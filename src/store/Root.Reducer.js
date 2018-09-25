import {
    ADD_VIDEO_SOURCE,
    DELETE_VIDEO_SOURCE,
    REPLACE_LAST_VIDEO_SOURCE,
    LOAD_VIDEO_SOURCES,
    STACK_ERROR,
    DISPLAY_ERROR
} from '../constant/Root.Consts';

const initialState = {
    selectedSource: {
        1: [],
        2: []
    },
    isError: false,
    errorStack: []
};

let selectedSource = {};
let sourceArr = [];

const rootReducer = (state = initialState, action) => {

    switch (action.type) {
        case LOAD_VIDEO_SOURCES:
            selectedSource = { 
                ...state.selectedSource,
                [action.id]: action.videoTypes
            };
            return { 
                ...state,
                selectedSource
            };
        case ADD_VIDEO_SOURCE:
            //type, deviceid
            selectedSource = { 
                ...state.selectedSource,
                [action.id]: [...state.selectedSource[action.id], action.videoType]
            };
            return { 
                ...state,
                selectedSource
            };
        case DELETE_VIDEO_SOURCE:
            sourceArr = state.selectedSource[action.id].filter(type => type !== action.videoType);
            selectedSource = { ...state.selectedSource,
                [action.id]: sourceArr
            };
            return { 
                ...state,
                selectedSource
            };
        case REPLACE_LAST_VIDEO_SOURCE:
        
            sourceArr = state.selectedSource[action.id].filter((type, i) => i === 0);
            sourceArr.push(action.videoType);
            selectedSource = { ...state.selectedSource,
                [action.id]: sourceArr
            };

            return { 
                ...state,
                selectedSource
            };
        case STACK_ERROR:

            return { ...state, errorStack: [...state.errorStack, action.error], isError:true };
        case DISPLAY_ERROR:
            return { ...state, isError: false };
        default:
            return state;
    }
};

export default rootReducer;