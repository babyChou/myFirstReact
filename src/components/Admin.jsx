import * as React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import {  } from "../helper/Services";
import { } from "../helper/helper";

import Header from "./Header";
import WindowModal from "./WindowModal";
import Btn from './Btn';
import AdminFirmware from './AdminFirmware';
import AdminNetwork from './AdminNetwork';


// import Dialog from "./Dialog";

//form valid https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
const mapStateToProps = store => ({
	config: store.configReducer.config
});

const mapDispatchToProps = dispatch => {
	return {
		// setDeviceConfig: config => dispatch(configActions.setDeviceConfig(config))
	};
};

class Admin extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			
		};

	}
	componentDidMount() {
		
	}
	
	render() {
		const { t, config } = this.props;

		return (
			<div className="container_wrapper">
				<Header noPanel={true}></Header>
				<div className="m-3 row">
					<div className="col-6">
						<WindowModal title={t('msg_basic_information')} >
							<fieldset className="">
								<div className="d-flex align-items-center">
									<div className="w-20">{t('msg_device_name')}</div>
									<div className="">
										<span className="align-middle">{ config.deviceName }</span>
										<button className="btn_rename_edit d-inline-block align-middle mx-3"></button>
									</div>
								</div>
								<div className="d-flex align-items-center mt-3">
									<div className="w-20">{t('msg_firmware_version')}</div>
									<div className="">{ config.version}</div>
								</div>
							</fieldset>
						</WindowModal>
						<WindowModal title={t('msg_firmware_title')}>
							<AdminFirmware></AdminFirmware>
						</WindowModal>

						{/* <WindowModal title={t('msg_backup_restore_sitting')} footer={<Btn size="sm" type="submit" onClick={this.submitForm} className="float-right">{t("msg_submit")}</Btn>}>
							<fieldset className="">
								<div className="form-group row">								
									<div className="col-md-2">
										{t('msg_backup_sitting')}
									</div>
									<div className="col-md-5">
										{t('msg_backup_sitting_to_pc')}<Btn size="sm" type="button" onClick={this.submitForm} className="ml-3">{t("msg_save")}</Btn>
									</div>
								</div>
								<div className="form-group row">
									<div className="col-md-2">
										{t('msg_restore_sitting')}
									</div>
									<div className="col-md-5">
										<div className="custom-file">
											<input type="file" className="custom-file-input" id="customFile" />
											<label className="custom-file-label" htmlFor="customFile" data-content={t('msg_browse')}>{}</label>
										</div>
									</div>
								</div>
							</fieldset>
						</WindowModal>
						<WindowModal title={t('msg_ir_blaster_setting')} ></WindowModal>
						<WindowModal title={t('msg_modify_account')} footer={<Btn size="lg" type="submit" onClick={this.submitForm} className="float-right">{t("msg_ok")}</Btn>}>
							<fieldset className="">
								<div className="form-group row">
									<label htmlFor="msg_input_username_old" className="col-md-3 col-form-label">{t('msg_input_username_old')}</label>
									<div className="col-md-7">
										<input type="email" className="form-control" id="msg_input_username_old" />
									</div>
								</div>
								<div className="form-group row">
									<label htmlFor="msg_input_username_01" className="col-md-3 col-form-label">{t('msg_input_username_01')}</label>
									<div className="col-md-7">
										<input type="email" className="form-control" id="msg_input_username_01" />
									</div>
								</div>
								<div className="form-group row">
									<label htmlFor="msg_input_password_old" className="col-md-3 col-form-label">{t('msg_input_password_old')}</label>
									<div className="col-md-7">
										<input type="email" className="form-control" id="msg_input_password_old" />
									</div>
								</div>
								<div className="form-group row">
									<label htmlFor="msg_input_password_01" className="col-md-3 col-form-label">{t('msg_input_password_01')}</label>
									<div className="col-md-7">
										<input type="email" className="form-control" id="msg_input_password_01" />
									</div>
								</div>
								
							</fieldset>
						</WindowModal> */}
					</div>
					<div className="col-6">
						<WindowModal title={t('msg_network_setting')}>
							<AdminNetwork></AdminNetwork>
						</WindowModal>
						{/* <WindowModal title={t('msg_cms_server_settings')} footer={<Btn size="sm" type="submit" onClick={this.submitForm} className="float-right">{t("msg_enable")}</Btn>}>
							<div className="form-group">
								{t('msg_cms_server_enable')}
							</div>
							
						</WindowModal>
						<WindowModal title={t('msg_time_setting')} >
							<fieldset >
								<div className="d-flex flex-row">
									<div>{t('msg_current_system_time')}</div>
									<Btn size="sm" type="submit" onClick={this.submitForm} className="">{t("msg_edit")}</Btn>
								</div>
							</fieldset>
						</WindowModal>
					
						
						<WindowModal title={t('msg_sap_group_setting')} >
							<fieldset >
								<div className="d-flex align-items-center">
									<div className="col-md-2">{t('msg_group_name')}</div>
									<input type="text" className="form-control" />
									<div className="col-md-2">
										<Btn size="sm" type="submit" onClick={this.submitForm} className="" >{t("msg_ok")}</Btn>
									</div>
								</div>
							</fieldset>
						</WindowModal> */}
					</div>
				</div>

			</div>
		);
	}
}

export default compose(
	translate("translation"),
	connect(mapStateToProps, mapDispatchToProps)
)(Admin);
