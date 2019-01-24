import * as React from 'react';
import { translate } from "react-i18next";
import { retrieveFromProp } from '../helper/helper';
import { IPV4_PORT_STR, HOSTNAME_STR, SPECIAL_CHAR_STR } from "../constant/Regx.Consts";



class ConfigurationHls extends React.Component {
	constructor(props) {
		super(props);
		const objProps = props.streamInfo.hls || {};

		this.state = {
			hlsSegmentFileNumbe: {
				value:  retrieveFromProp('hlsSegmentFileNumbe', objProps) || 5000,
				invalid: false,
				errMsg: ''
			},
			hlsChunkDuration: {
				value: retrieveFromProp('hlsChunkDuration', objProps) || 3,
				invalid: false,
				errMsg: ''
			},
			hlsUrl: {
				value: retrieveFromProp('hlsUrl', objProps),
				invalid: false,
				errMsg: ''
			},
			hlsLocation: {
				value: retrieveFromProp('hlsLocation', objProps),
				invalid: false,
				errMsg: ''//t('msg_name_special_charts')
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
			segmentDurationInvalid : false
		};

		this.hlsForm = React.createRef();

		this.onChangeVal = this.onChangeVal.bind(this);
		
	}
	componentDidMount() {
		
	}
	componentWillUnmount() {

	}
	componentDidUpdate(prevProps, prevState) {
		if(this.props.isStreamingCheck) {
			const { t } = this.props;
			const { hlsSegmentFileNumbe, hlsChunkDuration, hlsUrl, hlsLocation, username, password } = this.state;
			
			let passData = {
				hlsSegmentFileNumbe : hlsSegmentFileNumbe.value,
				hlsChunkDuration : hlsChunkDuration.value,
				hlsUrl : hlsUrl.value,
				hlsLocation : hlsLocation.value,
				username : username.value,
				password : password.value
			};

			let updateState = {
				hlsSegmentFileNumbe : {
					...this.state.hlsSegmentFileNumbe,
					errMsg : '',
					invalid : false
				},
				hlsChunkDuration: {
					...this.state.hlsChunkDuration,
					errMsg : '',
					invalid : false
				},
				hlsUrl: {
					...this.state.hlsUrl,
					errMsg : '',
					invalid : false
				},
				hlsLocation: {
					...this.state.hlsLocation,
					errMsg : '',
					invalid : false
				},
				segmentDurationInvalid : false
			};

			this.hlsForm.current.querySelector('.js-hlsSegmentFileNumbe').setCustomValidity('');
			this.hlsForm.current.querySelector('.js-hlsChunkDuration').setCustomValidity('');

			this.hlsForm.current.querySelectorAll('input:invalid').forEach(el => {
				let key = el.dataset.name;
				updateState[key].invalid = true;
				if(key === 'hlsLocation') {
					updateState[key].errMsg = t('msg_name_special_charts');
				}

			});

			if(passData.hlsSegmentFileNumbe*passData.hlsChunkDuration > 30000) {
				this.hlsForm.current.querySelector('.js-hlsSegmentFileNumbe').setCustomValidity(t('msg_hls_push_tip'));
				this.hlsForm.current.querySelector('.js-hlsChunkDuration').setCustomValidity(t('msg_hls_push_tip'));
				updateState.segmentDurationInvalid = true;
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

	
	

	editConnection() {
		this.setState({
			isEditing : true
		});
	}

	render() {
		const { t, streamInfo } = this.props;
		const { hlsSegmentFileNumbe, hlsChunkDuration, hlsUrl, hlsLocation, username, password, segmentDurationInvalid } = this.state;

		return (
			<fieldset ref={this.hlsForm} className="container-fluid" disabled={streamInfo.isStart}>
				
				<div className="mb-2 form-row align-items-center">
					<div className="col-3 col-lg-2">{t('msg_hls_segment_file_number')}</div>
					<div className="col-2 col-lg-1">
						<input className="form-control js-hlsSegmentFileNumbe" type="number" value={hlsSegmentFileNumbe.value} data-name="hlsSegmentFileNumbe" onChange={e => this.onChangeVal(e, 'hlsSegmentFileNumbe')} min="500" max="10000" required/>
					</div>
					<div className="col d-flex align-items-center"><span className={( hlsSegmentFileNumbe.invalid ? 'text-danger' : 'text-secondary')}>{t('msg_range')} ( 500 ~ 10000 ms )</span></div>
				</div>

				<div className="mb-2 form-row align-items-center">
					<div className="col-3 col-lg-2">{t('msg_file_duration')}</div>
					<div className="col-2 col-lg-1">
						<input className="form-control js-hlsChunkDuration" type="number" value={hlsChunkDuration.value} data-name="hlsChunkDuration" onChange={e => this.onChangeVal(e, 'hlsChunkDuration')} min="3" max="30" required/>
					</div>
					<div className="col d-flex align-items-center"><span className={( hlsChunkDuration.invalid ? 'text-danger' : 'text-secondary')}>{t('msg_range')} ( 3 ~ 30 )</span></div>
				</div>

				<div className="mb-4 mt-3 form-row align-items-center">
					<span className={( segmentDurationInvalid ? 'text-danger' : 'd-none')}>{t('msg_hls_push_tip')}</span>
				</div>

				<div className="mb-2 form-row align-items-center">
					<div className="col-3 col-lg-2">{t('msg_push_url')}</div>
					<div className="col-3 col-lg-2">
						<input className="form-control" value={hlsUrl.value} onChange={e => this.onChangeVal(e, 'hlsUrl')} data-name="hlsUrl" required pattern={`${IPV4_PORT_STR}|${HOSTNAME_STR}`}/>
					</div>
					<div className="col d-flex align-items-center"><span className={( hlsUrl.invalid ? 'text-danger' : 'text-secondary')}>{t('msg_push_location_tip')}</span></div>
				</div>

				<div className="mb-2 form-row align-items-center">
					<div className="col-3 col-lg-2">{t('msg_push_location')}</div>
					<div className="col-3 col-lg-2 d-inline-flex">
						<input className="form-control" value={hlsLocation.value} onChange={e => this.onChangeVal(e, 'hlsLocation')} data-name="hlsLocation" pattern={SPECIAL_CHAR_STR}/>
					</div>
					<div className="col d-flex align-items-center"><span className={( hlsLocation.invalid ? 'text-danger' : 'text-secondary')}>{hlsLocation.errMsg}</span></div>
				</div>

				<div className="mb-2 form-row align-items-center">
					<div className="col-3 col-lg-2">{t('msg_rtmp_username')}</div>
					<div className="col-3 col-lg-2">
						<input className="form-control" value={username.value} onChange={e => this.onChangeVal(e, 'username')} />
					</div>
				</div>

				<div className="mb-2 form-row align-items-center">
					<div className="col-3 col-lg-2">{t('msg_rtmp_password')}</div>
					<div className="col-3 col-lg-2">
						<input type="password" className="form-control" value={password.value} onChange={e => this.onChangeVal(e, 'password')} />
					</div>
				</div>

				
				
			</fieldset>

		);
	}

};

export default translate('translation')(ConfigurationHls);

