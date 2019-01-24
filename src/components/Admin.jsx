import * as React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import { configActions } from "../action/Config.Actions";
import { } from "../helper/helper";

import Header from "./Header";
import WindowModal from "./WindowModal";
import Btn from './Btn';
import AdminBasicInfo from './AdminBasicInfo';
import AdminFirmware from './AdminFirmware';
import AdminNetwork from './AdminNetwork';
import AdminAccount from './AdminAccount';
import AdminPassword from './AdminPassword';
import AdminRestore from './AdminRestore';
import AdminSystemTime from './AdminSystemTime';
import AdminSap from './AdminSap';
import AdminAutoReboot from './AdminAutoReboot';
import AdminCms from './AdminCms';


//form valid https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Form_validation
const mapStateToProps = store => ({
	config: store.configReducer.config
});

const mapDispatchToProps = dispatch => {
	return {
		setConfig: config => dispatch(configActions.setConfig(config))
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
		const { t, config, setConfig } = this.props;

		return (
			<div className="container_wrapper">
				<Header noPanel={true}></Header>
				<div className="m-3 row">
					<div className="col-6">
						<WindowModal title={t('msg_basic_information')} >
							<AdminBasicInfo config={config} setConfig={setConfig}></AdminBasicInfo>
							<AdminFirmware></AdminFirmware>
						</WindowModal>

						<WindowModal title={t('msg_modify_account')}>
							<AdminAccount></AdminAccount>
						</WindowModal>

						<WindowModal title={t('msg_backup_restore_sitting')}>
							<AdminRestore></AdminRestore>
						</WindowModal>
						<WindowModal title={t('msg_sap_group_setting')} >
							<AdminSap config={config} setConfig={setConfig}></AdminSap>
						</WindowModal>
						<WindowModal title={t('msg_time_setting')} >
							<AdminSystemTime language={config.language}></AdminSystemTime>
						</WindowModal>
						<WindowModal title={t('msg_reboot_setting')} >
							<AdminAutoReboot></AdminAutoReboot>
						</WindowModal>
						{/* <WindowModal title={t('msg_ir_blaster_setting')} ></WindowModal> */}
					</div>
					<div className="col-6">
						<WindowModal title={t('msg_cms_server_settings')}>
							<AdminCms></AdminCms>
						</WindowModal>
						<WindowModal title={t('msg_modify_password')}>
							<AdminPassword></AdminPassword>
						</WindowModal>
						<WindowModal title={t('msg_network_setting')}>
							<AdminNetwork></AdminNetwork>
						</WindowModal>
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
