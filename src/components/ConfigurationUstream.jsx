import * as React from 'react';
import { translate } from "react-i18next";
import { retrieveFromProp, isFunction } from '../helper/helper';
import { AUTHENTICATE_CDN, GET_CDN_CHANNEL_LIST, LOGOUT_CDN } from '../helper/Services';

const USTREAM_LOGO = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2133 2133">
  		<path className="cls-1" d="M347,0H1693c43.09,0,91.71-3.793,129,4,69.15,14.453,122.76,39.269,170,75,65.67,49.67,111.09,123.522,134,216,9.37,37.839,7,86.434,7,133V1713c0,36.54,2.53,75.75-4,107-20.62,98.65-65.03,176.79-132,229-47.43,36.98-100.27,63.6-170,79-45.17,9.97-106.31,5-159,5H640c-118.916,0-284.618,12.94-377-16-118.745-37.2-199.118-122.43-243-235-21.16-54.28-20-126.41-20-203V644C-0.006,484.8-15.871,297.829,43,197,89.1,118.041,152.311,58.286,242,23c21.963-8.641,46.349-13.834,71-19ZM521,484v609c-0.01,155.53-1.7,302.43,44,409,61.488,143.39,179.724,217.25,349,254,66.312,14.4,166.24,23.22,243,10,41.44-7.14,81.77-10.85,119-22,132.76-39.78,235.52-113.33,288-233,49.8-113.55,48-257.01,48-423V484H1271v613c0.01,115.4,7.21,237.15-37,308-26.53,42.52-100.08,95.14-179,83-67.953-10.45-115.475-26.39-148-71-50.842-69.73-45-190.3-45-312V484H521Z"/>
	</svg>
);

const STREAM_TYPES = {
	'11' : 'ustream',
	'14' : 'cdnVideo'
};

class ConfigurationUstream extends React.Component {
	constructor(props) {
		super(props);
		const streamType = props.streamInfo.streamType;
		const objProps = props.streamInfo[STREAM_TYPES[streamType]] || {};
		const userID = retrieveFromProp('userID', objProps);
		const channelID = retrieveFromProp('channelID', objProps);

		this.state = {
			streamType : streamType,
			username: {
				value: userID,
				invalid: false,
				textLength: 0
			},
			password: {
				value: '',
				invalid: false,
				textLength: 0
			},
			channelID: channelID,
			channels: [],
			isCheckingLogin : false,
			isLogin : (userID && channelID), 
			errMsg: ''
		};

		this.cdnLoginForm = React.createRef();

		this.logout = this.logout.bind(this);
		this.login = this.login.bind(this);
		this.onChangeVal = this.onChangeVal.bind(this);
		this.updateChannels = this.updateChannels.bind(this);
		this.renderBtn = this.renderBtn.bind(this);

	}
	static getDerivedStateFromProps(nextProps, prevState) {
		const streamType = nextProps.streamInfo.streamType;

		if(streamType !== prevState.streamType) {

			if(nextProps.streamInfo[STREAM_TYPES[streamType]]) {

				const objProps = nextProps.streamInfo[STREAM_TYPES[streamType]];
				const userID = retrieveFromProp('userID', objProps);
				const channelID = retrieveFromProp('channelID', objProps);

				return {
					streamType : streamType,
					username: {
						value: userID,
						invalid: false,
						textLength: 0
					},
					password: {
						value: '',
						invalid: false,
						textLength: 0
					},
					channelID: channelID,
					channels: [],
					isCheckingLogin : false,
					isLogin : (userID && channelID), 
					errMsg: ''
				};

			}else{
				return {
					streamType : streamType,
					username: {
						value: '',
						invalid: false,
						textLength: 0
					},
					password: {
						value: '',
						invalid: false,
						textLength: 0
					},
					channelID: '',
					channels: [],
					isCheckingLogin : false,
					isLogin : false, 
					errMsg: ''
				};
			}
			
		}
		return null;
	}
	componentDidMount() {
		if(this.state.isLogin) {
			this.updateChannels();
		}
	}
	componentWillUnmount() {

	}
	componentDidUpdate(prevProps, prevState) {
		const streamType = this.state.streamType;

		if(this.props.isStreamingCheck) {

			const { t } = this.props; 
			const { username, channelID, isLogin } = this.state; 

			const passData = {
				userID : username.value,
				channelID : channelID
			};

			let updateState = {
				errMsg : ''
			};

			if(!isLogin) {
				if(passData.userID !== '') {
					updateState.errMsg = t('msg_please_login');
				}

			}

			this.setState(updateState);
			this.props.handleStartStreming(passData);
		}

		

		if(streamType !== prevState.streamType) {

			if(this.props.streamInfo[STREAM_TYPES[streamType]]) {
				if(this.state.isLogin) {
					this.updateChannels();
				}

			}
		}
	}
	onChangeVal(e, key) {

		let updateObj = {};

		if(this.state[key].hasOwnProperty('value')) {
			updateObj = {
				[key] : {			
					...this.state[key],
					value : e.target.value
				}
			};
		}else{
			updateObj[key] = e.target.value;
		}


		this.setState(updateObj);
	}

