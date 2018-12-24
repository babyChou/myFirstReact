import { arrayBufferToBase64, isObject, serializeParams } from './helper';
import { profileActions } from '../action/Profile.Actions';
import { configActions } from '../action/Config.Actions';
import { rootActions } from '../action/Root.Actions';
import store from '../store/Store';

import { USER } from '../constant/User.Consts';
import { deleteCookie } from '../helper/helper';

const rootDOM = document.getElementById('root');
const errorDOM = document.getElementById('error');

let hostname = './';
let SESSION = '';

if (process.env.NODE_ENV !== 'production') {
    hostname = 'http://localhost:9998/se5820/';
}

function updateSession(session) {
    SESSION = session;
}

function checkSession() {
    return SESSION;
}

/* function parseJSON(response) {
  return new Promise((resolve) => response.json()
    .then((json) => resolve({
      status: response.status,
      ok: response.ok,
      json,
    })));
} */

function fetchData(params, method, isStore) {
    const _method = method || this.method || 'POST';
    const headers = new Headers({'Content-Type' : 'application/json', 'Accept': 'application/json', 'Accept-Charset' : 'utf-8'});
    const storeFun = this.store;
    const storeType = this.storeType;
    let url = hostname + this.url;
    let reqParams = {
        mode: 'cors', //for test
        // credentials: 'include',
        cache: 'no-cache',
        method : _method,
        headers : headers
    };



    if(!this.url.match('login') && (!(this.url.match('configuration') && _method === 'GET'))) {
        if(!SESSION) {
            alert('SESSION empty. URL: ' + this.url);
        }
        reqParams.headers.append('Authorization', 'Bearer ' + SESSION);
    }


    if(isObject(params)) {
        if(_method === 'GET') {
            // url = new URL(url);
            //TODO: Edge not work
            //npm install url-search-params-polyfill --save
            // url.search = new URLSearchParams(params);

            // url += ('?' + serializeParams(params));
            url += `?_=${Date.now()}&${serializeParams(params)}`;
        }else{
            reqParams.body = JSON.stringify(params);
        }
    }


    // for (var p of headers) {
    //     console.log(p)
    // }

    /* return new Promise((resolve, reject) => {
        fetch(url, reqParams)
        .then(parseJSON)
        .then((response) => {
            if (response.ok) {

                if(isStore !== false && storeFun) {
                    if(storeType === 'LOAD') {
                        storeFun(response.json);    
                    }
                }

                return resolve(response.json);
            }
          return reject(response.json.meta.error);
        })
        .catch((error) => reject({
            networkError: error.message,
        }));
    }); */

    let errInfo = {
        type : 'NetworkError'
    };


    return fetch(url, reqParams).then(response => {//add time
        if (response.ok){
            return response.text();
        }
    }).then(responseBodyAsText => {
        try {
            const bodyAsJson = JSON.parse(responseBodyAsText);
            return bodyAsJson;
        } catch (e) {
            errInfo.type = 'Parse JSON Error';
            errInfo.text = responseBodyAsText;
            throw e;
        }
    })
    .then(json => {

        if(isStore !== false && storeFun) {
            if(storeType === 'LOAD') {
                storeFun(json);    
            }
        }

        if(json.hasOwnProperty('result')) {
            if(json.result !== 0) {
                console.warn(this.url, json);
                if(json.result % 256 === 102) {
                    window.name = '';
                    deleteCookie(btoa(USER));
                    window.location = '/login';
                }
            }
        }
        return json;
    })
    .catch(err => {
        
        store.dispatch(rootActions.stackError({
            url: this.url, body: errInfo.text || err.stack, type: errInfo.type
        }));

        rootDOM.removeChild(rootDOM.firstChild);
        errorDOM.classList.remove('d-none');

        throw err;
    });

}

function fetchFile(params) {
    // const url = new URL(hostname + this.url);
    let url = hostname + this.url;
    const method = this.method || 'GET';
    const headers = new Headers({'Authorization' : 'Bearer ' + SESSION, 'Content-Type' : 'image/jpeg', 'Accept-Charset' : 'utf-8'});

    // url.search = new URLSearchParams(params);
    params.t = Date.now();
    url += ('?' + serializeParams(params));

    return fetch(url, {
        method : method,
        headers : headers
    }).then(response=>{
        if (!response.ok) throw new Error(response.statusText);
        return response.arrayBuffer().then((buffer) => {
            const base64Flag = 'data:image/jpeg;base64,';
            const imageStr = arrayBufferToBase64(buffer);

            return base64Flag + imageStr;//src
            // return url;
    
        });

    })
    .catch(err =>{
        console.log(err);
        //Handle lose connection
        return 'data:image/gif;base64,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';
    });
}

