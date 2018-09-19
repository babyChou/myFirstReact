import { LOAD_ENCODING_PROFILE_LIST, LOAD_ENCODING_PROFILE, LOAD_STREAM_PROFILE } from '../constant/Profile.Consts';

const initialState = {
    encodeProfiles : [],
    streamProfiles: []
};

const profiles = (state = initialState, action) => {
    
    switch (action.type) {
        case LOAD_ENCODING_PROFILE_LIST:
            return { ...state, encodeProfiles: action.profiles };
        case LOAD_ENCODING_PROFILE:
            return { ...state, encodeProfiles: [...state.encodeProfiles, action.profile] };
        case LOAD_STREAM_PROFILE:
            return { ...state, streamProfiles: [...state.streamProfiles , action.profile] };
        default: 
            return state;
    }
};

export default profiles;