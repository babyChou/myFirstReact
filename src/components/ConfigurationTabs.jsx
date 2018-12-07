import * as React from 'react';
import { findDOMNode } from "react-dom";
import { SET_DEVICE_CONFIG } from '../helper/Services';
import { INPUT_SOURCES } from '../constant/Common.Consts';
import Volume from './Volume';
import PipCanvas from './PipCanvas';

const audioParam = ['micMix','mixInput','soundControl','micPercentage','audioPercentage'];
const videoParam = ['brightness','contrast','hue','saturation'];
const boolValParma = ['micMix'];
const numberValParma = ['currentPIPID'];

export default class ConfigurationTabs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tabActive : ['active','',''],
			pipList: props.pipList
		};

		this.cgTab = this.cgTab.bind(this);
		this.volumeChange = this.volumeChange.bind(this);
		this.valChange = this.valChange.bind(this);
		this.changePip = this.changePip.bind(this);
		
	}

	componentDidMount() {}
	shouldComponentUpdate(nextProps, nextState) {
		const { id, selectedSource, deviceConfig } = nextProps;
		let defaultType = '3.5mm';

		/*
			Handle if selected source not in audio input list
		*/
		if(deviceConfig.audioInput !== defaultType && !selectedSource[id].includes(deviceConfig.audioInput)) {
			this.updateAudioInput(id, defaultType);
			nextProps.updateDeviceConfig({
				id : id,
				audioInput : defaultType
			});
		}
		
		return true;
	}
	updateAudioInput(id, sourceType) {

		return SET_DEVICE_CONFIG.fetchData({
			device : {
				id : id,
				audioInput : sourceType
			}
		},'PATCH');
	}
	cgTab(indx) {
		let tabActive = ['','',''];
		tabActive[indx] = 'active';

		this.setState({
			tabActive: tabActive
		});
	}
	volumeChange(val, name) {
		const attr = (name).replace(/([0-9]*)$/,'');
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

		if(videoParam.includes(attr)) {
			passDevice = {
				...passDevice,
				videoParam : {
					[attr] : val
				}
			}
		}

		if(!passDevice.hasOwnProperty('audioParam') && !passDevice.hasOwnProperty('videoParam')) {
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
		//update device config

		const attr = (e.target.name).replace(/([0-9]*)$/,'');
		const val = boolValParma.includes(attr) ? !!Number(e.target.value) : (numberValParma.includes(attr) ? Number(e.target.value) : e.target.value);
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

		if(videoParam.includes(attr)) {
			passDevice = {
				...passDevice,
				videoParam : {
					[attr] : val
				}
			}
		}

		if(!passDevice.hasOwnProperty('audioParam') && !passDevice.hasOwnProperty('videoParam')) {
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
	changePip(e) {
		const inputNodeDOM = findDOMNode(e.currentTarget).querySelector('input[type="radio"]');
		let passDevice = {
			id: this.props.id,
			currentPIPID: Number(inputNodeDOM.value)
		};
		this.props.updateDeviceConfig(passDevice);

		SET_DEVICE_CONFIG.fetchData({
			device : passDevice
		},'PATCH');
	}
	render() {
		const cgTab = this.cgTab;
		const volumeChange = this.volumeChange;
		const tabActive = this.state.tabActive;
		const pipList = this.state.pipList;
		const { t, facility, deviceConfig, id, selectedSource } = this.props;

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
						<table className="table table-bordered">
							<tbody>
								
							
							{
								facility.audioMix ? 
						        <tr className="">
						            <td className="align-middle w-10">{t('msg_microphone')}</td>
						            <td className="align-middle w-15">
						            	<div className="form-check d-inline-block w-45">
										<input className="form-check-input" type="radio" id="mixAudioEnable" name={'micMix' + id } value="1" checked={deviceConfig.audioParam.micMix} onChange={this.valChange}/>
										<label className="form-check-label" htmlFor="mixAudioEnable">{t('msg_enable')}</label>
										</div>
										<div className="form-check d-inline-block w-45">
											<input className="form-check-input" type="radio" id="mixAudioDisable" name={'micMix' + id } value="0" checked={!deviceConfig.audioParam.micMix} onChange={this.valChange}/>
											<label className="form-check-label" htmlFor="mixAudioDisable">{t('msg_disable')}</label>
										</div>
						            </td>
						            <td className="w-5"></td>
						            <td className="align-middle">{ t('msg_audio_control') }</td>
						            <td className="align-middle"><Volume value={deviceConfig.audioParam.soundControl} min={0} max={100} name={ 'soundControl' + id } onChange={volumeChange} disabled={false}></Volume></td>
						            <td className="w-20"></td>
						        </tr> 
						        : null
						    }
						    <tr className="">
						    	<td className="align-middle">{t('msg_audio_source')}</td>
								<td className="align-middle">
									<select className="form-control" name={'audioInput' + id } value={deviceConfig.audioInput} onChange={this.valChange}>
										{
											
											[
												...selectedSource[id].filter(input => input !== ''),
												...facility.audioInput.filter(input => input === '3.5mm')
											].map((input, i) => {
												return (<option key={i} value={input}>{INPUT_SOURCES[input]}</option>);
											})
											
										}
									</select>
								</td>
								<td className="align-middle"></td>
								<td className="align-middle">{ t('msg_audio_volume') }</td>
								<td className="align-middle"><Volume value={deviceConfig.audioParam.audioPercentage} min={0} max={100} name={'audioPercentage' + id} onChange={volumeChange} disabled={false}></Volume></td>
						    </tr>
						    {
								facility.audioMix ? 
									<tr className="">
										<td className="align-middle ">
											{t('msg_microphone_source')}
										</td>
										<td className="align-middle">
											<select className="form-control" name={'mixInput' + id } onChange={this.valChange} defaultValue={deviceConfig.audioParam.mixInput}>
												{ facility.mixInput.map((input, i) => (<option key={i} value={input}>{INPUT_SOURCES[input]}</option>)) }
											</select>
										</td>
										<td className="align-middle"></td>
										<td className="align-middle">{ t('msg_microphone_volume') }</td>
										<td className="align-middle">
											<Volume value={deviceConfig.audioParam.micPercentage} min={0} max={100} name={'micPercentage' + id} onChange={volumeChange} disabled={false}></Volume>
										</td>
									</tr>
								: null
							}
							</tbody>
					    </table>
					</section>

					<section className={'tab-pane ' + tabActive[1]}>
						<div className="form-row form-group align-items-center">
							<div className="col-1">{t('msg_brightness')}</div>
							<div className="col"><Volume value={deviceConfig.videoParam.brightness} min={0} max={100} onChange={volumeChange} name={'brightness' + id } size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-5"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-1">{t('msg_contrast')}</div>
							<div className="col"><Volume value={deviceConfig.videoParam.contrast} min={0} max={100} onChange={volumeChange} name={'contrast' + id} size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-5"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-1">{t('msg_hue')}</div>
							<div className="col"><Volume value={deviceConfig.videoParam.hue} min={0} max={100} onChange={volumeChange} name={'hue' + id } size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-5"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-1">{t('msg_saturation')}</div>
							<div className="col"><Volume value={deviceConfig.videoParam.saturation} min={0} max={100} onChange={volumeChange} name={ 'saturation' + id } size="lg" disabled={false} btnMinMax={false}></Volume></div>
							<div className="col-5"></div>
						</div>
						<div className="form-row form-group align-items-center">
							<div className="col-1">{t('msg_video_format')}</div>
							<div className="col">
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
							<div className="col-1">{t('msg_deinterlace_setting')}</div>
							<div className="col">
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
							<div className="col-lg-1">{t('msg_layout')}</div>
							<div className="col-lg">
								<ul className="list-inline">
									{
										pipList.map(pipConfig => {
											return (<li key={pipConfig.id} className="list-inline-item gradient-blue-bg p-2 rounded" onClick={this.changePip}>
														<div className="form-check mb-1" onClick={e => e.stopPropagation()}>
															<input className="form-check-input" type="radio" name={'currentPIPID' + id+(pipConfig.id*100)} id={'pip_' + pipConfig.id} value={pipConfig.id} checked={deviceConfig.currentPIPID === pipConfig.id} onChange={this.valChange}/>
															<label className={"form-check-label text-white " + (deviceConfig.currentPIPID === pipConfig.id ? 'text-warning' : '')} htmlFor={'pip_' + pipConfig.id}>{pipConfig.name}</label>
														</div>
														<PipCanvas width={160} height={90} pipConfig={pipConfig}></PipCanvas>
													</li>);
										})
									
									}
								</ul>
							</div>
						</div>
					</section>
					
				</div>
			</div>
		);
	}
}

