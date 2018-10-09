import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import { Router, Route } from 'react-router-dom';
// import { createBrowserHistory } from 'history';

import { LOGIN } from '../helper/Services';

import PrivateRoute from './PrivateRoute';
import BroadcastList from './BroadcastList';
import Configuration from './Configuration';
import Pip from './Pip';
import Login from './Login';

// const history = createBrowserHistory();

const mapStateToProps = store => (
	{ 
		authentication: store.authentication,
		isError: store.rootReducer.isError
	}
);

class App extends React.Component {

	componentDidMount() {}

    render() {
    	const { authentication } = this.props;
    	const loggedIn = this.props.authentication.loggedIn;

    	if(loggedIn || !LOGIN.checkSession()) {
			LOGIN.updateSession(this.props.authentication.session);
		}

	//<Router history={history}>
        return (<Router>
					<Switch>
						<Route path="/login" component={Login} />
						<PrivateRoute exact={true} path="/" component={BroadcastList} authentication={authentication}/>
						<PrivateRoute path="/configuration" component={Configuration} authentication={authentication}/>
						<PrivateRoute path="/pip" component={Pip} authentication={authentication}/>
						<Redirect from="*" to={"/configuration"} />
					</Switch>
				</Router>) ;
    }
}

export default connect(mapStateToProps, null)(App);