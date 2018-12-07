import * as React from "react";
import { translate } from "react-i18next";
import { SET_ENCODE_PROFILE } from "../helper/Services";
import { 
	ENCODE_AUDIO_CHANNEL,
	AUDIO_SAMPLE_MAP_BITRATE
} from "../constant/Common.Consts";


//msg_profile_category_name

//form valid https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation

class EncodingProfile extends React.Component {

	componentDidMount() {

	}

	changeVal(e) {
		const attrAsset = (e.target.name).split('_');
		const attr = attrAsset[0];
		const id = Number(attrAsset[1]);
		let val = e.target.value;

		if(attr === 'keepRatio') {
			val = !Number(val);
		}

		const encodingProfiles = this.state.encodingProfiles.map(pipConfig => {
			if(id === pipConfig.id) {
				
				return {
					...pipConfig,
					[attr] : val
				};

			}else{
				return pipConfig;
			}
		});

		this.setState({
			encodingProfiles
		});

		SET_ENCODE_PROFILE.fetchData({
			config : {
				id : id,
				[attr] : val
			}
		},'PATCH');

	}

	render() {
		const { t, encodingProfile } = this.props;
		const audioInfo = encodingProfile.audioInfo || {};
		let currAudioType = encodingProfile.audioType || 'aac';
		let currChannel = audioInfo.channel || 'mono';

		return (
			<div className="form-group row">
				<div className="col encoding_form_divider_right">
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_channel')}</label>
						<div className="col">
							<select className="form-control" name={`${this.props.namePrefix}_audioInfo_channel`} onChange={this.props.changeVal} value={currChannel}>
								{
									Object.entries(ENCODE_AUDIO_CHANNEL)
										.filter(channel => channel[1]['tags'].includes(currAudioType))
										.map(channel => <option key={channel[0]} value={channel[0]}>{channel[1]['name']}</option>)
								}
							</select>
						</div>
					</div>
					<div className="form-group row">
						
						<label className="col-auto encoding_form_title">{t('msg_profile_audio_sample_rate')}</label>
						<div className="col">
							<select className="form-control">
								<option value={48}>48</option>
							</select>
						</div>
					</div>
					
				</div>
				<div className="col">
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_audio_bitrate')}</label>
						<div className="col">
							<select className="form-control" name={`${this.props.namePrefix}_audioInfo_bitrate`} onChange={this.props.changeVal} value={audioInfo.bitrate}>
								{
									AUDIO_SAMPLE_MAP_BITRATE[currAudioType][currChannel][48000]
									.map(bitrate => <option key={bitrate} value={bitrate}>{bitrate}</option>)
								}
							</select>
						</div>
					</div>
					
				</div>
				
			</div>
		);
	}
}

export default translate("translation")(EncodingProfile);

