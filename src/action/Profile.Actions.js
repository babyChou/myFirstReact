
import { LOAD_ENCODING_PROFILE_LIST, LOAD_ENCODING_PROFILE, LOAD_STREAM_PROFILE  } from '../constant/Profile.Consts';

export const profileActions = {
    loadEncodingProfileList,
    loadEncodingProfile,
    loadStreamProfile
};

function loadEncodingProfileList(profiles) {
    return { type: LOAD_ENCODING_PROFILE_LIST, profiles: profiles };
}

function loadEncodingProfile(profile) {
    return { type: LOAD_ENCODING_PROFILE, profile: profile };
}

function loadStreamProfile(profile) {
    return { type: LOAD_STREAM_PROFILE, profile: profile  };
}
