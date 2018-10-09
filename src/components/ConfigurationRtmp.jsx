import * as React from 'react';
import { translate } from "react-i18next";
import { randomID, genCheckFormats, retrieveFromProp } from '../helper/helper';

const CHECK_BASIC_PROPS = ['addr','streamName'];
const CHECK_ADVANCED_PROPS = ['username','password','cmPassword'];
const MAIN_KEY_MAP = {
	addr : 'rtmpUrl',
	streamName : 'rtmpStreamName',
	username : 'rtmpUser',
	password : 'rtmpPasswd',
	enableAuthorize : 'enableAuthorize',
	rtmpUrl : 'addr',
	rtmpStreamName : 'streamName',
	rtmpUser : 'username',
	rtmpPasswd : 'password'
};

class ConfigurationRtmp extends React.Component {
	constructor(props) {
		super(props);
		const rtmpProps = props.streamInfo.rtmp || {};

		this.state = {
			addr: {
				value: retrieveFromProp('rtmpUrl', rtmpProps),
				invalid: false ,
				checkList : ['empty', 'rtmpUrlFormat']
			},
			streamName: {
				value: retrieveFromProp('rtmpStreamName', rtmpProps),
				invalid: false,
				errMsg: '',
				checkList : ['empty']
			},
			username: {
				value: retrieveFromProp('rtmpUser', rtmpProps),
				invalid: false,
				errMsg: '',
				checkList : ['empty']
			},
			password: {
				value: retrieveFromProp('rtmpPasswd', rtmpProps),
				invalid: false,
				errMsg: '',
				checkList : ['empty']
			},
			cmPassword: {
				value: '',
				invalid: false,
				errMsg: '',
				checkList : ['empty','samePasswd-password']
			},
			enableAuthorize: {
				value: retrieveFromProp('enableAuthorize', rtmpProps) || false
			}
		};

		this.checkFields = this.checkFields.bind(this);
		this.onChangeVal = this.onChangeVal.bind(this);

	}
	// static getDerivedStateFromProps(props, state) {
		/* let propKey = '';
		let updateStates = {};
		for(let k in state) {
			if(MAIN_KEY_MAP.hasOwnProperty(k)) {
				propKey = MAIN_KEY_MAP[k];
				updateStates[k] = {
					...state[k]
				};

				updateStates[k]['value'] = rtmpObj[propKey] || '';
			}
		}
		return { ...updateStates }; */

