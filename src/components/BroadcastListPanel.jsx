import * as React from 'react';
import { translate } from "react-i18next";
import { BROCASTLIST_PANNEL_UPDATE_TIME } from "../constant/Init.Consts";
import { INPUT_DEVICE_NAME, INPUT_SOURCES } from '../constant/Common.Consts';
import { GET_PIP_PREVIEW_IMG } from '../helper/Services';

class BroadcastListPanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			preview: {
				1 : props.preview['1'],
				2 : props.preview['2']
			}
		};
		
		this.interval = {};
		this.renewPreview = this.renewPreview.bind(this);
	}

	componentDidMount() {
		const { devices } = this.props;

		devices.forEach(device => {
			this.renewPreview(device.id);
		});
	}
	componentDidUpdate(prevProps, prevState) {}
	componentWillUnmount () {
		const { devices } = this.props;

		devices.forEach(device => {
			clearTimeout(this.interval[device.id]);
		});
	}

	renewPreview(deviceID){
		const { selectedSource } = this.props;

		if(this.interval[deviceID]) {
			clearTimeout(this.interval[deviceID]);
		}

		if(selectedSource[deviceID].length > 0) {	
				
			GET_PIP_PREVIEW_IMG.fetchFile({
				id : deviceID
			}).then(url=> {

				this.setState({
					preview : {
						...this.state.preview,
						[deviceID] : url
					}
				});
			});
		}


		this.interval[deviceID] = setTimeout(() => {
			this.renewPreview(deviceID);
		}, BROCASTLIST_PANNEL_UPDATE_TIME);

	}

	render() {
		const { preview } = this.state;
		const { t, devices, signals } = this.props;

		return (
			<React.Fragment>
				{
					devices.map(device => {
						let imgUri = preview[device.id];
						
						return (
								<div key={device.id} className="input_panel rounded p-2 d-flex align-items-start d-inline-flex mr-2">
									<div className="p-2 text-center">
										<h6>{t('msg_output')}</h6>
										<h4>{INPUT_DEVICE_NAME[device.id]}</h4>
									</div>
									<div className="p-2">
										<figure className="figure" style={{ overflow: 'hidden', width: '95px', height: '92px' }}>
											{ imgUri === '' ? <div className="border border-secondary bg-dark" style={{ width: '95px', height: '92px' }}></div> : <img className="figure-img img-fluid" src={imgUri} alt={device.id}/> }
										</figure>
									</div>
									{
										signals.map((signal,i) => {
											if(signal.deviceID === device.id) {						
												return (
													<div key={signal.sourceType} className={'p-2 ' + (signal.quality > 60 ? 'text-success' : 'text-danger')}>
														<h6 >{INPUT_SOURCES[signal.sourceType]}</h6>
														<ul className="list-unstyled">
															<li>- {t('msg_main_stream_resolution') + ' : ' + signal.width + 'x' + signal.height }</li>
															<li>- {t('msg_main_stream_signal_strength')  + ' : ' + signal.quality }</li>
															<li>- {t('msg_bitrate') + ' : ' + signal.currentBitrate }</li>
															{/* <li>- {t('msg_main_stream_status') + ' : '  }</li> */}
														</ul>
													</div>
												);
											}else{
												return null;
											}
										})
										
									}
									
								</div>
							);
					})
				}
			
			</React.Fragment>
		);
	}
}


export default translate("translation")(BroadcastListPanel);


