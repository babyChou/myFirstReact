import './styles/index.css';

// import 'core-js/es6/map';
// import 'core-js/es6/set';
//https://github.com/facebook/create-react-app/issues/3772
//https://reactjs.org/docs/javascript-environment-requirements.html
//https://stackoverflow.com/questions/43756211/best-way-to-polyfill-es6-features-in-react-app-that-uses-create-react-app

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import App from './components/App';
import ErrorPage from './components/ErrorPage';
import i18n from './i18n';
import store from './store/Store';

import { GET_CONFIG } from './helper/Services';


ReactDOM.render(
<Provider store={store}>
    <ErrorPage />
</Provider>, document.getElementById("error")
);


GET_CONFIG.fetchData().then(data => {
	if(data.result === 0) {
		i18n.changeLanguage(data.config.language);

		ReactDOM.render(
			<Provider store={store}>
		        <I18nextProvider i18n={i18n}>
		            <App />
		        </I18nextProvider>
		    </Provider>, document.getElementById("root")
		);

	}
});

		