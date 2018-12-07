import * as React from 'react';
import ReactDOM from 'react-dom';
import memoize from "memoize-one";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose, bindActionCreators } from 'redux';
import store from '../store/Store';
import { rootActions } from '../action/Root.Actions';
import { CONFIGURATION_TASK_UNLOCK_STREAM_TYPES } from "../constant/Init.Consts";
import { INPUT_SOURCES, STREAM_STYPE, ENCODE_VIDEO_CODEC, ENCODE_AUDIO_CODEC } from '../constant/Common.Consts';
import { IPV4_STR, IPV4_MULTICAST_STR } from '../constant/Regx.Consts';
import { SET_STREAM_PROFILE, SET_DEVICE_TASK, START_DEVICE_TASK, STOP_DEVICE_TASK, DELETE_DEVICE_TASK, SET_DEVICE_CONFIG } from '../helper/Services';
import { checkDevicesTasks, checkTasksStatus, checkStreamProfiles } from "../helper/preloader";
import { retrieveFromProp } from '../helper/helper';
import Dialog from "./Dialog";
import ConfigurationRtmp from './ConfigurationRtmp';
import ConfigurationYoutube from './ConfigurationYoutube';
import ConfigurationTwitch from './ConfigurationTwitch';
import ConfigurationUstream from './ConfigurationUstream';
import ConfigurationFacebook from './ConfigurationFacebook';
import ConfigurationRecord from './ConfigurationRecord';
import ConfigurationTcp from './ConfigurationTcp';
import ConfigurationHls from './ConfigurationHls';
import ConfigurationRtsp from './ConfigurationRtsp';
//https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization



const finishedList = CONFIGURATION_TASK_UNLOCK_STREAM_TYPES;

const OPTION_FIELD = ['ipAddr','port','nic'];
const STREAM_TYPE_MAP_STREAM_PARAMS = {
	1 : 'tcp',
	2 : 'udp',
	3 : 'udp',
	4 : 'rtp',
	5 : 'rtp',
	6 : 'rtmp',
	7 : 'hls',
	8 : 'rtsp',
	11 : 'ustream',
	12 : 'twitch',
	13 : 'youtube',
	14 : 'cdnVideo',
	15 : 'facebook',
	21 : '',
	22 : '',
	23 : '',
	51 : 'record'
};

const NOT_NECESSARY_FIELD = {
	1 : ['ipAddr','nic'],
	2 : [],
	3 : [],
	4 : [],
	5 : [],
	6 : ['ipAddr','port'],
	7 : ['ipAddr','port'],
	8 : ['ipAddr','nic'],
	11 : ['ipAddr','port'],
	12 : ['ipAddr','port'],
	13 : ['ipAddr','port'],
	14 : ['ipAddr','port'],
	15 : ['ipAddr','port'],
	21 : [],
	22 : [],
	23 : [],
	51 : ['ipAddr','port']
}

function isFieldDisabled(key, streamType, isStart) {
	if(isStart) {
		return !!isStart;
	}else{
		return NOT_NECESSARY_FIELD[streamType].includes(key);
	}

}

function getCheckIpPattern(streamType) {
	if(streamType === 3 || streamType === 5) {
		return IPV4_MULTICAST_STR;
	}else{
		return IPV4_STR;
	}
}


const mapDispatchToProps = (dispatch) => {
	return { actions: bindActionCreators(rootActions, dispatch) };
};

const mapStateToProps = store => ({
	devicesTasks: store.configReducer.devicesTasks,
	streamProfiles: store.profiles.streamProfiles
});

