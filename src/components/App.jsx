import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import { Router, Route } from 'react-router-dom';
// import { createBrowserHistory } from 'history';

import { GET_CONFIG, GET_DEVICE_FACILITIES, LOGIN } from '../helper/Services';
import i18n from "../i18n";

import PrivateRoute from './PrivateRoute';
import BroadcastList from './BroadcastList';
import Configuration from './Configuration';
import Login from './Login';
import ErrorPage from './ErrorPage';

// const history = createBrowserHistory();

const mapStateToProps = store => (
	{ 
		authentication: store.authentication
	}
);

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			isConfigSet : false,
			backdropShow: false
		};

	}

	componentDidMount() {
		const loggedIn = this.props.authentication.loggedIn;


		if(loggedIn) {
			LOGIN.updateSession(this.props.authentication.session);
		}

		GET_CONFIG.fetchData().then(data => {
			if(data.result === 0) {
				i18n.changeLanguage(data.config.language);

				this.setState({ isConfigSet : true });
				
			}
		});
		

	}

    render() {
		
        return this.state.isConfigSet ?
			//<Router history={history}>
			(<Router>
				<Switch>
					<Route path="/login" component={Login} />
					<Route path="/error/:errorApi" component={ErrorPage} />
					{/* <PrivateRoute exact={true} path="/" component={BroadcastList} authentication={this.props.authentication} /> */}
					<PrivateRoute path="/Configuration" component={Configuration} authentication={this.props.authentication} />
					<Redirect from="*" to={"/Configuration"} />
				</Switch>
			</Router>) : null;
    }
}

export default connect(mapStateToProps, null)(App);