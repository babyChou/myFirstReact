import * as React from 'react';
import { SET_DEVICE_CONFIG } from '../helper/Services';
import { INPUT_SOURCES } from '../constant/Common.Consts';
import Volume from './Volume';

const audioParam = ['micMix','mixInput','soundControl','micPercentage','audioPercentage'];
export default class ConfigurationTabs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tabActive : ['active','','']
		};

		this.cgTab = this.cgTab.bind(this);
		this.volumeChange = this.volumeChange.bind(this);
		this.valChange = this.valChange.bind(this);
	}
	cgTab(indx) {
		let tabActive = ['','',''];
		tabActive[indx] = 'active';

		this.setState({
			tabActive: tabActive
		});
	}
	volumeChange(val, name) {

		let passDevice = {
			id: this.props.id
		};
		
		if(audioParam.includes(name)) {
			passDevice = {
				...passDevice,
				audioParam : {
					[name] : val
				}
			}
		}else{
			passDevice = {
				...passDevice,
				[name] : val
			}
		}

		SET_DEVICE_CONFIG.fetchData({
			device : passDevice
		},'PATCH');

	}
	valChange(e) {
		const attr = e.target.name;
		let passDevice = {
			id: this.props.id
		};

		console.log(attr, audioParam.includes(attr));

		if(audioParam.includes(attr)) {

			passDevice = {
				...passDevice,
				audioParam : {
					[attr] : (attr === 'micMix' ? !!Number(e.target.value) : e.target.value) 
				}
			}
		}else{
			passDevice = {
				...passDevice,
				[attr] : e.target.value
			}
		}

		SET_DEVICE_CONFIG.fetchData({
			device : passDevice
		},'PATCH');

	}
	render() {
		const cgTab = this.cgTab;
		const volumeChange = this.volumeChange;
		const tabActive = this.state.tabActive;
		const { t, facility, deviceConfig } = this.props;

		// console.log(deviceConfig);
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
					<section className={'tab-pane w-80 ' + tabActive[0]}>
						{
							facility.audioMix ? 
							<div className="form-row form-group align-items-center">
								<div className="col-lg-1">{t('msg_microphone')}</div>
								<div className="col-lg-2">
									<div className="form-check form-check-inline">
										<input className="form-check-input" type="radio" id="mixAudioEnable" name="micMix" value="1" checked={deviceConfig.audioParam.micMix} onChange={this.valChange}/>
										<label className="form-check-label" htmlFor="mixAudioEnable">{t('msg_enable')}</label>
									</div>
									<div className="form-check form-check-inline">
										<input className="form-check-input" type="radio" id="mixAudioDisable" name="micMix" value="0" checked={!deviceConfig.audioParam.micMix} onChange={this.valChange}/>
										<label className="form-check-label" htmlFor="mixAudioDisable">{t('msg_disable')}</label>
									</div>
								</div>
								<div className="col-lg-1">{ t('msg_audio_control') }</div>
								<div className="col-lg-3"><Volume value={deviceConfig.audioParam.soundControl} min={0} max={100} name="soundControl" onChange={volumeChange} disabled={false}></Volume></div>
							</div>
							: ''
						}
						
						<div className="form-row align-items-center form-group">
							<div className="col-lg-1">{t('msg_audio_source_input')}</div>
							<div className="col-lg-2 pr-4">
								<select className="form-control" name="audioInput" defaultValue={deviceConfig.audioInput} onChange={this.valChange}>
									{
										facility.audioInput.map((input, i) => {
											return (<option key={i} value={input}>{INPUT_SOURCES[input]}</option>);
										})
									}
								</select>
							</div>
							<div className="col-lg-1">{ t('msg_audio_source') }</div>
							<div className="col-lg-3"><Volume value={deviceConfig.audioParam.audioPercentage} min={0} max={100} name="audioPercentage" onChange={volumeChange} disabled={false}></Volume></div>
							
						</div>
						{
							facility.audioMix ? 
								<div className="form-row form-group align-items-center">
									<div className="col-lg-1">
										<label className="">{t('msg_microphone_source')}</label>
									</div>
									<div className="col-lg-2 pr-4">
										<select className="form-control" name="mixInput" onChange={this.valChange} defaultValue={deviceConfig.audioParam.mixInput}>
											{ facility.mixInput.map((input, i) => (<option key={i} value={input}>{input.toUpperCase()}</option>)) }
										</select>
									</div>
									<div className="col-lg-1">{ t('msg_microphone') }</div>
									<div className="col-lg-3">
										<Volume value={deviceConfig.audioParam.micPercentage} min={0} max={100} name="micPercentage" onChange={volumeChange} disabled={false}></Volume>
									</div>
								</div>
							: null
						}
						
					</section>
					<section className={'tab-pane w-80 ' + tabActive[1]}>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_brightness')}</div>
							<div className="col-lg-3"><Volume value={50} min={0} max={100} onChange={volumeChange} size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-lg-3"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_contrast')}</div>
							<div className="col-lg-3"><Volume value={50} min={0} max={100} onChange={volumeChange} size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-lg-3"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_hue')}</div>
							<div className="col-lg-3"><Volume value={50} min={0} max={100} onChange={volumeChange} size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-lg-3"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_saturation')}</div>
							<div className="col-lg-3"><Volume value={50} min={0} max={100} onChange={volumeChange} size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-lg-3"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_video_format')}</div>
							<div className="col-lg">
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="ntsc" name="format" value="ntsc" onChange={this.valChange} checked={deviceConfig.format === 'ntsc'}/>
									<label className="form-check-label" htmlFor="ntsc">NTSC</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="pal" name="format" value="pal" onChange={this.valChange} checked={deviceConfig.format === 'pal'}/>
									<label className="form-check-label" htmlFor="pal">PAL</label>
								</div>
							</div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-1">{t('msg_deinterlace_setting')}</div>
							<div className="col-lg">
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="none" name="deinterlace"  value="none" onChange={this.valChange} checked={deviceConfig.deinterlace === 'none'}/>
									<label className="form-check-label" htmlFor="none">None</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="weave" name="deinterlace"  value="weave" onChange={this.valChange} checked={deviceConfig.deinterlace === 'weave'}/>
									<label className="form-check-label" htmlFor="weave">Weave</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="bob" name="deinterlace"  value="bob" onChange={this.valChange} checked={deviceConfig.deinterlace === 'bob'}/>
									<label className="form-check-label" htmlFor="bob">Bob</label>
								</div>
								<div className="form-check form-check-inline">
									<input className="form-check-input" type="radio" id="blend" name="deinterlace"  value="blend" onChange={this.valChange} checked={deviceConfig.deinterlace === 'blend'}/>
									<label className="form-check-label" htmlFor="blend">Blend</label>
								</div>
							</div>
						</div>
					</section>
					<section className={'tab-pane w-80 ' + tabActive[2]}>
						<div className="form-row form-group align-items-center">
							<div className="col-lg-2">{t('msg_layout')}</div>
							<div className="col-lg">
								<ul className="list-inline">
									<li className="list-inline-item">
										<div className="form-check mb-1">
											<input className="form-check-input" type="checkbox" id="source_reverse" value="option1" />
											<label className="form-check-label" htmlFor="source_reverse">{t('msg_yes')}</label>
										</div>	
										<div className="bg-primary" style={{width:'100px', height:'100px'}}></div>
									</li>
									<li className="list-inline-item">
										<div className="form-check mb-1">
											<input className="form-check-input" type="checkbox" id="source_reverse" value="option1" />
											<label className="form-check-label" htmlFor="source_reverse">{t('msg_yes')}</label>
										</div>	
										<div className="bg-primary" style={{width:'100px', height:'100px'}}></div>
									</li>
									<li className="list-inline-item">
										<div className="form-check mb-1">
											<input className="form-check-input" type="checkbox" id="source_reverse" value="option1" />
											<label className="form-check-label" htmlFor="source_reverse">{t('msg_yes')}</label>
										</div>	
										<div className="bg-primary" style={{width:'100px', height:'100px'}}></div>
									</li>
									<li className="list-inline-item">
										<div className="form-check mb-1">
											<input className="form-check-input" type="checkbox" id="source_reverse" value="option1" />
											<label className="form-check-label" htmlFor="source_reverse">{t('msg_yes')}</label>
										</div>	
										<div className="bg-primary" style={{width:'100px', height:'100px'}}></div>
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