class ConfigurationTasks extends React.Component {
	constructor(props) {
		super(props);
		const streamInfo = props.streamInfo || {};
		const streamType = retrieveFromProp('streamType', streamInfo);
		const subPropsKey = STREAM_TYPE_MAP_STREAM_PARAMS[streamType];
		const restData = streamInfo[subPropsKey] || {};
		const filterProfiles = props.encodeProfiles.filter(profile => profile.streamType.includes(streamType) || profile.streamType.includes(0));

		let encodingProfileID = retrieveFromProp('profileID', streamInfo);
		if(!encodingProfileID && filterProfiles[0]) {
			encodingProfileID = filterProfiles[0].id;
		}

		this.state = {
			videoSelected : ['',''],
			wasValidated : false,
			isStreamingCheck : false,
			isDialogShow : false,
			dialogObj : {
				title : '',
				type : 'alert',
				icon : 'warning',
				mainMsg : '',
				msg : '',
			},
			streamType: { 
				value : streamType,
				disabled: !!streamInfo.isStart
			},
			encodingProfile: { 
				value : encodingProfileID,
				disabled: !!streamInfo.isStart
			},
			ipAddr: {
				value: retrieveFromProp('ip', restData) || '',
				pattern : getCheckIpPattern(streamType),
				disabled: isFieldDisabled('ipAddr', streamType, streamInfo.isStart)
			},
			port: {
				value: retrieveFromProp('port', restData) || 1234,
				errMsg: '1~65535',
				disabled: isFieldDisabled('port', streamType, streamInfo.isStart)
			}, 
			nic: {
				value: retrieveFromProp('nic', streamInfo),
				disabled: isFieldDisabled('nic', streamType, streamInfo.isStart)
			}
		};


		this.subProp = {};
		this.trRow1 = React.createRef();
		this.trRow2 = React.createRef();

		this.cgVideoSource = this.cgVideoSource.bind(this);
		this.handleStartStreming = this.handleStartStreming.bind(this);
		this.getDefaultVal = this.getDefaultVal.bind(this);
		this.getCurrEncodingProfile = this.getCurrEncodingProfile.bind(this);
	}
	static getDerivedStateFromProps(props, state) {
		const deviceID = props.streamInfo.deviceID;
		// const currSelectedSource = props.selectedSource[deviceID];
		// const videoSelected = ['',''];
		const videoSelected = props.selectedSource[deviceID];

		/* currSelectedSource.forEach((type) => {

			let typePos = state.videoSelected.indexOf(type);
			if(typePos !== -1) {
				videoSelected[typePos] = type;
			}else{
				let unsetIndx = videoSelected.indexOf('');
				videoSelected[unsetIndx] = type;
			}
		}); */

		return { videoSelected };
	}

	encodeProfilesDOM = memoize(
		(encodeProfiles, streamType, t) => {
			let formatName = '';
			let formatKey = '';
			let formatTypes = [];
			let group = [];
			let group0 = {
				name : t('msg_profile_category_name_0'),
				formatTypes : []
			};

			encodeProfiles
			.filter(profile => profile.streamType.includes(streamType) || profile.streamType.includes(0))
			.forEach((profile, i) => {
				if(!!profile.videoType && !!profile.audioType) {
					formatKey = `${profile.videoType}_${profile.audioType}`;

					if(ENCODE_VIDEO_CODEC[profile.videoType] && ENCODE_AUDIO_CODEC[profile.audioType]) {
						formatName = `${ENCODE_VIDEO_CODEC[profile.videoType]}\\${ENCODE_AUDIO_CODEC[profile.audioType]}`;
					}else{
						
						formatName = `--${profile.videoType}\\---${profile.audioType}`;
					}
				}else{
					if(!!profile.videoType) {
						formatKey = profile.videoType;
						formatName = ENCODE_VIDEO_CODEC[profile.videoType] || `--${profile.videoType}`;
					}else{
						formatKey = profile.audioType;
						formatName = ENCODE_VIDEO_CODEC[profile.audioType] || `--${profile.audioType}`;
					}
				}

				if(profile.category === 0) {
					if(group0[formatKey]) {
						group0[formatKey]['doms'].push(<option key={profile.id} value={profile.id}>{profile.name}</option>);
					}else{					
						group0['formatTypes'].push(formatKey);
						group0[formatKey] = {
							format : formatName,
							doms : [<option key={profile.id} value={profile.id}>{profile.name}</option>]
						};
					}
					return true;
				}

				if(!group[profile.category]) {
					group[profile.category] = {
						name : t(`msg_profile_category_name_${profile.category}`),
						formatTypes : [formatKey],
						[formatKey] : {
							format : formatName,
							doms : [<option key={profile.id} value={profile.id}>{profile.name}</option>]
						}
					};
					

				}else{
					if(group[profile.category][formatKey]) {
						group[profile.category][formatKey]['doms'].push(<option key={profile.id} value={profile.id}>{profile.name}</option>);
					}else{
						group[profile.category]['formatTypes'].push(formatKey);
						group[profile.category][formatKey] = {
							format : formatName,
							doms : [<option key={profile.id} value={profile.id}>{profile.name}</option>]
						};
					}
				}
			});

			group.push(group0);

			return group
					.filter(group => !!group)
					.map((group, i) => {
						return (<React.Fragment key={'encodeFrame' + i}>
							<optgroup key={group.name + i} label={group.name}></optgroup>
							{
								group.formatTypes.map((formatKey,i) => <optgroup key={formatKey + i} label={'\u00A0\u00A0'+group[formatKey]['format']}>{group[formatKey]['doms']}</optgroup>)
							}
						</React.Fragment>);
		
					});
		}
	)

