import * as React from "react";
import { translate } from "react-i18next";
import { GET_PIP_CONFIG_LIST, SET_PIP_CONFIG, DELETE_PIP_CONFIG } from "../helper/Services";
import { } from "../helper/helper";

import Header from "./Header";
import WindowModal from "./WindowModal";
import PipCanvas from "./PipCanvas";
import Volume from "./Volume";

// import Dialog from "./Dialog";

//form valid https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation

class Pip extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			pipList : []
		};

		this.volumeChange = this.volumeChange.bind(this);
		this.changeVal = this.changeVal.bind(this);
		this.cloneProfile = this.cloneProfile.bind(this);
		this.deleteProfile = this.deleteProfile.bind(this);

	}
	componentDidMount() {
		GET_PIP_CONFIG_LIST.fetchData().then(data => {
			this.setState({
				pipList : data.config
			});
		});
	}
	deleteProfile(e, id) {
		let pipList = JSON.parse(JSON.stringify(this.state.pipList));
		const pipIndex = pipList.findIndex(pipConfig => (pipConfig.id === id));

		pipList.splice(pipIndex, 1);

		DELETE_PIP_CONFIG.fetchData({
			ids : [id]
		}).then(data => {
			if(data.result === 0) {
				this.setState({
					pipList
				});
			}
		});


	}
	cloneProfile(e, id) {
		const newPip = JSON.parse(JSON.stringify(this.state.pipList.find(pipConfig => pipConfig.id === id)));

		newPip.custom = true;
		newPip.name += '-copy';
		delete newPip.id;

		SET_PIP_CONFIG.fetchData({
			config : newPip
		},'POST').then(data => {
			if(data.result === 0) {
				newPip.id = data.id;
				
				this.setState({
					pipList : [...this.state.pipList, newPip]
				});
			}
		});


	}
	volumeChange(val, name) {
		const attrAsset = (name).split('_');
		const attr = attrAsset[0];
		const id = Number(attrAsset[1]);
		let updateData = {};

		const pipList = this.state.pipList.map(pipConfig => {
			if(id === pipConfig.id) {
				
				if(attr === 'x' || attr === 'y') {
					updateData.windowPosition = {
						...pipConfig.windowPosition,
						[attr] : val
					};
				}
				if(attr === 'size') {
					updateData.windowSize = val;
				}

				return {
					...pipConfig,
					...updateData
				};

			}else{
				return pipConfig;
			}
		});

		this.setState({
			pipList
		});

		SET_PIP_CONFIG.fetchData({
			config : {
				id : id,
				...updateData
			}
		},'PATCH');

	}
	changeVal(e) {
		const attrAsset = (e.target.name).split('_');
		const attr = attrAsset[0];
		const id = Number(attrAsset[1]);
		let val = e.target.value;

		if(attr === 'keepRatio') {
			val = !Number(val);
		}

		const pipList = this.state.pipList.map(pipConfig => {
			if(id === pipConfig.id) {
				
				return {
					...pipConfig,
					[attr] : val
				};

			}else{
				return pipConfig;
			}
		});

		this.setState({
			pipList
		});

		SET_PIP_CONFIG.fetchData({
			config : {
				id : id,
				[attr] : val
			}
		},'PATCH');

	}
	render() {
		const { t } = this.props;
		const { pipList } = this.state;

		return (
			<div className="">
				<Header>
					<div className="d-flex flex-wrap px-2">
					{
						
						pipList.map(pipConfig => (
							<div className="p-2" key={pipConfig.id}>
								<h5>{pipConfig.name}</h5>
								<PipCanvas width={160} height={90} pipConfig={pipConfig}></PipCanvas>
							</div>
						))
							
					}
					</div>
				</Header>
				<div className="mx-3">	
					<WindowModal title={t('msg_pip_setting')} >
						<div className="table-responsive">
							<table className="table-configuration">
								<thead className="thead-blue">
									<tr className="table-bordered">
										<th scope="col" className="w-5">{t('msg_no')}</th>
										<th scope="col" className="w-10">{t('msg_name')}</th>
										<th scope="col" className="w-15">{t('msg_window_position')}</th>
										<th scope="col" className="w-25">{t('msg_window_size')}</th>
										<th scope="col" className="w-15">{t('msg_other')}</th>
									</tr>
								</thead>
								<tbody>
									{
										pipList.map((pipConfig, i) => {
											let maxSize = Math.min(100 - pipConfig.windowPosition.x, 100 - pipConfig.windowPosition.y);

											if(pipConfig.isPBP) {
												maxSize = 75;
											}
			
											return (
												<tr key={pipConfig.id} className="table-common-odd table-bordered">
													<td className="text-center align-middle">{i+1}</td>
													<td className="align-middle"><input type="text" className="form-control" name={'name_' + pipConfig.id } value={pipConfig.name} onChange={this.changeVal} readOnly={!pipConfig.custom}/></td>
													<td className="align-middle">
														<div className="d-flex flex-row pb-1">
															<span className="mt-1">X</span>
															<Volume value={pipConfig.windowPosition.x} min={0} max={100} limitMax={100 - pipConfig.windowSize} onChange={this.volumeChange} name={ 'x_' + pipConfig.id } size="lg" disabled={!pipConfig.custom || pipConfig.isPBP} btnMinMax={false}></Volume>
															<span className="mt-1 ml-1">%</span>
														</div>
														<div className="d-flex flex-row pb-1">
															<span className="mt-1">Y</span>
															<Volume value={pipConfig.windowPosition.y} min={0} max={100} limitMax={100 - pipConfig.windowSize} onChange={this.volumeChange} name={ 'y_' + pipConfig.id } size="lg" disabled={!pipConfig.custom || pipConfig.isPBP} btnMinMax={false}></Volume>
															<span className="mt-1 ml-1">%</span>
														</div>
													</td>
													<td className="align-middle">
														<Volume value={pipConfig.windowSize} min={0} max={100} limitMin="25" limitMax={maxSize} onChange={this.volumeChange} name={ 'size_' + pipConfig.id } size="lg" disabled={!pipConfig.custom} btnMinMax={false}></Volume>
															<span className="mt-1 ml-1">%</span>
													</td>
													<td className="align-middle">
														<div className="form-check form-check-inline">
															<input className="form-check-input" type="checkbox" id={pipConfig.id} name={'keepRatio_' + pipConfig.id} value={pipConfig.keepRatio ? 1 : 0} checked={pipConfig.keepRatio} onChange={this.changeVal}/>
															<label className="form-check-label" htmlFor={pipConfig.id}>{t('msg_profile_keep_aspect_ratio')}</label>
														</div>
														{ pipConfig.custom ? <button className="btn_delete float-right mr-2" onClick={e => this.deleteProfile(e, pipConfig.id) }></button> : null}
														{ pipConfig.duplicable ? <button className="btn_add float-right mx-2" onClick={e => this.cloneProfile(e, pipConfig.id)} disabled={pipList.length >= 9}></button> : null}
														
													</td>
												</tr>
											);
										})
									}

								</tbody>
							</table>
						</div>

					</WindowModal>
				</div>
			</div>
		);
	}
}

export default translate("translation")(Pip);

