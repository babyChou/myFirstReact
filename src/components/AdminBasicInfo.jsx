import * as React from "react";
import { translate } from "react-i18next";

import { SET_CONFIG } from "../helper/Services";

import Dialog from "./Dialog";

class AdminBasicInfo extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name : props.config.deviceName,
			dialogObj : {
				type : 'confirm',
				okDisabled: true,
				ok : this.ok.bind(this)
			},
			isDialogShow : false
		};

		this.changeVal = this.changeVal.bind(this);
		this.toogleDia = this.toogleDia.bind(this);

	}
	componentDidMount() {
		
	}
	ok() {
		const { setConfig } = this.props;

		SET_CONFIG.fetchData({
			config : {
				deviceName : this.state.name
			}
		}, 'POST').then(data => {

			setConfig({
				deviceName : this.state.name
			})

			this.setState({
				isDialogShow : false
			});

		});
	}
	changeVal(e) {
		
		this.setState({
			name : e.target.value,
			dialogObj : {
				...this.state.dialogObj,
				okDisabled: e.target.value === '' ? true : false
			}
		});

	}
	toogleDia() {
		this.setState({
			isDialogShow: !this.state.isDialogShow,
			dialogObj : {
				...this.state.dialogObj,
				okDisabled: true
			}
		});
	}
	
	
	render() {
		const { t, config } = this.props;
		const { dialogObj, isDialogShow, name } = this.state;

		return (
			<React.Fragment>
				<Dialog title={t('msg_edit_device_name')} isShow={isDialogShow} toggle={this.toogleDia} { ...dialogObj }>
					<div className="form-group row align-items-center">
						<label htmlFor="" className="col-auto">{t('msg_device_name')}</label>
						<div className="col">
							<input type="text" className="form-control" value={name} onChange={this.changeVal} required maxLength="32"/>
							<p className="invalid-inline-feedback">{t('validator_required')}</p>
						</div>
					</div>
				</Dialog>
				<div className="d-flex align-items-center">
					<div className="conmmon_title_w">{t('msg_device_name')}</div>
					<div className="w-100">
						<span className="align-middle">{ config.deviceName }</span>
						<button className="btn_rename_edit d-inline-block align-middle mx-3" onClick={()=>{this.setState({isDialogShow: !isDialogShow })}}></button>
					</div>
				</div>
				<div className="d-flex align-items-center mt-3">
					<div className="conmmon_title_w">{t('msg_firmware_version')}</div>
					<div className="w-100">{ config.version}</div>
				</div>
			</React.Fragment>
		);
	}
}

export default translate("translation")(AdminBasicInfo);
