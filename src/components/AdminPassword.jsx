import * as React from "react";
import { translate } from "react-i18next";
import { MSG_SUCCESS_SECONDS} from "../constant/Init.Consts";
import { SET_USER } from "../helper/Services";

import Btn from './Btn';
import { Alert } from 'reactstrap';


class AdminPassword extends React.Component {
	constructor(props) {
		super(props);


		this.state = {
			oldPassword : '',
			password : '',
			cfpassword : '',
			okDisabled : true,
			errMsg : '',
			alertMsg : '',
			alertColor : 'info',
		};

		this.form = React.createRef();

		this.changeVal = this.changeVal.bind(this);
		this.submitForm = this.submitForm.bind(this);

	}
	changeVal(e) {
		const attrName = e.target.id.replace('input_','');
		
		this.setState({
			[attrName] : e.target.value
		},() => {
			const {oldPassword, password, cfpassword} = this.state;
			document.querySelector('#input_cfpassword').setCustomValidity('');
			if(attrName === 'cfpassword' || attrName === 'password') {
				if(cfpassword !== password) {
					document.querySelector('#input_cfpassword').setCustomValidity('validator_equalTo');
				}
			}

			if(oldPassword !=='' && password !== '' && cfpassword !== '') {

				if(this.form.current.querySelectorAll('input:invalid').length === 0) {
					this.setState({
						okDisabled : false
					});
				}else{
					this.setState({
						okDisabled : true
					});
				}
			}



		});

	}

	submitForm() {
		const { t } = this.props;
		const { oldPassword, password } = this.state;

		SET_USER.fetchData({
			oldPassword,
			password
		}).then(data => {
			if(data.result !== 0) {
				this.setState({
					errMsg : t('validator_checkdb')
				});
			}else{

				this.setState({
					oldPassword : '',
					password : '',
					cfpassword : '',
					okDisabled : true,
					alertColor : 'info',
					errMsg : '',
					alertMsg : <h4>{t('msg_success')}</h4> 
				}, () => {
					setTimeout(()=>{							
						this.setState({
							alertMsg : ''
						});
					}, MSG_SUCCESS_SECONDS);
				});
			}
		});
	}
	
	render() {
		const { t } = this.props;
		const { oldPassword, password, cfpassword, okDisabled, errMsg, alertMsg, alertColor} = this.state;

		return (
			<fieldset ref={this.form} className="my-was-validated">
				<div className="form-group row">
					<label htmlFor="input_oldPassword" className="col-auto conmmon_title_w col-form-label">{t('msg_input_password_old')}</label>
					<div className="col-md-7">
						<input type="password" className="form-control" id="input_oldPassword" value={oldPassword} onChange={this.changeVal}/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="input_password" className="col-auto conmmon_title_w col-form-label">{t('msg_input_password_01')}</label>
					<div className="col-md-7">
						<input type="password" className="form-control" id="input_password" value={password} onChange={this.changeVal}/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="input_cfpassword" className="col-auto conmmon_title_w col-form-label">{t('msg_input_password_02')}</label>
					<div className="col-md-7">
						<input type="password" className="form-control" id="input_cfpassword" value={cfpassword} onChange={this.changeVal}/>
						<div className="invalid-inline-feedback">{t('validator_equalTo')}</div>
						<div className="text-danger">{errMsg}</div>
					</div>
				</div>
				<Btn size="lg" type="submit" className="float-right" disabled={okDisabled} onClick={this.submitForm}>{t("msg_ok")}</Btn>
				<Alert isOpen={!!alertMsg} className="fixed-top text-center m-5" color={alertColor}>{alertMsg}</Alert>
			</fieldset>
		);
	}
}

export default translate("translation")(AdminPassword);
