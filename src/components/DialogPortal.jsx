import * as React from 'react';
import { createPortal } from 'react-dom';
import { translate } from "react-i18next";
import { isFunction, randomID } from "../helper/helper";
import Btn from './Btn';
//https://zhuanlan.zhihu.com/p/29880992
//https://reactjs.org/docs/portals.html

/*
type: <String> 'alert','custom','confirm'
icon: <String> 'error','confirm','info', 'warning'
title: <String>
mainMsg: <String>
msg: <String>
ok: <Function>
cancel: <Function>
okLabel: <String> default -> t('msg_ok')
cancelLabel: <String> default -> t('msg_cancel')
*/

class Dialog extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.reminderBodyDOM = this.reminderBodyDOM.bind(this);
		this.reminderFooterDOM = this.reminderFooterDOM.bind(this);
		this.closeDialog = this.closeDialog.bind(this);
		this.btnAction = this.btnAction.bind(this);

		const doc = window.document;

		this.node = doc.createElement('div');
		doc.body.appendChild(this.node);
		// document.getElementById('root').appendChild(this.node);

		this.dialogID = 'dia_' + randomID();

	}
	componentDidMount() {
		//body append class modal-open
		// 
	}
	componentWillUnmount() {

		if(window.document.body.querySelector(`#${this.dialogID}`)) {
			window.document.body.removeChild(this.node);
		}
	}
	reminderBodyDOM(icon) {
		let classTypes = {
			'error'   : 'icon_dialogboxe_4',
			'confirm' : 'icon_dialogboxe_3',
			'info'    : 'icon_dialogboxe_2',
			'warning' : 'icon_dialogboxe'
		};
		let classStr = classTypes[icon];
		return (
			<div className="media">
				{ classStr ? <i className={'align-self-center d-block d-flex mr-3 ' + classStr }></i> : null }
				<div className="media-body">
					<h5 className="mt-0">{this.props.mainMsg}</h5>
					{this.props.msg}
				</div>
			</div>
		);
	}
	reminderFooterDOM() {
		const { t, okLabel, cancelLabel, ok, cancel, type } = this.props;
		const _okLabel = okLabel || t('msg_ok');
		const _cancelLabel = cancelLabel || t('msg_cancel');
		const onOk = this.btnAction(ok);
		const onCancel = this.btnAction(cancel);

		if(type === 'alert') {
			return (<Btn size="sm" onClick={onOk} className="float-right mt-1">{_okLabel}</Btn>);
		}else{
			return (
				<React.Fragment>
					<Btn size="sm" onClick={onOk} className="float-right mt-1">{_okLabel}</Btn>
					<Btn size="sm" onClick={onCancel} className="float-right mt-1">{_cancelLabel}</Btn>
				</React.Fragment>
			);
		}
	}

	closeDialog() {
		window.document.body.removeChild(this.node);
	}

	btnAction(action) {
		return e => {
			if(isFunction(action)) {
				action(this.closeDialog);
			}else{
				this.closeDialog();
			}
		};
	}

	render() {
		const { t, children } = this.props;
		const onCancel = this.btnAction(this.props.cancel);
		let bodyDOM = this.reminderBodyDOM(this.props.icon);
		let footerDOM = this.reminderFooterDOM();
		let maxZindex = 1051;
		let existZindex = 0;
		document.querySelectorAll('div.modal').forEach(el => {
			if(this.node.querySelector(`#${this.dialogID}`) !== el) {
				existZindex = Number(window.getComputedStyle(el, null).getPropertyValue('z-index'));
				if(existZindex >= maxZindex) {
					maxZindex = existZindex + 2;
				}
			}
			
		});

		if(!!children) {

			if(children.length > 0) {

				children.forEach((child, i) => {
					if(isFunction(child)) {
						bodyDOM = child('body') || bodyDOM;
						footerDOM = child('footer') || footerDOM;
					}else{
						if(child.key === 'body') {
							bodyDOM = child;
						}else{
							footerDOM = child;
						}

					}
				});

			}else{
				if(isFunction(children)) {
					bodyDOM = children('body') || bodyDOM;
					footerDOM = children('footer') || footerDOM;
				}else{
					if(children.key === 'body') {
						bodyDOM = children;
					}else{
						footerDOM = children;
					}
				}

			}
		}



		return createPortal(
			<React.Fragment>
				<div id={this.dialogID} className="modal fade show d-block" style={{zIndex: maxZindex}}>
					<div className="modal-dialog modal-dialog-centered w-75">
						
						<div className="modal-content" >
							<div className="modal-header">
								<h6 className="modal-title">{this.props.title}</h6>
								<button type="button" className="close" aria-label="Close"><span aria-hidden="true" onClick={onCancel}>&times;</span></button>
							</div>
							<div className="modal-body">
								{ bodyDOM }
							</div>
							<div className="modal-footer">
								{ footerDOM }
							</div>
						</div>
					</div>
					
				</div>
				<div className="modal-backdrop fade show" style={{zIndex: maxZindex - 1}}></div>
			</React.Fragment>, this.node
		);
	}
}



export default translate("translation")(Dialog);

