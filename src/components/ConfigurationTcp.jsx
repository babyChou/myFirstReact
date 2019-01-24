import * as React from 'react';
import { translate } from "react-i18next";
import { randomID, retrieveFromProp } from '../helper/helper';
import ConfigurationCms from './ConfigurationCms';

const STREAM_TYPE_MAP_STREAM_PARAMS = {
	1 : 'tcp',
	2 : 'udp',
	3 : 'udp', //udp Multicast
	4 : 'rtp',
	5 : 'rtp' //RTP Multicast
};

class ConfigurationTcp extends React.Component {
	constructor(props) {
		super(props);
		const streamType = Number(props.streamInfo.streamType);
		const objProps = props.streamInfo[STREAM_TYPE_MAP_STREAM_PARAMS[streamType]] || {};
		const cmsProps = props.streamInfo.cms || {};
		const cmsDesc = retrieveFromProp('description', cmsProps);

		this.state = {
			setPid: retrieveFromProp('setPid', objProps) || false,
			videoPid: {
				value: retrieveFromProp('description', objProps) || 8176,
				invalid: false,
				textLength: 4,
				errMsg: ''
			},
			audioPid: {
				value:  retrieveFromProp('privacy', objProps) || 8177,
				invalid: false,
				textLength: 4,
				errMsg: ''
			},
			pmtPid: {
				value: retrieveFromProp('tag', objProps) || 256,
				invalid: false,
				textLength: 4,
				errMsg: ''
			},
			pcrPid: {
				value: retrieveFromProp('tag', objProps) || 257,
				invalid: false,
				textLength: 4,
				errMsg: ''
			},
			ttl: {				
				value: retrieveFromProp('ttl', objProps) || 64,
				invalid: false,
				textLength: 3,
				errMsg: ''
			},
			sap: retrieveFromProp('sap', objProps) || true,
			errMsg : '',
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

		this.adjustPidID = randomID();
		this.sapID = randomID();

		this.multicastDOM = this.multicastDOM.bind(this);
		this.onChangeVal = this.onChangeVal.bind(this);
		this.updateParentValue = this.updateParentValue.bind(this);

	}
	componentDidMount() {
	}
	componentWillUnmount() {

	}
	componentDidUpdate(prevProps, prevState) {
		if(this.props.isStreamingCheck) {
			const { streamInfo, t } = this.props;
			const deviceID = streamInfo.deviceID;

			let passData = {
				setPid : this.state.setPid
			};

			let updateState = {
				videoPid : {
					...this.state.videoPid,
					invalid : false
				},
				audioPid : {
					...this.state.audioPid,
					invalid : false
				},
				pmtPid : {
					...this.state.pmtPid,
					invalid : false
				},
				pcrPid : {
					...this.state.pcrPid,
					invalid : false
				},
				ttl : {
					...this.state.ttl,
					invalid : false
				},
				errMsg : ''
			};


			const pidDOMs = document.querySelectorAll(`#tsForm_${deviceID} input.jsPid`);
			const invalidDOMs = document.querySelectorAll(`#tsForm_${deviceID} input:invalid`);


			//Reset
			pidDOMs.forEach(el => {
				el.setCustomValidity('');
			});
			
			//check val conflict
			pidDOMs.forEach((el_i, i) => {
				pidDOMs.forEach((el_j, j) => {
					if(i !== j) {
						if(el_i.value === el_j.value) {
							el_i.setCustomValidity(t('msg_pid_duplicate'));
							el_j.setCustomValidity(t('msg_pid_duplicate'));
							updateState.errMsg = '*' + t('msg_pid_duplicate');
						}
					}
				});
			});

			invalidDOMs.forEach(el => {
				let key = el.dataset.name;
				if(el.validity.rangeUnderflow || el.validity.rangeOverflow) {
					updateState[key].invalid = true;
				}
			});


			if(this.state.setPid) {
				passData = {
					setPid : this.state.setPid,
					videoPid : this.state.videoPid.value,
					audioPid : this.state.audioPid.value,
					pmtPid : this.state.pmtPid.value,
					pcrPid : this.state.pcrPid.value
				};
			}

			if(Number(streamInfo.streamType) === 3 || Number(streamInfo.streamType) === 5) {
				passData.ttl = this.state.ttl.value;
				passData.sap = this.state.sap;
			}

			if(Number(streamInfo.streamType) === 3) {
				passData.enableCms = !!this.state.enableCms.value;

				if(passData.enableCms) {
					passData.cms = {};
					document.querySelector(`#tsForm_${deviceID} .cms_stream_config`)
								.querySelectorAll('input:valid, textarea:valid').forEach(el => {
									const keyName = el.name.split('_')[1];
									if(keyName !== 'enableCms') {
										passData.cms[keyName] = el.value;
									}
								});
				}

			}

			this.setState(updateState);
			this.props.handleStartStreming(passData);
		}
	}
	onChangeVal(e, key) {

		let updateObj = {};

		if(key === 'setPid' || key === 'sap') {
			updateObj[key] = !this.state[key];
		}else{
			updateObj = {
				[key] : {			
					...this.state[key],
					value : Number(e.target.value)
				}
			};
		}


		this.setState(updateObj);
	}

	multicastDOM() {
		const { ttl, sap } = this.state;
		return (
			<React.Fragment>
				<div className="mb-2 row align-items-start">
					<div className="col-2 col-xl-1">TTL :</div>
					<div className="col-auto d-flex align-items-start">
						<input className="form-control mr-2 w-45" type="number" value={ttl.value} step="0.1" data-name="ttl" onChange={e => this.onChangeVal(e, 'ttl')} required maxLength={ttl.textLength} min="1" max="255"/>
						<span className={( ttl.invalid ? 'text-danger' : 'text-secondary')}>(1 ~ 255)</span>
					</div>
				</div>
				<div className="mb-4 row align-items-start">
					<div className="col-2 col-xl-1">SAP :</div>
					<div className="col-auto d-flex align-items-start">
						<div className="form-check">					
							<input className="form-check-input" type="checkbox" value="1" id={this.sapID} checked={sap} onChange={e => this.onChangeVal(e, 'sap')}/>
							<label className="form-check-label" htmlFor={this.sapID}>{this.props.t('msg_enable')}</label>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
	updateParentValue(updateObj) {
		this.setState(updateObj);
	}

	render() {
		const { t, streamInfo, isCmsConnected } = this.props;
		const { setPid, videoPid, audioPid, pmtPid, pcrPid, errMsg, playBackUrl, title, description, enableCms } = this.state;
		const cmsParam = { 
			playBackUrl,
			title,
			description,
			enableCms,
			streamType : Number(streamInfo.streamType),
			updateParentValue : this.updateParentValue
		};

		return (
			<fieldset id={`tsForm_${streamInfo.deviceID}`} className="container-fluid" disabled={streamInfo.isStart}>
				{ (Number(streamInfo.streamType) === 3 || Number(streamInfo.streamType) === 5 ? this.multicastDOM() : null) }
				<div className="mb-3 row ">
					<div className="col-auto">
						<div className="form-check">
							<input className="form-check-input" type="checkbox" value="1" id={this.adjustPidID} checked={setPid} onChange={e => this.onChangeVal(e, 'setPid')}/>
							<label className="form-check-label" htmlFor={this.adjustPidID}>{t('msg_enable_ts_pid_adjust')}</label>
						</div>
					</div>
					<div className="col-auto">
						<span className="text-danger">{errMsg}</span>
					</div>
				</div>

				{ setPid ? 
					<React.Fragment>
						<div className="mb-2 row align-items-start">
							<div className="col-2 col-xl-1">Video PID :</div>
							<div className="col-auto d-flex align-items-start">
								<input className="form-control mr-2 w-45 jsPid" type="number" value={videoPid.value} data-name="videoPid" onChange={e => this.onChangeVal(e, 'videoPid')} required maxLength={videoPid.textLength} min="32" max="8190"/>
								<span className={( videoPid.invalid ? 'text-danger' : 'text-secondary')}>(32 ~ 8190)</span>
							</div>
						</div>
						<div className="mb-2 row align-items-start">
							<div className="col-2 col-xl-1">Audio PID :</div>
							<div className="col-auto d-flex align-items-start">
								<input className="form-control mr-2 w-45 jsPid" type="number" value={audioPid.value} data-name="audioPid" onChange={e => this.onChangeVal(e, 'audioPid')} required maxLength={audioPid.textLength} min="32" max="8190"/>
								<span className={( audioPid.invalid ? 'text-danger' : 'text-secondary')}>(32 ~ 8190)</span>
							</div>
						</div>
						<div className="mb-2 row align-items-start">
							<div className="col-2 col-xl-1">PMT PID :</div>
							<div className="col-auto d-flex align-items-start">
								<input className="form-control mr-2 w-45 jsPid" type="number" value={pmtPid.value} data-name="pmtPid" onChange={e => this.onChangeVal(e, 'pmtPid')} required maxLength={audioPid.textLength} min="32" max="8190"/>
								<span className={( pmtPid.invalid ? 'text-danger' : 'text-secondary')}>(32 ~ 8190)</span>
							</div>
						</div>
						<div className="mb-2 row align-items-start">
							<div className="col-2 col-xl-1">PCR PID :</div>
							<div className="col-auto d-flex align-items-start">
								<input className="form-control mr-2 w-45 jsPid" type="number" value={pcrPid.value} data-name="pcrPid" onChange={e => this.onChangeVal(e, 'pcrPid')} required maxLength={audioPid.textLength} min="32" max="8190"/>
								<span className={( pcrPid.invalid ? 'text-danger' : 'text-secondary')}>(32 ~ 8190)</span>
							</div>
						</div>
					</React.Fragment>
					: null
				}

				{
					(Number(streamInfo.streamType) === 3 && isCmsConnected) ? <ConfigurationCms {...cmsParam}></ConfigurationCms> : null
				}
			</fieldset>
		);
	}

};

export default translate('translation')(ConfigurationTcp);

