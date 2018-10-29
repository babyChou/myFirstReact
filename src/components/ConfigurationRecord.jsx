import * as React from 'react';
import { translate } from "react-i18next";
import { retrieveFromProp } from '../helper/helper';
import { RECORD_FILE_PREFIX_NAME, RECORD_ROOT_FOLDER, MAX_RECORD_DURATION, MIN_RECORD_DURATION } from "../constant/Init.Consts";
import { RECORD_STORE_DEVICE, RECORD_CONTAINER } from "../constant/Common.Consts";
import { UPDATE_CHECK_NETWORK_CONNECTION } from '../helper/Services';
import Btn from './Btn';


const FILE_PREFIX_NAME = RECORD_FILE_PREFIX_NAME;
const ROOT_FOLDER = RECORD_ROOT_FOLDER;

const regxRecordPath = /^(\\\\)((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)||[\w]+)(\\[\w]+)$/;
const regxRecordIpStr = '^(\\\\\\\\)?((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)||[\\w]+)$';
const regxFolderPathStr = '^(\\\\)?([\\w]*)$';

function getValFormRecordPath(paramName, recordPath) {// \\10.1.9.10\aaaa, \\mpdsw01\Temp
	let result = '';
	if(paramName === 'ip') {
		if(recordPath.match(/[\d]+.[\d]+.[\d]+.[\d]+/)) {
			result = /[\d]+.[\d]+.[\d]+.[\d]+/.exec(recordPath).join('');

		}else if(recordPath.match(/[\w]+/)){
			result = /[\w]+/.exec(recordPath).join('');
		}
		
	}else{

		if(recordPath.match(/[\w]+$/)) {
			result = /[\w]+$/.exec(recordPath).join('');
		}
	}

	return result;

}

function getValFormSegmentDuration(paramName, segmentDuration) {
	const duration = Number(segmentDuration);
	let hr = 0;
	let min = 5;

	if(duration) {
		hr = Math.floor(duration/60);
		min = (duration - (hr*60));
	}

	return (paramName === 'hour' ? hr : min);

}

class ConfigurationRecord extends React.Component {
	constructor(props) {
		super(props);
		const objProps = props.streamInfo.record || {};
		const storeDevice = retrieveFromProp('storeDevice', objProps) || 'sd';
		const recordPath = retrieveFromProp('recordPath', objProps) || '';
		const segmentDuration = retrieveFromProp('segmentDuration', objProps);

		this.state = {
			storeDevice: storeDevice,
			container: retrieveFromProp('container', objProps) || 'mp4',
			ip: {
				value:  getValFormRecordPath('ip', recordPath),
				invalid: false,
				errMsg: ''
			},
			folderPath: {
				value: getValFormRecordPath('folderPath', recordPath),
				invalid: false,
				errMsg: ''
			},
			hour: {
				value: getValFormSegmentDuration('hour', segmentDuration),
				invalid: false,
				errMsg: ''
			},
			min: {
				value: getValFormSegmentDuration('min', segmentDuration),
				invalid: false,
				errMsg: ''
			},
			username: {
				value: retrieveFromProp('username', objProps),
				invalid: false,
				errMsg: ''
			},
			password: {
				value: retrieveFromProp('password', objProps),
				invalid: false,
				errMsg: ''
			},
			isEditing : (storeDevice === 'nas' && regxRecordPath.test(recordPath)),
			connectionMsg : ''
		};

		this.ipDOM = React.createRef();
		this.pathDOM = React.createRef();

		this.onChangeVal = this.onChangeVal.bind(this);
		this.getRenderPath = this.getRenderPath.bind(this);
		this.checkConnection = this.checkConnection.bind(this);
		this.editConnection = this.editConnection.bind(this);

	}
	componentDidMount() {
		
	}
	componentWillUnmount() {

	}
	componentDidUpdate(prevProps, prevState) {
		if(this.props.isStreamingCheck) {

			let ip = '';
			let folderPath = '';
			let segmentDuration = (Number(this.state.hour.value))*60 + Number(this.state.min.value);
			let passData = {};
			let updateState = {
				hour : {
					...this.state.hour,
					invalid : false
				},
				min : {
					...this.state.min,
					invalid : false
				}
			};


			if(segmentDuration > MAX_RECORD_DURATION || segmentDuration < MIN_RECORD_DURATION) {
				passData.invalidForm = true;
				updateState.hour.invalid = true;
				updateState.min.invalid = true;
			}


			passData = {
				container : this.state.container,
				storeDevice : this.state.storeDevice,
				recordPath : ROOT_FOLDER,
				filePrefix : FILE_PREFIX_NAME,
				segmentDuration : segmentDuration
			};

			if(passData.storeDevice === 'nas') {
				ip = getValFormRecordPath('ip', this.state.ip.value);
				folderPath = getValFormRecordPath('folderPath', this.state.folderPath.value);
				passData = {
					...passData,
					username : this.state.username.value,
					password : this.state.password.value,
					recordPath : `\\\\${ip}\\${folderPath}`,
				};
			}

			

			this.setState(updateState);
			this.props.handleStartStreming(passData);
		}
	}
	onChangeVal(e, key) {

		let updateObj = {};

		if(this.state[key].hasOwnProperty('value')) {
			updateObj[key] = {		
				...this.state[key],
				value : e.target.value
			};
		}else{
			updateObj[key] = e.target.value;
		}

		if(key === 'storeDevice' && e.target.value === 'nas') {
			updateObj.isEditing = true;
			updateObj.ip = {
				...this.state.ip,
				invalid : false
			};
			updateObj.folderPath = {
				...this.state.folderPath,
				invalid : false
			};
		}

		this.setState(updateObj);
	}

