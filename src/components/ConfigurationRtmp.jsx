import * as React from 'react';
import { translate } from "react-i18next";
import { randomID, genCheckFormats, retrieveFromProp } from '../helper/helper';
import ConfigurationCms from './ConfigurationCms';

const CMS_PARAMS = ['playBackUrl','title','description'];
const MAIN_KEY_MAP = {
	addr : 'rtmpUrl',
	streamName : 'rtmpStreamName',
	username : 'rtmpUser',
	password : 'rtmpPasswd',
	enableAuthorize : 'enableAuthorize',
	rtmpUrl : 'addr',
	rtmpStreamName : 'streamName',
	rtmpUser : 'username',
	rtmpPasswd : 'password',
	enableCms : 'enableCms',
	playBackUrl: 'playBackUrl',
	title: 'title',
	description: 'description'
};

class ConfigurationRtmp extends React.Component {
	constructor(props) {
		super(props);
		const rtmpProps = props.streamInfo.rtmp || {};
		const cmsProps = props.streamInfo.cms || {};
		const cmsDesc = retrieveFromProp('description', cmsProps);

		this.state = {
			addr: {
				value: retrieveFromProp('rtmpUrl', rtmpProps),
				invalid: false 
			},
			streamName: {
				value: retrieveFromProp('rtmpStreamName', rtmpProps),
				invalid: false,
				errMsg: ''
			},
			username: {
				value: retrieveFromProp('rtmpUser', rtmpProps),
				invalid: false,
				errMsg: ''
			},
			password: {
				value: retrieveFromProp('rtmpPasswd', rtmpProps),
				invalid: false,
				errMsg: props.t('validator_required')
			},
			cmPassword: {
				value: retrieveFromProp('rtmpPasswd', rtmpProps) || '',
				invalid: false,
				errMsg: props.t('validator_required')
			},
			enableAuthorize: {
				value: retrieveFromProp('enableAuthorize', rtmpProps) || false
			},
			enableCms: {
				value: !!props.streamInfo.enableCms
			},
			playBackUrl : {
				value: retrieveFromProp('playBackUrl', cmsProps) || '',
				invalid: false,
				errMsg: ''
			},
			title : {
				value: retrieveFromProp('title', cmsProps) || '',
				invalid: false,
				errMsg: '',
			},
			description : {
				value: cmsDesc,
				invalid: false,
				textLength: cmsDesc.length,
			}
		};

		this.form = React.createRef();
		this.prefix = randomID();

		this.checkFields = this.checkFields.bind(this);
		this.onChangeVal = this.onChangeVal.bind(this);
		this.updateParentValue = this.updateParentValue.bind(this);

	}
	componentDidUpdate(prevProps, prevState) {
		if(this.props.isStreamingCheck) {
			this.checkFields();
		}
	}
	checkFields() {
		const hasErr = this.form.current.querySelectorAll('input:invalid, textarea:invalid').length > 0;
		let emitStates = {};

		if(!!this.state.enableCms.value) {
			emitStates.cms = {};
		}

		if(!hasErr) {
			this.form.current.querySelectorAll('input:valid, textarea:valid').forEach(el => {
				if(el.name) {
					const keyName = el.name.split('_')[1];
					const stateKey = MAIN_KEY_MAP[keyName];
					if(CMS_PARAMS.includes(stateKey)) {
						emitStates.cms[keyName] = this.state[stateKey].value;
					}else{
						emitStates[keyName] = this.state[stateKey].value;
					}
				}
				
			});

		}

		this.props.handleStartStreming(emitStates);
		
	}
	onChangeVal(e, key) {
		const { t } = this.props;
		let updateObj = {};

		this.form.current.querySelectorAll('.js_check_password').forEach(el => {
			el.setCustomValidity('');
		});

		if(!!key.match('enable')) {
			updateObj[key] = {
				value : !!Number(e.target.value)
			}

		}else{

			updateObj[key] = {
				...this.state[key],
				value : e.target.value
			};

		}

		if(key.includes('password')) {
			if(updateObj[key]['value'] === '') {
				updateObj[key]['errMsg'] = t('validator_required')
			}else{
				updateObj[key]['errMsg'] = t('msg_password_not_matched')
			}
			
		}

		if(key === 'description'){
			updateObj[key].textLength = e.target.value.length;
		}


		this.setState(updateObj, () => {
			const { password, cmPassword } = this.state;
			if(password.value !== cmPassword.value) {
				this.form.current.querySelectorAll('.js_check_password').forEach(el => {
					el.setCustomValidity('validator_equalTo');
				});
			}

		});


	}
	updateParentValue(updateObj) {
		this.setState(updateObj);
	}