	streamTypesDOM = memoize(
		(STREAM_STYPE) => Object.entries(STREAM_STYPE)
								// .filter(type => !isNaN(type[0])) //A003670
								.filter(type =>{
									// console.log(type[0]);
									return (!isNaN(type[0]) && finishedList.includes(Number(type[0])));
								})
								.map(type => <option key={type[0]} value={type[0]}>{type[1]}</option>)
	)
	nicsDOM = memoize(
		(nics) => nics.map(nic => <option key={nic.id} value={nic.id}>{nic.name}</option>)
	)

	videoInputOptionDOM = memoize(
		(videoInputs, deviceID, selectedSource) => [<option  key="none" value=""></option>].concat(videoInputs.map((input, i) => {
														let otherDeviceID = (deviceID % 2) + 1;
														let isDisabled = false;
														// if(selectedSource[otherDeviceID].filter(type => type.match(input)).length > 0) {
														// 	isDisabled = true;																	
														// }

														return <option key={i} value={input} disabled={isDisabled}>{INPUT_SOURCES[input]}</option>;
													}))
	)
	cgVideoSource(e) {

		const { streamInfo, selectedSource } = this.props;
		const { deleteSourceType, replaceSourceType } = this.props.actions;
		const deviceID = Number(streamInfo.deviceID);
		const currSelectedSource = this.state.videoSelected;
		const selectedRow = e.target.dataset.sourceRow;
		const type = e.target.value;
		const prevType = currSelectedSource[selectedRow];
		let currSourceType = [];

		if(type === '') {
			deleteSourceType(prevType, deviceID);
		}else{
			replaceSourceType(type, deviceID, selectedRow);
		}

		currSourceType = store.getState().rootReducer.selectedSource[deviceID];

		SET_DEVICE_CONFIG.fetchData({
			device : {
				id : deviceID,
				videoInput : currSourceType
			}
		});
	
	}