	getRenderPath() {
		const { storeDevice, ip, folderPath } = this.state;

		if(storeDevice === 'nas') {
			if(ip.value) {
				return `\\\\${getValFormRecordPath('ip',ip.value)}\\${getValFormRecordPath('folderPath', folderPath.value)}`;
			}else{
				return '';
			}
		}else{
			return ROOT_FOLDER;
		}

	}
	checkConnection() {

		let ip = getValFormRecordPath('ip', this.state.ip.value);
		let folderPath = getValFormRecordPath('folderPath', this.state.folderPath.value);
		let updateState = {
			ip : {
				...this.state.ip,
				invalid : false
			},
			folderPath : {
				...this.state.folderPath,
				invalid : false
			}
		};
		let isInvalid = false;


		if(!this.ipDOM.current.validity.valid) {
			updateState.ip.invalid = true;
			isInvalid = true;
		}

		if(!this.pathDOM.current.validity.valid) {
			updateState.folderPath.invalid = true;
			isInvalid = true;
		}

	
		if(isInvalid) {
			this.setState(updateState);
			return false;
		}

		this.props.handleBackdrop(true);


		UPDATE_CHECK_NETWORK_CONNECTION.fetchData({
			recordPath : ip + folderPath,
			username : this.state.username.value,
			password : this.state.password.value,
		}).then(data => {
			this.props.handleBackdrop(false);

			if(data.result === 0) {
				
				this.props.handleAlert({
					type : 'ok',
					msg : <h4>{this.props.t('msg_success')}</h4> 
				});

				updateState.isEditing = false
				updateState.connectionMsg = '';
				this.setState(updateState);

			}else{
				//connectionMsg

				updateState.connectionMsg = data.result;
				this.setState(updateState);
			}
		});

	}

	editConnection() {
		this.setState({
			isEditing : true
		});
	}

