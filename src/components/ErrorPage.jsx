import * as React from 'react';
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { compose } from "redux";
import Btn from './Btn';


const mapStateToProps = store => ({
	errorStack: store.rootReducer.errorStack,
	isError: store.rootReducer.isError
});

class ErrorPage extends React.Component {
	constructor(props, context) {
		super(props, context);

		if(props.errorStack.length === 0 || !props.isError) {
			// window.location.replace('/');
			//btn on -> displayError
		}
	}

	
	
	render() {
		const { t , isError, errorStack } = this.props;
		const errInfo = errorStack[errorStack.length - 1];


		return (
			isError ? 
			<div id="flexContainer" >
				<div className="modal-content" style={{width:'450px', height: '250px'}}>
					<div className="modal-header">
						<h6 className="modal-title">{t('msg_an_error_occurred')}</h6>
					</div>
					<div className="modal-body">
						<div className="media">
							<i className="align-self-center d-block d-flex icon_dialogboxe_4 mr-5"></i>
							<div className="media-body">
								<h5 className="mt-0">{t('msg_server_connection_failed')}</h5>
								<p>Type : { errInfo.type ? errInfo.type : null }</p>
								<p>Url: { errInfo.url ? errInfo.url : null }</p>
								<p>body: { errInfo.body ? errInfo.body : null }</p>
							</div>
						</div>
				
						
					</div>
					<div className="modal-footer">
						<Btn size="sm" onClick={()=> { window.location.replace('/') }} className="float-right mt-1">{t("msg_ok")}</Btn>
					</div>
				</div>
			</div> : null
		);
	}
}



export default compose(
	translate("translation"),
	connect(mapStateToProps)
)(ErrorPage);