	handleStartStreming(data) {
		this.setState({
			isStreamingCheck : false
		});
		const { t, streamInfo, devicesTasks, streamProfiles, rowNo } = this.props;
		const { deviceID, taskID, id } = streamInfo;
		const streamID = id;
		const streamProfileMethod = ( streamID !== -1 ? 'PUT' : 'POST');
		const taskMethod = ( taskID !== -1 ? 'PATCH' : 'POST');
		const streamType = Number(this.state.streamType.value);
		const subPropsKey = STREAM_TYPE_MAP_STREAM_PARAMS[streamType];
		// let currEncodeProfileID = this.state.encodingProfile.value;
		let configPortDom = document.getElementById(`configPort${deviceID}${rowNo}`);
		let invalidRow1DomNodes;
		let invalidRow2DomNodes;
		let checkStreamProfileID = [];
		let streamProfile = {
			streamType,
			[subPropsKey] : {}
		};
		let task = {};

		configPortDom.setCustomValidity('');

		//get check stream profile
		devicesTasks.forEach(device => {
			device.tasks.forEach(task => {
				// console.log(task);
				if(streamID !== task.streamID) {
					checkStreamProfileID.push(task.streamID);
				}
			});
		});

		// console.log(streamID, this.props.streamProfiles, checkStreamProfileID);


		//Check port conflict [tcp,udp..rtsp]
		if(streamType < 6 ||  streamType === 8) {
			streamProfiles.filter(profile => (checkStreamProfileID.includes(profile.id) && (profile.streamType < 6 || profile.streamType === 8)))
							.forEach(profile => {
								let paramsKey = STREAM_TYPE_MAP_STREAM_PARAMS[profile.streamType];
								let params = profile[paramsKey];
								let isPortConflict = false;

								if(this.state.ipAddr.disabled) {//tcp,rtsp
									isPortConflict = (this.state.port.value === params.port);
								}else{
									isPortConflict = (this.state.ipAddr.value === params.ip && this.state.port.value === params.port);
								}

								if(isPortConflict) {
									configPortDom.setCustomValidity(t('msg_port_error'));
									this.setState({
										port : {
											...this.state.port,
											errMsg : t('msg_port_error')
										}
									});
								}
							});	
		}

		invalidRow1DomNodes = ReactDOM.findDOMNode(this.trRow1.current).querySelectorAll('input:invalid, select:invalid');
		invalidRow2DomNodes = ReactDOM.findDOMNode(this.trRow2.current).querySelectorAll('input:invalid, select:invalid');

		
		//Check invalid input
		if(invalidRow1DomNodes.length > 0 || invalidRow2DomNodes.length > 0 || data.invalidForm) {
			return false;
		}

		this.props.handleBackdrop(true);

		//this.props.streamProfiles
		
		//setup values
		OPTION_FIELD.forEach(oKey => {
			if(this.state[oKey]['disabled']) {
				return false;
			}

			switch(oKey) {
				case 'nic':
					streamProfile.nic = Number(this.state.nic.value);
					break;
				case 'port':
					streamProfile[subPropsKey]['port'] = Number(this.state.port.value);
					break;
				case 'ipAddr':
					streamProfile[subPropsKey]['ip'] = this.state[oKey]['value'];
					break;
				default:
					streamProfile[subPropsKey][oKey] = this.state[oKey]['value'];
					break;
			}

		});
		
		//setup sub values
		delete data.invalidForm;


		streamProfile[subPropsKey] = Object.assign(streamProfile[subPropsKey], {...data});

		if(streamID !== -1) {
			streamProfile.id = streamID;
		}

		
		//set stream profile 
		SET_STREAM_PROFILE.fetchData({
			streamProfile
		}, streamProfileMethod).then(data => {
			if(data.result !== 0) {
				//dialog error
			}else{
				return data.id;
			}
		}).then(_streamID => {
			//setup task values
			task.streamID = (streamID !== -1 ? streamID : _streamID);
			task.profileID = Number(this.state.encodingProfile.value);
			if(taskID !== -1) {
				task.id = taskID;
			}

			return SET_DEVICE_TASK.fetchData({
				devices : [{
					id : deviceID,
					tasks: [{ ...task }]
				}]
			}, taskMethod);
		})
		.then(data => {
			if(data.result !== 0) {
				//dialog error
			}else{

				task.rowNo = rowNo;
				task = {
					...task,
					...data.tasks.find(task => task.deviceID === deviceID)
				};
			
				return START_DEVICE_TASK.fetchData({
					tasks : [...data.tasks]
				}).then(data => {
					if(data.result === 0) {

						return Promise.all([checkDevicesTasks(true), checkTasksStatus(true), checkStreamProfiles(task.streamID, true)]).then(() => {

							this.props.renewDevicesTasksDetail(task);
							this.props.handleBackdrop(false);
							
							//update disabled btn
							this.setState({
								streamType : {
									...this.state.streamType,
									disabled : true
								},
								encodingProfile : {
									...this.state.encodingProfile,
									disabled : true
								},
								ipAddr : {
									...this.state.ipAddr,
									disabled : true
								},
								port : {
									...this.state.port,
									errMsg : '1~65535',
									disabled : true
								},
								nic : {
									...this.state.nic,
									disabled : true
								}
							});
						});
					}else{
						//dialog error
					}
				});
			}
		})
		.catch(err => {

		});

	}
	btnStart(e) {
		this.setState({
			isStreamingCheck : true,
			wasValidated : true
		});

	}
	btnStop(e) {

		const rowNo = this.props.rowNo;
		const { deviceID, taskID, id } = this.props.streamInfo;
		const taskInfo = {
			deviceID,
			taskID,
			rowNo,
			streamID : id,
			profileID : Number(this.state.encodingProfile.value)
		};
		
		this.props.handleBackdrop(true);

		STOP_DEVICE_TASK.fetchData({
			tasks : [{
				deviceID,
				taskID
			}]
		}).then(data => {
			if(data.result === 0) {
				checkTasksStatus(true).then(()=>{				
					this.props.renewDevicesTasksDetail(taskInfo);
					this.props.handleBackdrop(false);

					//update disabled btn
					this.setState({
						streamType : {
							...this.state.streamType,
							disabled : false
						},
						encodingProfile : {
							...this.state.encodingProfile,
							disabled : false
						},
						ipAddr : {
							...this.state.ipAddr,
							disabled : isFieldDisabled('ipAddr', this.state.streamType.value, 0)
						},
						port : {
							...this.state.port,
							errMsg : '1~65535',
							disabled : isFieldDisabled('port', this.state.streamType.value, 0)
						},
						nic : {
							...this.state.nic,
							disabled : isFieldDisabled('nic', this.state.streamType.value, 0)
						}
					});
				});
			}else{
				//dialog error
			}
		});

	}
	btnAdd(e) {
		this.props.addSubTask(this.props.streamInfo.deviceID);
	}
	btnDelete(e) {
		const { t, rowNo, streamInfo, taskKey } = this.props;
		const { deviceID, taskID } = streamInfo;

		this.setState({
			isDialogShow : true,
			dialogObj : {
				...this.state.dialogObj,
				type : 'confirm',
				icon : 'info',
				title : t('msg_stream_delete'),
				msg : t('msg_stream_delete_confirm'),
				ok : () => {

					this.props.handleBackdrop(true);

					if(taskID !== -1) {
						DELETE_DEVICE_TASK.fetchData({
							tasks : [{
								deviceID,
								taskID
							}]
						}).then(data => {
							if(data.result === 0) {
								checkTasksStatus(true).then(()=>{				
									this.props.deleteSubTask(deviceID, taskID, taskKey, rowNo);
									this.props.handleBackdrop(false);
								});
							}else{
								//dialog error
								this.props.handleAlert({
									type : 'failed',
									msg : <React.Fragment><h4 className="alert-heading">{t('msg_failed')}</h4><p>Error code : {data.result}</p></React.Fragment>
								});
							}
						});
						
					}else{
						this.props.deleteSubTask(deviceID, taskID, taskKey, rowNo);
						this.props.handleBackdrop(false);
					}

				}
			}
		});
		
	}
	getCurrEncodingProfile(streamType) {
		const { encodeProfiles } = this.props;
		
		return encodeProfiles.filter(profile => profile.streamType.includes(streamType) || profile.streamType.includes(0));
	}

