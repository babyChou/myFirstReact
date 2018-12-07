import * as React from "react";
import { translate } from "react-i18next";
import { GET_NETWORK_CONFIG, SET_NETWORK_CONFIG } from "../helper/Services";
import { MSG_SUCCESS_SECONDS,  MSG_FAILED_SECONDS} from "../constant/Init.Consts";

import Dialog from "./Dialog";
import Btn from './Btn';
import Loader from './Loader';
import { Alert } from 'reactstrap';

const dhcpValArr = ['static_ip', 'auto_ip_dns','auto_ip'];
class AdminNetwork extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			netWorkStatus : [],
			currentNic : '',
			ipArr : ['','','',''],
			maskArr : ['','','',''],
			gatewayArr : ['','','',''],
			dnsMainArr : ['','','',''],
			dnsSubArr : ['','','',''],
			ip: {
				invalid: false,
				errMsg : ''
			},
			mask: {
				invalid: false,
				errMsg : ''
			},
			gateway: {
				invalid: false,
				errMsg : ''
			},
			dnsMain: {
				invalid: false,
				errMsg : ''
			},
			dnsSub: {
				invalid: false,
				errMsg : ''
			},
			isDialogShow : false,
			isLoaderShow : false,
			alertMsg : '',
			alertColor : 'info',
			dialogObj : {
				title : '',
				type : 'alert',
				icon : 'warning',
				mainMsg : '',
				msg : ''
			}
		};

		this.checkedDOMs = [React.createRef(), React.createRef(), React.createRef(), React.createRef()];
		this.formDOM = React.createRef();

		this.onChangeCheck = this.onChangeCheck.bind(this);
		this.onChangeNicID = this.onChangeNicID.bind(this);
		this.onFocusInput = this.onFocusInput.bind(this);
		this.onChangeInput = this.onChangeInput.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.onKeydown = this.onKeydown.bind(this);

	}
	componentDidMount() {
		GET_NETWORK_CONFIG.fetchData().then(data => {
			if(data.result === 0) {
				const currentNic =  data['nic'][0];
				const { ipArr, maskArr, gatewayArr, dnsMainArr, dnsSubArr } = this.state;

				this.setState({
					netWorkStatus : data['nic'],
					currentNic,
					ipArr : Object.assign(ipArr, currentNic.ip.split('.')),
					maskArr : Object.assign(maskArr, currentNic.mask.split('.')),
					gatewayArr : Object.assign(gatewayArr, currentNic.gateway.split('.')),
					dnsMainArr : Object.assign(dnsMainArr, (currentNic.dns[0] || '...').split('.')),
					dnsSubArr : Object.assign(dnsSubArr, (currentNic.dns[1] || '...').split('.'))
				});
			}
		});
	}
	onChangeCheck(e) {
		let dhcpVal = Number(e.target.value);
		let updateData = {};
		const reset = {			
			invalid: false,
			errMsg : ''
		};
		

		this.checkedDOMs.forEach(ref => {
			if(e.target !== ref.current && ref.current.checked) {
				dhcpVal *= Number(ref.current.value);
			}
		});

		updateData.currentNic = {
			...this.state.currentNic,
			dhcp : dhcpValArr[dhcpVal]
		};

		if(dhcpVal === 1){ //auto_ip_dns
			updateData.ip = reset;
			updateData.mask = reset;
			updateData.gateway = reset;
			updateData.dnsMain = reset;
			updateData.dnsSub = reset;
		}else if(dhcpVal === 2) { //auto_ip
			updateData.ip = reset;
			updateData.mask = reset;
			updateData.gateway = reset;
		}

		this.setState(updateData);

	}
	submitForm(e) {
		//is-invalid
		const { t } = this.props;
		const { netWorkStatus, currentNic, ipArr, maskArr, gatewayArr, dnsMainArr, dnsSubArr } = this.state;
		const invalidDOMs = this.formDOM.current.querySelectorAll('input[type="text"]:invalid');
		let isFormInVaild = true;
		let invalidNames = [];

		let ip = {
			invalid: false,
			errMsg : ''
		};

		let mask = {
			invalid: false,
			errMsg : ''
		};

		let gateway = {
			invalid: false,
			errMsg : ''
		};

		let dnsMain = {
			invalid: false,
			errMsg : ''
		};

		let dnsSub = {
			invalid: false,
			errMsg : ''
		};

		let updateData = {};

		if(invalidDOMs.length > 0) {
			
			invalidDOMs.forEach(el => {
				if(!invalidNames.includes(el.dataset.name)) {
					invalidNames.push(el.dataset.name);
				}
			});

			invalidNames.forEach(name => {
				updateData[name] = {
					invalid : true,
					errMsg : t('msg_incorrect_input')
				};
			});

			this.setState(updateData);

			return false;
		}

		if(currentNic.dhcp === 'static_ip') {

			netWorkStatus.forEach(nic => {
				if(nic.id !== currentNic.id) {
					if(nic.ip === ipArr.join('.')) {
						isFormInVaild = false;
						ip.invalid = true;
						ip.errMsg = 'MSG_ This IP is used by the other port';
					}
				}
			});

			const maskBinary = maskArr.map(val => {
				let result = (Number(val)).toString(2);
				while(result.length < 8) {
					result = "0" + result;
				}
				return result;
			}).join('');

			if(!maskBinary.match(/^1(1*)(0*)$/)) {
				isFormInVaild = false;
				mask.invalid = true;
				mask.errMsg = t('msg_incorrect_input');
			}

			if(gatewayArr.join('.') === ipArr.join('.')) {
				ip.invalid = true;
				ip.errMsg = t('msg_incorrect_input');
				gateway.invalid = true;
				gateway.errMsg = t('msg_incorrect_input'); 
				isFormInVaild = false;
			}

			if(!mask.invalid) {
				
				maskArr.forEach((val, i) => {
					let ipVal = Number(ipArr[i]);
					let maskVal = Number(val);
					let gwVal = Number(gatewayArr[i]);

					if( (maskVal & ipVal) !== (maskVal & gwVal)  ){
						ip.invalid = true;
						ip.errMsg = t('msg_incorrect_input');
						gateway.invalid = true;
						gateway.errMsg = t('msg_incorrect_input');
						isFormInVaild = false;
					}
					
				});
			}
		}


		if(isFormInVaild){

			if(currentNic.dhcp === 'static_ip') {

				const {ipArr, maskArr, gatewayArr} = this.state;
				const tableDOM = <React.Fragment>
					<p>{t('msg_ip_addr_change_info')}</p>
					<table className="table table-bordered table-striped-common">
						<thead className="thead-blue">
							<tr>
								<th>{t('msg_network_setting')}</th>
								<th>{t('msg_manually_set_ip')}</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{t('msg_ip_addr')}</td>
								<td>{ipArr.join('.')}</td>
							</tr>
							<tr>
								<td>{t('msg_subnet_mask')}</td>
								<td>{maskArr.join('.')}</td>
							</tr>
							<tr>
								<td>{t('msg_default_gateway')}</td>
								<td>{gatewayArr.join('.')}</td>
							</tr>
						</tbody>
					</table>
				</React.Fragment>;

				this.setState({
					dialogObj : {
						title : t('msg_network_setting'),
						type : 'confirm',
						icon : 'info',
						mainMsg : t('msg_ip_addr_change'),
						msg : tableDOM,
						ok : () =>{
							//set 
							SET_NETWORK_CONFIG.fetchData({
								nic : {
									id : currentNic.id,
									dhcp : currentNic.dhcp,
									dns: [dnsMainArr.join('.'), dnsSubArr.join('.')],
									gateway: gatewayArr.join('.'),
									ip: ipArr.join('.'),
									mask: maskArr.join('.')
								}
							},'PATCH').then(data => {
								if(data.result === 0) {

									this.setState({
										isDialogShow : false,
										isLoaderShow : true
									});
									
									setTimeout(function(){
										window.location = 'http://'+ ipArr.join('.') +'/';
									},3000);
								}else{
									this.setState({
										alertColor : 'danger',
										alertMsg : <React.Fragment><h4 className="alert-heading">{t('msg_failed')}</h4><p>Error code : {data.result}</p></React.Fragment>
									}, () => {
										setTimeout(()=>{							
											this.setState({
												alertMsg : ''
											});
										}, MSG_FAILED_SECONDS);
										

									});
								}
							});
						}
					},
					isDialogShow : true,
					ip,
					mask,
					gateway,
					dnsMain,
					dnsSub
				});

			}else{

				SET_NETWORK_CONFIG.fetchData({
					nic : {
						id : currentNic.id,
						dhcp : currentNic.dhcp
					}
				},'PATCH').then(data => {
					if(data.result === 0) {
						//update network
						GET_NETWORK_CONFIG.fetchData().then(data => {
							if(data.result === 0) {
								this.setState({
									netWorkStatus : data['nic']
								});
							}
						});

						this.setState({
							alertColor : 'info',
							alertMsg : <h4>{t('msg_success')}</h4> 
						}, () => {
							setTimeout(()=>{							
								this.setState({
									alertMsg : ''
								});
							}, MSG_SUCCESS_SECONDS);
						});

					}else{
						this.setState({
							alertColor : 'danger',
							alertMsg : <React.Fragment><h4 className="alert-heading">{t('msg_failed')}</h4><p>Error code : {data.result}</p></React.Fragment>
						}, () => {
							setTimeout(()=>{							
								this.setState({
									alertMsg : ''
								});
							}, MSG_FAILED_SECONDS);
						});
					}
				});
			}

		}else{
			
			this.setState({
				ip,
				mask,
				gateway,
				dnsMain,
				dnsSub
			}, () => {
				console.log(this.state);
			});
		}
	}
	onChangeNicID(e) {
		const { ipArr, maskArr, gatewayArr, dnsMainArr, dnsSubArr } = this.state; 
		const currentNic = this.state.netWorkStatus.find(nic => nic.id === e.target.value);
		let ip,mask,gateway,dnsMain,dnsSub;

		ip = mask = gateway = dnsMain = dnsSub = {
			invalid: false,
			errMsg : ''
		};




		this.setState({
			currentNic,
			ipArr : Object.assign(ipArr, currentNic.ip.split('.')),
			maskArr : Object.assign(maskArr, currentNic.mask.split('.')),
			gatewayArr : Object.assign(gatewayArr, currentNic.gateway.split('.')),
			dnsMainArr : Object.assign(dnsMainArr, (currentNic.dns[0] || '...').split('.')),
			dnsSubArr : Object.assign(dnsSubArr, (currentNic.dns[1] || '...').split('.')),
			ip,
			mask,
			gateway,
			dnsMain,
			dnsSub
		});


	}
	getNextInput(el) {
		if(!el.nextElementSibling || !el.nextElementSibling.nextElementSibling) {
			return null;
		}else{
			return el.nextElementSibling.nextElementSibling;
		}
	}
	onKeydown(e) {
		if(e.keyCode === 110 || e.keyCode === 190) {
			const nextInputDOM = this.getNextInput(e.target);

			if(nextInputDOM) {
				nextInputDOM.focus();
			}

		}
	}
	onFocusInput(e) {
		const name = e.currentTarget.dataset['name'];
		const elIndex = Number(e.target.dataset['index']);
		let newArr = [...this.state[name + 'Arr']];
		newArr[elIndex] = '';

		this.setState({
			[name + 'Arr'] : newArr
		});
	}
	onChangeInput(e) {
		const nextInputDOM = this.getNextInput(e.target);
		let value = Number(e.target.value);
		const min = Number(e.target.min);
		const max = Number(e.target.max);
		const name = e.target.dataset['name'] || e.currentTarget.dataset['name'];
		const elIndex = Number(e.target.dataset['index']);
		const maxLength = Number(e.target.maxLength);
		const valLength = e.target.value.length;

		if(!!value) {
			if(value > max) {
				value = Number(max);
			}

			if(value < min) {
				value = Number(min);
			}

			let newArr = [...this.state[name + 'Arr']];

			newArr[elIndex] = value;
			this.setState({
				[name + 'Arr'] : newArr
			}, ()=>{
				console.log(this.state);
				if(valLength >= maxLength) {
					if(nextInputDOM) {
						nextInputDOM.focus();
					}
				}
			});

		}
	
	}
	
	render() {
		const { t } = this.props;
		const { netWorkStatus, currentNic, ipArr, maskArr, gatewayArr, dnsMainArr, dnsSubArr, ip, mask, gateway, dnsMain, dnsSub, isLoaderShow, alertMsg, alertColor } = this.state;

		let ipCss = 'ip_control w-50' + (ip.invalid ? ' is-invalid' : '');
		let maskCss = 'ip_control w-50' + (mask.invalid ? ' is-invalid' : '');
		let gatewayCss = 'ip_control w-50' + (gateway.invalid ? ' is-invalid' : '');

		let dnsMainCss = 'ip_control w-50' + (dnsMain.invalid ? ' is-invalid' : '');
		let dnsDubCss = 'ip_control w-50' + (dnsSub.invalid ? ' is-invalid' : '');


		if(!currentNic) {
			return null;
		}

		if(!!currentNic.dhcp.match('auto_ip')) {
			ipCss += ' disabled';
			maskCss += ' disabled';
			gatewayCss += ' disabled';
		}
			

		if(currentNic.dhcp === 'auto_ip_dns') {
			dnsMainCss +=  ' disabled';
			dnsDubCss +=  ' disabled';
		}



		return (
			<fieldset>
				<div className="row mt-3">
					<div className="col-auto ml-3">{t('msg_network_interface')}</div>
					<div className="col-lg-7 col-md-8 my-was-validated" ref={this.formDOM}>
						<div className="form-group">
							<select className="form-control w-60" value={currentNic.id} onChange={this.onChangeNicID}>
								{
									netWorkStatus.map(nic => <option key={nic.id} value={nic.id}>{nic.name}</option>)
								}
							</select>
						</div>
						<div className="form-group form-check">
							<input className="form-check-input" type="radio" value="1" name="dhcp" id="enable_dhcp" onChange={this.onChangeCheck} checked={!!currentNic.dhcp.match('auto_ip')} ref={this.checkedDOMs[0]}/>
							<label className="form-check-label" htmlFor="enable_dhcp">{t('msg_auto_set_ip')}</label>
						</div>
						<div className="form-group form-check">
							<input className="form-check-input" type="radio" value="0" name="dhcp" id="disable_dhcp" onChange={this.onChangeCheck} checked={currentNic.dhcp === 'static_ip'} ref={this.checkedDOMs[1]}/>
							<label className="form-check-label" htmlFor="disable_dhcp">{t('msg_manually_set_ip')}</label>
						</div>
						<div className="form-group ml-3">
							<div className="m-2 d-flex align-items-center">
								<div className="w-45">{t('msg_ip_addr')}</div>
								<div className={ipCss} tabIndex="1" data-name="ip" onFocus={this.onFocusInput} onKeyDown={this.onKeydown}>
								{
									ipArr.map((val,i) =>{
										const min = (i === 0 ? 1 : 0);
										const max = (i === 0 ? 223 : 255);
										const pattern = (currentNic.dhcp === 'static_ip' ? (i === 0 ? '[^1]*[^2]*[^7]*' : '') : '');
										
										return (
											<React.Fragment key={i}>
												{
													pattern ? <input data-index={i} data-name="ip" type="text" maxLength="3" min={min} max={max} value={val} required={currentNic.dhcp === 'static_ip'} pattern={pattern} onChange={this.onChangeInput}/>
													: <input data-index={i} data-name="ip" type="text" maxLength="3" min={min} max={max} value={val} required={currentNic.dhcp === 'static_ip'} onChange={this.onChangeInput}/>
												}
												
												{ i < (ipArr.length - 1) ? <span className="mx-1">.</span> : null }
											</React.Fragment>);
									})
								}
								</div>
							</div>
							<div className="mx-2 d-flex align-items-center"><div className="w-45"></div><small className="text-danger">{ip.errMsg}</small></div>
							<div className="m-2 d-flex align-items-center">
								<div className="w-45">
									{t('msg_subnet_mask')}
								</div>
								<div className={maskCss} tabIndex="1" data-name="mask" onFocus={this.onFocusInput} onKeyDown={this.onKeydown}>
									{
										maskArr.map((val,i) =>{
											return (
												<React.Fragment key={i}>
													<input data-index={i} data-name="mask" type="text" maxLength="3" min="0" max="255" value={val} required={currentNic.dhcp === 'static_ip'} onChange={this.onChangeInput}/>
													{ i < (maskArr.length - 1) ? <span className="mx-1">.</span> : null }
												</React.Fragment>);
										})
									}
								</div>
							</div>
							<div className="mx-2 d-flex align-items-center"><div className="w-45"></div><small className="text-danger">{mask.errMsg}</small></div>
							<div className="m-2 d-flex align-items-center">
								<div className="w-45">
									{t('msg_default_gateway')}
								</div>
								<div className={gatewayCss} tabIndex="1" data-name="gateway" onFocus={this.onFocusInput} onKeyDown={this.onKeydown}>
									{
										gatewayArr.map((val,i) =>{
											const min = (i === 0 ? 1 : 0);
											const max = (i === 0 ? 223 : 255);
											const pattern = (currentNic.dhcp === 'static_ip' ? (i === 0 ? '[^1]*[^2]*[^7]*' : '') : '');
											return (
												<React.Fragment key={i}>
													{
														pattern ? <input data-index={i} data-name="gateway" type="text" maxLength="3" min={min} max={max} value={val} required={currentNic.dhcp === 'static_ip'} pattern={pattern} onChange={this.onChangeInput}/> : 
														<input data-index={i} data-name="gateway" type="text" maxLength="3" min={min} max={max} value={val} required={currentNic.dhcp === 'static_ip'} onChange={this.onChangeInput}/>
													}
													{ i < (gatewayArr.length - 1) ? <span className="mx-1">.</span> : null }
												</React.Fragment>);
										})
									}
								</div>
							</div>
							<div className="mx-2 d-flex align-items-center"><div className="w-45"></div><small className="text-danger">{gateway.errMsg}</small></div>
						</div>
						<div className="form-group form-check">
							<input className="form-check-input" type="radio" value="1" name="dns_setting" id="auto_set_dns" onChange={this.onChangeCheck} checked={currentNic.dhcp === 'auto_ip_dns'} disabled={currentNic.dhcp === 'static_ip'} ref={this.checkedDOMs[2]}/>
							<label className="form-check-label" htmlFor="auto_set_dns">{t('msg_auto_set_dns')}</label>
						</div>
						<div className="form-group form-check">
							<input className="form-check-input" type="radio" value="2" name="dns_setting" id="manually_set_dns" onChange={this.onChangeCheck} checked={currentNic.dhcp === 'static_ip' || currentNic.dhcp === 'auto_ip'}  ref={this.checkedDOMs[3]}/>
							<label className="form-check-label" htmlFor="manually_set_dns">{t('msg_manually_set_dns')}</label>
						</div>
						<div className="form-group ml-3">
							<div className="m-2 d-flex align-items-center">
								<div className="w-45">{t('msg_primary_dns_server')}</div>
								<div className={dnsMainCss} data-name="dnsMain" tabIndex="1" onFocus={this.onFocusInput} onKeyDown={this.onKeydown}>
									{
										dnsMainArr.map((val,i) =>{
											const min = (i === 0 ? 1 : 0);
											const max = (i === 0 ? 223 : 255);
											return (
												<React.Fragment key={i}>
													<input data-index={i} data-name="dnsMain" type="text" maxLength="3" min={min} max={max} value={val} required={(currentNic.dhcp === 'static_ip' || currentNic.dhcp === 'auto_ip')} onChange={this.onChangeInput}/>
													{ i < (dnsMainArr.length - 1) ? <span className="mx-1">.</span> : null }
												</React.Fragment>);
										})
									}
								</div>
							</div>
							<div className="mx-2 d-flex align-items-center"><div className="w-45"></div><small className="text-danger">{dnsMain.errMsg}</small></div>
							<div className="m-2 d-flex align-items-center">
								<div className="w-45">{t('msg_secondary_dns_server')}</div>
								<div className={dnsDubCss} data-name="dnsSub" tabIndex="1" onFocus={this.onFocusInput} onKeyDown={this.onKeydown}>
									{
										dnsSubArr.map((val,i) =>{
											const min = (i === 0 ? 1 : 0);
											const max = (i === 0 ? 223 : 255);
											return (
												<React.Fragment key={i}>
													<input data-index={i} data-name="dnsSub" type="text" maxLength="3" min={min} max={max} value={val} required={(currentNic.dhcp === 'static_ip' || currentNic.dhcp === 'auto_ip')} onChange={this.onChangeInput}/>
													{ i < (dnsSubArr.length - 1) ? <span className="mx-1">.</span> : null }
												</React.Fragment>);
										})
									}
								</div>
							</div>
							<div className="mx-2 d-flex align-items-center"><div className="w-45"></div><small className="text-danger">{dnsSub.errMsg}</small></div>

						</div>
					</div>
					
				</div>
				<div className="row">
					<div className="col offset-3 mt-3">
						<Btn size="sm" type="submit" onClick={this.submitForm} className="float-right mr-4">{t("msg_ok")}</Btn>
					</div>
					<Dialog isShow={this.state.isDialogShow} toggle={()=>{this.setState({isDialogShow: !this.state.isDialogShow })}} { ...this.state.dialogObj }></Dialog>
					<Loader isOpen={isLoaderShow}></Loader>
					<Alert isOpen={!!alertMsg} className="fixed-top text-center m-5" color={alertColor}>{alertMsg}</Alert>
				</div>
			</fieldset>
		);
	}
}

export default translate("translation")(AdminNetwork);
