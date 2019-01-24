import * as React from "react";
import { translate } from "react-i18next";
import { MSG_SUCCESS_SECONDS, MSG_FAILED_SECONDS } from "../constant/Init.Consts";
import { SET_REBOOT_SCHEDULE, GET_REBOOT_SCHEDULE } from "../helper/Services";
import { isHtmlInputTypeSupported } from "../helper/helper";

import Btn from './Btn';
import { Alert } from 'reactstrap';


class AdminAutoReboot extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			day : 1,
			time : '00:00',
			isEnable : false,
			optDisabled : false,
			alertMsg : '',
			alertColor : 'info'
		};

		this.form = React.createRef();

		this.changeVal = this.changeVal.bind(this);
		this.submitForm = this.submitForm.bind(this);

	}
	componentDidMount() {


		GET_REBOOT_SCHEDULE.fetchData().then(data => {
			if(data.result === 0) {

				this.setState({
					day : data.day,
					time : `${data.hour < 10 ? '0' + data.hour : data.hour }:${data.minute < 10 ? '0' + data.minute : data.minute}`,
					isEnable : data.enable,
					optDisabled : !data.enable
				});
			}
			
		});
		
	}
	changeVal(e) {
		const inputDom = e.target;
		const type = inputDom.type;
		const attrName = inputDom.name.replace('input_','');
		let val = inputDom.value;
		let optDisabled = false;

		this.form.current.querySelectorAll('input').forEach(el => {
			el.classList.remove('is-invalid');
		});

		if(type === 'radio') {
			val = !!Number(val);
			optDisabled = !val;
		}else if(type === 'number') {
			val = Number(val);
		}

		this.setState({
			[attrName] : val,
			optDisabled : optDisabled
		},() => {

			this.form.current.querySelectorAll('input:invalid').forEach(el => {
				el.classList.add('is-invalid');
			});


		});

	}

	submitForm() {
		const { t } = this.props;
		const { day, time, isEnable } = this.state;
		const timeArr = time.split(':');
		let resultMessage, color, sec;

		SET_REBOOT_SCHEDULE.fetchData({
			day,
			hour : Number(timeArr[0]),
			minute : Number(timeArr[1]),
			enable : isEnable
		}, 'POST').then(data => {
			if(data.result === 0) {
				resultMessage = <h4>{t('msg_success')}</h4> ;
				sec = MSG_SUCCESS_SECONDS;
				color = 'info';
			}else{
				resultMessage = <React.Fragment><h4 className="alert-heading">{t('msg_failed')}</h4><p>Error code : {data.result}</p></React.Fragment>;
				sec = MSG_FAILED_SECONDS;
				color = 'danger';
			}

			this.setState({
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
	
	render() {
		const { t } = this.props;
		const { day, time, isEnable, optDisabled, alertMsg, alertColor } = this.state;

		return (
			<fieldset ref={this.form}>
				<div className="form-inline mb-3">
					<div className="form-group">
						<label className="mr-2">{t('msg_every')}</label>
						<input type="number" className="form-control mr-2" name="input_day" value={day} onChange={this.changeVal} min="1" style={{width:'125px'}} disabled={optDisabled}/>
						<div className="invalid-inline-feedback w_auto mr-2">{t('validator_min').replace('{0}', 1)}</div>
					</div>
					<div className="form-inline">
						<label className="mr-2">{t('msg_days_and')}</label>
						<input type="time" className="form-control" name="input_time" value={time} onChange={this.changeVal} disabled={optDisabled} required pattern="[\d][\d]:[\d][\d]"/>
						<div className="invalid-inline-feedback w_auto mx-2">{t('validator_time') + (isHtmlInputTypeSupported('time') ? '' : ' ex: 18:00')}</div>
						<label className="mx-2">{t('msg_reboot')}</label>
					</div>
				</div>
				<div className="form-group">
					<div className="form-check form-check-inline">
						<input className="form-check-input" type="radio" name="input_isEnable" id="auto-reboot-enable" value="1" checked={isEnable} onChange={this.changeVal}/>
						<label className="form-check-label" htmlFor="auto-reboot-enable">{t('msg_enable')}</label>
					</div>
					<div className="form-check form-check-inline">
						<input className="form-check-input" type="radio" name="input_isEnable" id="auto-reboot-disable" value="0" checked={!isEnable} onChange={this.changeVal}/>
						<label className="form-check-label" htmlFor="auto-reboot-disable">{t('msg_disable')}</label>
					</div>
					<Btn size="sm" type="submit" onClick={this.submitForm} className="float-right">{t("msg_ok")}</Btn>
				</div>
				<Alert isOpen={!!alertMsg} className="fixed-top text-center m-5" color={alertColor}>{alertMsg}</Alert>
			</fieldset>
		);
	}
}

export default translate("translation")(AdminAutoReboot);
