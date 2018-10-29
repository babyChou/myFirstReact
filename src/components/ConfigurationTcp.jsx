import * as React from 'react';
import { translate } from "react-i18next";
import { randomID, retrieveFromProp } from '../helper/helper';
import { AUTHENTICATE_OAUTH, LOGOUT_CDN } from '../helper/Services';
import Tag from './Tag';

const HOSTNAME = 'http://' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
const HOST_URI = `${HOSTNAME}/retrieveToken`;
const REDIRECT_URI = `https://accounts.google.com/o/oauth2/auth?client_id=320053556772-ims85cqoo8k8ti1c2fal45libubi732t.apps.googleusercontent.com&redirect_uri=https://www.avermedia.com/oauth/auth_v2.0.php&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile&response_type=code&state=${HOST_URI}&access_type=offline&approval_prompt=force`;

// 
//  authUrl = 'https://api.twitch.tv/kraken/oauth2/authenticate?action=authorize&client_id=nwv779kj9s4wjdn1dkdrnc4duq8fe0&redirect_uri=https://www.avermedia.com/oauth/auth_v2.0.php&response_type=token&scope=channel_read&state={IP}/cgi-bin/twitchAuth',
// authUrl = 'https://www.facebook.com/dialog/oauth?client_id=1288773337839988&redirect_uri=https://www.avermedia.com/oauth/auth_v2.0.php&scope=publish_actions&response_type=token&state={IP}/cgi-bin/facebookAuth';
// console.log(HOST_URI);

class ConfigurationYoutube extends React.Component {
	constructor(props) {
		super(props);
		const objProps = props.streamInfo.youtube || {};

		this.state = {
			userID: retrieveFromProp('userID', objProps),
			title: {
				value: retrieveFromProp('title', objProps),
				invalid: false,
				textLength: 0,
				errMsg: ''
			},
			description: {
				value: retrieveFromProp('description', objProps),
				invalid: false,
				textLength: 0,
				errMsg: ''
			},
			privacy: {
				value:  retrieveFromProp('privacy', objProps) || 'unlisted',
				invalid: false,
				errMsg: ''
			},
			tag: {
				value: retrieveFromProp('tag', objProps),
				invalid: false,
				errMsg: ''
			}
		};

		this.postKey = randomID();
		this.popup = null;
		this.timer = null;

		this.logout = this.logout.bind(this);
		this.login = this.login.bind(this);
		this.onChangeVal = this.onChangeVal.bind(this);

	}
	componentDidMount() {
		window.addEventListener('message', e => {
			if (e.data.key !== this.postKey)
				return;

			this.props.handleBackdrop(true);

			AUTHENTICATE_OAUTH.fetchData({
				code : e.data.code
			}).then(data => {
				if(data.result === 0) {
					this.setState({
						userID : data.userID
					}, () => {
						this.props.handleBackdrop(false);
					});
				}
			});

			if(this.popup) {
				this.popup.close();
				clearInterval(this.timer);
			}
		}, false);
	}
	componentWillUnmount() {

	}
	componentDidUpdate(prevProps, prevState) {
		if(this.props.isStreamingCheck) {

			const passData = {
				userID : this.state.userID,
				title : this.state.title.value,
				description : this.state.description.value,
				privacy : this.state.privacy.value,
				tag : this.state.tag.value,
			};

			let updateState = {
				title : {
					...this.state.title,
					invalid : (this.state.title.value.length === 0 || this.state.title.value.length > 150)
				},
				description : {
					...this.state.description,
					invalid : (this.state.description.value.length === 0 || this.state.description.value.length > 5000)
				}
			};

			this.setState(updateState);
			this.props.handleStartStreming(passData);
		}
	}
	onChangeVal(e, key) {

		let updateObj = {
			[key] : {			
				...this.state[key],
				value : e.target.value
			}
		};

		if(key === 'title' || key === 'description') {
			updateObj[key].textLength = e.target.value.length;

			if(key === 'title') {
				updateObj[key].invalid = e.target.value.length > 150;
			}else{
				updateObj[key].invalid = e.target.value.length > 5000;
			}
			
		}


		this.setState(updateObj);
	}

	logout(e) {
		
		LOGOUT_CDN.fetchData({
			streamType : 13
		}).then(() => {
			this.setState({
				userID : null
			});
		});
	}
	login(e) {
		this.popup = window.open(REDIRECT_URI,'' , 'height=550px, width=980px');
		
		// console.log(REDIRECT_URI);
		this.timer = setInterval(() => { 
		    if(!this.popup.closed) {
		        this.popup.postMessage({
		        	key : this.postKey
		        }, HOSTNAME);
		    }
		}, 2000);
		

	}
	render() {
		const { t, streamInfo } = this.props;
		const { userID, title, description, privacy, tag } = this.state;

		return (
			userID ?
			<fieldset className="container-fluid" disabled={streamInfo.isStart}>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_title')}</div>
					<div className="col-lg-2">
						<input className="form-control" type="text" value={title.value} onChange={e => this.onChangeVal(e, 'title')} required maxLength="150"/>
						<small className={( title.invalid ? 'text-danger' : 'text-secondary')}>({title.textLength}/150)</small>
					</div>
					
				</div>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_description')}</div>
					<div className="col-lg-2"><textarea className="form-control" type="text" value={description.value} onChange={e => this.onChangeVal(e, 'description')} required maxLength="5000"></textarea>
						<small className={( description.invalid ? 'text-danger' : 'text-secondary')}>({description.textLength}/5000)</small>
					</div>
				</div>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_tag')}</div>
					<div className="col-lg-2">
						<Tag value={tag.value} onChange={tag => this.onChangeVal({target:{value:tag}}, 'tag')} disabled={streamInfo.isStart}></Tag>
					</div>
				</div>
				<div className="mb-2 row">
					<div className="col-lg-2">{t('msg_privacy')}</div>
					<div className="col-lg-2">
						<select className="form-control" value={privacy.value} onChange={e => this.onChangeVal(e, 'privacy')} >
							<option value="unlisted">{t('msg_privacy_unlisted')}</option>
							<option value="private">{t('msg_privacy_private')}</option>
							<option value="public">{t('msg_privacy_public')}</option>
						</select>
					</div>
				</div>
				<div className="mb-2 mt-4 row">
					<div className="col-lg-4">
						<button className="btn btn-outline-danger float-right" onClick={this.logout}><i className="icon icon-md ion-logo-google mr-2 align-middle"></i>{t("msg_logout")}</button>
					</div>
				</div>
			</fieldset>
			: <button className="btn btn-outline-danger" onClick={this.login}><i className="icon icon-md ion-logo-google mr-2 align-middle"></i>{t("msg_login")}</button>

		);
	}

};

export default translate('translation')(ConfigurationYoutube);

