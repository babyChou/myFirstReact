import * as Services from './Services';
import store from '../store/Store';
import * as helper from './helper';

function checkFacilities() {
    let devices = JSON.parse(JSON.stringify(store.getState().configReducer.devices));
    if (devices.length === 0) {
        return Services.GET_DEVICE_FACILITIES.fetchData().then(data => {
            return JSON.parse(JSON.stringify(store.getState().configReducer.devices));
        });

    } else {
        return Promise.resolve(devices);
    }

}



function checkDevicesTasks(renew) {
    let devicesTasks = JSON.parse(JSON.stringify(store.getState().configReducer.devicesTasks));

    if (devicesTasks.length === 0 || renew) {
        return Services.GET_DEVICE_TASK.fetchData({
            deviceID: 0,
            taskID: 0
        }).then(() => {
            return JSON.parse(JSON.stringify(store.getState().configReducer.devicesTasks));
        });
    } else {
        return Promise.resolve(devicesTasks);
    }
}



function checkTasksStatus(renew) {
    let tasksStatus = JSON.parse(JSON.stringify(store.getState().configReducer.tasksStatus));

    if (tasksStatus.length === 0 || renew) {
        return Services.GET_TASKS_STATUS.fetchData({
            id: 0
        }).then(() => {
            return JSON.parse(JSON.stringify(store.getState().configReducer.tasksStatus));
        });
    } else {
        if (tasksStatus.length === 0) {
            return Services.GET_TASKS_STATUS.fetchData({
                id: 0
            }).then(() => {
                return JSON.parse(JSON.stringify(store.getState().configReducer.tasksStatus));
            });
        } else {
            return Promise.resolve(tasksStatus);
        }
    }
}


function checkEncodeProfiles(renew) {
    let encodeProfiles = JSON.parse(JSON.stringify(store.getState().profiles.encodeProfiles));
    if (encodeProfiles.length === 0 || renew) {
        return Services.GET_ENCODE_PROFILE_LIST.fetchData().then(() => {
            return JSON.parse(JSON.stringify(store.getState().profiles.encodeProfiles));
        });
    } else {
        return Promise.resolve(encodeProfiles);
    }
}


function checkStreamProfiles(id, renew) {
    let streamProfiles = JSON.parse(JSON.stringify(store.getState().profiles.streamProfiles));
    let isLoaded = false;
    
    streamProfiles.forEach(profile => {
        if (profile.id === id) {
            isLoaded = true;
        }
    });

    if (!isLoaded || renew) {
        return Services.GET_STREAM_PROFILE.fetchData({
            id: id
        }).then(data => {
            if (data.result === 0) {
                return JSON.parse(JSON.stringify(store.getState().profiles.streamProfiles));
            }
        });
    } else {
        return JSON.parse(JSON.stringify(store.getState().profiles.streamProfiles));
    }
}


function checkDeviceConfig(id, renew) {
    let devicesConfig = JSON.parse(JSON.stringify(store.getState().configReducer.devicesConfig));
    let deviceConfig;

    if (devicesConfig.length === 0 || renew) {
        return Services.GET_DEVICE_CONFIG.fetchData({
            id: id
        }).then(data => {
            if (data.result === 0) {
                return data.device;
            }
        });
    } else {
        deviceConfig = devicesConfig.find(config => config.id === id);
        if(helper.isEmptyObj(deviceConfig)) {
            return Services.GET_DEVICE_CONFIG.fetchData({
                id: id
            }).then(data => {
                if (data.result === 0) {
                    return data.device;
                }
            });

        }else{
            return Promise.resolve(deviceConfig);
        }
    }
}


export {
    checkDevicesTasks,
    checkFacilities,
    checkTasksStatus,
    checkEncodeProfiles,
    checkStreamProfiles,
    checkDeviceConfig
};