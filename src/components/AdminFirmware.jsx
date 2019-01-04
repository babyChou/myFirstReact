import * as React from "react";
import { translate } from "react-i18next";

import { UPLOAD_FW, UPDATE_FW } from "../helper/Services";

import Btn from './Btn';
import Loader from './Loader';


class AdminFirmware extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			fileOk : false,
			fileText : '',
			fileErrMsg : '',
			backdropShow : false,
			counterShow : false,
			counter: 0
		};

		this.onUploadFile = this.onUploadFile.bind(this);
		this.updateFW = this.updateFW.bind(this);

	}
	componentDidMount() {
		
	}
	onUploadFile(e) {
		const { t } = this.props;
		const file = e.target.files[0];


		if(!!file && file.name.match(/(.bin)$/)) {

			this.setState({
				fileText : file.name,
				backdropShow : true
			}, () => {
				UPLOAD_FW.postFile({
					file : file
				}).then(data => {
					if(data.result === 0) {
						// document.getElementById('firmwareInput').value = null;
						this.setState({
							backdropShow : false,
							fileOk : true
						});
					}else{
						this.setState({
							fileErrMsg : t('msg_firmware_file_error'),
							backdropShow : false
						});
					}
	
				});

			});
		}else{
			
			this.setState({
				fileOk : false,
				fileErrMsg : t('msg_firmware_version_error_format')
			});

		}

		
	}
	updateFW(e) {
		let countdownTimer;
		UPDATE_FW.fetchData().then(data => {
			if(data.result === 0) {
				let seconds = data.seconds || 60;

				countdownTimer = setInterval(() => {
					this.setState({
						counterShow : true,
						counter : seconds
					});

					seconds--;

					if(seconds <= 0) {
						window.location.reload();
						clearInterval(countdownTimer);
					}

				}, 1000);

			}

		});
	}
	
	render() {
		const { t } = this.props;
		const { fileText, fileErrMsg, backdropShow, counterShow, counter, fileOk } = this.state;

		return (
			<div className="mt-3 d-flex align-items-center ">
				{ counterShow ? <Loader innerText={ counter + 's'} text={t('msg_firmware_updateing')}></Loader> : null }
				{ backdropShow ? <Loader></Loader> : null }
				
				<div className="text-capitalize conmmon_title_w">{t('msg_firmware_update_file')}</div>
				<div className="custom-file mr-3">
					<input type="file" className={'custom-file-input ' + (fileErrMsg ? 'is-invalid' : '')} id="firmwareInput" onChange={this.onUploadFile} accept=".bin"/>
					<label className="custom-file-label" htmlFor="customFile" data-content={t('msg_browse')}>{ fileText }</label>
					<div className="invalid-feedback">{ fileErrMsg }</div>
				</div>
				{ fileOk ? <Btn size="sm" type="submit" onClick={this.updateFW} className="" >{t("msg_update")}</Btn> : null}
				
			</div>
		);
	}
}

export default translate("translation")(AdminFirmware);
