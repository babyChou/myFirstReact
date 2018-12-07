import Btn from './Btn';

import * as React from 'react';
import { translate } from "react-i18next";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose, bindActionCreators  } from 'redux';
import { userActions } from '../action/User.Actions';
import { Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { userConsts } from '../constant/User.Consts';
import { LOGIN } from '../helper/Services';
import { setCookie, deleteCookie } from '../helper/helper';


class Login extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			userInputErr: false,
			pwInputErr: false,
			authErr: false,
			errorMessage: '',
			errorResponse: ''
		};

		this.userInput = React.createRef();
		this.pwInput = React.createRef();
		this.rememberInput = React.createRef();
		this.submitForm = this.submitForm.bind(this);
		this.checkInput = this.checkInput.bind(this);

	}

	submitForm(e) {
		e.preventDefault();

		const { history, actions, t } = this.props;
		let formValid = true;

		this.setState({errorMessage : '', errorResponse : ''});

		if(this.userInput.current.value === '') {
			this.setState({
				errorMessage : t('msg_required'),
				userInputErr : true,
			});
			formValid = false;
		}
		if(this.pwInput.current.value === '') {
			this.setState({
				errorMessage : t('msg_required'),
				pwInputErr : true,
			});
			formValid = false;
		}
		
		if(formValid) {
			LOGIN.fetchData({
				username: this.userInput.current.value,
				password: this.pwInput.current.value
			})
			.then(data => {

				if(data.result === 0) {
					let user = btoa(userConsts.USER);
					actions.login(data.session);
					LOGIN.updateSession(data.session);
					window.name = data.session;

					if(this.rememberInput.current.checked) {
						// window.localStorage.setItem(user, data.session);
						setCookie( user, data.session, 7, '/');
					}else{
						// window.localStorage.removeItem(user);
						deleteCookie(user);
					}
					history.push('/');
				}else{
					actions.loginFailure(data.result);
					this.setState({
						errorResponse : t('msg_login_error'),
						authErr: true
					});
				}
			});
			
		} 

		return false;
	}

	checkInput(e) {
		if(e.target === this.userInput.current) {
			this.setState({userInputErr : false});
		}
		if(e.target === this.pwInput.current) {
			this.setState({pwInputErr : false});
		}
	}

	componentDidUpdate() {

		if(this.state.errorMessage !== '' && !this.state.userInputErr && !this.state.pwInputErr) {
			this.setState({errorMessage : ''});
		}
	}
	componentDidMount() {
		if(this.props.authentication.loggedIn) {
			LOGIN.updateSession(this.props.authentication.session);
			this.props.history.push('/');
		}
		this.userInput.current.focus();
		this.userInput.current.onkeydown = this.checkInput;
		this.pwInput.current.onkeydown = this.checkInput;
	}
	
	render() {
		const { t } = this.props;

		return (
			<div id="flexContainer" >

				<Form id="login-form" className="bg_login" onSubmit={this.submitForm}>
					<FormGroup>
						<Label for="login_username">{t("msg_login_username")}</Label>
						<Input invalid={this.state.userInputErr} type="text" name="username" id="login_username"  bsSize="sm" innerRef={this.userInput} />

						<Label for="login_password" className="mt-2">{t("msg_login_password")}</Label>
						<Input invalid={this.state.pwInputErr} type="password" name="password" id="login_password" bsSize="sm" innerRef={this.pwInput}/>
						<FormFeedback>{this.state.errorMessage}</FormFeedback>
						<div className={"invalid-feedback" + (this.state.authErr ? ' d-block' : '') }>{this.state.errorResponse}</div>
					</FormGroup>
					<FormGroup check>
						<Label check>
							<Input type="checkbox" innerRef={this.rememberInput}/>
							{' ' + t("msg_keep_login")}
						</Label>
						<Btn size="sm" type="submit" onClick={this.submitForm} className="float-right mt-1">{t("msg_login")}</Btn>
					</FormGroup>
				</Form>
			
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return { authentication : state.authentication };
}

const mapDispatchToProps = (dispatch) => {
    // return {
    //     login: (username) => dispatch(userActions.login(username)),
    //     loginFailure: (username , error) => dispatch(userActions.loginFailure(username , error))
	// };
	return { actions: bindActionCreators(userActions, dispatch) };
};



// export default translate("translation")(Login);

export default compose(
	withRouter,
	translate('translation'),
	connect(mapStateToProps, mapDispatchToProps)
)(Login);

