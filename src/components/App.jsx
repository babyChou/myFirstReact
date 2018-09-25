import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import { Router, Route } from 'react-router-dom';
// import { createBrowserHistory } from 'history';

import { LOGIN } from '../helper/Services';

import PrivateRoute from './PrivateRoute';
import BroadcastList from './BroadcastList';
import Configuration from './Configuration';
import Login from './Login';

// const history = createBrowserHistory();

const mapStateToProps = store => (
	{ 
		authentication: store.authentication,
		isError: store.rootReducer.isError
	}
);

class App extends React.Component {
	constructor(props) {
		super(props);

	}

	componentDidMount() {
		const loggedIn = this.props.authentication.loggedIn;

		if(loggedIn) {
			LOGIN.updateSession(this.props.authentication.session);
		}

	}

    render() {
    	const { authentication } = this.props;

	//<Router history={history}>
        return (<Router>
					<Switch>
						<Route path="/login" component={Login} />
						<PrivateRoute exact={true} path="/" component={BroadcastList} authentication={authentication}/>
						<PrivateRoute path="/Configuration" component={Configuration} authentication={authentication}/>
						<Redirect from="*" to={"/Configuration"} />
					</Switch>
				</Router>) ;
    }
}

export default connect(mapStateToProps, null)(App);