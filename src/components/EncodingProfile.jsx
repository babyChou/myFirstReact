import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { translate } from "react-i18next";
import { GET_ENCODE_PROFILE_LIST, GET_ENCODE_PROFILE, SET_ENCODE_PROFILE } from "../helper/Services";
import { 
	ENCODE_VIDEO_CODEC,
	ENCODE_AUDIO_CODEC,
	ENCODE_MODE,
	ENCODE_ENTROPY_MODE,
	ENCODE_PROFILE,
	ENCODE_OUTPUT_RATIO,
	ENCODE_FRAME_RATE,
	ENCODE_AUDIO_CHANNEL
 } from "../constant/Common.Consts";

import { randomID } from "../helper/helper";

import Header from "./Header";
import WindowModal from "./WindowModal";
import Dialog from "./Dialog";
import Btn from "./Btn";
import EncodingProfileEdit from "./EncodingProfileEdit";

const videoInfoKeyMap = {
	encodeMode : 'msg_profile_encode_mode',
	entropyMode : 'msg_profile_entropy',
	profile : 'msg_profile_h264_profile',
	bframeNum : 'msg_profile_bframes',
	bitrate : 'msg_profile_bitrate',
	outputRatio : 'msg_profile_display_aspect_ratio',
	frameRate : 'msg_profile_frame_rate',
	frame : 'msg_profile_key_frame',
};

const audioInfoKeyMap = {
	channel : 'msg_profile_channel',
	bitrate : 'msg_profile_audio_bitrate',
	sampleRate : 'msg_profile_audio_sample_rate'
};

//msg_profile_resolution
//msg_profile_category_name

//form valid https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation

const mapStateToProps = store => ({
	encodingProfiles: store.profiles.encodeProfiles
});

