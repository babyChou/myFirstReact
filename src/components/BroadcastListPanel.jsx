import * as React from 'react';
import { translate } from "react-i18next";
import { INPUT_DEVICE_NAME, INPUT_SOURCES } from '../constant/Common.Consts';


class BroadcastListPanel extends React.Component {

	componentDidMount() {}
	componentDidUpdate(prevProps, prevState) {}
	componentWillUnmount () {}

	render() {
		const { t, devices, preview, signals } = this.props;

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


