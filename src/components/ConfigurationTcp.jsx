import * as React from 'react';
import { translate } from "react-i18next";
import { randomID, retrieveFromProp } from '../helper/helper';

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
			sap: retrieveFromProp('sap', objProps) || true
		};

		this.adjustPidID = randomID();
		this.sapID = randomID();

		this.multicastDOM = this.multicastDOM.bind(this);
		this.onChangeVal = this.onChangeVal.bind(this);

	}
	componentDidMount() {
	}
	componentWillUnmount() {

	}
	componentDidUpdate(prevProps, prevState) {
		if(this.props.isStreamingCheck) {
			const { streamInfo } = this.props;
			const streamType = streamInfo.streamType;
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
				}
			};

			const invalidDOMs = document.querySelectorAll(`#tsForm_${deviceID} input:invalid`);

			invalidDOMs.forEach(el => {
				let key = el.dataset.name;
				updateState[key].invalid = true;

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
					<div className="col-lg-1">TTL :</div>
					<div className="col-lg-2 d-flex align-items-start">
						<input className="form-control mr-2 w-45" type="number" value={ttl.value} data-name="ttl" onChange={e => this.onChangeVal(e, 'ttl')} required maxLength={ttl.textLength} min="1" max="255"/>
						<span className={( ttl.invalid ? 'text-danger' : 'text-secondary')}>(1 ~ 255)</span>
					</div>
				</div>
				<div className="mb-4 row align-items-start">
					<div className="col-lg-1">SAP :</div>
					<div className="col-lg-2">
						<div className="form-check">					
							<input className="form-check-input" type="checkbox" value="1" id={this.sapID} checked={sap} onChange={e => this.onChangeVal(e, 'sap')}/>
							<label className="form-check-label" htmlFor={this.sapID}>{this.props.t('msg_enable')}</label>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	render() {
		const { t, streamInfo } = this.props;
		const { setPid, videoPid, audioPid, pmtPid, pcrPid } = this.state;

		return (
			<fieldset id={`tsForm_${streamInfo.deviceID}`} className="container-fluid" disabled={streamInfo.isStart}>
				{ (Number(streamInfo.streamType) === 3 || Number(streamInfo.streamType) === 5 ? this.multicastDOM() : null) }
				<div className="mb-3 row form-check">
					<div className="col-lg">
						<input className="form-check-input" type="checkbox" value="1" id={this.adjustPidID} checked={setPid} onChange={e => this.onChangeVal(e, 'setPid')}/>
						<label className="form-check-label" htmlFor={this.adjustPidID}>{t('msg_enable_ts_pid_adjust')}</label>
					</div>
				</div>

				{ setPid ? 
					<React.Fragment>
						<div className="mb-2 row align-items-start">
							<div className="col-lg-1">Video PID :</div>
							<div className="col-lg-2 d-flex align-items-start">
								<input className="form-control mr-2 w-45" type="number" value={videoPid.value} data-name="videoPid" onChange={e => this.onChangeVal(e, 'videoPid')} required maxLength={videoPid.textLength} min="32" max="8190"/>
								<span className={( videoPid.invalid ? 'text-danger' : 'text-secondary')}>(32 ~ 8190)</span>
							</div>
						</div>
						<div className="mb-2 row align-items-start">
							<div className="col-lg-1">Audio PID :</div>
							<div className="col-lg-2 d-flex align-items-start">
								<input className="form-control mr-2 w-45" type="number" value={audioPid.value} data-name="audioPid" onChange={e => this.onChangeVal(e, 'audioPid')} required maxLength={audioPid.textLength} min="32" max="8190"/>
								<span className={( audioPid.invalid ? 'text-danger' : 'text-secondary')}>(32 ~ 8190)</span>
							</div>
						</div>
						<div className="mb-2 row align-items-start">
							<div className="col-lg-1">PMT PID :</div>
							<div className="col-lg-2 d-flex align-items-start">
								<input className="form-control mr-2 w-45" type="number" value={pmtPid.value} data-name="pmtPid" onChange={e => this.onChangeVal(e, 'pmtPid')} required maxLength={audioPid.textLength} min="32" max="8190"/>
								<span className={( pmtPid.invalid ? 'text-danger' : 'text-secondary')}>(32 ~ 8190)</span>
							</div>
						</div>
						<div className="mb-2 row align-items-start">
							<div className="col-lg-1">PCR PID :</div>
							<div className="col-lg-2 d-flex align-items-start">
								<input className="form-control mr-2 w-45" type="number" value={pcrPid.value} data-name="pcrPid" onChange={e => this.onChangeVal(e, 'pcrPid')} required maxLength={audioPid.textLength} min="32" max="8190"/>
								<span className={( pcrPid.invalid ? 'text-danger' : 'text-secondary')}>(32 ~ 8190)</span>
							</div>
						</div>
					</React.Fragment>
					: null
				}
			</fieldset>
		);
	}

};

export default translate('translation')(ConfigurationTcp);

