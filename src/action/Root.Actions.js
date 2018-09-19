/*
Action is a function combine a "type" and a data you want to save

 */
import {
	ADD_VIDEO_SOURCE,
	DELETE_VIDEO_SOURCE,
	REPLACE_LAST_VIDEO_SOURCE,
	LOAD_VIDEO_SOURCES
} from '../constant/Root.Consts';

export const rootActions = {
	addSourceType,
	deleteSourceType,
	replaceLastSourceType,
	loadSourceType
};

function loadSourceType(videoTypes, deviceID) {
	return {
		type: LOAD_VIDEO_SOURCES,
		videoTypes,
		id: deviceID
	};
}

function addSourceType(videoType, deviceID) {
	return {
		type: ADD_VIDEO_SOURCE,
		videoType,
		id: deviceID
	};
}

function deleteSourceType(videoType, deviceID) {
	return {
		type: DELETE_VIDEO_SOURCE,
		videoType,
		id: deviceID
	};
}

function replaceLastSourceType(videoType, deviceID) {
	return {
		type: REPLACE_LAST_VIDEO_SOURCE,
		videoType,
		id: deviceID
	};
}

// store.getState().rootReducer.selectedSource