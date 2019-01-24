import * as React from "react";
import { translate } from "react-i18next";
import { MSG_SUCCESS_SECONDS, MSG_FAILED_SECONDS } from "../constant/Init.Consts";
import { } from "../constant/Regx.Consts";
import { GET_CMS_SERVER_STATUS, SET_CMS_SERVER } from "../helper/Services";
import Btn from './Btn';
import { Alert } from 'reactstrap';
import Dialog from "./Dialog";

const DOMAIN_REG = '(^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$)|(^(?=^.{1,253}$)(([a-z\d]([a-z\d-]{0,62}[a-z\d])*[\.]){1,3}[a-z]{1,61})$)';
class AdminCms extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isDialogShow : false,
			alertMsg : '',
			alertColor : 'info',
			dialogObj : {
				type : 'confirm',
				title :'',
				okDisabled: true,
			},
			isEnable : true,
			domain : '',
			domainErr : '',
			port : ''
		};

		this.form = React.createRef();

		this.changeVal = this.changeVal.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.enableCms = this.enableCms.bind(this);
		this.renderCmsDialog = this.renderCmsDialog.bind(this);
		this.toogleDia = this.toogleDia.bind(this);
		this.checnCmsStatus = this.checnCmsStatus.bind(this);

	}
	componentDidMount() {
		this.checnCmsStatus();
	}
	checnCmsStatus() {
		GET_CMS_SERVER_STATUS.fetchData().then(data => {
			if(data.result === 0) {
				let updateData = {
					isEnable : !!data.instInfo.streamConnect,
					domain : '',
					port : ''
				};

				if(updateData.isEnable) {
					const domainArr = data.instInfo.cmsDomain.split(':');
					updateData.domain = domainArr[0];
					updateData.port = Number(domainArr[1]);
				}
				
				this.setState(updateData);
			}
		});
	}
	changeVal(e) {
		const { t } = this.props;
		const inputDom = e.target;
		const type = inputDom.type;
		const attrName = inputDom.name.replace('input_','');
		let val = inputDom.value;
		let okDisabled = false;

		this.form.current.querySelectorAll('input').forEach(el => {
			el.classList.remove('is-invalid');
		});

		if(type === 'number') {
			val = Number(val);
		}

		this.setState({
			[attrName] : val
		},() => {
			let domainErr = ''

			this.form.current.querySelectorAll('input:invalid').forEach(el => {

				if(attrName === 'domain') {
					domainErr = t('msg_format_error');
				}

				if(inputDom.name === el.name) {
					el.classList.add('is-invalid');
				}

				okDisabled = true;
			});

			this.setState({
				domainErr : domainErr,
				dialogObj : {
					...this.state.dialogObj,
					okDisabled : okDisabled
				}
			});


		});

	}

	submitForm() {
		const { t } = this.props;
		const { domain, port, isEnable } = this.state;
		let resultMessage, color, sec;
		let postData = {
			connect : ( !isEnable & true )
		};

		if(!isEnable) {
			postData.cmsDomain = `${domain}:${port}`;
		}else{
			postData.cmsDomain = '';
		}

		SET_CMS_SERVER.fetchData(postData, 'POST').then(data => {
			if(data.result === 0) {
				resultMessage = <h4>{t('msg_success')}</h4> ;
				sec = MSG_SUCCESS_SECONDS;
				color = 'info';
				this.checnCmsStatus();
			}else{
				resultMessage = <React.Fragment><h4 className="alert-heading">{t('msg_failed')}</h4><p>Error code : {data.result}</p></React.Fragment>;
				sec = MSG_FAILED_SECONDS;
				color = 'danger';
			}


			this.setState({
				isDialogShow : false,
				alertMsg : resultMessage
			}, () => {
				setTimeout(()=>{							
					this.setState({
						alertMsg : ''
					});
				}, sec);
			});

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

	enableCms() {
		const { t } = this.props;
		const { isEnable } = this.state;

		this.setState({
			dialogObj : {
				type : 'confirm',
				icon : isEnable ? 'warning' : '',
				title : isEnable ? `${t('msg_disable_server')} ` : t('msg_enable_cms_server'),
				msg : isEnable ? t('msg_disable_main') : null,
				okDisabled: !isEnable,
				ok : this.submitForm
			},
			isDialogShow : true
		});
	}

	renderCmsDialog() {
		const { t } = this.props;
		const { domain, port, domainErr } = this.state;

		return (
				<div className="">
					<div className="form-row align-items-center mb-3">
						<label htmlFor="" className="col-auto">{t('msg_cmsipdomain')}</label>
						<div className="col">
							<input type="text" className="form-control" value={domain} name="input_domain" onChange={this.changeVal} required maxLength="150" placeholder="proxy.avermedia.com" pattern={DOMAIN_REG}/>
							<div className="invalid-inline-feedback">{domainErr}</div>
						</div>
					</div>
					<div className="form-row align-items-center">
						<label htmlFor="" className="col-auto">{t('msg_cmsport')}</label>
						<div className="col-auto">
							<input type="Number" className="form-control" value={port} name="input_port" onChange={this.changeVal} required min="1" max="35565" placeholder="8080"/>
							<div className="invalid-inline-feedback">1 ~ 35565</div>
						</div>
					</div>
				</div>
			);

	}
	
	render() {
		const { t } = this.props;
		const { isDialogShow, dialogObj, isEnable, alertMsg, alertColor } = this.state;


		return (
			<fieldset ref={this.form}>
				<div className="">
					{ 
						!isEnable ? t('msg_cms_server_enable')  : 
						<div>
							<div className="mb-2">{t('msg_cms_server_enabled')}</div>
							<div>{t('msg_cms_server_address')} : 10.1.9.133:80</div>
						</div>
					}
				</div>
				<div className="">
					<Btn size="sm" type="submit" onClick={this.enableCms} className="float-right">{isEnable ? t("msg_cms_disable") : t("msg_enable")}</Btn>
				</div>
				<Alert isOpen={!!alertMsg} className="fixed-top text-center m-5" color={alertColor}>{alertMsg}</Alert>

				<Dialog isShow={isDialogShow} toggle={this.toogleDia} { ...dialogObj }>
					{ !isEnable ? this.renderCmsDialog() : null }
				</Dialog>
			</fieldset>
		);
	}
}

export default translate("translation")(AdminCms);
