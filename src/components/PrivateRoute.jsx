import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
	const loggedIn = rest.authentication.loggedIn;

	return (
		<Route {...rest}
			render={props => {
				return loggedIn ? (
					<Component {...props} />
					) : (
							<Redirect
								to={{
									pathname: "/login",
									state: { from: props.location }
								}}
							/>
						);
				}
				
			}
		/>
	);
};

export default PrivateRoute;