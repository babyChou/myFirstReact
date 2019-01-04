import * as React from "react";
import { translate } from "react-i18next";
import { MSG_SUCCESS_SECONDS} from "../constant/Init.Consts";
import { SET_USER } from "../helper/Services";

import Btn from './Btn';
import { Alert } from 'reactstrap';


class AdminAccount extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			oldUsername : '',
			username : '',
			cfusername : '',
			okDisabled : true,
			errMsg : '',
			alertMsg : '',
			alertColor : 'info',
		};

		this.form = React.createRef();

		this.changeVal = this.changeVal.bind(this);
		this.submitForm = this.submitForm.bind(this);

	}
	componentDidMount() {
		
	}
	changeVal(e) {
		const attrName = e.target.id.replace('input_','');
		
		this.setState({
			[attrName] : e.target.value
		},() => {
			const {oldUsername, username, cfusername} = this.state;
			document.querySelector('#input_cfusername').setCustomValidity('');
			if(attrName === 'cfusername' || attrName === 'username') {
				if(cfusername !== username) {
					document.querySelector('#input_cfusername').setCustomValidity('validator_equalTo');
				}
			}

			if(oldUsername !=='' && username !== '' && cfusername !== '') {

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
		const { oldUsername, username } = this.state;

		SET_USER.fetchData({
			oldUsername,
			username
		}).then(data => {
			if(data.result !== 0) {
				this.setState({
					errMsg : t('validator_checkdb')
				});
			}else{

				this.setState({
					oldUsername : '',
					username : '',
					cfusername : '',
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
		const { oldUsername, username, cfusername, okDisabled, errMsg, alertMsg, alertColor} = this.state;

		return (
			<fieldset ref={this.form} className="my-was-validated">
				<div className="form-group row">
					<label htmlFor="input_oldUsername" className="col-auto conmmon_title_w col-form-label">{t('msg_input_username_old')}</label>
					<div className="col-md-7">
						<input type="text" className="form-control" id="input_oldUsername" value={oldUsername} onChange={this.changeVal}/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="input_username" className="col-auto conmmon_title_w col-form-label">{t('msg_input_username_01')}</label>
					<div className="col-md-7">
						<input type="text" className="form-control" id="input_username" value={username} onChange={this.changeVal}/>
					</div>
				</div>
				<div className="form-group row">
					<label htmlFor="input_cfusername" className="col-auto conmmon_title_w col-form-label">{t('msg_input_username_02')}</label>
					<div className="col-md-7">
						<input type="text" className="form-control" id="input_cfusername" value={cfusername} onChange={this.changeVal}/>
						<div className="invalid-inline-feedback">{t('validator_equalTo')}</div>
						<div className="text-danger">{errMsg}</div>
					</div>
				</div>
				<Btn size="lg" type="submit"  className="float-right" disabled={okDisabled} onClick={this.submitForm}>{t("msg_ok")}</Btn>
				<Alert isOpen={!!alertMsg} className="fixed-top text-center m-5" color={alertColor}>{alertMsg}</Alert>
			</fieldset>
		);
	}
}

export default translate("translation")(AdminAccount);
