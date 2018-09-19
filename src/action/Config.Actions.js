/*
Action is a function combine a "type" and a data you want to save

 */
import {
    LOAD_CONFIG,
    LOAD_DEVICES_FACILITIES,
    SET_CONFIG, LOAD_DEVICES_TASKS,
    LOAD_TASKS_STATUS,
    LOAD_NETWORK_CONFIG,
    LOAD_DEVICE_CONFIG
} from '../constant/Config.Consts';


export const configActions = {
    loadConfig,
    setConfig,
    loadFacilites,
    loadDevicesTasks,
    loadTasksStatus,
    loadNetworkConfig,
    loadDeviceConfig
};

//LOAD_ENCODING_PROFILE_LIST
function setConfig(config) {
    return { type: SET_CONFIG, config };
}

function loadConfig(config) {
    return { type: LOAD_CONFIG, config };
}

function loadFacilites(devices) {
    return { type: LOAD_DEVICES_FACILITIES, devices: devices };
}

function loadDevicesTasks(devicesTasks) {
    return { type: LOAD_DEVICES_TASKS, devicesTasks: devicesTasks };
}

function loadTasksStatus(tasksStatus) {
    return { type: LOAD_TASKS_STATUS, tasksStatus: tasksStatus };
}

function loadNetworkConfig(nic) {
    return { type: LOAD_NETWORK_CONFIG, nic: nic };
}

function loadDeviceConfig(deviceConfig) {
    return { type: LOAD_DEVICE_CONFIG, deviceConfig: deviceConfig };
}