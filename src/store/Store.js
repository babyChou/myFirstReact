import { createStore, combineReducers } from 'redux';
import rootReducer from './Root.Reducer';
import configReducer from './Config.Reducer';
import { authentication } from './Auth.Reducer';
import profiles from './Profile.Reducer';

export default createStore(
    combineReducers({
        rootReducer,
        configReducer,
        authentication,
        profiles
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);