function postFile(params) {

    const url = hostname + this.url;
    const method = 'POST';
    const headers = new Headers({'Authorization' : 'Bearer ' + SESSION, 'Accept-Charset' : 'utf-8'});
    let formData  = new FormData();

    for(let key in params) {
        formData.append(key, params[key]);
    }

    return fetch(url, {
        method : method,
        headers : headers,
        body: formData
    }).then(response=>{
         if (!response.ok){
            throw new Error({ url: this.url, body: response.statusText, type: 'responseNotOk', status: response.status });
        }else{
            return response.json();
        }

    })
    .catch(err=>{
        console.log(err);
        //Handle lose connection
    });
}



const LOGIN = {
    url: '/api/login',
    fetchData,
    updateSession,
    checkSession
};

const LOGOUT = {
    url: '/api/logout',
    method: 'POST',
    fetchData
};

const GET_CONFIG = {
    url: '/api/configuration',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(configActions.loadConfig({
                ...data.config,
                ...data.streamSetting,
                mastership : data.mastership
            }));
        }
    }
};

const SET_CONFIG = {
    url: '/api/configuration',
    fetchData
};

const SET_USER = {
    url: '/api/setUser',
    method: 'PATCH',
    fetchData
};

const GET_DEVICE_CONFIG = {
    url: '/api/deviceConfig',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(rootActions.loadSourceType(data.device.videoInput, data.device.id));
            store.dispatch(configActions.loadDeviceConfig(data.device));
        }
    }
};

const SET_DEVICE_CONFIG = {
    url: '/api/deviceConfig',
    method : 'PATCH',
    fetchData
};

const SOURCE_THUMBNAIL = {
    url: '/api/sourceThumbnail',
    storeType: 'LOAD',
    method: 'GET',
    fetchFile
};

const GET_DEVICE_FACILITIES = {
    url: '/api/deviceFacilities',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(configActions.loadFacilites(data.devices));
        }
    }
}

const GET_DEVICE_TASK = {
    url: '/api/deviceTask',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(configActions.loadDevicesTasks(data.devices));
        }
    }
};

const SET_DEVICE_TASK = {
    url: '/api/deviceTask',
    fetchData
};

const START_DEVICE_TASK = {
    url: '/api/startTask',
    fetchData
};

const STOP_DEVICE_TASK = {
    url: '/api/stopTask',
    fetchData
};


const DELETE_DEVICE_TASK = {
    url: '/api/deleteTask',
    method: 'DELETE',
    fetchData
};

const GET_TASKS_STATUS = {
    url: '/api/taskStatus',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(configActions.loadTasksStatus(data.tasks));
        }
        
    }
};

const GET_ENCODE_PROFILE_LIST = {
    url: '/api/encodeProfileList',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(profileActions.loadEncodingProfileList(data.profiles));
        }
    }
};

const GET_ENCODE_PROFILE = {//store.getState().year
    url: '/api/encodeProfile',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(profileActions.loadEncodingProfile(data.profile));
        }
    }
};

const SET_ENCODE_PROFILE = {
    url: '/api/encodeProfile',
    fetchData
};

const GET_STREAM_PROFILE = {
    url: '/api/streamProfile',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(profileActions.loadStreamProfile(data.streamProfile));
        }
        
    }
};

const SET_STREAM_PROFILE = {
    url: '/api/streamProfile',
    fetchData
};

const GET_NETWORK_STATUS = {
    url: '/api/networkStatus',
    method: 'GET',
    fetchData
};

const GET_NETWORK_CONFIG = {
    url: '/api/networkConfig',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(configActions.loadNetworkConfig(data.nic));
        }
        
    }
};

const SET_NETWORK_CONFIG = {
    url: '/api/networkConfig',
    fetchData
};

const GET_PIP_PREVIEW_IMG = {
    url: '/api/inputSourceThumbnail',
    method: 'GET',
    fetchFile
};

const GET_INPUT_SIGNAL_STATUS = {
    url: '/api/inputSignalStatus',
    method: 'GET',
    fetchData
};

