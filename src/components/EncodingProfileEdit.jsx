import * as React from "react";
import { translate } from "react-i18next";
import { GET_ENCODE_PROFILE } from "../helper/Services";
import { 
	ENCODE_VIDEO_CODEC,
	ENCODE_AUDIO_CODEC,
	AUDIO_SAMPLE_MAP_BITRATE
 } from "../constant/Common.Consts";


import EncodingProfileH264 from "./EncodingProfileH264";
import EncodingProfileAudio from "./EncodingProfileAudio";

const defaultProfile = {
	"videoType": "h264",
	"audioType": "aac",
	"videoInfo": {
		"width": 1280,
		"height": 720,
		"bitrate": 1800,
		"bframeNum": 0,
		"frame": 2500,
		"frameRate": 2500,
		"profile": "high",
		"encodeMode": "avbr_fixqp",
		"entropyMode": "cabac",
		"outputRatio": "4:3"
	},
	"audioInfo": {
		"channel": "stereo",
		"bitrate": 48
	}
};


//msg_profile_category_name

//form valid https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation

class EncodingProfileEdit extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			encodingProfile : null,
			wasValidated : true,
			isVideoCheckRequired : false,
			isAudioCheckRequired : false,
		};

		this.changeVal = this.changeVal.bind(this);
		this.changeSubVal = this.changeSubVal.bind(this);
		this.buildRefProfiles = this.buildRefProfiles.bind(this);
		this.renderVideo = this.renderVideo.bind(this);

	}
	componentDidMount() {

		GET_ENCODE_PROFILE.fetchData({
			id : this.props.profileID
		}).then(data => {
			if(data.result === 0) {
				let profile = {};

				if(this.props.action === 'new') {
					profile = {
						...data.profile,
						name : '',
						enableVideo : data.profile.hasOwnProperty('videoInfo'),
						enableAudio : data.profile.hasOwnProperty('audioInfo')
					};
				}else{
					profile = {
						...data.profile,
						enableVideo : data.profile.hasOwnProperty('videoInfo'),
						enableAudio : data.profile.hasOwnProperty('audioInfo')
					};
				}

				this.setState({
					encodingProfile : profile
				});
			}

		});

	}
	
	changeVal(e) {
		let val = (e.target.type === 'checkbox' ? e.target.checked : e.target.value);
		const attrName = e.target.name.replace(this.props.namePrefix + '_', '');

		if(attrName === 'refProfile') {
			GET_ENCODE_PROFILE.fetchData({
				id : Number(val)
			}).then(data => {
				if(data.result === 0) {

					this.setState(state => {
						return {
							encodingProfile : {
								...data.profile,
								name : state.encodingProfile.name,
								enableVideo : data.profile.hasOwnProperty('videoInfo'),
								enableAudio : data.profile.hasOwnProperty('audioInfo')
							}
						}
					});

				
				}

			});
		}else{

			let updateData = {
				isVideoCheckRequired : false,
				isAudioCheckRequired : false,
				encodingProfile : {
					...this.state.encodingProfile,
					[attrName] : val
				}
			};

			
			if(attrName === 'enableVideo'){
				if(!val) {
					delete updateData.encodingProfile.videoType;
					delete updateData.encodingProfile.videoInfo;
				}else{
					updateData.encodingProfile.videoType = defaultProfile.videoType;
					updateData.encodingProfile.videoInfo = defaultProfile.videoInfo;
					
				}
			}

			// if(attrName === 'videoType'){}

			if(attrName === 'enableAudio'){
				if(!val) {
					delete updateData.encodingProfile.audioType;
					delete updateData.encodingProfile.audioInfo;
				}else{
					updateData.encodingProfile.audioType = defaultProfile.audioType;//Object.keys(ENCODE_AUDIO_CODEC)[0];
					updateData.encodingProfile.audioInfo = defaultProfile.audioInfo;
					
				}
			}

			if(attrName === 'audioType'){
				updateData.audioInfo = {
					...this.state.encodingProfile.audioInfo
				};

				if(AUDIO_SAMPLE_MAP_BITRATE[val]) {
					for (let channelKey in AUDIO_SAMPLE_MAP_BITRATE[val]) {
						updateData.encodingProfile.audioInfo.channel = channelKey;
						updateData.encodingProfile.audioInfo.bitrate = AUDIO_SAMPLE_MAP_BITRATE[val][channelKey]['48000'][0];
					}
					
				}
			}

			if(!updateData.encodingProfile.videoType && !updateData.encodingProfile.audioType) {			
				updateData.isAudioCheckRequired = true;
				updateData.isVideoCheckRequired = true;
			}


			this.setState(updateData);

			
		}



	}

	changeSubVal(e) {
		const val = (e.target.type === 'number' ? Number(e.target.value) : e.target.value);
		const attrNameArr = e.target.name.split('_');
		const attrNameType = attrNameArr[1];
		const attrName = attrNameArr[2];

		this.setState(state => {
			let result = {
				encodingProfile : {
					...state.encodingProfile,
					[attrNameType] : {
						...state.encodingProfile[attrNameType]
					}
				}
			};

			if(attrName === 'resolution') {
				result.encodingProfile[attrNameType]['width'] = Number(val.replace(/x[\d]*/,''));
				result.encodingProfile[attrNameType]['height'] = Number(val.replace(/[\d]*x/,''));
			}else{
				result.encodingProfile[attrNameType][attrName] = val;
			}


			return result;
		});


	}

	renderVideo(videoType) {
		const { encodingProfile } = this.state;
		
		switch(videoType) {
			case 'h264':
			case 'h265':
				return <EncodingProfileH264 namePrefix={this.props.namePrefix} encodingProfile={encodingProfile} changeVal={this.changeSubVal}></EncodingProfileH264>;
			default :
				return null;
		}
	}
	renderAudio(type) {}
	buildRefProfiles(encodingProfiles) {
		const { t } = this.props;
		let group = [];
		let group0Doms = [];

		encodingProfiles.forEach((profile, i) => {
			if(profile.category === 0) {
				group0Doms.push(<option key={profile.id} value={profile.id}>{profile.name}</option>);
				return true;
			}
			if(!group[profile.category]) {
				group[profile.category] = {
					name : t(`msg_profile_category_name_${profile.category}`),
					doms : [<option key={profile.id} value={profile.id}>{profile.name}</option>]
				};
				
			}else{
				group[profile.category]['doms'].push(<option key={profile.id} value={profile.id}>{profile.name}</option>);
			}
		});

		group.push({
			name : t('msg_profile_category_name_0'),
			doms : group0Doms
		});

		return group.map((group, i) => <optgroup key={i} label={group.name}>{group.doms}</optgroup>);
	}
	render() {
		if(!this.state.encodingProfile) {
			return null;
		}
		const { t, encodingProfiles, wasValidated } = this.props;
		const { encodingProfile, isVideoCheckRequired, isAudioCheckRequired } = this.state;
		const currVideoType = encodingProfile.videoType;
		const currAudioType = encodingProfile.audioType;
		const isEnableVideo = encodingProfile.enableVideo;
		const isEnableAudio = encodingProfile.enableAudio;
		// console.log(encodingProfile);


		return (
			<div id={`${this.props.namePrefix}_form`} className={wasValidated ? 'encoding_form my-was-validated' : 'encoding_form'}>
				<div className="form-group row px-3">
					<label className="col-auto encoding_form_title col-form-label">{t('msg_profile_name')}</label>
					<div className="col">
						<input type="text" maxLength="50" required name={`${this.props.namePrefix}_name`} className="form-control" onChange={this.changeVal} value={encodingProfile.name}/>
						<div className="invalid-inline-feedback">{t('validator_required')}</div>
					</div>
				</div>
				<div className="form-group row px-3">
					<label className="col-auto encoding_form_title">{t('msg_profile_reference')}</label>
					<div className="col">
						<select name={`${this.props.namePrefix}_refProfile`} className="form-control" onChange={this.changeVal}>
							<option value={this.props.profileID}></option>
							{
								this.buildRefProfiles(encodingProfiles)
							}
						</select>
					</div>
				</div>

				<fieldset className="border mt-2rem px-3">
					<div className="form-group row align-items-center encode_legend_row">
						<div className="col-auto encoding_form_title align-self-center">
							<span className="bg-white px-2 ml-2">
								<input className="mr-2 form-check-input" type="checkbox" name={`${this.props.namePrefix}_enableVideo`} checked={isEnableVideo} id="videoType" onChange={this.changeVal} required={isVideoCheckRequired}/>
								<label className="font-weight-bold form-check-label" htmlFor="videoType">{t('msg_profile_video_setting')}</label>
							</span>
						</div>
						<div className="col">
							{
								isEnableVideo ? 
								<select name={`${this.props.namePrefix}_videoType`} className="form-control" onChange={this.changeVal} value={currVideoType}>
									{
										Object.entries(ENCODE_VIDEO_CODEC).map(codec => <option key={codec[0]} value={codec[0]}>{codec[1]}</option>)
									}
								</select>
								: null
							}
						</div>
					</div>

					{
						isEnableVideo ? this.renderVideo(currVideoType) : null
					}
				</fieldset>

				<fieldset className="border mt-2rem px-3">
					<div className="form-group row encode_legend_row">
						<div className="col-auto encoding_form_title align-self-center">
							<span className="bg-white px-2 ml-2">
								<input className="mr-2 form-check-input" type="checkbox" name={`${this.props.namePrefix}_enableAudio`} id="audioType" checked={isEnableAudio} onChange={this.changeVal} required={isAudioCheckRequired}/>
								<label className="font-weight-bold form-check-label" htmlFor="audioType">{t('msg_profile_audio_setting')}</label>
							</span>
						</div>
						<div className="col">
							{
								isEnableAudio ?
								<select name={`${this.props.namePrefix}_audioType`} className="form-control" onChange={this.changeVal} value={currAudioType}>
									{
										Object.entries(ENCODE_AUDIO_CODEC).map(codec => <option key={codec[0]} value={codec[0]}>{codec[1]}</option>)
									}
								</select> :
								null
							}

						</div>
					</div>
					{
						isEnableAudio ? <EncodingProfileAudio namePrefix={this.props.namePrefix} encodingProfile={encodingProfile} changeVal={this.changeSubVal}></EncodingProfileAudio> : null
					}
					
				</fieldset>
			</div>
		);
	}
}

export default translate("translation")(EncodingProfileEdit);

