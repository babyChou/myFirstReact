import * as React from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { translate } from "react-i18next";
import store from '../store/Store';
import { CONFIGURATION_PANNEL_UPDATE_TIME } from "../constant/Init.Consts";
import { rootActions } from '../action/Root.Actions';
import { INPUT_DEVICE_NAME, INPUT_SOURCES } from '../constant/Common.Consts';
import { SET_DEVICE_CONFIG, GET_PIP_PREVIEW_IMG } from '../helper/Services';

const updateSec = CONFIGURATION_PANNEL_UPDATE_TIME;

const mapDispatchToProps = (dispatch) => {
	return { actions: bindActionCreators(rootActions, dispatch) };
};

class HeaderPanel extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			preview: {
				1 : '',
				2 : ''
			}
		};
		

		this.interval = {};

		this.clickSource = this.clickSource.bind(this);
		this.renewPreview = this.renewPreview.bind(this);

	}

	componentDidMount() {
		const { devices, selectedSource } = this.props;

		devices.forEach(device => {
			if(selectedSource[device.id].length > 0) {	
				this.renewPreview(device.id);
			}

		});
	}
	componentDidUpdate(prevProps, prevState) {
		const { devices, selectedSource } = this.props;


		devices.forEach(device => {
			let isPropsChange = false;

			if(selectedSource[device.id].length !== prevProps.selectedSource[device.id].length) {
				isPropsChange = true;
			}
			if(selectedSource[device.id].length > 0) {

				if(isPropsChange) {
					this.renewPreview(device.id);
				}
			}else{
				if(this.interval[device.id]) {
					clearTimeout(this.interval[device.id]);

					if((prevState.preview[device.id] !== this.state.preview[device.id]) || isPropsChange) {
						this.setState({
							preview : {
								...this.state.preview,
								[device.id] : ''
							}
						});
					}
				}

			}

		});

	}
	componentWillUnmount () {
		this.props.devices.forEach(device => {
			if(this.interval[device.id]) {
				clearTimeout(this.interval[device.id]);
			}
		});
	}

	clickSource(e) {
		
		const { addSourceType, deleteSourceType, replaceLastSourceType } = this.props.actions;
		const { selectedSource } = this.props;
		const selectID = e.target.dataset.selectId.split('_');
		const deviceID = Number(selectID[0]);
		const type = selectID[1];
		let currSourceType = [];

		if(selectedSource[deviceID].indexOf(type) !== -1) {
			deleteSourceType(type, deviceID);
		}else{
			if(selectedSource[deviceID].length < 2) {
				addSourceType(type, deviceID);
			}else{
				replaceLastSourceType(type, deviceID);
			}
		}

		currSourceType = store.getState().rootReducer.selectedSource[deviceID];

		SET_DEVICE_CONFIG.fetchData({
			device : {
				id : deviceID,
				videoInput : currSourceType
			}
		});
		

	}

	renewPreview(deviceID){

		if(this.interval[deviceID]) {
			clearTimeout(this.interval[deviceID]);
		}

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

		this.interval[deviceID] = setTimeout(() => {
			this.renewPreview(deviceID);
		}, updateSec);

	}

	render() {
		const { t, devices, selectedSource, taskList } = this.props;
		const { preview } = this.state;


		return (
			<React.Fragment>
				{
					devices.map(device => {
						const isDeviceStreaming = taskList.some(task => task.deviceID === device.id && task.isStart === 1);

						return (
								<div key={device.id} className="input_panel rounded p-2 d-flex align-items-start d-inline-flex mr-2">
									<div className="p-2 text-center">
										<h6>{t('msg_output')}</h6>
										<h4>{INPUT_DEVICE_NAME[device.id]}</h4>
										<h4 className="text-warning">
											{ (selectedSource[device.id].length > 1 ? 'PIP' : '') }
										</h4>
									</div>
									<div className="p-2">
										<figure className="figure" style={{ overflow: 'hidden', width: '95px', height: '92px' }}>
											{ preview[device.id] === '' ? <div className="border border-secondary bg-dark" style={{ width: '95px', height: '92px' }}></div> : <img className="figure-img img-fluid" src={preview[device.id]} alt={device.id}/> }
										</figure>
									</div>
									{
										device.videoInput.map(type => {
											let inputType = type.slice(0, -1);
											let btnClass = `btn_source_${inputType} panel_${inputType}_simple mx-auto mt-2`;
											let otherDeviceID = (device.id % 2) + 1;
											let isDisabled = true;

											if(selectedSource[device.id].indexOf(type) !== -1) {
												btnClass += ' active';
											}else{
												/* Disable another source
													if(selectedSource[otherDeviceID].filter(selectedType => selectedType.match(type)).length > 0) {
													isDisabled = true;
												} */
											}

											if(!isDeviceStreaming) {
												isDisabled = false;
											}

											return (<div key={device.id + type} className="p-2">
														<div className={'border_text_' + inputType }>{INPUT_SOURCES[type]}</div>
														<button className={ btnClass } disabled={isDisabled} data-select-id={device.id + '_' + type} onClick={this.clickSource}></button>
													</div>);
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


// export default withRouter(translate("translation")(HeaderPanel));

export default compose(
	translate('translation'),
	connect(null, mapDispatchToProps)
)(HeaderPanel);