		// if(props.isStreamingCheck) {
		// 	return this.checkFields();
		// }else{
		// 	return null;
		// }
	// }
	componentDidUpdate(prevProps, prevState) {
		if(this.props.isStreamingCheck) {
			this.checkFields();
		}
	}
	checkFields() {
		const t = this.props.t;
		let emitStates = { invalidForm : false };
		let defaultState = {};
		let updateState = {};
		let checkKeyArr = CHECK_BASIC_PROPS;

		if(this.state.enableAuthorize.value) {
			checkKeyArr = checkKeyArr.concat(CHECK_ADVANCED_PROPS);
		}
		

		checkKeyArr.forEach(propKey => {
			let propObj = this.state[propKey];
			let checkList = propObj.checkList;
			let anotherKey = '';

			defaultState[propKey] = {
				...this.state[propKey],
				invalid : false,
				errMsg: ''
			};

			checkList.some(checkType => {
				let formats = genCheckFormats(checkType);
				let isInvalid = formats.check(propObj.value);
				let errorKey = formats.errorKey;

				if(checkType.match('samePasswd')) {
					anotherKey = checkType.split('-')[1];
					isInvalid = formats.check(propObj.value, this.state[anotherKey].value);
				}

				if(isInvalid) {
					emitStates.invalidForm = true;
					updateState[propKey] = {
						...this.state[propKey],
						invalid : true
					};

					if(checkType.match('samePasswd')) {

						updateState[anotherKey] = {
							...this.state[anotherKey],
							invalid : true
						};
						updateState[anotherKey]['errMsg'] = t(errorKey);
					}

					if(this.state[propKey].hasOwnProperty('errMsg')) {
						updateState[propKey]['errMsg'] = t(errorKey);
					}

					return true;
				}

				return false;
				
			});
			
		});

		if(!emitStates.invalidForm) {
			let orgKey = '';
			for(let k in this.state) {
				orgKey = MAIN_KEY_MAP[k];
				if(orgKey) {
					emitStates[orgKey] = this.state[k].value;
				}
			}
		}

		this.props.handleStartStreming(emitStates);
		this.setState({...defaultState, ...updateState});

	}
	onChangeVal(e, key) {
		let updateObj = {};

		if(key === 'enableAuthorize') {
			updateObj[key] = {
				value : !!Number(e.target.value)
			}
		}else{

			updateObj[key] = {
				...this.state[key],
				value : e.target.value
			};

		}

		this.setState(updateObj);


	}
	render() {
		const { t, streamInfo } = this.props;
		const { addr, streamName, username, password, cmPassword, enableAuthorize } = this.state;
		const rtmpCertID = 'enable_rtmp_cert' + randomID();
		
		return (
			<fieldset className="container-fluid" disabled={streamInfo.isStart}>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_fms_addr')}</div>
					<div className="col-lg-2"><input className={'form-control ' + (addr.invalid ?  ' is-invalid' : '')} type="text" value={addr.value} onChange={e => this.onChangeVal(e, 'addr')}/></div>
					<div className={'col-lg-2 ' + ( addr.invalid ? 'text-danger' : 'text-secondary')}>{t('msg_fms_addr_example')}</div>
				</div>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_fms_stream_name')}</div>
					<div className="col-lg-2"><input className={'form-control ' + (streamName.invalid ?  ' is-invalid' : '')} type="text" value={streamName.value} onChange={e => this.onChangeVal(e, 'streamName')}/></div>
					<div className="col-lg text-danger">{streamName.errMsg}</div>
				</div>
				<div className="my-3 row form-check">
					<div className="col-lg">
						<input className="form-check-input" type="checkbox" value={enableAuthorize.value ? 0 : 1} id={rtmpCertID} checked={enableAuthorize.value} onChange={e => this.onChangeVal(e, 'enableAuthorize')}/>
						<label className="form-check-label" htmlFor={rtmpCertID}>{t('msg_enable_rtmp_cert')}</label>
					</div>
				</div>
				<div className={"mb-2 row" + (enableAuthorize.value ? '' : ' d-none')}>
					<div className="col-lg-2">{t('msg_rtmp_username')}</div>
					<div className="col-lg-2"><input className={'form-control ' + (username.invalid ?  ' is-invalid' : '')} type="text" value={username.value} onChange={e => this.onChangeVal(e, 'username')} /></div>
					<div className="col-lg text-danger">{username.errMsg}</div>
				</div>
				<div className={"mb-2 row" + (enableAuthorize.value ? '' : ' d-none')}>
					<div className="col-lg-2">{t('msg_rtmp_password')}</div>
					<div className="col-lg-2"><input className={'form-control ' + (password.invalid ?  ' is-invalid' : '')} type="text" value={password.value} onChange={e => this.onChangeVal(e, 'password')}/></div>
					<div className="col-lg-2 text-danger">{password.errMsg}</div>
				</div>
				<div className={"row" + (enableAuthorize.value ? '' : ' d-none')}>
					<div className="col-lg-2">{t('msg_rtmp_password_confirm')}</div>
					<div className="col-lg-2"><input className={'form-control ' + (cmPassword.invalid ?  ' is-invalid' : '')} type="text" value={cmPassword.value} onChange={e => this.onChangeVal(e, 'cmPassword')}/></div>
					<div className="col-lg text-danger">{cmPassword.errMsg}</div>
				</div>
			</fieldset>
		);
	}

};

export default translate('translation')(ConfigurationRtmp);