	getDefaultVal(key, streamType) {
		const { nics, encodeProfiles } = this.props;
		let encodeProfileID = 0;
		switch(key) {
			case 'encodingProfile':
				// console.log('a,',this.getCurrEncodingProfile()[0]['id']);
				if(this.getCurrEncodingProfile(streamType)[0]) {
					encodeProfileID = this.getCurrEncodingProfile(streamType)[0]['id'];
				}
				return encodeProfileID;
			case 'port':
				return 1234;
			case 'nic':
				return nics[0]['id'];
			default:
				return '';
		}
	}
	onChangeVal(e, key) {
		let updateObj = {
			wasValidated : false
		};
		let val = e.target.value;

		if(key === 'streamType') {
			val = Number(val);

			OPTION_FIELD.forEach(oKey => {
				if(isFieldDisabled(oKey, val, false)) {
					updateObj[oKey] = {
						...this.state[oKey],
						disabled : true,
						value : ''
					};
				}else{
					updateObj[oKey] = {
						...this.state[oKey],
						disabled : false,
						value : this.getDefaultVal(oKey, val)
					};

					if(oKey === 'ipAddr') {
						updateObj[oKey]['pattern'] = getCheckIpPattern(Number(val));
					}
				}
			});

			updateObj.encodingProfile = {
				...this.state.encodingProfile,
				value : this.getDefaultVal('encodingProfile', val)
			};


		}

		updateObj[key] = {
			...this.state[key],
			value : val
		};

		this.setState(updateObj);


	}
	changeSourceReversed(e, state) {
		
		let passDevice = {
			id: this.props.streamInfo.deviceID,
			reverseInputSource: state
		};

		this.props.updateDeviceConfig(passDevice);

		SET_DEVICE_CONFIG.fetchData({
			device : passDevice
		},'PATCH');
	}

