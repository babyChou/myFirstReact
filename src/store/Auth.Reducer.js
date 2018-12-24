import {
    USER,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT
} from '../constant/User.Consts';
import { getCookie } from '../helper/helper';


// let user = window.name || JSON.parse(window.localStorage.getItem(btoa(USER)));
let user = window.name || getCookie(btoa(USER));

const initialState = user ? {
    loggedIn: true,
    session: user
} : {};
// const initialState = { loggedIn: true, user };


export function authentication(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                loggedIn: true,
                session: action.session
            };
        case LOGIN_FAILURE:
            return {};
        case LOGOUT:
            return {};
        default:
            return state
    }
}