	render() {
		const { t, streamInfo } = this.props;
		const { isEditing, storeDevice, container, ip, folderPath, hour, min, username, password, connectionMsg } = this.state;

		return (
			<fieldset className="container-fluid" disabled={streamInfo.isStart}>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_store_device')}</div>
					<div className="col-lg-3">
						<select className="form-control" value={storeDevice} onChange={e => this.onChangeVal(e, 'storeDevice')} >
							{
								Object.entries(RECORD_STORE_DEVICE).map(item => <option key={item[0]} value={item[0]}>{item[1]}</option>)
							}
						</select>
					</div>
				</div>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_backup_path')}</div>
					<div className="col-lg-3">
						<input className="form-control" type="text" value={this.getRenderPath()} onChange={e => this.onChangeVal(e, '')} readOnly={true}/>
					</div>
				</div>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_video_format')}</div>
					<div className="col-lg-3">
						<select className="form-control" value={container} onChange={e => this.onChangeVal(e, 'container')} >
							{
								Object.entries(RECORD_CONTAINER).map(item => <option key={item[0]} value={item[0]}>{item[1]}</option>)
							}
						</select>
					</div>
				</div>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_file_duration')}</div>
					<div className="col-lg-3 d-flex align-items-center ">
						<input className={`form-control ${( hour.invalid ? 'is-invalid' : '')}`} type="number" value={hour.value} onChange={e => this.onChangeVal(e, 'hour')} />
						<span className={'px-2 ' + ( hour.invalid ? 'text-danger' : '')}>{t('msg_hour')}</span>
						<input className={`form-control ${( min.invalid ? 'is-invalid' : '')}`} type="number" value={min.value} onChange={e => this.onChangeVal(e, 'min')} />
						<span className={'px-2 ' + ( hour.invalid ? 'text-danger' : '')}>{t('msg_minutes')}</span>
					</div>
					<div className="col-lg-2 d-flex align-items-center"><span className={( hour.invalid ? 'text-danger' : 'text-secondary')}>( {MIN_RECORD_DURATION +' '+ t('msg_minutes')} ~ 2 {t('msg_hour')} )</span></div>
				</div>

				<fieldset className={storeDevice !== 'nas' ? 'd-none' : ''} disabled={streamInfo.isStart || !isEditing}>
					<div className="mb-2 mt-4 row">
						<div className="col-lg-2">{t('msg_IP_addr')}</div>
						<div className="col-lg-3">
							<input className={`form-control ${( ip.invalid ? 'is-invalid' : '')}`} type="text" value={ip.value} onChange={e => this.onChangeVal(e, 'ip')} ref={this.ipDOM} pattern={regxRecordIpStr} required={isEditing}/>
						</div>
						<div className="col-lg-2">
							<span className={( ip.invalid ? 'text-danger' : 'text-secondary')}>{t('msg_example') + ' ' + t('msg_tip_record_IP')}</span>
						</div>
					</div>
					<div className="mb-2 row">
						<div className="col-lg-2">{t('msg_backup_path')}</div>
						<div className="col-lg-3">
							<input className={`form-control ${( folderPath.invalid ? 'is-invalid' : '')}`} type="text" value={folderPath.value} onChange={e => this.onChangeVal(e, 'folderPath')} ref={this.pathDOM} pattern={regxFolderPathStr} required={isEditing}/>
						</div>
						<div className="col-lg-2">
							<span className={( folderPath.invalid ? 'text-danger' : 'text-secondary')}>{t('msg_example') + ' ' + t('msg_tip_record_path')}</span>
						</div>
					</div>
					<div className="mb-2 row">
						<div className="col-lg-2">{t('msg_user_name')}</div>
						<div className="col-lg-3">
							<input className="form-control" type="text" value={username.value} onChange={e => this.onChangeVal(e, 'username')} />
						</div>
					</div>
					<div className="mb-2 row">
						<div className="col-lg-2">{t('msg_backup_password')}</div>
						<div className="col-lg-3">
							<input className="form-control" type="text" value={password.value} onChange={e => this.onChangeVal(e, 'password')} />
						</div>
						
					</div>
					<div className="mb-2 row">
						<div className="offset-2 col-lg-2">
							<span className='text-danger'>{connectionMsg}</span>
						</div>
					</div>
				</fieldset>

				<div className={'mb-2 row ' + (storeDevice !== 'nas' ? 'd-none' : '')}>
					<div className="col-lg-5">
						{
							isEditing ? <Btn type="submit" onClick={this.checkConnection} className="float-right mt-1">{t("msg_btn_connect")}</Btn>
							: <Btn type="submit" onClick={this.editConnection} className="float-right mt-1">{t("msg_edit")}</Btn>
						}
						
					</div>
				</div>
				
			</fieldset>

		);
	}

};

export default translate('translation')(ConfigurationRecord);

