import * as React from 'react';
import Header from './Header';
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose } from 'redux';
import { INPUT_SOURCES, STREAM_STATUS } from '../constant/Common.Consts';
import { checkFacilities, checkDevicesTasks, checkTasksStatus, checkEncodeProfiles, checkStreamProfiles } from '../helper/preloader';
import { outputAddr, concatTasksStatus } from '../helper/helper';
import { SET_DEVICE_TASK, START_DEVICE_TASK, STOP_DEVICE_TASK, GET_NETWORK_STATUS } from '../helper/Services';


const mapStateToProps = store => (
	{ 
		devices: store.configReducer.devices
	}
);

const updateSec = 15000;

class BroadcastList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			devicesTasks : [],
			btnsStatus: [],
			tasksIsChecked: [],
			netWorkStatus: []
		};

		this.renewList = this.renewList.bind(this);
		this.taskOnCheck = this.taskOnCheck.bind(this);
		this.btnAction = this.btnAction.bind(this);
		this.isAnyChecked = this.isAnyChecked.bind(this);
	}

	componentDidMount(){// Handle after fetch data
		// let reqPromise = [checkDevicesTasks(true), checkEncodeProfiles()];
		checkFacilities().then(() => {
			this.renewList();
		});
	}
	componentWillUnmount () {
		clearInterval(this.interval);
	}
	renewList() {
		let reqPromise = [checkDevicesTasks(true), checkEncodeProfiles(), GET_NETWORK_STATUS.fetchData(), checkTasksStatus(true)];
		let reqPromise2 = [];
		let btnsStatus = [];
		let tasksIsChecked = [];

		Promise.all(reqPromise).then(data => {
			let devicesTasks = concatTasksStatus(data[0], data[3]);
			let encodingProfiles = data[1];


			this.setState({
				netWorkStatus : data[2]['nic']
			});

			devicesTasks.forEach(device => {
				btnsStatus.push({
					deviceID: device.id,
					disabled: true
				});

				tasksIsChecked.push({
					deviceID: device.id,
					taskID: 0,
					checked: false
				});
				
				device.tasks.forEach(task => {
					
					tasksIsChecked.push({
						deviceID: device.id,
						taskID: task.id,
						checked: false
					});
					encodingProfiles.forEach(profile => {
						if(task.profileID === profile.id) {
							task.profileName = profile.name;
						}
					});

					reqPromise2.push(checkStreamProfiles(task.streamID, true));
				});

			});

			return Promise.all(reqPromise2).then(streamProfiles => {

				devicesTasks.forEach(device => {
					device.tasks.forEach(task => {
						streamProfiles.forEach(streamProfile => {

							if(task.profileID === streamProfile.id) {
								task.streamProfile = streamProfile;
							}
						});
					});
				});

				return devicesTasks;

			});
			

		}).then(data => {
			this.setState({
				devicesTasks : data,
				btnsStatus,
				tasksIsChecked
			});
		});

		if(this.interval) {
			clearInterval(this.interval);
		}

		this.interval = setInterval(() => {
			
			checkTasksStatus(true).then(tasksStatus => {
				let devicesTasks = this.state.devicesTasks.map(device => {
					let tasks = tasksStatus.filter(taskStatus => (device.id === taskStatus.dievceID))
										.map(taskStatus => {
											let task = device.tasks.filter(task => (task.id === taskStatus.taskID))[0];
											return {
												...task,
												taskStatus: taskStatus
											};
										});

					return {
						id : device.id,
						tasks : tasks
					}

				});

				this.setState({
					devicesTasks : devicesTasks
				});
			});

		}, updateSec);

	}
	taskOnCheck(e) {
	
		const isCheckAll = (e.target.id.match('ckboxAll'));
		const val = Number(e.target.value);
		const taskID = val%1000;
		const deviceID = (val - taskID)/1000;
		const checked = e.target.checked;

		const tasksArr = this.state.tasksIsChecked.map(obj => {
			if(isCheckAll && obj.deviceID === deviceID) {
				return {
					...obj,
					checked: checked
				};
			}
			if(obj.deviceID === deviceID && obj.taskID === taskID) {
				return {
					...obj,
					checked: checked
				};
			}else{
				return obj;
			} 
		});

		this.setState({
			tasksIsChecked : tasksArr
		}, () => {
			this.isAnyChecked(deviceID);
		});
		
	}
	isAnyChecked(deviceID) {
		let tasksArr = [...this.state.tasksIsChecked];
		const totalCount = this.state.tasksIsChecked.filter(obj => {
			return (obj.deviceID === deviceID && obj.taskID !== 0 );
		}).length;

		const isCheckedCount = this.state.tasksIsChecked.filter(obj => {
			return (obj.taskID !== 0 && obj.deviceID === deviceID && obj.checked);
		}).length;


		tasksArr = this.state.tasksIsChecked.map(obj => {
			if(obj.taskID === 0 && obj.deviceID === deviceID) {
				return {
					...obj,
					checked: (isCheckedCount === 0 ? false : (isCheckedCount === totalCount ? true : obj.checked))
				};
			}else{
				return  obj;
			}
		});


		const btnsStatus = this.state.btnsStatus.map(obj => {
			if(obj.deviceID === deviceID) {
				return {
					...obj,
					disabled: (isCheckedCount === 0)
				};
			}else{
				return obj;
			} 
		});


		this.setState({
			btnsStatus : btnsStatus,
			tasksIsChecked : tasksArr
		});

	}
	btnAction(deviceID, action) {
		let resp;
		let params = {
			device : {
				id : deviceID,
				tasks: []
			}
		};

		params.device.tasks = this.state.tasksIsChecked.filter(obj => {
			return (obj.taskID !== 0 && obj.deviceID === deviceID && obj.checked);
		}).map(obj => {
			return {
				taskID : obj.taskID
			};
		});

		switch (action) {
			case 0:
				resp = SET_DEVICE_TASK.fetchData(params, 'DELETE');
				break
			case 1:
				resp = START_DEVICE_TASK.fetchData(params);
				break
			case 2:
				resp = STOP_DEVICE_TASK.fetchData(params);
				break
			default:
				break
		}

		resp.then(data => {
			if(data.result === 0) {
				this.renewList();
			}
		});
	}
	render() {
		const state = this.state;
		const { t, devices } = this.props;
		const { devicesTasks, btnsStatus, tasksIsChecked, netWorkStatus } = state;
		const taskOnCheck = this.taskOnCheck;
		const btnAction = this.btnAction;
		
		function modal(device, tasks, i) {
			let btnsDisabled = true;
			let isChecked = false;

			btnsStatus.forEach(obj => {
				if(obj.deviceID === device.id) {
					btnsDisabled = obj.disabled;
					return false;
				}
			});

			tasksIsChecked.forEach(obj => {
				if(obj.deviceID === device.id && obj.taskID === 0) {
					isChecked = obj.checked;
					return false;
				}
			});
			
			return (<div key={device.id} className="modal-content mb-3">
						<div className="modal-header">
							<h6 className="modal-title">
								{t('msg_output') + ' ' + i}
							</h6>
						</div>
						<div className="modal-body">
							<ul className="nav nav-tabs">
								<li className="nav-item">
									<a className="nav-link active" >{t('msg_streaming_task')}</a>
								</li>
							</ul>
							<div className="border border-top-0 p-3">
								<ul className="list-inline">
									<li className="list-inline-item"><button type="button" className="btn_broadcast_list_delete" disabled={btnsDisabled} onClick={() => btnAction(device.id, 0)}></button></li>
									<li className="list-inline-item"><button type="button" className="btn_broadcast_list_start" disabled={btnsDisabled} onClick={() => btnAction(device.id, 1)}></button></li>
									<li className="list-inline-item"><button type="button" className="btn_broadcast_list_stop" disabled={btnsDisabled} onClick={() => btnAction(device.id, 2)}></button></li>
								</ul>
								<div className="table-responsive">
									<table className="table table-bordered table-striped-common ">
										<thead className="thead-blue">
											<tr>
												<th scope="col" className="text-center"><input type="checkbox" id={'ckboxAll_' + device.id} value={device.id*1000} checked={isChecked} onChange={taskOnCheck} /></th>
												<th scope="col">{t('msg_no')}</th>
												<th scope="col">{t('msg_channel_name')}</th>
												<th scope="col" className="w-25">{t('msg_output_addr')}</th>
												<th scope="col" className="w-25">{t('msg_encoding_profile')}</th>
												<th scope="col">{t('msg_status')}</th>
												<th scope="col">{t('msg_streaming_status')}</th>
											</tr>
										</thead>
										<tbody>
											{
												tasks.map((task, i) => taskList(device.id, task, i+1))
											}
										</tbody>
									</table>
								</div>
								
							</div>
						</div>
						<div className="modal-footer"></div>
					</div>);
		}

		function taskList(deviceID, task, i) {
			let isChecked = false;
			let channelName = [];
			let streamStatus = 0;
			let streamStatusInfo = [];
			const addrs = outputAddr(task.streamProfile.streamType, task.streamProfile, netWorkStatus).map((url, i) => (<span className="d-block" key={i}>{url}</span>));
		
			tasksIsChecked.forEach(obj => {
				if(obj.deviceID === deviceID && obj.taskID === task.id) {
					isChecked = obj.checked;
					return false;
				}
			});
	
			//TODO: get device config
			/* task.streamProfile.sourceType.forEach(type => {
				channelName.push(INPUT_SOURCES[type]);
			}); */

			if(task.isStart === 1) {
				streamStatus = task.status;
				if(streamStatus === -1) {
					streamStatusInfo = ['ErrorCode: ' + task.errorCode];
				}
		
			}else{
				streamStatus = 0;
			}


		
			return	<tr key={i}>
						<td className="align-middle text-center"><input type="checkbox" name={ 'd_' + deviceID +'_t[]'} value={deviceID*1000 + task.id} checked={isChecked} onChange={taskOnCheck}/></td>
						<td className="align-middle">{i}</td>
						<td className="align-middle">{channelName.join(' , ')}</td>
						<td className="align-middle">{addrs}</td>
						<td className="align-middle">{task.profileName}</td>
						<td className="align-middle">{t(STREAM_STATUS[streamStatus])}</td>
						<td className="align-middle">{streamStatusInfo}</td>
					</tr>;
		}

		return (
			<div className="">
				<Header></Header>
				<section id="config_panel" className="mx-3">
				{
					devices.map((device, i) => {
						return devicesTasks.filter(deviceTasks => {
							return device.id === deviceTasks.id;
						}).map(currDevice => {
							return modal(currDevice , currDevice.tasks, i+1);
						})
					})
				}
				</section>
			</div>
    	);
	}
}


export default compose(
	translate('translation'),
	connect(mapStateToProps, null)
)(BroadcastList);