	logout(e) {
		const streamType = this.props.streamInfo.streamType;
		const { username, password } = this.state;

		LOGOUT_CDN.fetchData({
			streamType
		}).then(() => {
			this.setState({
				username : {
					...username,
					value: ''
				},
				password : {
					...password,
					value: ''
				},
				channelID : '',
				channels : [],
				isLogin : false,
				isCheckingLogin : false
			});
		});
	}
	login(e) {
		const { streamInfo, t } = this.props;
		const { streamType } = streamInfo;
		const { username, password } = this.state;
		const cdnLoginFormDOM = this.cdnLoginForm.current.querySelectorAll('input:invalid');

		this.setState({
			isCheckingLogin : true,
			errMsg: ''
		});


		if(cdnLoginFormDOM.length > 0) {
			return false;
		}


		this.props.handleBackdrop(true);

		AUTHENTICATE_CDN.fetchData({
			streamType,
			username : username.value,
			password : password.value
		}).then(data => {
			if(data.result === 0) {

				this.updateChannels((()=>{
					this.setState({
						isCheckingLogin : false,
						isLogin : true
					}, ()=>{

						this.props.handleBackdrop(false);
						this.props.handleAlert({
							type : 'ok',
							msg : <h4>{t('msg_success')}</h4> 
						});

					});
				}).bind(this));


			}else{

				//msg_get_rtmp_info_connection_lost, 
				this.setState({
					errMsg : t('msg_get_rtmp_info_login_fail'),
				});
				
			}
		});

	}
	updateChannels(callback) {
		const streamType = this.props.streamInfo.streamType;
		const channelID = this.state.channelID;
		let channels = [];
		let channelId = '';

		this.props.handleBackdrop(true);

		GET_CDN_CHANNEL_LIST.fetchData({
			streamType
		}).then(data => {
			this.props.handleBackdrop(false);
			if(data.result === 0) {
				channels = data.channelList.channels;
				channelId = channels[0]['channelID'];

				channels.forEach(channel => {
					if(channel.channelID === channelID) {
						channelId = channel.channelID;
					}
				});

				this.setState({
					channels : channels,
					channelID : channelId
				});

				if(isFunction(callback)) {
					callback();
				}


			}else{
				this.props.handleAlert({
					type : 'failed',
					msg : <React.Fragment><h4 className="alert-heading">{this.props.t('msg_failed')}</h4><p>Error code : {data.result}</p></React.Fragment>
				});
			}

		});
	}
	renderBtn(isLogin, streamType) {
		const { t } = this.props;
		if(streamType === 11) {
			return (isLogin ? <button className="btn btn-outline-ustream float-right" onClick={this.logout}><i className=" mr-2 align-middle">{USTREAM_LOGO}</i>{t("msg_logout")}</button>
						   : <button className="btn btn-outline-ustream float-right" onClick={this.login}><i className="mr-2 align-middle">{USTREAM_LOGO}</i>{t("msg_login")}</button>);
		}else{
			return (isLogin ? <button className="btn btn-cdnvideo float-right" onClick={this.logout}>{t("msg_logout")}</button>
						   : <button className="btn btn-cdnvideo float-right" onClick={this.login}>{t("msg_login")}</button>);
		}
	}
	render() {
		const { t, streamInfo } = this.props;
		const { username, channelID, password, channels, isCheckingLogin, isLogin, errMsg, streamType } = this.state;

		return (
			<fieldset className="container-fluid" disabled={streamInfo.isStart}>
				<div className="row">
					<div className="col">
						<fieldset ref={this.cdnLoginForm} disabled={!!isLogin} className={isCheckingLogin ? 'my-was-validated' : ''}>
							<div className="mb-2 row">
								<div className="col-4 col-xl-3 align-self-center">{t('msg_rtmp_username')}</div>
								<div className="col align-self-center">
									<input className={'form-control ' + (username.invalid ?  ' is-invalid' : '')} type="text" value={username.value} onChange={e => this.onChangeVal(e, 'username')} required={!isLogin}/>
									<div className="invalid-feedback">{t('validator_required')}</div>
								</div>
							</div>
							<div className="mb-2 row">
								<div className="col-4 col-xl-3 align-self-center">{t('msg_rtmp_password')}</div>
								<div className="col align-self-center">
									<input className={'form-control ' + (password.invalid ?  ' is-invalid' : '')} type="password" value={password.value} onChange={e => this.onChangeVal(e, 'password')} required={!isLogin}/>
									<div className="invalid-feedback">{t('validator_required')}</div>
								</div>
							</div>
							<div className="row">
								<div className="offset-3 col-lg text-danger align-self-center">{errMsg}</div>
							</div>
						</fieldset>
						<div className="mb-2 mt-3 row">
							<div className="col align-self-center">
								{
									this.renderBtn(isLogin, streamType)
								}
								
							</div>
						</div>
						
					</div>
					<div className="offset-1"></div>
					<div className="col">
						<div className="mb-2 row">
							<div className="col-4 align-self-center">{t('msg_streaming_channel')}</div>
							<div className="col align-self-center">
								<select className="form-control" value={channelID} onChange={e => this.onChangeVal(e, 'channelID')}  required>
									{
										channels.map(item => <option key={item.channelID} value={item.channelID}>{item.channelName}</option>)
									}
								</select>
							</div>
							<div className="col-1 align-self-center">
								<button className="btn_refresh" disabled={!isLogin} onClick={this.updateChannels}></button>
							</div>
						</div>
					</div>
					<div className="offset-xl-5"></div>
				</div>
				
			</fieldset>

		);
	}

};

export default translate('translation')(ConfigurationUstream);

