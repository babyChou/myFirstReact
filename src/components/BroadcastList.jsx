import * as React from 'react';
import Header from './Header';
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose } from 'redux';
import { BROCASTLIST_GLOBAL_UPDATE_TIME, BROCASTLIST_PANNEL_UPDATE_TIME } from "../constant/Init.Consts";
import { INPUT_SOURCES, STREAM_STATUS, RECORD_STORE_DEVICE, RECORD_CONTAINER } from '../constant/Common.Consts';
import { checkFacilities, checkDeviceConfig, checkDevicesTasks, checkTasksStatus, checkEncodeProfiles, checkStreamProfiles } from '../helper/preloader';
import { concatTasksStatus } from '../helper/helper';
import { DELETE_DEVICE_TASK, START_DEVICE_TASK, STOP_DEVICE_TASK, GET_NETWORK_STATUS, GET_PIP_PREVIEW_IMG, GET_INPUT_SIGNAL_STATUS } from '../helper/Services';
import { NavLink } from 'react-router-dom';
import BroadcastListPanel from "./BroadcastListPanel";
import Dialog from "./Dialog";
import Loader from './Loader';


const mapStateToProps = store => (
	{ 
		devices: store.configReducer.devices,
		selectedSource: store.rootReducer.selectedSource
	}
);

const updateSec = BROCASTLIST_GLOBAL_UPDATE_TIME;

