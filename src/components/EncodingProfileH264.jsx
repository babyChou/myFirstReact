import * as React from "react";
import { translate } from "react-i18next";
import { 
	RESOLUTION,
	ENCODE_PROFILE,
	ENCODE_MODE,
	ENCODE_ENTROPY_MODE,
	ENCODE_OUTPUT_RATIO,
	// ENCODE_GOP_MODE,
	ENCODE_FRAME_RATE,

	H264_MACROBLOCKS,
	H265_PICTURE_SIZE,
	ENCODE_RESOLUTION_LEVEL,
	ENCODE_LEVEL_H264_DECODING,
	ENCODE_LEVEL_H265_SAMPLE_RATE,
	ENCODE_LEVEL
} from "../constant/Common.Consts";

const DEVICE_MAX_BITRATE = 102400;


//form valid https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation

class EncodingProfile extends React.Component {
	constructor(props) {
		super(props);

		const { encodingProfile } = props;
		const currResulution = `${encodingProfile.videoInfo.width}x${encodingProfile.videoInfo.height}`;
		const currProfile = encodingProfile.videoInfo.profile;
		const currCodec = encodingProfile.videoType;
		const currLevel = ENCODE_RESOLUTION_LEVEL[currCodec][currResulution][currProfile];
		const basicVal = ENCODE_LEVEL[currLevel][currCodec][currProfile] || ENCODE_LEVEL[currLevel][currCodec]['main'];
		let maxBitrate = basicVal;
		let maxFrameRate = 0;

		if(currCodec === 'h264') {
			if(currProfile !== 'baseline' && currProfile !== 'main') {
				maxBitrate = basicVal*1.25;
			}
		}

		if(currCodec === 'h264') {
			maxFrameRate = ENCODE_LEVEL_H264_DECODING[currLevel]/H264_MACROBLOCKS[currResulution];
		}else{
			maxFrameRate = ENCODE_LEVEL_H265_SAMPLE_RATE[currLevel]/H265_PICTURE_SIZE[currResulution];
		}


		this.state = {
			maxBitrate : (maxBitrate > DEVICE_MAX_BITRATE ? DEVICE_MAX_BITRATE : maxBitrate),
			maxFrameRate : maxFrameRate*100
		};

		this.changeResolution = this.changeResolution.bind(this);
		this.changeEncodeProfile = this.changeEncodeProfile.bind(this);
		this.changeBitrate = this.changeBitrate.bind(this);

	}
	componentDidMount() {

	}

	getMaxBitrate() {}
	getFrameRate() {}

	changeResolution(e) {
		const { encodingProfile } = this.props;
		const currResulution = e.target.value;
		const currProfile = encodingProfile.videoInfo.profile;
		const currCodec = encodingProfile.videoType;
		const currLevel = ENCODE_RESOLUTION_LEVEL[currCodec][currResulution][currProfile];
		const basicVal = ENCODE_LEVEL[currLevel][currCodec][currProfile] || ENCODE_LEVEL[currLevel][currCodec]['main'];
		let maxBitrate = basicVal;

		if(currCodec === 'h264') {
			if(currProfile !== 'baseline' && currProfile !== 'main') {
				maxBitrate = basicVal*1.25;
			}
		}

		maxBitrate = (maxBitrate > DEVICE_MAX_BITRATE ? DEVICE_MAX_BITRATE : maxBitrate);

		this.setState({
			maxBitrate : maxBitrate
		});
		
		
		this.props.changeVal(e);
	}
	changeEncodeProfile(e) {
		const { encodingProfile } = this.props;
		const currResulution = `${encodingProfile.videoInfo.width}x${encodingProfile.videoInfo.height}`;
		const currProfile = e.target.value;
		const currCodec = encodingProfile.videoType;
		const currLevel = ENCODE_RESOLUTION_LEVEL[currCodec][currResulution][currProfile];
		let maxFrameRate = 0;

		if(currCodec === 'h264') {
			maxFrameRate = ENCODE_LEVEL_H264_DECODING[currLevel]/H264_MACROBLOCKS[currResulution];
		}else{
			maxFrameRate = ENCODE_LEVEL_H265_SAMPLE_RATE[currLevel]/H265_PICTURE_SIZE[currResulution];
		}

		this.setState({
			maxFrameRate : maxFrameRate*100
		});

		//frame rate
		this.props.changeVal(e);
	}

	changeBitrate(e) {
		e.target.value = e.target.value*1000; 
		this.props.changeVal(e);
	}

