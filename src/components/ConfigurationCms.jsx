import * as React from 'react';
import { translate } from "react-i18next";
import { randomID } from '../helper/helper';

class ConfigurationCms extends React.Component {
	constructor(props) {
		super(props);

		this.onChangeVal = this.onChangeVal.bind(this);
		this.prefix = randomID();;

	}
	componentDidMount() {
		
	}
	componentWillUnmount() {

	}
	componentDidUpdate(prevProps, prevState) {
		
	}
	onChangeVal(e, key) {
		let updateObj = {};

		if(!!key.match('enable')) {
			updateObj[key] = {
				value : !!Number(e.target.value)
			}

		}else{

			if(this.props[key].hasOwnProperty('value')) {
				updateObj[key] = {		
					...this.props[key],
					value : e.target.value
				};
			}else{
				updateObj[key] = e.target.value;
			}

			if(key === 'description'){
				updateObj[key].textLength = e.target.value.length;
			}
		}


		this.props.updateParentValue(updateObj);
	}



	render() {
		const { t, enableCms, playBackUrl, title, description, streamType } = this.props;
		const rtmpCmsID = 'enable_cms' + randomID();
		let displayPlaybackUrl = !!(streamType === 6);


		return (
			<div className="cms_stream_config">
				<div className="my-3 row form-check">
					<div className="col">
						<input className="form-check-input" type="checkbox" value={enableCms.value ? 0 : 1} name={`${this.prefix}_enableCms`} checked={enableCms.value} id={rtmpCmsID} onChange={e => this.onChangeVal(e, 'enableCms')}/>
						<label className="form-check-label" htmlFor={rtmpCmsID}>{t('msg_activating_cms')}</label>
					</div>
				</div>
				{
					!enableCms.value ? null :
					<React.Fragment>
						{
							displayPlaybackUrl ? 
							<div className="form-row mb-3 align-items-center">
								<div className="col-auto conmmon_title_w">{t('msg_video_url')}</div>
								<div className="col d-inline-flex align-items-center">
									<input className="form-control conmmon_control_w" type="text" value={playBackUrl.value} name={`${this.prefix}_playBackUrl`} onChange={e => this.onChangeVal(e, 'playBackUrl')} required={enableCms.value} pattern="^(https://|http://)([-a-zA-Z0-9\.\/_:]+)(:(\d*))?/?([-a-zA-Z0-9\._:]+.m3u8)$"/>
									<div className="tip-feedback ml-5">{t('msg_video_url_example')}</div>
								</div>
							</div>
							: null
						}
						<div className="form-row mb-3 align-items-center">
							<div className="col-auto conmmon_title_w">{t('msg_channelname')}</div>
							<div className="col d-inline-flex align-items-center">
								<input className="form-control conmmon_control_w" type="text" value={title.value} name={`${this.prefix}_title`} onChange={e => this.onChangeVal(e, 'title')} required={enableCms.value}/>
								<div className="invalid-feedback ml-5 w_auto">{t('validator_required')}</div>
							</div>
						</div>
						<div className="form-row mb-3 align-items-center">
							<div className="col-auto conmmon_title_w mt-rev-tip-title">{t('msg_channeldesc')}</div>
							<div className="col">
								<textarea className="form-control conmmon_control_w" type="text" value={description.value} name={`${this.prefix}_description`} onChange={e => this.onChangeVal(e, 'description')} maxLength="4000" required={enableCms.value}></textarea>
								<small className="tip-feedback">({description.textLength}/4000)</small>
							</div>
						</div>
					</React.Fragment>
				}
			</div>

		);
	}

};

export default translate('translation')(ConfigurationCms);

