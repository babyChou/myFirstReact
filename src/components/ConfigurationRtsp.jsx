import * as React from 'react';
import { translate } from "react-i18next";
import { retrieveFromProp } from '../helper/helper';


class ConfigurationRtsp extends React.Component {
	constructor(props) {
		super(props);
		const objProps = props.streamInfo.rtsp || {};

		this.state = {
			maxClient: {
				value:  retrieveFromProp('maxClient', objProps) || 10,
				invalid: false,
				errMsg: ''
			},
			rtspUrl: {
				value: retrieveFromProp('rtspUrl', objProps),
				invalid: false,
				errMsg: ''
			}
		};

		this.onChangeVal = this.onChangeVal.bind(this);

	}
	componentDidMount() {
		
	}
	componentWillUnmount() {

	}
	componentDidUpdate(prevProps, prevState) {
		if(this.props.isStreamingCheck) {
			const { maxClient, rtspUrl} = this.state;

			this.props.handleStartStreming({
				maxClient : maxClient.value,
				rtspUrl : rtspUrl.value
			});
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

		this.setState(updateObj);
	}



	render() {
		const { t, streamInfo } = this.props;
		const { maxClient, rtspUrl } = this.state;

		return (
			<fieldset className="container-fluid" disabled={streamInfo.isStart}>
				<div className="mb-2 form-row align-items-center">
					<div className="col-2 col-lg-2">{t('msg_max_client')}</div>
					<div className="col row align-items-center">
						<input className="form-control col-2 col-lg-1" type="number" value={maxClient.value} onChange={e => this.onChangeVal(e, 'maxClient')} min="1" max="10" required/>
						<div className="valid-inline-feedback col">{t('msg_range')} ( 1 ~ 10 )</div>
						<div className="invalid-inline-feedback col">{t('msg_range')} ( 1 ~ 10 )</div>
					</div>
				</div>
				<div className="mb-2 form-row align-items-center">
					<div className="col-2 col-lg-2">{t('msg_url')}</div>
					<div className="col row align-items-center">
						<input className="form-control col-4 col-lg-3" value={rtspUrl.value} onChange={e => this.onChangeVal(e, 'rtspUrl')} required pattern="[\w\/]+(\.[\w]+)$"/>
						<div className="valid-inline-feedback col">{t('msg_example_dot')} live/1001.sdp</div>
						<div className="invalid-inline-feedback col">{t('msg_example_dot')} live/1001.sdp</div>
					</div>
				</div>
				
			</fieldset>

		);
	}

};

export default translate('translation')(ConfigurationRtsp);