	render() {
		const { t, streamInfo, isCmsConnected } = this.props;
		const { addr, streamName, username, password, cmPassword, enableAuthorize, playBackUrl, title, description, enableCms } = this.state;
		const rtmpCertID = 'enable_rtmp_cert' + randomID();
		const cmsParam = { 
			playBackUrl,
			title,
			description,
			enableCms,
			streamType : 6,
			updateParentValue : this.updateParentValue
		};
		
		return (
			<fieldset ref={this.form} className="container-fluid" disabled={streamInfo.isStart}>
				<div className="form-row mb-3 align-items-center">
					<div className="col-auto conmmon_title_w">{t('msg_fms_addr')}</div>
					<div className="col d-inline-flex align-items-center">
						<input className={'form-control conmmon_control_w' + (addr.invalid ?  ' is-invalid' : '')} type="text" name={`${this.prefix}_rtmpUrl`} value={addr.value} onChange={e => this.onChangeVal(e, 'addr')} required pattern="^rtmp://([-a-zA-Z0-9\.]+)(:[\d]*)?/?([-a-zA-Z0-9\.:]*)$"/>
						<div className="tip-feedback ml-5">{t('msg_fms_addr_example')}</div>
					</div>
				</div>
				<div className="form-row mb-3 align-items-center">
					<div className="col-auto conmmon_title_w">{t('msg_fms_stream_name')}</div>
					<div className="col d-inline-flex align-items-center">
						<input className={'form-control conmmon_control_w' + (streamName.invalid ?  ' is-invalid' : '')} type="text" name={`${this.prefix}_rtmpStreamName`} value={streamName.value} onChange={e => this.onChangeVal(e, 'streamName')} required/>
						<div className="invalid-feedback ml-5 w_auto">{t('validator_required')}</div>
					</div>
				</div>
				<div className="my-3 row form-check">
					<div className="col">
						<input className="form-check-input" type="checkbox" value={enableAuthorize.value ? 0 : 1} id={rtmpCertID} name={`${this.prefix}_enableAuthorize`} checked={enableAuthorize.value} onChange={e => this.onChangeVal(e, 'enableAuthorize')}/>
						<label className="form-check-label" htmlFor={rtmpCertID}>{t('msg_enable_rtmp_cert')}</label>
					</div>
				</div>
				{
					!enableAuthorize.value ? null : 
					<React.Fragment>
						<div className="form-row mb-3 align-items-center">
							<div className="col-auto conmmon_title_w">{t('msg_rtmp_username')}</div>
							<div className="col d-inline-flex align-items-center">
								<input className={'form-control conmmon_control_w' + (username.invalid ?  ' is-invalid' : '')} type="text" name={`${this.prefix}_rtmpUser`} value={username.value} onChange={e => this.onChangeVal(e, 'username')} required={enableAuthorize.value}/>
								<div className="invalid-feedback ml-5 w_auto">{t('validator_required')}</div>
							</div>
						</div>
						<div className="form-row mb-3 align-items-center">
							<div className="col-auto conmmon_title_w">{t('msg_rtmp_password')}</div>
							<div className="col d-inline-flex align-items-center">
								<input className={'form-control conmmon_control_w js_check_password' + (password.invalid ?  ' is-invalid' : '')} type="password" name={`${this.prefix}_rtmpPasswd`} value={password.value} onChange={e => this.onChangeVal(e, 'password')} required={enableAuthorize.value}/>
								<div className="invalid-feedback ml-5 w_auto">{password.errMsg}</div>
							</div>
						</div>
						<div className="form-row align-items-center">
							<div className="col-auto conmmon_title_w">{t('msg_rtmp_password_confirm')}</div>
							<div className="col d-inline-flex align-items-center">
								<input className={'form-control conmmon_control_w js_check_password' + (cmPassword.invalid ?  ' is-invalid' : '')} type="password" value={cmPassword.value} onChange={e => this.onChangeVal(e, 'cmPassword')} required={enableAuthorize.value}/>
								<div className="invalid-feedback ml-5 w_auto">{cmPassword.errMsg}</div>
							</div>
						</div>
					</React.Fragment>
				}
				{
					isCmsConnected ? <ConfigurationCms {...cmsParam}></ConfigurationCms> : null
					
				}
			</fieldset>
		);
	}

};

export default translate('translation')(ConfigurationRtmp);

