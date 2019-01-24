import * as React from "react";
import Header from "./Header";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { DEFAULT_STREAM_TYPE, MSG_SUCCESS_SECONDS, MSG_FAILED_SECONDS} from "../constant/Init.Consts";
import { configActions } from "../action/Config.Actions";
import { GET_NETWORK_STATUS, GET_PIP_CONFIG_LIST, GET_CMS_SERVER_STATUS } from "../helper/Services";
import { concatTasksStatus, randomID } from "../helper/helper";
import {
	checkFacilities,
	checkDevicesTasks,
	checkTasksStatus,
	checkEncodeProfiles,
	checkStreamProfiles,
	checkDeviceConfig
} from "../helper/preloader";
import ConfigurationPanel from "./ConfigurationPanel";
import ConfigurationModal from "./ConfigurationModal";
import ConfigurationTabs from "./ConfigurationTabs";
import ConfigurationTasks from "./ConfigurationTasks";
import Loader from './Loader';
import { Alert } from 'reactstrap';

const defaultStreamType = DEFAULT_STREAM_TYPE;

//form valid https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
const mapStateToProps = store => ({
	devices: store.configReducer.devices,
	devicesConfig: store.configReducer.devicesConfig,
	devicesTasks: store.configReducer.devicesTasks,
	tasksStatus: store.configReducer.tasksStatus,
	encodeProfiles: store.profiles.encodeProfiles,
	streamProfiles: store.profiles.streamProfiles,
	selectedSource: store.rootReducer.selectedSource
});

const mapDispatchToProps = dispatch => {
	return {
		setDeviceConfig: config => dispatch(configActions.setDeviceConfig(config))
	};
};

const MAX_BITRATE = 20000;


function filterEncodingProfilesByStreamType(encodeProfiles, streamType) {
	return encodeProfiles.filter(profile => profile.streamType.includes(streamType) || profile.category === 0);
}


function getCurrEncodingProfiles(encodeProfiles, streamType) {
	let _encodeProfiles = encodeProfiles.filter(profile => profile.streamType.includes(streamType) || profile.category === 0);

	return function filterByResolution(firstProfileID, operator) {

		const profileInfo = encodeProfiles.find(profile => profile.id === firstProfileID);
		let width = Infinity;
		if(profileInfo && profileInfo.width) {
			width = Number(profileInfo.width);
		}

		if(operator === 'biggerthan') {
			_encodeProfiles = _encodeProfiles.filter(profile => profile.width >= width);
		}else{
			_encodeProfiles = _encodeProfiles.filter(profile => profile.width <= width);
		}

		return function filterByBitrate(profileIDs) {
			if(!!profileIDs && profileIDs.length > 0) {
				const sumBitrate = profileIDs
										.map(id => {
											const profileInfo = encodeProfiles.find(profile => profile.id === id);

												if(profileInfo) {
													return profileInfo.totalBitrate;
												}else{
													return 0;
												}
												
										})
										.reduce((bitrate, sumVal) => bitrate + sumVal);

				_encodeProfiles = _encodeProfiles.filter(profile => (profile.totalBitrate + sumBitrate) < MAX_BITRATE);
				
			}

			return _encodeProfiles;
		}

	}

}


