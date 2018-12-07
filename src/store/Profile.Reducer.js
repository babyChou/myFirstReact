import { LOAD_ENCODING_PROFILE_LIST, LOAD_ENCODING_PROFILE, LOAD_STREAM_PROFILE } from '../constant/Profile.Consts';

const initialState = {
    encodeProfiles : [],
    streamProfiles: []
};

let isOldData = false;
let newDataList = [];

const profiles = (state = initialState, action) => {
    
    switch (action.type) {
        case LOAD_ENCODING_PROFILE_LIST:
            return { ...state, encodeProfiles: action.profiles };
        case LOAD_ENCODING_PROFILE:
            isOldData = state.encodeProfiles.some(profile => profile.id === action.profile.id);

            if(isOldData) {
                newDataList = state.encodeProfiles.map(profile => {
                    if(profile.id === action.profile.id) {
                        return action.profile;
                    }else{
                        return profile;
                    }
                });
            }else{
                newDataList = [...state.encodeProfiles , action.profile];
            }
            return { ...state, encodeProfiles: newDataList };

        case LOAD_STREAM_PROFILE:
            isOldData = state.streamProfiles.some(profile => profile.id === action.profile.id);

            if(isOldData) {
                newDataList = state.streamProfiles.map(profile => {
                    if(profile.id === action.profile.id) {
                        return action.profile;
                    }else{
                        return profile;
                    }
                });
            }else{
                newDataList = [...state.streamProfiles , action.profile];
            }
            return { ...state, streamProfiles: newDataList };
        default: 
            return state;
    }
};

export default profiles;