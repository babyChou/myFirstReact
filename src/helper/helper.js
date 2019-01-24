export {
    setCookie,
    getCookie,
    deleteCookie,
    arrayBufferToBase64,
    isString,
    isNumber,
    isArray,
    isFunction,
    isObject,
    isEmptyObj,
    retrieveFromProp,
    randomID,
    genCheckFormats,
    checkDomainName,
    checkIPv6Address,
    checkUri,
    checkPortNumber,
    concatTasksStatus,
    serializeParams,
    formatDuration,
    formatBytes,
    fireEvent,
    isHtmlInputTypeSupported
};

function setCookie(cKey, cValue, exDays, cPath) {
    let d = new Date(), expires, path;//, domain

    d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
    expires = "expires=" + d.toUTCString();
            // domain = "domain=" + cDomain;
    path = "path=" + cPath;
    document.cookie = cKey + "=" + cValue + "; " + expires + ';' + path;
}

function getCookie(cKey) {
    let key = cKey + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i<ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(key) === 0) return c.substring(key.length,c.length);
    }
    return "";
}

function fireEvent(obj,evt){
    let fireOnThis = obj;
    if(document.createEvent ) {
        let evObj = document.createEvent('MouseEvents');
        evObj.initEvent( evt, true, false );
        fireOnThis.dispatchEvent( evObj );
    } else if( document.createEventObject ) {
        let evObj = document.createEventObject();
        fireOnThis.fireEvent( 'on' + evt, evObj );
    }
}

function formatDuration(sec){
    var days = Math.floor(sec / 86400);
    var hours = Math.floor((sec % 86400) / 3600);
    var minutes = Math.floor(((sec % 86400) % 3600) / 60);
    var seconds = ((sec % 86400) % 3600) % 60;

    if (hours   < 10) {hours = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    return (days > 0 ? days+':' : '') + hours+':'+minutes+':'+seconds;
}


function formatBytes(bytes,decimals) {
   if(bytes === 0) return '0 Bytes';
   var k = 1024,
       dm = decimals <= 0 ? 0 : decimals || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function deleteCookie(cKey,cPath) {
    document.cookie = `${cKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cPath}`;//cKey + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"+"path=" + cPath;
}

function randomID() {
    return Math.random().toString(36).slice(2);
}

function checkDomainName(value) {
    return value.match(/^[a-zA-Z0-9.-]*$/);
}

function checkIPv6Address(value) {
    return value.match(/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/);
}

function checkUri(value) {
    return value.match(/^[a-zA-Z0-9,.;?'+\\&amp;%$#=~_:\-/]*$/);
}

function checkPortNumber(value) {
    value = parseInt(value, 10);
    return value > 0 && value < 65536;
}

function retrieveFromProp(key, propObj) {
    return propObj.hasOwnProperty(key) ? propObj[key] : '';
}

function genCheckFormats(type) {
    const typeSet = {
        empty: {
            check: (val) => val.trim() === '',
            errorKey: 'validator_required'
        },
        rtmpUrlFormat: {
            check: (value) => {
                //IPV4 check
                var fmsUrlPattern = /^rtmp:\/\/([-a-zA-Z0-9.]+)(:(\d*))?(.*)$/;
                var result = fmsUrlPattern.exec(value);

                if (null !== result) {
                    if (result[1] && (checkDomainName(result[1]))) {
                        if (!result[2] || (!!result[3] && checkPortNumber(result[3]))) {
                            if (!!result[4] && checkUri(result[4])) {
                                return false;
                            }
                        }
                    }
                } else {
                    //IPV6 check
                    var fmsIpv6UrlPattern = /^rtmp:\/\/\[([a-zA-z0-9:]+)\](:(\d*))?(.*)$/;
                    var resultIpv6 = fmsIpv6UrlPattern.exec(value);

                    if (null !== resultIpv6) {
                        if (resultIpv6[1] && (!!checkIPv6Address(resultIpv6[1]))) {
                            if (!resultIpv6[2] || (!!resultIpv6[3] && checkPortNumber(resultIpv6[3]))) {
                                if (!!resultIpv6[4] && checkUri(resultIpv6[4])) {
                                    return false;
                                }
                            }
                        }
                    }
                }

                return true;
            },
            errorKey: 'validator_url'
        },
        samePasswd: {
            check: (val1, val2) => val1 !== val2,
            errorKey: 'msg_password_not_matched'
        }
    };

    let resp = {};

    if (type.match('samePasswd')) {
        resp = typeSet['samePasswd'];
    } else {
        resp = typeSet[type];
    }

    return resp;

}


function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach((b) => binary += String.fromCharCode(b));

    return window.btoa(binary);
}

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

// Returns if a value is really a number
function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

// Returns if a value is an array
function isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
}

// Returns if a value is a function
function isFunction(fun) {
    return fun && {}.toString.call(fun) === '[object Function]';
}

// Returns if a value is an object
function isObject(value) {
    return value && typeof value === 'object' && value.constructor === Object;
}

function isEmptyObj(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function serializeParams(params, prefix) {
    let str = [],
        p;
    for (p in params) {
        if (params.hasOwnProperty(p)) {
            let k = prefix ? prefix + "[" + p + "]" : p,
                v = params[p];
            str.push((v !== null && typeof v === "object") ?
                serializeParams(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}


function concatTasksStatus(_devicesTasks, _tasksStatu) {
    let devicesTasks = JSON.parse(JSON.stringify(_devicesTasks));
    let mainTask = [];
    let subTask = [];

    return devicesTasks.map(device => {

        mainTask = device.tasks.map(task => {
            subTask = _tasksStatu.filter(taskStatus => device.id === taskStatus.deviceID && task.id === taskStatus.taskID)
                .map(taskStatus => {
                    let newObj = {};
                    for (let k in taskStatus) {
                        if (k !== 'deviceID' && k !== 'taskID') {
                            newObj[k] = taskStatus[k];
                        }

                    }

                    return newObj;
                });

            if (subTask.length > 0) {
                return { ...task,
                    ...subTask[0]
                };
            }

        });

        return {
            ...device,
            tasks: mainTask
        };

    });
}

function isHtmlInputTypeSupported(type) {
    let input = document.createElement('input');
    let value = 'a';
    input.setAttribute('type', type);
    input.setAttribute('value', value);
    return (input.value !== value);
}