	render() {

		const { rowNo, totalTaskCount, videoInputs, nics, streamInfo, encodeProfiles, selectedSource, reverseInputSource, t } = this.props;
		const { streamType, encodingProfile, ipAddr, port, nic } = this.state;
		const videoSelected = this.state.videoSelected;
		const deviceID = streamInfo.deviceID;
		const videoInputOptionDOM = this.videoInputOptionDOM(videoInputs, deviceID, selectedSource);
		const streamTypesDOM = this.streamTypesDOM(STREAM_STYPE);
		const encodeProfilesDOM = this.encodeProfilesDOM(encodeProfiles, Number(streamType.value), t);
		const nicsDOM = this.nicsDOM(nics);
		const isAddRow = (rowNo > 1);
		const videoInputDOM = disabledType => (videoInputOptionDOM.map(obj => {

				if(!obj.props.disabled && obj.props.value !== '') {
					let newProp = {
						...obj.props,
						disabled : (disabledType === obj.props.value)
					};
					return { ...obj, props : newProp};
				}else{
					return obj;
				}

			})

		);
		const rowDOM = (buildRow) => {
			let dom = [];
			let selected = videoSelected[buildRow - 1];
			// let disabledType = videoSelected[buildRow%2];
			let disabledType = selectedSource[deviceID][buildRow%2];
			let isCheck = (videoSelected.length === 0);

			if(buildRow === 1) {
				if(!isAddRow) {
					dom.push(<td key="1" className="align-middle text-center" rowSpan="2">{rowNo}</td>);
					dom.push(<td key="2" className="align-top">
								<select className="form-control" onChange={this.cgVideoSource} data-source-row="0" value={ selected || ''} disabled={streamInfo.isStart} required={isCheck}>{ videoInputDOM(disabledType) }</select>
								<div className="invalid-feedback">{t('msg_not_setup_yet')}</div>
							</td>);
					dom.push(<td key="3" className="align-top text-center pt_10px_impt w_21px"><button className={"btn_reversed " + (reverseInputSource ? 'active' : '')} onClick={e => this.changeSourceReversed(e, !reverseInputSource)} ></button></td>);//reverseInputSource
				}else{
					
					dom.push(<td key="4" className="align-middle text-center" rowSpan="2">{rowNo}</td>);
					dom.push(<td key="5" rowSpan="2"></td>);
					dom.push(<td key="6" rowSpan="2"></td>);
				}
			}else{
				if(!isAddRow) {
					dom.push(<td key="5" className="">
								<select className="form-control" onChange={this.cgVideoSource} data-source-row="1" value={ selected || ''} disabled={streamInfo.isStart} required={isCheck}>{ videoInputDOM(disabledType) }</select>
								<div className="invalid-feedback">{t('msg_not_setup_yet')}</div>
							</td>);
				}else{
					// 
				}
			}

			return dom;
		};

		const subDOM = (streamType) => {
			// console.log(streamType, typeof streamType);
			const _streamType = Number(streamType);

			const params = {
				handleStartStreming: this.handleStartStreming,
				isStreamingCheck: this.state.isStreamingCheck,
				streamInfo: {
					...streamInfo,
					profileID: Number(this.state.encodingProfile.value),
					streamType : _streamType
				},
				handleBackdrop: this.props.handleBackdrop,
				handleAlert: this.props.handleAlert
			};
			switch(_streamType) {
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
					return <ConfigurationTcp {...params}></ConfigurationTcp>;
				case 6:
					return <ConfigurationRtmp {...params}></ConfigurationRtmp>;
				case 7:
					return <ConfigurationHls {...params}></ConfigurationHls>;
				case 8:
					return <ConfigurationRtsp {...params}></ConfigurationRtsp>;
				case 11:
				case 14:
					return <ConfigurationUstream {...params}></ConfigurationUstream>;
				case 12:
					return <ConfigurationTwitch {...params}></ConfigurationTwitch>;
				case 13:
					return <ConfigurationYoutube {...params}></ConfigurationYoutube>;
				case 15:
					return <ConfigurationFacebook {...params}></ConfigurationFacebook>;
				case 51: 
					return <ConfigurationRecord {...params} encodeProfiles={this.getCurrEncodingProfile(_streamType)}></ConfigurationRecord>;
				default: 
					return null;

			}
		};
 
		return (
			<React.Fragment>
				<tr ref={this.trRow1} className={'table-common-odd table-bordered ' + (this.state.wasValidated ? 'my-was-validated' : '')}>
					{ rowDOM(1) }
					<td className="align-top">
						<select className="form-control" disabled={streamType.disabled} value={streamType.value} onChange={e => this.onChangeVal(e, 'streamType')}>{ streamTypesDOM }</select>
					</td>
					<td className="align-top">
						<select className="form-control" disabled={encodingProfile.disabled} value={encodingProfile.value} onChange={e => this.onChangeVal(e, 'encodingProfile')}>{ encodeProfilesDOM }</select>
					</td>
					<td className="align-top">
						<input type="text" className="form-control" disabled={ipAddr.disabled} value={ipAddr.value} onChange={e => this.onChangeVal(e, 'ipAddr')} required={!ipAddr.disabled} pattern={ipAddr.pattern}/>
						<div className="invalid-feedback">{t('msg_ip_addr_error')}</div>
					</td>
					<td className="align-top">
						<input type="number" id={`configPort${deviceID}${rowNo}`} className="form-control" disabled={port.disabled} value={port.value} onChange={e => this.onChangeVal(e, 'port')} required={!port.disabled} min="1" max="65535" />
						<div className="invalid-feedback">{port.errMsg}</div>
					</td>
					<td className="align-top">
						<select className="form-control" disabled={nic.disabled} value={nic.value} onChange={e => this.onChangeVal(e, 'nic')} >{ nicsDOM }</select>
					</td>
					<td className="pt_10px_impt w_21px">
						<button className={ streamInfo.isStart ? 'btn_stop' : 'btn_start'} onClick={ streamInfo.isStart ? this.btnStop.bind(this) : this.btnStart.bind(this)}></button>
					</td>
					<td className="pt_10px_impt w_21px">
						{
							isAddRow ? <button className="btn_delete" onClick={ this.btnDelete.bind(this) } disabled={(streamInfo.isStart )}></button> :
										<button className="btn_add" onClick={ this.btnAdd.bind(this) } disabled={ totalTaskCount >= 2 }></button>
						}
						
					</td>
				</tr>
				<tr ref={this.trRow2} className={'table-common-odd table-bordered ' + (this.state.wasValidated ? 'my-was-validated' : '')}>
					{ rowDOM(2) }
					{ !isAddRow ? <td></td> : null }
					<td className="px-3 py-4" colSpan="7">
						{ subDOM(streamType.value) }
						<Dialog isShow={this.state.isDialogShow} toggle={()=>{this.setState({isDialogShow: !this.state.isDialogShow })}} { ...this.state.dialogObj }></Dialog>
					</td>
				</tr>
			</React.Fragment>
		)
	}
}




export default compose(
	translate('translation'),
	connect(mapStateToProps, mapDispatchToProps)
)(ConfigurationTasks);

