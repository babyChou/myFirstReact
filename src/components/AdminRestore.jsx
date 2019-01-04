import * as React from "react";
import { translate } from "react-i18next";
import { MSG_SUCCESS_SECONDS } from "../constant/Init.Consts";
import { DOWNLOAD_CONFIG_BACKUP, RESTORE_CONFIG_BACKUP } from "../helper/Services";


import Btn from './Btn';
import Loader from './Loader';
import Dialog from './Dialog';
import { Alert } from 'reactstrap';

const HOSTNAME = 'http://' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

class AdminRestore extends React.Component {
	constructor(props) {
		super(props);


		this.state = {
			fileText : '',
			backdropShow : false,
			isDialogShow : false,
			fileObject : null,
			downloadPath : '',
			fileErrMsg : '',
			alertMsg : ''
		};

		this.form = React.createRef();

		this.onUploadFile = this.onUploadFile.bind(this);
		this.confirmRestore = this.confirmRestore.bind(this);
		this.cancelRestore = this.cancelRestore.bind(this);
		this.requestFile = this.requestFile.bind(this);

	}
	onUploadFile(e) {

		const { t } = this.props;
		const file = e.target.files[0];
		document.querySelector('#restoreFile').setCustomValidity('');


		if(!!file && file.name.match(/(.tgz)$/)) {

			this.setState({
				fileText : file.name,
				disabledSubmit : false,
				fileObject : file,
				isDialogShow : true
			});
		}else{

			document.querySelector('#restoreFile').setCustomValidity('msg_firmware_version_error_format');

			this.setState({
				fileErrMsg : t('msg_firmware_version_error_format')
			});

		}

	}

	cancelRestore() {
		document.getElementById('restoreFile').value = null;
		this.setState({
			isDialogShow : false,
			fileText : ''
		});
	}
	confirmRestore() {

		const { t } = this.props;
		
		this.setState({
			backdropShow : true,
			isDialogShow : false
		});

		RESTORE_CONFIG_BACKUP.postFile({
			config : this.state.fileObject
		}).then(data => {
			document.getElementById('restoreFile').value = null;
			if(data.result === 0) {

				this.setState({
					backdropShow : false,
					disabledSubmit : true,
					fileText : '',
					alertMsg : <h4>{t('msg_backup_succeed')}</h4>
				}, () => {
					setTimeout(()=>{							
						this.setState({
							alertMsg : ''
						});
						window.location.reload(true);
					}, MSG_SUCCESS_SECONDS + 1000);
				});
			}else{

				document.querySelector('#restoreFile').setCustomValidity('msg_backup_failed');

				this.setState({
					fileErrMsg : t('msg_backup_failed').replace('{0}',''),
					backdropShow : false,
					disabledSubmit : true,
					fileText : ''
				});
			}

		});

	}
	requestFile() {
		
		DOWNLOAD_CONFIG_BACKUP.fetchData().then(data => {
			if(data.result === 0) {
				this.setState({
					downloadPath : HOSTNAME + data.downloadFile
				});
			}

		});
	}
	render() {
		const { t } = this.props;
		const { fileText, backdropShow, fileErrMsg, isDialogShow, alertMsg, downloadPath } = this.state;

		return (
			<fieldset className="my-was-validated">
				<div className="form-group row">								
					<div className="col-auto conmmon_title_w">
						{t('msg_backup_sitting')}
					</div>
					<div className="col-auto">
						{t('msg_backup_sitting_to_pc')}<Btn size="sm" type="button" onClick={this.requestFile} className="ml-3" >{t("msg_save")}</Btn>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-auto conmmon_title_w">
						{t('msg_restore_sitting')}
					</div>
					<div className="col-md-6">
						<div className="custom-file">
							<input type="file" className="custom-file-input" id="restoreFile" onChange={this.onUploadFile} accept=".tgz"/>
							<label className="custom-file-label" htmlFor="restoreFile" data-content={t('msg_browse')}>{fileText}</label>
							<div className="invalid-inline-feedback">{fileErrMsg}</div>
						</div>
					</div>
				</div>
				<Dialog type="confirm" icon="warning" isShow={isDialogShow} title={t('msg_backup_restore_sitting')} msg={t('msg_backup_confirm')} cancel={this.cancelRestore} ok={this.confirmRestore}></Dialog>
				{
					downloadPath ? <iframe className="d-none" src={downloadPath}></iframe> : null
				}
				<Loader isOpen={backdropShow}></Loader>
				<Alert isOpen={!!alertMsg} className="fixed-top text-center m-5" color="info">{alertMsg}</Alert>
			</fieldset>
		);
	}
}

export default translate("translation")(AdminRestore);