class EncodingProfile extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			wasValidated : false,
			isDialogShow : false,
			isEditProfileShow : false,
			defaultProfileID : 0,
			editProfileID : 0,
			dialogObj : {
				title : '',
				type : 'custom', 
				icon : 'warning',
				mainMsg : '',
				msg : '',
			},
			btnAction : 'new'
		};

		this.namePrefix = randomID();

		this.addProfile = this.addProfile.bind(this);
		this.editProfile = this.editProfile.bind(this);
		this.deleteProfile = this.deleteProfile.bind(this);
		this.submitProfile = this.submitProfile.bind(this);
		this.getNewList = this.getNewList.bind(this);
		this.getVideoDisplayInfo = this.getVideoDisplayInfo.bind(this);
		this.getAudioDisplayInfo = this.getAudioDisplayInfo.bind(this);

	}
	componentDidMount() {
		this.getNewList();
	}
	getNewList() {

		return GET_ENCODE_PROFILE_LIST.fetchData().then(data => {
			let promiseQue = [];
			data.profiles.filter(profile => profile.id > 1000)
							.forEach(profile => {
								promiseQue.push(GET_ENCODE_PROFILE.fetchData({ id : profile.id }));
							});

			return Promise.all(promiseQue).then(() => {			
				this.setState({
					defaultProfileID : data.profiles.filter(profile => profile.id < 1000)[0]['id'],
					editProfileID : data.profiles.filter(profile => profile.id < 1000)[0]['id']
				});
			});

		});

	}
	deleteProfile(e, id) {


		this.setState({
			isDialogShow : true,
			dialogObj : {
				...this.state.dialogObj,
				type : 'confirm',
				icon : 'info',
				title : this.props.t('msg_delete_confirmation'),
				msg : this.props.t('msg_confirm_delete_profile'),
				ok : () => {

					SET_ENCODE_PROFILE.fetchData({
						id : id
					}, 'DELETE').then(data => {
						if(data.result === 0) {

							this.getNewList();
							this.setState({
								isDialogShow : false
							});

						}
					});

				}
			}
		});
	}
	addProfile(e) {
		const { t } = this.props;
		this.setState({
			isEditProfileShow : true,
			btnAction : 'new',
			editProfileID : this.state.defaultProfileID,
			dialogObj : {
				...this.state.dialogObj,
				title : t('msg_profile_title_addnew'),
				type : 'custom',
				ok : this.submitProfile
			}
		});
	}
	editProfile(e, id) {
		const { t } = this.props;
		this.setState({
			isEditProfileShow : true,
			btnAction : 'edit',
			editProfileID : id,
			dialogObj : {
				...this.state.dialogObj,
				title : t('msg_profile_title_edit'),
				type : 'custom',
				ok : this.submitProfile
			}
		});
	}
	submitProfile() {
		const { btnAction, editProfileID } = this.state;

		let encodingProfile = {};
		const method = (btnAction === 'new' ? 'POST' : 'PUT');

		if(btnAction === 'edit') {
			encodingProfile = {
				id : editProfileID
			};
		}

		this.setState({
			wasValidated : true
		}, ()=> {
			const formElDoms = document.getElementById(`${this.namePrefix}_form`);


			if(formElDoms.querySelectorAll(':invalid').length > 0) {
				return false;
			}


			Array.prototype.filter.call(formElDoms.querySelectorAll('input, select'), el => !!el.name && !el.name.match('refProfile') && el.type !== 'checkbox')
			.forEach(el=> {
				const attrNameArr = el.name.replace(`${this.namePrefix}_`,'').split('_');
				const key = attrNameArr[0];
				const keySub = attrNameArr[1];
				let val = el.value;

				if(!isNaN(val)) {
					val = Number(val);
				}

				if(!!keySub) {

					if(!encodingProfile[key]) {
						encodingProfile[key] = {};
					}

					if(keySub === 'resolution') {
						encodingProfile[key]['width'] = Number(val.replace(/x[\d]*/,''));
						encodingProfile[key]['height'] = Number(val.replace(/[\d]*x/,''));
					}else{			
						encodingProfile[key][keySub] = val;
					}
					
				}else{
					encodingProfile[key] = val;
				}
			});

			// console.log(encodingProfile);

			SET_ENCODE_PROFILE.fetchData({
				profile : encodingProfile
			}, method).then(data => {
				if(data.result === 0) {

					this.getNewList();
					this.setState({
						isEditProfileShow: !this.state.isEditProfileShow,
						wasValidated : false
					});
				}
			});
			
		});

	}

	getVideoDisplayInfo(key, val, videoInfo) {
		const { t } = this.props;

		switch(key) {
			case 'width':
				return <p key={key} className="px-2 w_260px">{`${t('msg_profile_resolution')} : ${videoInfo.width}x${videoInfo.height}`}</p>;
			case 'encodeMode':
				return <p key={key} className="px-2 w_260px">{t(videoInfoKeyMap[key]) + ' : ' + ENCODE_MODE[val]['name']}</p>;
			case 'entropyMode':
				return <p key={key} className="px-2 w_260px">{t(videoInfoKeyMap[key]) + ' : ' + ENCODE_ENTROPY_MODE[val]}</p>;
			case 'profile':
				return <p key={key} className="px-2 w_260px">{t(videoInfoKeyMap[key]) + ' : ' + ENCODE_PROFILE[val]['name']}</p>;
			case 'outputRatio':
				return <p key={key} className="px-2 w_260px">{t(videoInfoKeyMap[key]) + ' : ' + ENCODE_OUTPUT_RATIO[val]}</p>;
			case 'frameRate':
				return <p key={key} className="px-2 w_260px">{t(videoInfoKeyMap[key]) + ' : ' + ENCODE_FRAME_RATE[val]}</p>;
			default:
				return <p key={key} className="px-2 w_260px">{t(videoInfoKeyMap[key]) + ' : ' + val}</p>;
		}

	}

	getAudioDisplayInfo(key, val, audioInfo) {
		const { t } = this.props;

		switch(key) {
			case 'channel':
				return <p key={key} className="px-2">{`${t(audioInfoKeyMap[key])} : ${ENCODE_AUDIO_CHANNEL[val]['name']}`}</p>;
			case 'sampleRate':				
			case 'bitrate':
				return <p key={key} className="px-2">{`${t(audioInfoKeyMap[key])} : ${val}`}</p>;
			default:
				return <p key={key} className="px-2">{t(audioInfoKeyMap[key]) + ' : ' + val}</p>;
		}
	}
	
	render() {
		const { t } = this.props;
		const { encodingProfiles } = this.props;
		const { editProfileID } = this.state;
		const customProfiles = encodingProfiles.filter(profile => profile.id > 1000);

		return (
			<div className="container_wrapper">
				<Header noPanel={true}></Header>
				<div className="mx-3 mt-4">	
					<WindowModal title={t('msg_profile_management')} >
						<Dialog isShow={this.state.isDialogShow} toggle={()=>{this.setState({isDialogShow: !this.state.isDialogShow })}} { ...this.state.dialogObj }></Dialog>
						{/* <Dialog isShow={this.state.isEditProfileShow} toggle={this.submitProfile} { ...this.state.dialogObj } size="lg"> */}
						<Dialog isShow={this.state.isEditProfileShow} toggle={()=>{this.setState({isEditProfileShow: !this.state.isEditProfileShow })}} { ...this.state.dialogObj } size="lg">
							<EncodingProfileEdit profileID={editProfileID} encodingProfiles={encodingProfiles} action={this.state.btnAction} wasValidated={this.state.wasValidated} namePrefix={this.namePrefix}></EncodingProfileEdit>
						</Dialog>
						<Btn  type="submit" onClick={this.addProfile} className="mb-3 px-3">{t("msg_profile_title_addnew")}</Btn>
						<div className="table-responsive">
							<table className="table-configuration w-100">
								<thead className="thead-blue">
									<tr className="table-bordered">
										<th scope="col" className="text-center">{t('msg_profile_name')}</th>
										<th scope="col" className="text-center w_220px">{t('msg_profile_type')}</th>
										<th scope="col" className="text-center">{t('msg_profile_video_setting')}</th>
										<th scope="col" className="text-center w_300px">{t('msg_profile_audio_setting')}</th>
										<th scope="col" className="text-center w_85px">{t('msg_edit')}</th>
										<th scope="col" className="text-center w_85px">{t('msg_delete')}</th>
									</tr>
								</thead>
								{
									customProfiles.length === 0 ? null :
									<tbody>
										{
											customProfiles.map(profile => {
												let codecArr = [];

												if(profile.videoType) {
													codecArr.push(ENCODE_VIDEO_CODEC[profile.videoType]);
												}

												if(profile.audioType) {
													codecArr.push(ENCODE_AUDIO_CODEC[profile.audioType]);
												}

												return (<tr key={profile.id} className="table-common-odd table-bordered">
													<td className="align-middle">{profile.name}</td>
													<td className="align-middle text-center">{ codecArr.join('/')}</td>
													<td className="align-middle">
														{
															!profile.videoInfo ? null :
															<div className="d-flex flex-wrap">
																{
																	Object.keys(profile.videoInfo)
																		.filter(key => key !== 'height')
																		.map(key => {
																			if(profile.videoInfo[key]) {
																				return this.getVideoDisplayInfo(key, profile.videoInfo[key], profile.videoInfo);
																			}else{
																				return null;
																			}
																		})
																}
															</div>
														}
													</td>
													<td className="align-middle">
														{
															!profile.audioInfo ? null :
															<div className="d-flex flex-column" >
																{
																	Object.keys(profile.audioInfo)
																		.map(key => {
																			if(profile.audioInfo[key]) {
																				return this.getAudioDisplayInfo(key, profile.audioInfo[key], profile.audioInfo);
																			}else{
																				return null;
																			}
																		})
																}
															</div>
														}
													</td>
													<td className="align-middle"><button className="btn_edit mx-auto" onClick={e => this.editProfile(e, profile.id) }></button></td>
													<td className="align-middle"><button className="btn_delete mx-auto" onClick={e => this.deleteProfile(e, profile.id) }></button></td>
												</tr>);
											})
										}
									</tbody>
									
								}
							</table>
						</div>
						<Btn  type="submit" onClick={this.addProfile} className="mt-3 px-3">{t("msg_profile_title_addnew")}</Btn>

					</WindowModal>
				</div>
			</div>
		);
	}
}


export default compose(
	translate("translation"),
	connect(mapStateToProps, null)
)(EncodingProfile);

