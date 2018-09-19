export const INPUT_DEVICE_NAME = Object.freeze({
    1 : 'A',
    2 : 'B',
    'A' : 1,
    'B' : 2
});

export const INPUT_SOURCES = Object.freeze({
    'hdmi1' : 'HDMI 1',
    'hdmi2' : 'HDMI 2',
    'sdi1' : 'SDI 1',
    'sdi2' : 'SDI 2',
    '3.5mm' : '3.5mm',
    'xlr' : 'XLR',

    'HDMI 1' : 'hdmi1',
    'HDMI 2' : 'hdmi2',
    'SDI 1' : 'sdi1',
    'SDI 2' : 'sdi2',
    'XLR': 'xlr'
});


export const STREAM_STATUS = Object.freeze({
    '-1' : 'msg_stream_failed',
    '0' : 'msg_stop_streaming',
    '1' : 'msg_task_streaming',
    '2' : 'msg_stream_activating'
});



export const STREAM_STYPE = Object.freeze({
    1: 'TS over TCP',
    2: 'TS over UDP',
    3: 'TS Multicast',
    4: 'TS over RTP',
    5: 'TS RTP Multicast',
    6 : 'RTMP Publish',
    7: 'HLS',
    8: 'RTSP',
    11: 'Ustream',
    12: 'Twitch',
    13: 'Youtube Live',
    14: 'CDNVideo',
    15: 'Facebook',
    21: 'TS over HTTP',
    22: 'MPEG-DASH Push',
    23: 'RTMP Pull',
    51: 'Record',

    'TS over TCP' : 1,
    'TS over UDP' : 2,
    'TS Multicast' : 3,
    'TS over RTP' : 4,
    'TS RTP Multicast' : 5,
    'RTMP Publish' : 6,
    'HLS' : 7,
    'RTSP' : 8,
    'Ustream' : 11,
    'Twitch' : 12,
    'Youtube Live' : 13,
    'CDNVideo' : 14,
    'Facebook' : 15,
    'TS over HTTP' : 21,
    'MPEG-DASH Push' : 22,
    'RTMP Pull' : 23,
    'Record' : 51
});