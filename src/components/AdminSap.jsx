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
			sap : '',
			okDisabled : true,
			alertMsg : '',
			alertColor : 'info'
		};

		this.form = React.createRef();

		this.changeVal = this.changeVal.bind(this);
		this.submitForm = this.submitForm.bind(this);

	}
	componentDidMount() {
		
	}
	changeVal(e) {
		const attrName = e.target.name.replace('input_','');
		console.log(attrName, e.target.value);
		
		this.setState({
			[attrName] : e.target.value
		},() => {

			if(this.form.current.querySelectorAll('input:invalid').length === 0) {
				this.setState({
					okDisabled : false
				});
			}else{
				this.setState({
					okDisabled : true
				});
			}


		});

	}

	submitForm() {
		const { t } = this.props;
		const { sap } = this.state;

		SET_CONFIG.fetchData({
			config : {
				sap : this.state.name
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
			/* setConfig({
				deviceName : this.state.name
			}) */

		});
	}
	
	render() {
		const { t } = this.props;
		const { sap, okDisabled, alertMsg, alertColor } = this.state;

		return (
			<fieldset ref={this.form}>
				<div className="d-flex align-items-center">
					<div className="col-md-2">{t('msg_group_name')}</div>
					<input type="text" className="form-control" name="input_sap" value={sap} onChange={this.changeVal} required/>
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
