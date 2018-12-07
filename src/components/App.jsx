import * as React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import { Router, Route } from 'react-router-dom';
// import { createBrowserHistory } from 'history';

import { LOGIN } from '../helper/Services';

import PrivateRoute from './PrivateRoute';
import BroadcastList from './BroadcastList';
import Configuration from './Configuration';
import EncodingProfile from './EncodingProfile';
import Pip from './Pip';
import Admin from './Admin';
import Login from './Login';
import Token from './Token';

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
						<Route path="/retrieveToken" component={Token} />
						<PrivateRoute exact={true} path="/" component={BroadcastList} authentication={authentication}/>
						<PrivateRoute path="/configuration" component={Configuration} authentication={authentication}/>
						<PrivateRoute path="/pip" component={Pip} authentication={authentication}/>
						<PrivateRoute path="/administration" component={Admin} authentication={authentication}/>
						<PrivateRoute path="/encoding_profile" component={EncodingProfile} authentication={authentication}/>
						<PrivateRoute path="/log_management" component={EncodingProfile} authentication={authentication}/>
						<PrivateRoute path="/filebrowser" component={EncodingProfile} authentication={authentication}/>
						<Redirect from="*" to={"/configuration"} />
					</Switch>
				</Router>) ;
    }
}

export default connect(mapStateToProps, null)(App);