import * as React from 'react';
import ReactDOM from 'react-dom';
import memoize from "memoize-one";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose, bindActionCreators } from 'redux';
import store from '../store/Store';
import { rootActions } from '../action/Root.Actions';
import { INPUT_SOURCES, STREAM_STYPE } from '../constant/Common.Consts';
import { SET_STREAM_PROFILE, SET_DEVICE_TASK, START_DEVICE_TASK, STOP_DEVICE_TASK, DELETE_DEVICE_TASK, SET_DEVICE_CONFIG } from '../helper/Services';
import {
    checkDevicesTasks,
    checkTasksStatus
} from "../helper/preloader";
import { retrieveFromProp } from '../helper/helper';
import ConfigurationRtmp from './ConfigurationRtmp';
//https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization



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
	4 : ['ipAddr','port'],
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
	51 : ['ipAddr']
}

function isFieldDisabled(key, streamType, isStart) {
	if(isStart) {
		return !!isStart;
	}else{
		return NOT_NECESSARY_FIELD[streamType].includes(key);
	}

}


const mapDispatchToProps = (dispatch) => {
	return { actions: bindActionCreators(rootActions, dispatch) };
};

class ConfigurationTasks extends React.Component {
	constructor(props) {
		super(props);
		const streamInfo = props.streamInfo || {};
		const streamType = retrieveFromProp('streamType', streamInfo);
		const subPropsKey = STREAM_TYPE_MAP_STREAM_PARAMS[streamType];
		const restData = streamInfo[subPropsKey] || {};

		this.state = {
			videoSelected : ['',''],
			wasValidated : false,
			isStreamingCheck : false,
			streamType: { 
				value : streamType,
				disabled: !!streamInfo.isStart
			},
			encodingProfile: { 
				value : retrieveFromProp('profileID', streamInfo) || 1,
				disabled: !!streamInfo.isStart
			},
			ipAddr: {
				value: retrieveFromProp('ip', restData) || '',
				disabled: isFieldDisabled('ipAddr', streamType, streamInfo.isStart)
			},
			port: {
				value: retrieveFromProp('port', restData) || '',
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
		(encodeProfiles) => encodeProfiles.map(profile => <option key={profile.id} value={profile.id}>{profile.name}</option>)
	)
	streamTypesDOM = memoize(
		(STREAM_STYPE) => Object.entries(STREAM_STYPE)
								// .filter(type => !isNaN(type[0])) //A003670
								.filter(type =>{
									// console.log(type[0]);
									return (!isNaN(type[0]) && Number(type[0]) === 6);
								} )
								.map(type => <option key={type[0]} value={type[0]}>{type[1]}</option>)
	)
	nicsDOM = memoize(
		(nics) => nics.map(nic => <option key={nic.id} value={nic.id}>{nic.name}</option>)
	)

	videoInputOptionDOM = memoize(
		(videoInputs, deviceID, selectedSource) => [<option  key="none" value=""></option>].concat(videoInputs.map((input, i) => {
														let otherDeviceID = (deviceID % 2) + 1;
														let isDisabled = false;
														if(selectedSource[otherDeviceID].filter(type => type.match(input)).length > 0) {
															isDisabled = true;																	
														}

														return <option key={i} value={input} disabled={isDisabled}>{INPUT_SOURCES[input]}</option>;
													}))
	)
	cgVideoSource(e) {

		const { streamInfo, selectedSource } = this.props;
		const { addSourceType, deleteSourceType } = this.props.actions;
		const deviceID = Number(streamInfo.deviceID);
		const currSelectedSource = this.state.videoSelected;
		const selectedRow = e.target.dataset.sourceRow;
		const type = e.target.value;
		const prevType = currSelectedSource[selectedRow];
		let currSourceType = [];

		if(type === '') {
			deleteSourceType(prevType, deviceID);
		}else{
			if(selectedSource[deviceID].length < 2) {
				addSourceType(type, deviceID);
			}else{
				deleteSourceType(prevType, deviceID);
				addSourceType(type, deviceID);
			}
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
		const { deviceID, taskID, id } = this.props.streamInfo;
		const streamID = id;
		const streamProfileMethod = ( streamID !== -1 ? 'PUT' : 'POST');
		const taskMethod = ( taskID !== -1 ? 'PATCH' : 'POST');
		const streamType = this.state.streamType.value;
		const invalidRow1DomNodes = ReactDOM.findDOMNode(this.trRow1.current).querySelectorAll('input:invalid, select:invalid');
		const invalidRow2DomNodes = ReactDOM.findDOMNode(this.trRow2.current).querySelectorAll('input:invalid, select:invalid');
		const subPropsKey = STREAM_TYPE_MAP_STREAM_PARAMS[streamType];
		let streamProfile = {
			streamType
		};

		// console.log(77777,streamID, streamProfileMethod, data);

		let task = {};
		
		//Check invalid input
		if(invalidRow1DomNodes.length > 0 || invalidRow2DomNodes.length > 0 || data.invalidForm) {
			return false;
		}

		this.props.handleBackdrop(true);
		
		//setup values
		OPTION_FIELD.forEach(oKey => {
			if(this.state[oKey]['disabled']) {
				return false;
			}

			if(oKey === 'nic') {
				streamProfile.nic = Number(this.state.nic.value);
			}else{
				streamProfile[subPropsKey] = this.state[oKey]['value'];
			}
		});
		
		//setup sub values
		delete data.invalidForm;


		streamProfile[subPropsKey] = {...data};

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
			
				return START_DEVICE_TASK.fetchData({
					tasks : [...data.tasks]
				}).then(data => {
					if(data.result === 0) {
						return Promise.all([checkDevicesTasks(true), checkTasksStatus(true)]).then(() => {
							this.props.handleBackdrop(false);
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
		//stopStream
		//STOP_DEVICE_TASK
		const { deviceID, taskID } = this.props.streamInfo;

		STOP_DEVICE_TASK.fetchData({
			tasks : [{
				deviceID,
				taskID
			}]
		}).then(data => {
			if(data.result === 0) {
				checkTasksStatus(true);
			}else{
				//dialog error
			}
		})

		console.log(this, e);
	}
	btnAdd(e) {
		this.props.addSubTask(this.props.streamInfo.deviceID);
	}
	btnDelete(e) {
		const rowNo = this.props.rowNo;
		const { deviceID, taskID } = this.props.streamInfo;
		//DELETE_DEVICE_TASK
		console.log();

		this.props.deleteSubTask(deviceID, taskID, rowNo);
	}
	onChangeVal(e, key) {
		let updateObj = {
			wasValidated : false
		};
		let val = e.target.value;


		if(key === 'streamType') {
			OPTION_FIELD.forEach(oKey => {
				if(isFieldDisabled(oKey, val, false)) {
					updateObj[oKey] = {
						...this.state[oKey],
						disabled : true
					};
				}else{
					updateObj[oKey] = {
						...this.state[oKey],
						disabled : false
					};
				}
			});
		}

		updateObj[key] = {
			...this.state[key],
			value : val
		};

		this.setState(updateObj);


	}

	render() {

		const { rowNo, totalTaskCount, videoInputs, nics, streamInfo, encodeProfiles, selectedSource, t } = this.props;
		const { streamType, encodingProfile, ipAddr, port, nic } = this.state;
		const videoSelected = this.state.videoSelected;
		const deviceID = streamInfo.deviceID;
		const videoInputOptionDOM = this.videoInputOptionDOM(videoInputs, deviceID, selectedSource);
		const streamTypesDOM = this.streamTypesDOM(STREAM_STYPE);
		const encodeProfilesDOM = this.encodeProfilesDOM(encodeProfiles);
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
			let disabledType = videoSelected[buildRow%2];
			let isCheck = (videoSelected.length === 0);

			if(buildRow === 1) {
				if(!isAddRow) {
					dom.push(<td key="1" className="align-middle text-center" rowSpan="2">{rowNo}</td>);
					dom.push(<td key="2" className="align-top">
								<select className="form-control" onChange={this.cgVideoSource} data-source-row="0" value={ selected || ''} disabled={streamInfo.isStart} required={isCheck}>{ videoInputDOM(disabledType) }</select>
								<div className="invalid-feedback">{t('msg_not_setup_yet')}</div>
							</td>);
				}else{
					
					dom.push(<td key="3" className="align-middle text-center" rowSpan="2">{rowNo}</td>);
					dom.push(<td key="4" rowSpan="2"></td>);
				}
			}else{
				if(!isAddRow) {
					dom.push(<td key="5" className="">
								<select className="form-control" onChange={this.cgVideoSource} data-source-row="1" value={ selected || ''} disabled={streamInfo.isStart} required={isCheck}>{ videoInputDOM(disabledType) }</select>
								<div className="invalid-feedback">{t('msg_not_setup_yet')}</div>
							</td>);
				}else{
					// dom.push(<td key="6"></td>);
				}
			}

			return dom;
		};

		const subDOM = (streamType) => {
			// console.log(streamType, typeof streamType);
			switch(Number(streamType)) {
				case 6:
					return <ConfigurationRtmp handleStartStreming={this.handleStartStreming} isStreamingCheck={this.state.isStreamingCheck} streamInfo={streamInfo}></ConfigurationRtmp>;
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
						<input type="text" className="form-control" disabled={ipAddr.disabled} value={ipAddr.value} onChange={e => this.onChangeVal(e, 'ipAddr')} required />
						<div className="invalid-feedback">{t('msg_ip_addr_error')}</div>
					</td>
					<td className="align-top">
						<input type="number" className="form-control" disabled={port.disabled} value={port.value} onChange={e => this.onChangeVal(e, 'port')} required min="1" max="65535" />
						<div className="invalid-feedback">1~65535</div>
					</td>
					<td className="align-top">
						<select className="form-control" disabled={nic.disabled} value={nic.value} onChange={e => this.onChangeVal(e, 'nic')} >{ nicsDOM }</select>
					</td>
					<td className="" style={{width:'21px', paddingTop:'10px'}}>
						<button className={ streamInfo.isStart ? 'btn_stop' : 'btn_start'} onClick={ streamInfo.isStart ? this.btnStop.bind(this) : this.btnStart.bind(this)}></button>
					</td>
					<td className="" style={{width:'21px', paddingTop:'10px'}}>
						{
							isAddRow ? <button className="btn_delete" onClick={ this.btnDelete.bind(this) } disabled={(streamInfo.isStart )}></button> :
										<button className="btn_add" onClick={ this.btnAdd.bind(this) } disabled={(streamInfo.isStart || totalTaskCount >= 2 )}></button>
						}
						
					</td>
				</tr>
				<tr ref={this.trRow2} className={'table-common-odd table-bordered ' + (this.state.wasValidated ? 'my-was-validated' : '')}>
					{ rowDOM(2) }
					<td className="px-3 py-4" colSpan="7">
						{ subDOM(streamType.value) }
					</td>
				</tr>
			</React.Fragment>
		)
	}
}




export default compose(
	translate('translation'),
	connect(null, mapDispatchToProps)
)(ConfigurationTasks);

