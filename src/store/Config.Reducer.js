import {
    LOAD_CONFIG,
    LOAD_DEVICES_FACILITIES,
    SET_CONFIG,
    LOAD_DEVICES_TASKS,
    LOAD_TASKS_STATUS,
    LOAD_DEVICE_CONFIG,
    SET_DEVICE_CONFIG
} from '../constant/Config.Consts';

const initialState = {
    config: {},
    devices: [],
    devicesConfig: [],
    devicesTasks: [],
    tasksStatus: [],
    nic: []
};

let devicesConfig = [];

const configReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_CONFIG:
            return {
                ...state,
                config: Object.assign({}, action.config, state.config)
            };
        case LOAD_CONFIG:
            return { ...state,
                config: action.config
            };
        case LOAD_DEVICES_FACILITIES:
            return { ...state,
                devices: action.devices
            };
        case LOAD_DEVICES_TASKS:
            return { ...state,
                devicesTasks: action.devicesTasks
            };
        case LOAD_TASKS_STATUS:

            return { ...state,
                tasksStatus: action.tasksStatus
            };

        case LOAD_DEVICE_CONFIG:
            let isExistData = false;
            devicesConfig = state.devicesConfig.map(config => {
                if (action.deviceConfig.id === config.id) {
                    isExistData = true;
                    return { ...config,
                        ...action.deviceConfig
                    };
                } else {
                    return config;
                }
            });

            if (!isExistData) {
                devicesConfig.push(action.deviceConfig);
            }

            return { ...state,
                devicesConfig: devicesConfig
            };
        case SET_DEVICE_CONFIG:
            let newConfig = {};
            // console.log(state.devicesConfig);
            devicesConfig = state.devicesConfig.map(config => {
                if (config.id === action.deviceConfig.id) {
                    newConfig = {
                        ...config,
                        ...action.deviceConfig
                    };

                    if (action.deviceConfig.hasOwnProperty('audioParam')) {
                        newConfig.audioParam = {
                            ...config.audioParam,
                            ...action.deviceConfig.audioParam
                        };
                    }

                    if (action.deviceConfig.hasOwnProperty('videoParma')) {
                        newConfig.videoParma = {
                            ...config.videoParma,
                            ...action.deviceConfig.videoParma
                        };
                    }

                    // console.log(config, newConfig);

                    return newConfig;
                } else {
                    return config;
                }

            });
            // console.log(devicesConfig);

            return {
                ...state,
                devicesConfig: devicesConfig
            };
        default:
            return state;
    }
};

export default configReducer;