class BroadcastList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			devicesTasks : [],
			btnsStatus: [],
			tasksIsChecked: [],
			netWorkStatus: [],
			backdropShow : false,
			dialogObj : {
				title : '',
				type : 'alert',
				icon : 'warning',
				mainMsg : '',
				msg : '',
			},
			isDialogShow : false,
			preview: {
				1 : '',
				2 : ''
			},
			signals: []
		};

		this.renewList = this.renewList.bind(this);
		this.taskOnCheck = this.taskOnCheck.bind(this);
		this.btnAction = this.btnAction.bind(this);
		this.isAnyChecked = this.isAnyChecked.bind(this);
		this.outputAddr = this.outputAddr.bind(this);
	}

	componentDidMount(){// Handle after fetch data
		let reqPromise = [];
		let preview = {};

		checkFacilities().then(facilitys => {

			return Promise.all(facilitys.map(facility => checkDeviceConfig(facility.id)))
							.then((devicesConfig)=> {
								
								devicesConfig.forEach(config => {
									if(config.videoInput.length > 0) {
										reqPromise.push(GET_PIP_PREVIEW_IMG.fetchFile({ id : config.id }).then(url => {
											preview[config.id] = url;
											return true;
										}));
			
									}
								});

								Promise.all(reqPromise).then(data => {

									this.setState((state) => ({
										preview : {
											...state.preview,
											...preview
										}
									}));

									return this.renewList();
									
								});
								
								
							});
		});


	}
	componentWillUnmount () {
		clearInterval(this.interval);
	}
	componentDidCatch(error, info) {
		clearInterval(this.interval);
	}
	renewList() {
		let reqPromise = [checkDevicesTasks(true), checkEncodeProfiles(), GET_NETWORK_STATUS.fetchData(), checkTasksStatus(true), GET_INPUT_SIGNAL_STATUS.fetchData()];
		let reqPromise2 = [];
		let btnsStatus = [];
		let tasksIsChecked = [];

		// console.log(this.state);

		Promise.all(reqPromise).then(data => {
			let devicesTasks = concatTasksStatus(data[0], data[3]);
			let encodingProfiles = data[1];

			this.setState({
				netWorkStatus : data[2]['nic'],
				signals: data[4]['signalStatuses']
			});

			devicesTasks.forEach(device => {
				btnsStatus.push({
					deviceID: device.id,
					disabled: true
				});

				//Select All
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
							task.profileTotalBitrate = profile.totalBitrate;
						}
					});

					reqPromise2.push(checkStreamProfiles(task.streamID, true));

				});

			});

			return Promise.all(reqPromise2).then(data => {
				let streamProfiles = data[data.length - 1];
				
				return 	devicesTasks
							.map(device => ({
								...device,
								tasks: device
										.tasks
										.map(task => ({
											...task,
											streamProfile : streamProfiles.find(streamProfile => task.streamID === streamProfile.id)
										}))
							}));

			});
			

		})
		.then(data => {
			this.setState({
				devicesTasks : data,
				btnsStatus,
				tasksIsChecked,
				backdropShow : false
			});
		});

		if(this.interval) {
			clearInterval(this.interval);
		}

		this.interval = setInterval(() => {
			const { devices, selectedSource } = this.props;
			let queryP = [];

			queryP.push(checkTasksStatus(true).then(tasksStatus => {
				return this.state.devicesTasks.map(device => {
					let tasks = tasksStatus.filter(taskStatus => (device.id === taskStatus.deviceID))
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

			}));

			queryP.push(GET_INPUT_SIGNAL_STATUS.fetchData());

			devices.forEach(device => {
				let deviceID = device.id;
				if(selectedSource[deviceID].length > 0) {

					queryP.push(GET_PIP_PREVIEW_IMG.fetchFile({
						id : deviceID
					}).then(url => {
						return {
							id : deviceID,
							url: url
						};
					}));
					
				}
			});


			Promise.all(queryP).then(data => {
				let updateData = {
					preview : {
						...this.state.preview
					}
				};
				data.forEach((uData, i) => {
					switch(i) {
						case 0:
							updateData.devicesTasks = uData;
							break;
						case 1:
							updateData.signals = uData.signalStatuses;
							break;
						default: 
							updateData.preview[uData.id] = uData.url
							break;
					}
				});

				this.setState(updateData);
				
			}).catch(err => {
				clearInterval(this.interval);
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
		const { t, selectedSource } = this.props;
		const isSourceOk = (selectedSource[deviceID].length > 0);
		let resp;
		let params = {
			tasks : []
		};


		params.tasks = this.state.tasksIsChecked.filter(obj => {
			return (obj.taskID !== 0 && obj.deviceID === deviceID && obj.checked);
		}).map(obj => {
			return {
				deviceID,
				taskID : obj.taskID
			};
		});

		switch (action) {
			case 0:
				
				this.setState({
					isDialogShow : true,
					dialogObj : {
						...this.state.dialogObj,
						type : 'confirm',
						icon : 'info',
						title : t('msg_stream_delete'),
						msg : t('msg_stream_delete_confirm'),
						ok : () => {
							this.setState({
								isDialogShow : false,
								backdropShow : true
							});
							DELETE_DEVICE_TASK.fetchData(params, 'DELETE').then(data => {
								if(data.result === 0) {
									this.renewList();
								}
							});
						}
					}
				});
					
				break
			case 1:
				if(isSourceOk) {
					this.setState({
						backdropShow : true
					});
					resp = START_DEVICE_TASK.fetchData(params);
				}else{
					this.setState({
						isDialogShow : true,
						dialogObj : {
							...this.state.dialogObj,
							title : t('msg_input_source_not_set'),
							msg : t('msg_please_configure_input_source'),//a003670
						}
					});
					return false;
				}

				break
			case 2:
				this.setState({
					backdropShow : true
				});
				resp = STOP_DEVICE_TASK.fetchData(params);
				break
			default:
				break
		}

		if(resp) {
			resp.then(data => {
				if(data.result === 0) {
					this.renewList();
				}
			});
			
		}

	}
	outputAddr(streamType, streamProfile, netWorkStatus) {
		let urls = [];
		let uri = '';
	    const { t } = this.props;
	    const tempUrl = '{protocol}://{@}{ip}:{port}{uri}';
	    const protocols = ['', 'tcp', 'udp', 'udp', 'rtp', 'rtp', '', '', 'rtsp'];


	    if (streamType === 8 || streamType === 1) {
	        netWorkStatus.filter(data => (data.isConnected !== 0))
	            .forEach(data => {
	                if (streamType === 8) {
	                    urls.push(tempUrl.replace('{ip}', data.ip).replace('{protocol}', protocols[streamType]));
	                }else if(streamType === 1){
	                    urls.push(tempUrl.replace('{ip}', data.ip).replace('{uri}', '').replace('{protocol}', protocols[streamType]));
	                }else{
	                	if(streamProfile.nic === data.name) {
	                		urls.push(tempUrl.replace('{ip}', data.ip).replace('{uri}', '').replace('{protocol}', protocols[streamType]));
	                	}
	                }
	            });
	    }

	    // console.log(netWorkStatus);1,8
	    switch (streamType) {
	        case 1: //tcp://ip:port
	            urls = urls.map(url => {
	                return url.replace('{@}', '').replace('{port}', streamProfile.tcp.port);
	            });

	            break;
	        case 2: // udp://@ip:port
	        case 3:
	        	urls = [tempUrl.replace('{@}', '@').replace('{port}', streamProfile.udp.port).replace('{ip}', streamProfile.udp.ip).replace('{uri}','').replace('{protocol}', protocols[streamType])];
	            break;
	        case 4: // rtp://@ip:port
	        case 5:
	        	urls = [tempUrl.replace('{@}', '@').replace('{port}', streamProfile.rtp.port).replace('{ip}', streamProfile.rtp.ip).replace('{uri}','').replace('{protocol}', protocols[streamType])];
	            break;
	        case 6: //FMS URL : streamInfo.rtmpUrl, Stream
	            urls = [t('msg_fms_addr') + ' ' + streamProfile.rtmp.rtmpUrl ,t('msg_fms_stream_name') + ' ' + streamProfile.rtmp.rtmpStreamName ];
	            break;
	        case 7: // http://xxxxx/xxxxx.m3u8
	            // console.log(streamProfile.hls.hlsLocation);
	            let hlsLocation = streamProfile.hls.hlsLocation ? '/'+streamProfile.hls.hlsLocation : '';
	            uri = `http://${streamProfile.hls.hlsUrl}${hlsLocation}/index.m3u8`;
	            urls = [uri];
	            break;
	        case 8: //rtsp://ip:port/uri
	            urls = urls.map(url => {
	                return url.replace('{@}', '').replace('{port}', streamProfile.rtsp.port).replace('{uri}', '/'+streamProfile.rtsp.rtspUrl);
	            });
	            break;
	        case 11: //https://www.ustream.tv/broadcaster/'+streamInfo.cdnUrl
	            // http://www.ustream.tv/channel/11753958 (Not sure channelID)
	            // uri = 'https://www.ustream.tv/channel/' + streamProfile.ustream.channelID;
	            uri = 'https://www.ustream.tv/channel/' + streamProfile.ustream.videoID;
	           
				urls.push(<a href={uri} target="_blank">{uri}</a>);
	            break;
	        case 12: //https://www.twitch.tv/'+streamInfo.cdnUser
	            //https://dev.twitch.tv/docs/v5/reference/channels/#get-channel
	            //Get Channel by cancelIdleCallback
	            //Response -> {... "url": "https://www.twitch.tv/dallas" ..}
	            uri = 'https://www.twitch.tv/' + streamProfile.twitch.userID;//(or url)
				urls.push(<a href={uri} target="_blank">{uri}</a>);
	            break;
	        case 13:
				uri = 'https://www.youtube.com/watch?v=' + streamProfile.youtube.videoID;
				urls.push(<a href={uri} target="_blank">{uri}</a>);
	            break;
	        case 15:
				urls.push(<a href={uri} target="_blank">{streamProfile.facebook.videoID}</a>);
	            break;
	        case 51:
	        	urls.push(
	        		<ul className="list-unstyled">
	        			<li>{t('msg_store_device')} : { RECORD_STORE_DEVICE[streamProfile.record.storeDevice] }</li>
	        			<li>{t('msg_format')} : { RECORD_CONTAINER[streamProfile.record.container] }</li>
	        			<li>{t('msg_backup_path')} : { streamProfile.record.recordPath }</li>
	        		</ul>
	        	);
	            break;
	        default:
	            break;
	    }

	    return urls;
	}
	render() {
		const state = this.state;
		const { t, devices, selectedSource } = this.props;
		const { devicesTasks, btnsStatus, tasksIsChecked, netWorkStatus, preview, signals } = state;
		const taskOnCheck = this.taskOnCheck;
		const btnAction = this.btnAction;
		const outputAddr = this.outputAddr;

		
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
						<div className="modal-footer"></div>
					</div>);
		}

		function taskList(deviceID, task, i) {
			let isChecked = false;
			let channelName = [];
			let streamStatus = 0;
			let streamStatusInfo = [];
			let addrs = [];

			if(task.streamProfile) {
				addrs = outputAddr(task.streamProfile.streamType, task.streamProfile, netWorkStatus).map((url, i) => (<span className="d-block" key={i}>{url}</span>));
			}
	
			tasksIsChecked.forEach(obj => {
				if(obj.deviceID === deviceID && obj.taskID === task.id) {
					isChecked = obj.checked;
					return false;
				}
			});


			channelName = selectedSource[deviceID]
							.map(input => {
								return (<div key={input + deviceID}>{INPUT_SOURCES[input]}</div>);
							});


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
						<td className="align-middle">
						{ 
							channelName.length === 0 ?
							(<div className="media"><i className="icon_dialogboxe d-block mr-2" style={{width:'20px', height:'20px', backgroundSize:'100%'}}></i><div className="media-body"><NavLink to="/configuration"><span>{t('msg_input_source_not_set')}</span></NavLink></div></div>) :
							channelName
						}
						</td>
						<td className="align-middle">{addrs}</td>
						<td className="align-middle">{task.profileName}</td>
						<td className="align-middle">{t(STREAM_STATUS[streamStatus])}</td>
						<td className="align-middle">{streamStatusInfo}</td>
					</tr>;
		}

		let currBitrate = 0;

		devicesTasks.forEach(device => {
			device.tasks.forEach(task => {
				currBitrate += task.profileTotalBitrate;				
			});
		});

		currBitrate = (currBitrate/1000).toFixed(2);


		return (
			<div className="container_wrapper">
				{<Dialog isShow={this.state.isDialogShow} toggle={()=>{this.setState({isDialogShow: !this.state.isDialogShow })}} { ...this.state.dialogObj }></Dialog>}
				<Loader isOpen={this.state.backdropShow}></Loader>
				<Header addition={<p className="color-attention">{`${t('msg_total_bitrate_ceiling')} ( ${t('msg_total_bitrate_accumulative')} / ${t('msg_total_bitrate_max')} ) : ${currBitrate} / 20 Mbps`}</p>}>
					<BroadcastListPanel devices={devices} preview={preview} signals={signals}></BroadcastListPanel>

				</Header>
				<section id="config_panel" className="mx-3">
				{
					devices.map((device, i) => {
						let deviceTaskDOM = devicesTasks.filter(deviceTasks => {
							return device.id === deviceTasks.id;
						}).map(currDevice => {
							return modal(currDevice , currDevice.tasks, i+1);
						});

						if(deviceTaskDOM.length === 0) {
							return modal({id:device.id} , [], i+1);
						}else{
							return deviceTaskDOM;
						}
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