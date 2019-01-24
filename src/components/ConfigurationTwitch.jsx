import * as React from 'react';
import { translate } from "react-i18next";
import { randomID, retrieveFromProp } from '../helper/helper';
import { AUTHENTICATE_OAUTH, LOGOUT_CDN, SET_STREAM_PROFILE } from '../helper/Services';

const HOSTNAME = 'http://' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
const HOST_URI = `${HOSTNAME}/retrieveToken`;
const REDIRECT_URI = `https://api.twitch.tv/kraken/oauth2/authenticate?action=authorize&client_id=nwv779kj9s4wjdn1dkdrnc4duq8fe0&redirect_uri=https://www.avermedia.com/oauth/auth_v2.0.php&response_type=token&scope=channel_read&state=${HOST_URI}`;
 
// authUrl = 'https://www.facebook.com/dialog/oauth?client_id=1288773337839988&redirect_uri=https://www.avermedia.com/oauth/auth_v2.0.php&scope=publish_actions&response_type=token&state={IP}/cgi-bin/facebookAuth';
// console.log(HOST_URI);

class ConfigurationTwitch extends React.Component {
	constructor(props) {
		super(props);
		const objProps = props.streamInfo.twitch || {};

		this.state = {
			userID: retrieveFromProp('userID', objProps),
			loginErrMsg : ''
		};

		this.postKey = randomID();
		this.popup = null;
		this.timer = null;

		this.logout = this.logout.bind(this);
		this.login = this.login.bind(this);

	}
	componentDidMount() {
		window.addEventListener('message', e => {
			if (e.data.key !== this.postKey)
				return;

			this.props.handleBackdrop(true);

			AUTHENTICATE_OAUTH.fetchData({
				code : e.data.access_token,
				streamType : 12
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
				setTimeout(()=>{
					this.popup.close();
				}, 300);
				clearInterval(this.timer);
			}
		}, false);
	}
	componentWillUnmount() {

	}
	componentDidUpdate(prevProps, prevState) {
		if(this.props.isStreamingCheck) {
			let updateState = {
				loginErrMsg : ''
			};

			updateState.loginErrMsg = this.props.t('msg_please_login');

			this.setState(updateState);

			this.props.handleStartStreming({
				userID : this.state.userID,
				invalidForm : !this.state.userID
			});
		}
	}

	logout(e) {
		const { taskKey, streamInfo, updateRootStreamProfile } = this.props;
		const toEmptyProfile = {
			twitch : {
				channelID: '',
				userID: '',
				videoID: ''
			}
		};

		SET_STREAM_PROFILE.fetchData({
			streamProfile : {
				id : streamInfo.id,
				...toEmptyProfile
			}
		}, 'PUT').then(data => {

			LOGOUT_CDN.fetchData({
				streamType : 12
			}).then(() => {
				updateRootStreamProfile(taskKey, toEmptyProfile);
				this.setState({
					userID : null,
					loginErrMsg : ''
				});
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
		const { userID, loginErrMsg } = this.state;
		return (
			userID ?
			<button className="btn btn-outline-twitch" onClick={this.logout} disabled={streamInfo.isStart}><i className="icon icon-md ion-logo-twitch mr-2 align-middle"></i>{t("msg_logout")}</button>
			:
			<div>			
				<button className="btn btn-outline-twitch mr-3" onClick={this.login}><i className="icon icon-md ion-logo-twitch mr-2 align-middle"></i>{t("msg_login")}</button>
				<span className="text-danger">{loginErrMsg}</span>
			</div> 

		);
	}

};

export default translate('translation')(ConfigurationTwitch);