	render() {
		const { t, encodingProfile } = this.props;
		const { maxBitrate } = this.state;
		const currVideoType = encodingProfile.videoType;
		const resolution = `${encodingProfile.videoInfo.width}x${encodingProfile.videoInfo.height}`;


		// console.log(encodingProfiles);

		return (
			<div className="form-group row ">
				<div className="col encoding_form_divider_right">
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_encode_mode')}</label>
						<div className="col">
							<select name={`${this.props.namePrefix}_videoInfo_encodeMode`} className="form-control" onChange={this.props.changeVal} value={encodingProfile.videoInfo.encodeMode}>
								{
									Object.entries(ENCODE_MODE)
										.filter(encodeMode => encodeMode[1]['tags'].includes(currVideoType))
										.map(encodeMode => <option key={encodeMode[0]} value={encodeMode[0]}>{encodeMode[1]['name']}</option>)
								}
							</select>
						</div>
					</div>
					<div className="form-group row">
						
						<label className="col-auto encoding_form_title">{t('msg_profile_resolution')}</label>
						<div className="col">
							<select name={`${this.props.namePrefix}_videoInfo_resolution`} className="form-control" onChange={this.changeResolution} value={resolution}>
								{
									Object.entries(RESOLUTION).map(resolution => <option key={resolution[0]} value={resolution[0]}>{resolution[0]}</option>)
								}
							</select>
						</div>
					</div>
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_h264_profile')}</label>
						<div className="col">
							<select name={`${this.props.namePrefix}_videoInfo_profile`} className="form-control" onChange={this.props.changeVal} value={encodingProfile.videoInfo.profile}>
								{
									Object.entries(ENCODE_PROFILE)
											.filter(encodeProfile => encodeProfile[1]['tags'].includes(currVideoType))
											.map(encodeProfile => <option key={encodeProfile[0]} value={encodeProfile[0]}>{encodeProfile[1]['name']}</option>)
								}
							</select>
						</div>
					</div>
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_display_aspect_ratio')}</label>
						<div className="col">
							<select name={`${this.props.namePrefix}_videoInfo_outputRatio`} className="form-control" onChange={this.props.changeVal} value={encodingProfile.videoInfo.outputRatio}>
								{
									Object.entries(ENCODE_OUTPUT_RATIO)
											.map(ratio => <option key={ratio[0]} value={ratio[0]}>{ratio[1]}</option>)
								}
							</select>
						</div>
					</div>
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_frame_rate')}</label>
						<div className="col">
							<select name={`${this.props.namePrefix}_videoInfo_frameRate`} className="form-control" onChange={this.props.changeVal} value={encodingProfile.videoInfo.frameRate}>
								{
									Object.entries(ENCODE_FRAME_RATE)
									// .filter(frameRate => frameRate[0] <= maxFrameRate)
									.map(frameRate => <option key={frameRate[0]} value={frameRate[0]}>{frameRate[1]}</option>)
								}
							</select>
						</div>
					</div>
				</div>
				<div className="col">
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_bitrate')}</label>
						<div className="col">
							<input type="number" className="form-control" min="2" max={maxBitrate} required name={`${this.props.namePrefix}_videoInfo_bitrate`} onChange={this.props.changeVal} value={encodingProfile.videoInfo.bitrate}/>
							<div className="invalid-inline-feedback">2 ~ {maxBitrate}</div>
						</div>
					</div>
					{/* <div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_gop_mode')}</label>
						<div className="col">
							<select className="form-control" name={`${this.props.namePrefix}_videoInfo_gopMode`} onChange={this.props.changeVal} value={encodingProfile.videoInfo.gopMode}>
								{
									Object.entries(ENCODE_GOP_MODE).map(gop => <option key={gop[0]} value={gop[0]}>{gop[1]}</option>)
								}
							</select>
						</div>
					</div> */}
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_key_frame')}</label>
						<div className="col">
							<input type="number" className="form-control" min="1" max="65536" required name={`${this.props.namePrefix}_videoInfo_frame`} onChange={this.props.changeVal} value={encodingProfile.videoInfo.frame}/>
							<div className="invalid-inline-feedback">1 ~ 65536</div>
						</div>
					</div>
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_entropy')}</label>
						<div className="col">
							<select className="form-control" name={`${this.props.namePrefix}_videoInfo_entropyMode`} onChange={this.props.changeVal} value={encodingProfile.videoInfo.entropyMode}>
								{
									Object.entries(ENCODE_ENTROPY_MODE).map(entropy => <option key={entropy[0]} value={entropy[0]}>{entropy[1]}</option>)
								}
							</select>
						</div>
					</div>
					<div className="form-group row">
						<label className="col-auto encoding_form_title">{t('msg_profile_bframes')}</label>
						<div className="col">
							<select className="form-control" name={`${this.props.namePrefix}_videoInfo_bframeNum`} onChange={this.props.changeVal} value={encodingProfile.videoInfo.bframeNum}>
								<option  value={0}>0</option>
								<option  value={1}>1</option>
								<option  value={2}>2</option>
							</select>
						</div>
					</div>
				</div>
				
			</div>
		);
	}
}

export default translate("translation")(EncodingProfile);

