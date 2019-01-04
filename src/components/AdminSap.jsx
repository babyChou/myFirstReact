import * as React from "react";
import { translate } from "react-i18next";
import { MSG_SUCCESS_SECONDS } from "../constant/Init.Consts";
import { SET_CONFIG } from "../helper/Services";

import Btn from './Btn';
import { Alert } from 'reactstrap';


class AdminSap extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			sap : props.config.sap,
			okDisabled : true,
			alertMsg : '',
			errMsgKey : '',
			alertColor : 'info'
		};

		this.form = React.createRef();

		this.changeVal = this.changeVal.bind(this);
		this.submitForm = this.submitForm.bind(this);

	}
	componentDidMount() {
		
	}
	changeVal(e) {
		const inputDom = e.target;
		const attrName = inputDom.name.replace('input_','');
		inputDom.classList.remove('is-invalid');

		this.setState({
			[attrName] : e.target.value
		},() => {
			

			if(this.form.current.querySelectorAll('input:invalid').length === 0) {
				this.setState({
					okDisabled : false
				});
			}else{
				let errMsgKey = 'validator_required';

				if(inputDom.validity.patternMismatch) {
					errMsgKey = 'msg_special_characters_folder';
				}

				this.setState({
					errMsgKey : errMsgKey,
					okDisabled : true
				},() => {
					inputDom.classList.add('is-invalid');
				});
			}


		});

	}

	submitForm() {
		const { t, setConfig } = this.props;
		const { sap } = this.state;

		SET_CONFIG.fetchData({
			config : {
				sap : sap
			}
		}, 'POST').then(data => {
			this.setState({
				alertMsg : <h4>{t('msg_success')}</h4> 
			}, () => {
				setTimeout(()=>{							
					this.setState({
						alertMsg : ''
					});
				}, MSG_SUCCESS_SECONDS);
			});
			setConfig({
				sap : sap
			})

		});
	}
	
	render() {
		const { t, config } = this.props;
		const { sap, okDisabled, alertMsg, alertColor, errMsgKey } = this.state;

		return (
			<fieldset ref={this.form}>
				<div className="d-flex align-items-center">
					<div className="conmmon_title_w col-auto">{t('msg_group_name')}</div>
					<div className="col">
						<input type="text" className="form-control" name="input_sap" value={sap} onChange={this.changeVal} maxLength="50" required pattern="[^\\^\|^/^:^?^<^>^*^+^*]*"/>
						<div className="invalid-inline-feedback">{t(errMsgKey)}</div>
					</div>
					<div className="col-md-2">
						<Btn size="sm" type="submit" onClick={this.submitForm} className="" disabled={okDisabled}>{t("msg_ok")}</Btn>
					</div>
				</div>
				<Alert isOpen={!!alertMsg} className="fixed-top text-center m-5" color={alertColor}>{alertMsg}</Alert>
			</fieldset>
		);
	}
}

export default translate("translation")(AdminSap);
