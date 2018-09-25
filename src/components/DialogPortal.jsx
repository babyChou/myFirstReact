import * as React from 'react';
import { createPortal } from 'react-dom';
import { translate } from "react-i18next";
import { isFunction } from "../helper/helper";
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

		this.reminderDOM = this.reminderDOM.bind(this);
		this.btnAction = this.btnAction.bind(this);

		const doc = window.document;
		this.node = doc.createElement('div');
		doc.body.appendChild(this.node);
	}
	componentDidMount() {
		//body append class modal-open
	}
	reminderDOM(icon) {
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

	btnAction(action) {
		return e => {
			if(isFunction(action)) {
				action();
			}
			this.props.toggle();
		};
	}

	render() {
		const { t } = this.props;
		const okLabel = this.props.okLabel || t('msg_ok');
		const cancelLabel = this.props.cancelLabel || t('msg_cancel');
		const onOk = this.btnAction(this.props.ok);
		const onCancel = this.btnAction(this.props.cancel);


		if(!this.props.isShow) {
			return null;
		}

		return createPortal(
			<React.Fragment>
				<div className="modal fade show d-block" >
					<div className="modal-dialog modal-dialog-centered">
						
						<div className="modal-content" >
							<div className="modal-header">
								<h6 className="modal-title">{this.props.title}</h6>
								<button type="button" className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
							</div>
							<div className="modal-body">
								{ this.props.type !== 'custom' ? this.reminderDOM(this.props.icon) : null }
								{ this.props.children }
							</div>
							<div className="modal-footer">
								<Btn size="sm" onClick={onOk} className="float-right mt-1">{okLabel}</Btn>
								{this.props.type !== 'alert' ? <Btn size="sm" onClick={onCancel} className="float-right mt-1">{cancelLabel}</Btn> : null}
								
							</div>
						</div>
					</div>
					
				</div>
				<div className="modal-backdrop fade show"></div>
				</React.Fragment>
		);
	}
}



export default translate("translation")(Dialog);

