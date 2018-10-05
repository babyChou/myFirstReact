import * as React from 'react';
import { SET_DEVICE_CONFIG, GET_PIP_CONFIG_LIST } from '../helper/Services';
import { INPUT_SOURCES } from '../constant/Common.Consts';
import Volume from './Volume';
import PipCanvas from './PipCanvas';

const audioParam = ['micMix','mixInput','soundControl','micPercentage','audioPercentage'];
const videoParma = ['brightness','contrast','hue','saturation'];



export default class ConfigurationTabs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tabActive : ['active','',''],
			pipList: []
		};

		this.cgTab = this.cgTab.bind(this);
		this.volumeChange = this.volumeChange.bind(this);
		this.valChange = this.valChange.bind(this);
	}
	componentDidMount() {
		GET_PIP_CONFIG_LIST.fetchData().then(data => {
			if(data.result === 0) {
				this.setState({
					pipList : data.config
				});

			}
		});
	}
	cgTab(indx) {
		let tabActive = ['','',''];
		tabActive[indx] = 'active';

		this.setState({
			tabActive: tabActive
		});
	}
	volumeChange(val, name) {
		const attr = (name).replace(/[0-9]$/,'');
		let passDevice = {
			id: this.props.id
		};
		
		if(audioParam.includes(attr)) {
			passDevice = {
				...passDevice,
				audioParam : {
					[attr] : val
				}
			}
		}

		if(videoParma.includes(attr)) {
			passDevice = {
				...passDevice,
				videoParma : {
					[attr] : val
				}
			}
		}

		if(!passDevice.hasOwnProperty('audioParam') && !passDevice.hasOwnProperty('videoParma')) {
			passDevice = {
				...passDevice,
				[attr] : val
			}
		}

		this.props.updateDeviceConfig(passDevice);

		SET_DEVICE_CONFIG.fetchData({
			device : passDevice
		},'PATCH');

	}
	valChange(e) {
		const attr = (e.target.name).replace(/[0-9]$/,'');
		let passDevice = {
			id: this.props.id
		};

		console.log(attr, e.target.value);

		if(audioParam.includes(attr)) {
			passDevice = {
				...passDevice,
				audioParam : {
					[attr] : (attr === 'micMix' ? !!Number(e.target.value) : e.target.value) 
				}
			}
		}

		if(videoParma.includes(attr)) {
			passDevice = {
				...passDevice,
				videoParma : {
					[attr] : e.target.value
				}
			}
		}

		if(!passDevice.hasOwnProperty('audioParam') && !passDevice.hasOwnProperty('videoParma')) {
			passDevice = {
				...passDevice,
				[attr] : e.target.value
			}
		}

		this.props.updateDeviceConfig(passDevice);


		SET_DEVICE_CONFIG.fetchData({
			device : passDevice
		},'PATCH');

	}
	render() {
		const cgTab = this.cgTab;
		const volumeChange = this.volumeChange;
		const tabActive = this.state.tabActive;
		const { t, facility, deviceConfig, id } = this.props;


		return (
			<div>
				
				<ul className="nav nav-tabs">
					<li className="nav-item">
						<a className={'btn nav-link ' + tabActive[0] } onClick={() => cgTab(0) }>{t('msg_audio')}</a>
					</li>
					<li className="nav-item">
						<a className={'btn nav-link ' + tabActive[1] } onClick={() => cgTab(1) }>{t('msg_video')}</a>
					</li>
					<li className="nav-item">
						<a className={'btn nav-link ' + tabActive[2] } onClick={() => cgTab(2) }>{t('msg_pip')}</a>
					</li>
				</ul>
				<div className="tab-content border border-top-0 p-3 mb-3">
					<section className={'tab-pane ' + tabActive[0]}>
						{
							facility.audioMix ? 
							<div className="form-row form-group align-items-center">
								<div className="col-lg-1">{t('msg_microphone')}</div>
								<div className="col-lg-2">
									<div className="form-check form-check-inline">
										<input className="form-check-input" type="radio" id="mixAudioEnable" name={'micMix' + id } value="1" checked={deviceConfig.audioParam.micMix} onChange={this.valChange}/>
										<label className="form-check-label" htmlFor="mixAudioEnable">{t('msg_enable')}</label>
									</div>
									<div className="form-check form-check-inline">
										<input className="form-check-input" type="radio" id="mixAudioDisable" name={'micMix' + id } value="0" checked={!deviceConfig.audioParam.micMix} onChange={this.valChange}/>
										<label className="form-check-label" htmlFor="mixAudioDisable">{t('msg_disable')}</label>
									</div>
								</div>
								<div className="col-lg-1">{ t('msg_audio_control') }</div>
								<div className="col-lg-3"><Volume value={deviceConfig.audioParam.soundControl} min={0} max={100} name={ 'soundControl' + id } onChange={volumeChange} disabled={false}></Volume></div>
							</div>
							: null
						}
						
						<div className="form-row align-items-center form-group">
							<div className="col-lg-1">{t('msg_audio_source_input')}</div>
							<div className="col-lg-2 pr-4">
								<select className="form-control" name={'audioInput' + id } defaultValue={deviceConfig.audioInput} onChange={this.valChange}>
									{
										facility.audioInput.map((input, i) => {
											return (<option key={i} value={input}>{INPUT_SOURCES[input]}</option>);
										})
									}
								</select>
							</div>
							<div className="col-lg-1">{ t('msg_audio_source') }</div>
							<div className="col-lg-3"><Volume value={deviceConfig.audioParam.audioPercentage} min={0} max={100} name={'audioPercentage' + id} onChange={volumeChange} disabled={false}></Volume></div>
							
						</div>
						{
							facility.audioMix ? 
								<div className="form-row form-group align-items-center">
									<div className="col-lg-1">
										<label className="">{t('msg_microphone_source')}</label>
									</div>
									<div className="col-lg-2 pr-4">
										<select className="form-control" name={'mixInput' + id } onChange={this.valChange} defaultValue={deviceConfig.audioParam.mixInput}>
											{ facility.mixInput.map((input, i) => (<option key={i} value={input}>{input.toUpperCase()}</option>)) }
										</select>
									</div>
									<div className="col-lg-1">{ t('msg_microphone') }</div>
									<div className="col-lg-3">
										<Volume value={deviceConfig.audioParam.micPercentage} min={0} max={100} name={'micPercentage' + id} onChange={volumeChange} disabled={false}></Volume>
									</div>
								</div>
							: null
						}
						
					</section>
					<section className={'tab-pane ' + tabActive[1]}>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_brightness')}</div>
							<div className="col-lg-2"><Volume value={deviceConfig.videoParma.brightness} min={0} max={100} onChange={volumeChange} name={'brightness' + id } size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-lg-3"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_contrast')}</div>
							<div className="col-lg-2"><Volume value={deviceConfig.videoParma.contrast} min={0} max={100} onChange={volumeChange} name={'contrast' + id} size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-lg-3"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_hue')}</div>
							<div className="col-lg-2"><Volume value={deviceConfig.videoParma.hue} min={0} max={100} onChange={volumeChange} name={'hue' + id } size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-lg-3"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_saturation')}</div>
							<div className="col-lg-2"><Volume value={deviceConfig.videoParma.saturation} min={0} max={100} onChange={volumeChange} name={ 'saturation' + id } size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-lg-3"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_video_format')}</div>
							<div className="col-lg">
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id={'ntsc' + id} name={'format' + id} value="ntsc" onChange={this.valChange} checked={deviceConfig.format === 'ntsc'}/>
									<label className="form-check-label" htmlFor={'ntsc' + id}>NTSC</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id={'pal' + id} name={'format' + id} value="pal" onChange={this.valChange} checked={deviceConfig.format === 'pal'}/>
									<label className="form-check-label" htmlFor={'pal' + id}>PAL</label>
								</div>
							</div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_deinterlace_setting')}</div>
							<div className="col-lg">
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id={'none' + id } name={ 'deinterlace' + id}  value="none" onChange={this.valChange} checked={deviceConfig.deinterlace === 'none'}/>
									<label className="form-check-label" htmlFor={'none' + id }>None</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id={'weave' + id } name={ 'deinterlace' + id}  value="weave" onChange={this.valChange} checked={deviceConfig.deinterlace === 'weave'}/>
									<label className="form-check-label" htmlFor={'weave' + id }>Weave</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id={'bob' + id } name={ 'deinterlace' + id}  value="bob" onChange={this.valChange} checked={deviceConfig.deinterlace === 'bob'}/>
									<label className="form-check-label" htmlFor={'bob' + id }>Bob</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id={'blend' + id } name={ 'deinterlace' + id}  value="blend" onChange={this.valChange} checked={deviceConfig.deinterlace === 'blend'}/>
									<label className="form-check-label" htmlFor={'blend' + id }>Blend</label>
								</div>
							</div>
						</div>
					</section>
					<section className={'tab-pane ' + tabActive[2]}>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-2">{t('msg_layout')}</div>
							<div className="col-lg">
								<ul className="list-inline">
									<li className="list-inline-item">
										<div className="form-check mb-1">
											<input className="form-check-input" type="checkbox" id="source_reverse" value="option1" />
											<label className="form-check-label" htmlFor="source_reverse">{t('msg_yes')}</label>
										</div>
										{/* <Stage width={160} height={90}> */}
											{/* <Layer> */}
												<PipCanvas className="bg-secondary" width={160} height={90}></PipCanvas>
											{/* </Layer> */}
										{/* </Stage> */}
										
									</li>
									
									
									
								</ul>

							</div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-2">{t('msg_video_source_reverse')}</div>
							<div className="col-lg">
								<div className="form-check">
									<input className="form-check-input" type="checkbox" id="source_reverse" value="option1" />
									<label className="form-check-label" htmlFor="source_reverse">{t('msg_yes')}</label>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		);
	}
}