class Configuration extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			netWorkStatus: [],
			pipList: [],
			devicesTasksDetail: [],
			isCmsConnected : false,
			isDeviceConfigSet: false,
			backdropShow: false,
			alert : {
				msg : '',
				color : 'info' //danger
			}
		};

		this.addSubTask = this.addSubTask.bind(this);
		this.deleteSubTask = this.deleteSubTask.bind(this);
		this.updateTask = this.updateTask.bind(this);
		this.handleBackdrop = this.handleBackdrop.bind(this);
		this.handleAlert = this.handleAlert.bind(this);
		this.renewDevicesTasksDetail = this.renewDevicesTasksDetail.bind(this);
		this.updateRootStreamProfile = this.updateRootStreamProfile.bind(this);
	}
	componentDidMount() {
		let reqPromise = [
			checkDevicesTasks(true),
			checkTasksStatus(true),
			checkEncodeProfiles(true),
			GET_NETWORK_STATUS.fetchData(),
			GET_PIP_CONFIG_LIST.fetchData(),
			GET_CMS_SERVER_STATUS.fetchData()
		];
		let reqPromise2 = [];
		let pipList = [];
		let netWorkStatus = [];
		let devicesConfig = [];
		let isCmsConnected = false;
		let devices = {}, devicesTasksStatus = {}, encodeProfiles = {};

		checkFacilities()
			.then(facilities => {
				devices = facilities;

				devices.forEach(device => {
					reqPromise.push(checkDeviceConfig(device.id, true));
				});

				return Promise.all(reqPromise).then(data => {
					const devicesTasks = data[0];
					devicesTasksStatus = concatTasksStatus(
						devicesTasks,
						data[1]
					);

					encodeProfiles = data[2];
					netWorkStatus = data[3]["nic"];
					pipList = data[4]["config"];
					isCmsConnected = !!data[5].instInfo.streamConnect;

					devicesConfig[1] = data.pop();
					devicesConfig[0] = data.pop();


					devicesTasks.forEach(device => {
						device.tasks.forEach(task => {
							reqPromise2.push(
								checkStreamProfiles(task.streamID, true)
							);
						});
					});

					return Promise.all(reqPromise2).then(data => data);
				});
			})
			.then(seqStreamProfiles => {
				let streamProfiles = seqStreamProfiles[0];
				let streamInfo = {
					deviceID: -1,
					taskKey: -1,
					taskID: -1,
					profileID: '',
					isStart: 0,
					streamStatus: 0,
					id: -1,
					streamType: defaultStreamType,
					nic: 1
				};
				let devicesTasksDetail = [];

				if(seqStreamProfiles.length > 0) {
					streamProfiles = seqStreamProfiles.reduce((profiles, finalProfiles) => {
						if(finalProfiles.length > profiles.length) {
							return finalProfiles;
						}else{
							return profiles;
						}
					});
				}


				devicesTasksDetail = devices.map(facility => {
					let tasks = [];
					let config = devicesConfig.find(
						device => device.id === facility.id
					);


					devicesTasksStatus
						.filter(device => device.id === facility.id)
						.forEach(device => {
							tasks = device.tasks.map((task, i) => {
								let streamProfile = streamProfiles.find(stream => stream.id === task.streamID);

								return {
									deviceID: device.id,
									taskID: task.id,
									taskKey: randomID(),
									profileID: task.profileID,
									isStart: task.isStart,
									streamStatus: task.status,
									...streamProfile
								};
							});
						});

					if (tasks.length === 0) {
						streamInfo.taskKey = randomID();

						tasks.push(Object.assign({}, streamInfo, {
							deviceID : facility.id
						}));

					}


					return {
						...facility,
						tasks: tasks,
						deviceConfig: config
					};
				});

				this.setState({
					isCmsConnected,
					pipList,
					netWorkStatus,
					devicesTasksDetail,
					isDeviceConfigSet: true
				});
			});
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		let isValuesChange = false;
		let devicesTasksDetail = prevState.devicesTasksDetail.map(device => {
			let newConfig = {
				...device.deviceConfig
			};
			nextProps.devicesConfig.forEach(config => {
				if(device.id === config.id) {
					//Check value change
					if(device.hasOwnProperty('deviceConfig') && !!device.deviceConfig) {
						for(let k in config) {
							if(device.deviceConfig[k] !== config[k]) {
								isValuesChange = true;
							}
						}
					}else{
						isValuesChange = true;
					}

					if(isValuesChange) {
						newConfig = {
							...device.deviceConfig,
							...config
						};
					}


				}
			});


			return {
				...device,
				deviceConfig: newConfig
			};
		});

		if(isValuesChange) {
			return {
				devicesTasksDetail
			};
		}else{
			return null;
		}

		
	}

	renewDevicesTasksDetail(taskInfo) {
		const { deviceID, taskID, taskKey, profileID, streamID } = taskInfo;
		const { devicesConfig, tasksStatus, streamProfiles } = this.props;

		let devicesTasksDetail = this.state.devicesTasksDetail.map(device => {
			let deviceConfig = devicesConfig.find(facility => deviceID === facility.id);

			if(device.id === deviceID) {

				let tasks = device.tasks.map((task, i) => {
								let taskStatus = tasksStatus.find(taskStatus => taskStatus.deviceID === deviceID && taskStatus.taskID === taskID);
								let streamProfile = streamProfiles.find(stream => stream.id === streamID);

								if(taskKey === task.taskKey) {
									return {
										...task,
										taskID: taskID,
										taskKey: randomID(),
										profileID: profileID, 
										isStart: taskStatus.isStart,
										streamStatus: taskStatus.status,
										id: taskID,
										...streamProfile
									};

								}else{
									return task;
								}

							});

				return {
					...device,
					tasks,
					deviceConfig
				};
			}else{

				return {
					...device,
					deviceConfig
				};
			}

		});

		this.setState({
			devicesTasksDetail
		});

	}

	updateRootStreamProfile(taskKey, streamProfile) {
		const { devicesTasksDetail } = this.state;

		this.setState({
			devicesTasksDetail : devicesTasksDetail.map(device => {
				let tasks = device.tasks.map(task => {
					if(taskKey === task.taskKey) {
						return {
							...task,
							...streamProfile
						};
					}else{
						return task;
					}
				});

				return {
					...device,
					tasks
				};
			})
		});
	}

	addSubTask(deviceID) {
		let devicesTasksDetail = [];
		let streamInfo = {
			deviceID: deviceID,
			taskID: -1,
			taskKey: randomID(),
			profileID: '',
			isStart: 0,
			streamStatus: 0,
			id: -1,
			streamType: defaultStreamType,
			nic: 1,
			createTime : Date.now()
		};

		devicesTasksDetail = this.state.devicesTasksDetail.map(device => {
			if (device.id === deviceID) {
				return {
					...device,
					tasks: [...device.tasks, streamInfo]
				};
			} else {
				return device;
			}
		});

		this.setState({
			devicesTasksDetail
		});
	}
	deleteSubTask(deviceID, taskID, taskKey, rowNo) {
		let devicesTasksDetail = [];
		let remainTasks = [];

		devicesTasksDetail = this.state.devicesTasksDetail.map(device => {
			if (device.id === deviceID) {

				remainTasks = device.tasks.filter(task => task.taskKey !== taskKey);

				if (remainTasks.length === 0) {
					alert(
						`Error deviceID ${deviceID}, taskID ${taskID}, rowNo ${rowNo}`
					);
				}

				return {
					...device,
					tasks: remainTasks
				};
			} else {
				return device;
			}
		});

		this.setState({
			devicesTasksDetail
		});
	}
	updateTask(deviceID, taskKey, updateTask) {
		let devicesTasksDetail = this.state.devicesTasksDetail.map(device => {
			if (device.id !== deviceID) {
				return device;
			}

			return {
				...device,
				tasks : device.tasks.map(task => {
					if(task.taskKey !== taskKey) {
						return task;
					}
					
					return {
						...task,
						...updateTask
					};
				})
			};

		});


		this.setState({
			devicesTasksDetail
		});
	}
	handleBackdrop(show) {
		this.setState({
			backdropShow: show
		});
	}
	handleAlert(alertObj) {
		this.setState({
			alert : {			
				...this.state.alert,
				...alertObj
			}
		}, ()=>{

			setTimeout(()=>{
				this.setState({
					alert : {
						...this.state.alert,
						msg : '',
						color : (alertObj.type === 'ok' ? 'info' : 'danger')
					}
				});
			}, (alertObj.type === 'ok' ? MSG_SUCCESS_SECONDS : MSG_FAILED_SECONDS));
		});
	}
	render() {
		const { t, devices, encodeProfiles, devicesConfig, selectedSource } = this.props;
		const { netWorkStatus, devicesTasksDetail, isDeviceConfigSet, alert, isCmsConnected } = this.state;
		let currBitrate = 0;
		let taskList = [];

		devicesTasksDetail.forEach(device => {
			taskList = [...taskList, ...(device.tasks.filter(task => task.profileID !== ''))];
		});

		if(taskList.length > 0) {
			currBitrate = taskList.map(task => encodeProfiles.find(profile => profile.id === task.profileID)['totalBitrate']).reduce((bitrate, currentBitrate) => bitrate + currentBitrate);
			currBitrate = (currBitrate/1000).toFixed(2);
		}


		return (
			<div className="container_wrapper">
				{/* { this.state.backdropShow ? ( <div className="modal-backdrop fade show" />) : null } */}
				<Loader isOpen={this.state.backdropShow}></Loader>
				<Alert isOpen={!!alert.msg} className="fixed-top text-center m-5" color={alert.color}>{alert.msg}</Alert>
				<Header addition={<p className="color-attention">{`${t('msg_total_bitrate_ceiling')} ( ${t('msg_total_bitrate_accumulative')} / ${t('msg_total_bitrate_max')} ) : ${currBitrate} / 20 Mbps`}</p>}>
					{isDeviceConfigSet ? (<ConfigurationPanel taskList={taskList} devices={devices} selectedSource={selectedSource} devicesConfig={devicesConfig} />) : null}
				</Header>
				<section id="config_panel" className="mx-3">
					{devicesTasksDetail.map(device => {
						let totalTaskCount = device.tasks.length;
						let filterProfiles = undefined;
						let profileIDs = [];
						let isDeviceStreaming = taskList.some(task => task.deviceID === device.id && task.isStart === 1);

						return (
							<ConfigurationModal key={device.id} t={t} id={device.id} >
								{
									<ConfigurationTabs facility={device} t={t} id={device.id} deviceConfig={device.deviceConfig} pipList={this.state.pipList} updateDeviceConfig={this.props.setDeviceConfig} renewDevicesTasksDetail={this.renewDevicesTasksDetail} selectedSource={selectedSource}/>
								}
								{ device.tasks.map((task, i) => {
									if(taskList.length === 0) {
										filterProfiles = filterEncodingProfilesByStreamType(encodeProfiles, task.streamType);
									}else{
										
										//This task not set yet
										if(task.id === -1) {
											try {
												//Check has pioneer task or not
												const firstTask = taskList.find(item => item.deviceID === task.deviceID);

												profileIDs = taskList.map(item => item.profileID);

												if(!!firstTask) {
													//Find pioneer task. Mean this task is output 2
													filterProfiles = getCurrEncodingProfiles(encodeProfiles, task.streamType)(firstTask.profileID, 'lessthan')(profileIDs);
													
												}else{
													//Mean this Device not set task yet
													filterProfiles = getCurrEncodingProfiles(encodeProfiles, task.streamType)()(profileIDs);

												}

											}catch(err) {
												alert(`Find task error. ${err}`);
												console.log(err);
											}

										}else{
											try {
												//Check this task is output 1 or 2
												const siblingTask = taskList.find(item => item.deviceID === task.deviceID && item.id !== task.id);
												profileIDs = taskList.filter(item => item.id !== task.id).map(item => item.profileID);

												if(siblingTask) {
													if(siblingTask.id < task.id) {
														//Mean this task is output 2
														filterProfiles = getCurrEncodingProfiles(encodeProfiles, task.streamType)(siblingTask.profileID, 'lessthan')(profileIDs);
													}else{
														//Mean this task is output 1
														filterProfiles = getCurrEncodingProfiles(encodeProfiles, task.streamType)(siblingTask.profileID, 'biggerthan')(profileIDs);
													}

												}else{
													//Mean this task is output1 and already set
													filterProfiles = getCurrEncodingProfiles(encodeProfiles, task.streamType)()(profileIDs);
												}

											}catch(err) {
												alert(`Find task error. ${err}`);
												console.log(err);
											}

										}
									}


									let _props = {
										key : task.taskKey,
										taskKey : task.taskKey,
										rowNo : i + 1,
										totalTaskCount : totalTaskCount,
										nics : netWorkStatus,
										videoInputs : device.videoInput,
										selectedSource : selectedSource,
										updateDeviceConfig : this.props.setDeviceConfig,
										reverseInputSource : device.deviceConfig.reverseInputSource,
										streamInfo : task,
										encodeProfiles : filterProfiles,
										addSubTask : this.addSubTask,
										deleteSubTask : this.deleteSubTask,
										updateTask : this.updateTask,
										handleBackdrop : this.handleBackdrop,
										handleAlert : this.handleAlert,
										renewDevicesTasksDetail : this.renewDevicesTasksDetail,
										updateRootStreamProfile : this.updateRootStreamProfile,
										isDeviceStreaming : isDeviceStreaming,
										isCmsConnected : isCmsConnected
									};

									return (
										<ConfigurationTasks {..._props} />
									);
								})}
							</ConfigurationModal>
						);
					})}
				</section>
			</div>
		);
	}
}

export default compose(
	translate("translation"),
	connect(mapStateToProps, mapDispatchToProps)
)(Configuration);
