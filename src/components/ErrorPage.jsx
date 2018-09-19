import * as React from 'react';
import { translate } from "react-i18next";



class ErrorPage extends React.Component {
	constructor(props, context) {
		super(props, context);

		console.log();
	}

	
	
	render() {
		const { t } = this.props;

		return (
			<div id="flexContainer" >
				<div className="modal-content" style={{width:'450px', height: '250px'}}>
					<div className="modal-header">
						<h6 className="modal-title">{t('msg_prompt')}</h6>
					</div>
					<div className="modal-body">
						<span class="oi oi-warning" style={{width:'50px', height: '50px'}}></span>
						{t('msg_an_error_occurred')}
						{'API :' + this.props.match.params.errorApi}
						{t('msg_server_connection_failed')}
				
						
					</div>
					<div className="modal-footer"></div>
				</div>
				
			</div>
		);
	}
}



export default translate("translation")(ErrorPage);

