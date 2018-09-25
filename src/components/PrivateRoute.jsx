import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { LOGIN } from '../helper/Services';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const loggedIn = rest.authentication.loggedIn && LOGIN.checkSession();

	return (
		<Route {...rest} render={props => {
					return loggedIn ? (<Component {...props} />) : (<Redirect to={{
						pathname: "/login",
						state: { from: props.location }
					}}/>);
				}
				
			}
		/>
	);
};

export default PrivateRoute;