const GET_PIP_CONFIG_LIST = {
    url: '/api/PIPConfigList',
    method: 'GET',
    fetchData
};

const SET_PIP_CONFIG = {
    url: '/api/PIPConfig',
    method: 'POST',
    fetchData
};


const DELETE_PIP_CONFIG = {
    url: '/api/deletePIPConfig',
    method: 'DELETE',
    fetchData
};

const AUTHENTICATE_CDN = {
    url: '/api/authenticateCDN',
    method: 'POST',
    fetchData
};

const AUTHENTICATE_OAUTH = {
    url: '/api/authenticateOauth',
    method: 'POST',
    fetchData
};

const GET_CDN_CHANNEL_LIST = {
    url: '/api/getCDNchannelList',
    method: 'GET',
    fetchData
};

const LOGOUT_CDN = {
    url: '/api/logoutCDN',
    method: 'POST',
    fetchData
};

const UPLOAD_FW = {
    url: '/api/uploadFW',
    method: 'POST',
    postFile
};

const UPDATE_FW = {
    url: '/api/updateFW',
    method: 'POST',
    fetchData
};

const UPDATE_CHECK_NETWORK_CONNECTION = {
    url: '/api/checkNetworkConnection',
    method: 'POST',
    fetchData
};

const DOWNLOAD_CONFIG_BACKUP = {
    url: '/api/getConfigBackup',
    method: 'GET',
    fetchData
};

const RESTORE_CONFIG_BACKUP = {
    url: '/api/restoreConfigBackup',
    method: 'POST',
    postFile
};

const GET_USER_LOG = {
    url: '/api/userLog',
    method: 'GET',
    fetchData
};

const DOWNLOAD_USER_LOG = {
    url: '/api/downloadLog',
    method: 'POST',
    fetchData
};

const GET_SYSTEM_TIME = {
    url: '/api/systemTime',
    method: 'GET',
    fetchData
};

const SET_SYSTEM_TIME = {
    url: '/api/systemTime',
    method: 'POST',
    fetchData
};

const GET_DIRECTORY = {
    url: '/api/directorys',
    method: 'GET',
    fetchData
};

const CREATE_DIRECTORY = {
    url: '/api/directorys',
    method: 'POST',
    fetchData
};

const MODIFY_DIRECTORY = {
    url: '/api/directorys',
    method: 'PUT',
    fetchData
};

const DELETE_DIRECTORY = {
    url: '/api/directorys',
    method: 'DELETE',
    fetchData
};


export {
    LOGIN,
    LOGOUT,
    GET_CONFIG,
    SET_CONFIG,
    SET_USER,
    SOURCE_THUMBNAIL,
    GET_DEVICE_FACILITIES,
    GET_DEVICE_TASK,
    SET_DEVICE_TASK,
    START_DEVICE_TASK,
    STOP_DEVICE_TASK,
    DELETE_DEVICE_TASK,
    GET_ENCODE_PROFILE_LIST,
    GET_ENCODE_PROFILE, 
    SET_ENCODE_PROFILE, 
    GET_STREAM_PROFILE, 
    SET_STREAM_PROFILE,
    GET_TASKS_STATUS,
    GET_NETWORK_STATUS,
    GET_NETWORK_CONFIG,
    SET_NETWORK_CONFIG,
    GET_DEVICE_CONFIG,
    SET_DEVICE_CONFIG,
    GET_PIP_PREVIEW_IMG,
    GET_INPUT_SIGNAL_STATUS,
    GET_PIP_CONFIG_LIST,
    SET_PIP_CONFIG,
    DELETE_PIP_CONFIG,
    AUTHENTICATE_CDN,
    AUTHENTICATE_OAUTH,
    GET_CDN_CHANNEL_LIST,
    LOGOUT_CDN,
    UPLOAD_FW,
    UPDATE_FW,
    UPDATE_CHECK_NETWORK_CONNECTION,
    DOWNLOAD_CONFIG_BACKUP,
    RESTORE_CONFIG_BACKUP,
    GET_USER_LOG,
    DOWNLOAD_USER_LOG,
    GET_SYSTEM_TIME,
    SET_SYSTEM_TIME,
    GET_DIRECTORY,
    CREATE_DIRECTORY,
    MODIFY_DIRECTORY,
    DELETE_DIRECTORY
};