import { arrayBufferToBase64, isObject, serializeParams } from './helper';
import { profileActions } from '../action/Profile.Actions';
import { configActions } from '../action/Config.Actions';
import { rootActions } from '../action/Root.Actions';
import store from '../store/Store';

const rootDOM = document.getElementById('root');
const errorDOM = document.getElementById('error');

let hostname = './';
let SESSION = '';

/* if (process.env.NODE_ENV !== 'production') {
    hostname = 'http://localhost:9998/se5820/';
} */

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


    if(!this.url.match('login') && (!this.url.match('configuration') && _method !== 'GET')) {
        if(!SESSION) {
            alert('SESSION empty. URL: ' + this.url);
        }
        // reqParams.credentials = 'include';//????
        headers.append('Authorization', 'Bearer ' + SESSION);
    }

    if(isObject(params)) {
        if(_method === 'GET') {
            // url = new URL(url);
            //TODO: Edge not work
            //npm install url-search-params-polyfill --save
            // url.search = new URLSearchParams(params);

            url += ('?' + serializeParams(params));
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


    return fetch(url, reqParams).then(response => {//add time
        if (!response.ok){
            // return Promise.reject({ url: this.url, body: response.statusText, type: 'responseNotOk', status: response.status });
            throw new Error({ url: this.url, body: response.statusText, type: 'responseNotOk', status: response.status });
        }else{
            return response.text();
        }
    }).then(responseBodyAsText => {
        try {
            const bodyAsJson = JSON.parse(responseBodyAsText);
            return bodyAsJson;
        } catch (e) {
            throw new Error({ url: this.url, body: responseBodyAsText, type: 'unparsable' });
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
            }
        }
        return json;
    })
    .catch(err => {

        console.log(err, err.body);
        
        if(err.body) {
            // alert(`${err.url}. ${err}. ${err.body}`);
            store.dispatch(rootActions.stackError(err));
        }else{
            store.dispatch(rootActions.stackError({
                url: this.url, body: err.stack, type: 'unknow' 
            }));
            
            // alert(err);
        }

        rootDOM.removeChild(rootDOM.firstChild);
        errorDOM.classList.remove('d-none');

        return err;
    });

}

function fetchFile(params) {
    // const url = new URL(hostname + this.url);
    let url = hostname + this.url;
    const method = this.method || 'GET';
    const headers = new Headers({'Authorization' : SESSION, 'Content-Type' : 'image/jpeg', 'Accept-Charset' : 'utf-8'});

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
    
        });

    })
    .catch(err=>{
        console.log(err);
        //Handle lose connection
    });
}

function postFile(params) {

    const url = hostname + this.url;
    const method = 'POST';
    const headers = new Headers({'Authorization' : SESSION, 'Accept-Charset' : 'utf-8'});
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

const GET_CONFIG = {
    url: '/api/configuration',
    storeType: 'LOAD',
    method: 'GET',
    fetchData,
    store: (data) => {
        if(data.result === 0) {
            store.dispatch(configActions.loadConfig(data.config));
        }
    }
};

const SET_CONFIG = {
    url: '/api/configuration',
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
            store.dispatch(profileActions.loadEncodingProfile());
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


export {
    LOGIN,
    GET_CONFIG,
    SET_CONFIG,
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
    UPDATE_FW
};