/*
Action is a function combine a "type" and a data you want to save

 */
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT  } from '../constant/User.Consts';

export const userActions = {
    login,
    loginFailure,
    logout
};

function login(session) {
    return { type: LOGIN_SUCCESS, session };
}

function loginFailure(errorCode) {
    return { type: LOGIN_FAILURE, errorCode  };
}

function logout() {
    return { type: LOGOUT };
}