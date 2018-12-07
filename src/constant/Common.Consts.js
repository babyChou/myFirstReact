export const INPUT_DEVICE_NAME = Object.freeze({
    1 : '1',
    2 : '2'
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

export const RECORD_STORE_DEVICE = Object.freeze({
    'usb' : 'USB',
    'sd' : 'SD Card',
    'nas' : 'NAS'
});

export const RECORD_CONTAINER = Object.freeze({
    'flv' : 'FLV',
    'avi' : 'AVI',
    'mp4' : 'MP4',
    'mov' : 'MOV',
    'ts' : 'TS',
    'aac' : 'AAC',
    'mp3' : 'MP3'
});


export const ENCODE_VIDEO_CODEC = Object.freeze({
    'h264' : 'H.264',
    'h265' : 'H.265',
    'mjpeg' : 'M-JPEG'
});

export const RESOLUTION = Object.freeze({
    '1920x1080' : { 'width' : 1920, 'height' : 1080 },
    '1280x720'  : { 'width' : 1280, 'height' : 720 },
    '720x480'   : { 'width' : 720,  'height' : 480 },
    '640x480'   : { 'width' : 640,  'height' : 480 },
    '720x576'   : { 'width' : 720,  'height' : 576 },
});


export const H264_MACROBLOCKS = Object.freeze({
    '1920x1080' : Math.ceil(1920/16)*Math.ceil(1080/16),
    '1280x720'  : Math.ceil(1280/16)*Math.ceil(720/16),
    '854x480'   : Math.ceil(854/16)*Math.ceil(480/16),
    '720x576'   : Math.ceil(720/16)*Math.ceil(576/16),
    '720x480'   : Math.ceil(720/16)*Math.ceil(480/16),
    '640x480'   : Math.ceil(640/16)*Math.ceil(480/16),
    '640x360'   : Math.ceil(640/16)*Math.ceil(360/16),
    '480x360'   : Math.ceil(480/16)*Math.ceil(360/16),
    '426x240'   : Math.ceil(426/16)*Math.ceil(240/16),
    '320x240'   : Math.ceil(320/16)*Math.ceil(240/16),
});


export const H265_PICTURE_SIZE = Object.freeze({
    '1920x1080' : 1920*1080,
    '1280x720'  : 1280*720,
    '854x480'   : 854*480,
    '720x576'   : 720*576,
    '720x480'   : 720*480,
    '640x480'   : 640*480,
    '640x360'   : 640*360,
    '480x360'   : 480*360,
    '426x240'   : 426*240,
    '320x240'   : 320*240
});


export const ENCODE_RESOLUTION_LEVEL = Object.freeze({
    h264 : {
        '1920x1080' : { baseline : 4.2, main : 4.2, high : 4.2 },
        '1280x720'  : { baseline : 3.1, main : 3.1, high : 3.1 },
        '854x480'   : { baseline : 3, main : 3, high : 3 },
        '720x576'   : { baseline : 3, main : 3, high : 3 },
        '720x480'   : { baseline : 3, main : 3, high : 3 },
        '640x480'   : { baseline : 3, main : 3, high : 3 },
        '640x360'   : { baseline : 3, main : 3, high : 3 },
        '480x360'   : { baseline : 2.1, main : 2.1, high : 2.1 },
        '426x240'   : { baseline : 2.1, main : 2.1, high : 2.1 },
        '320x240'   : { baseline : 2, main : 2, high : 2 },
    },
    h265 : {
        '1920x1080' : { main : 4.1 },
        '1280x720'  : { main : 3.1 },
        '854x480'   : { main : 3 },
        '720x576'   : { main : 3 },
        '720x480'   : { main : 3 },
        '640x480'   : { main : 3 },
        '640x360'   : { main : 2.1 },
        '480x360'   : { main : 2.1 },
        '426x240'   : { main : 2 },
        '320x240'   : { main : 2 },
    }
});


export const ENCODE_LEVEL_H264_DECODING = Object.freeze({
    '1'     : 1485,        //Level 1
    '1.1'   : 3000,        //Level 1.1
    '1.2'   : 6000,        //Level 1.2
    '1.3'   : 11880,       //Level 1.3
    '2'     : 11880,       //Level 2
    '2.1'   : 19800,       //Level 2.1
    '2.2'   : 20250,       //Level 2.2
    '3'     : 40500,       //Level 3
    '3.1'   : 108000,      //Level 3.1
    '3.2'   : 216000,      //Level 3.2
    '4'     : 245760,     //Level 4
    '4.1'   : 245760,     //Level 4.1
    '4.2'   : 522240,     //Level 4.2
    '5'     : 589824,     //Level 5
    '5.1'   : 983040,     //Level 5.1
    '5.2'   : 2073600     //Level 5.2
});

export const ENCODE_LEVEL_H265_SAMPLE_RATE = Object.freeze({
    '1'     : 552960,          //Level 1
    '2'     : 3686400,         //Level 2
    '2.1'   : 7372800,       //Level 2.1
    '3'     : 16588800,        //Level 3
    '3.1'   : 33177600,      //Level 3.1
    '4'     : 66846720,        //Level 4
    '4.1'   : 133693440,     //Level 4.1
    '5'     : 267386880,       //Level 5
    '5.1'   : 534773760,     //Level 5.1
    '5.2'   : 1069547520,    //Level 5.2
    '6'     : 1069547520,      //Level 6
    '6.1'   : 2139095040,    //Level 6.1
    '6.2'   : 4278190080     //Level 6.2
});

// this.H265_LEVEL_MACROBLOCKS = {
//     // index of Level: {Max Picture Size, Max Decoding Speed}
//     '0' : {'samples':36864, 'sampleRate':552960},           //Level 1
//     '1' : {'samples':122880, 'sampleRate':3686400},         //Level 2
//     '2' : {'samples':245760, 'sampleRate':7372800},         //Level 2.1
//     '3' : {'samples':552960, 'sampleRate':16588800},            //Level 3
//     '4' : {'samples':983040, 'sampleRate':33177600},            //Level 3.1
//     '5' : {'samples':2228224, 'sampleRate':66846720},           //Level 4
//     '6' : {'samples':2228224, 'sampleRate':133693440},          //Level 4.1
//     '7' : {'samples':8912896, 'sampleRate':267386880},          //Level 5
//     '8' : {'samples':8912896, 'sampleRate':534773760},      //Level 5.1
//     '9' : {'samples':8912896, 'sampleRate':1069547520},     //Level 5.2
//     '10' : {'samples':35651584, 'sampleRate':1069547520},       //Level 6
//     '11' : {'samples':35651584, 'sampleRate':2139095040},       //Level 6.1
//     '12' : {'samples':35651584, 'sampleRate':4278190080}        //Level 6.2
// };

// this.H264_LEVEL_MACROBLOCKS = {
//     // index of Level: {Max Frames Size, Max Decoding Speed}
//     '1' : {'frames':99, 'decoding':1485},           //Level 1
//     '1.1' : {'frames':396, 'decoding':3000},          //Level 1.1
//     '1.2' : {'frames':396, 'decoding':6000},          //Level 1.2
//     '1.3' : {'frames':396, 'decoding':11880},         //Level 1.3
//     '2' : {'frames':396, 'decoding':11880},         //Level 2
//     '2.1' : {'frames':792, 'decoding':19800},         //Level 2.1
//     '2.2' : {'frames':1620, 'decoding':20250},        //Level 2.2
//     '3' : {'frames':1620, 'decoding':40500},        //Level 3
//     '3.1' : {'frames':3600, 'decoding':108000},       //Level 3.1
//     '3.2' : {'frames':5120, 'decoding':216000},       //Level 3.2
//     '4' : {'frames':8192, 'decoding':245760},      //Level 4
//     '4.1' : {'frames':8192, 'decoding':245760},      //Level 4.1
//     '4.2' : {'frames':8704, 'decoding':522240},      //Level 4.2
//     '5' : {'frames':22080, 'decoding':589824},     //Level 5
//     '5.1' : {'frames':36864, 'decoding':983040},     //Level 5.1
//     '5.2' : {'frames':36864, 'decoding':2073600}     //Level 5.2
// };
// 
// maxbitrate = level->profile
// 


export const ENCODE_PROFILE = Object.freeze({
    'baseline' : {
        name : 'Baseline',
        tags : ['h264']
    },
    'high' : {
        name : 'High',
        tags : ['h264']
    },
    'main' : {
        name : 'Main',
        tags : ['h264','h265']
    }
});

export const ENCODE_MODE = Object.freeze({
    'cbr' : { name : 'CBR', tags : ['h264','h265'] },
    'vbr' : { name : 'VBR', tags : ['h264','h265'] },
    'avbr_fixqp' : { name : 'AVBR FixQp', tags : ['h264','h265'] }
});

/*
https://www.mobile01.com/topicdetail.php?f=510&t=3735840
Table: https://zh.wikipedia.org/wiki/H.264/MPEG-4_AVC
H.264 The maximum bit rate for High Profile is 
[1.25] times that of the Base/Extended/Main Profiles,
[3] times for Hi10P,
[4] times for Hi422P/Hi444PP.
*/
/*
Table : https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding_tiers_and_levels
HEVC For bit depth the maximum bit rate increases by:
 12-bit profiles -> 1.5x. ex: Main 12 = basicValue*1.5
 16-bit profiles -> 2x 
 4:2:2 profiles ->1.5x. ex: Main 4:4:4 12(12-bit) = basicValue*1.5*2
 4:4:4 profiles -> 2x
Intra profiles -> 2x
*/
export const ENCODE_LEVEL = Object.freeze({
    '1' : { 
        name : 'Level 1',
        value: 1,
        tags : ['h264','h265'],
        h264 : {'baseline':64, 'main':64 }, //max bitrate : high = main*1.25
        h265 : { main : 128} //Main 12 = main*1.5, 
    }, 
    '1.1' : { 
        name : 'Level 1.1',
        value: 1.1,
        tags : ['h264'],
        h264 : {'baseline':192, 'main':192}
    }, 
    '1.2' : { 
        name : 'Level 1.2', 
        value: 1.2,
        tags : ['h264'],
        h264 : {'baseline':384, 'main':384}
    }, 
    '1.3' : { 
        name : 'Level 1.3', 
        value: 1.3,
        tags : ['h264'],
        h264 : {'baseline':786,'main':786}
    }, 
    '2' : { 
        name : 'Level 2', 
        value: 2,
        tags : ['h264','h265'],
        h264 : {'baseline':2000, 'main':2000},
        h265 : {main : 1500}
    }, 
    '2.1' : { 
        name : 'Level 2.1', 
        value: 2.1,
        tags : ['h264','h265'],
        h264 : {'baseline':4000, 'main':4000},
        h265 : {main : 3000}
    }, 
    '2.2' : { 
        name : 'Level 2.2', 
        value: 2.2,
        tags : ['h264'],
        h264 : {'baseline':4000, 'main':4000} 
    }, 
    '3' : { 
        name : 'Level 3', 
        value: 3,
        tags : ['h264','h265'],
        h264 : {'baseline':10000, 'main':10000},
        h265 : {main : 6000}
    }, 
    '3.1' : { 
        name : 'Level 3.1',
        value: 3.1,
        tags : ['h264','h265'],
        h264 : {'baseline':14000, 'main':14000},
        h265 : { main : 10000}
    }, 
    '3.2' : { 
        name : 'Level 3.2',
        value: 3.2,
        tags : ['h264'],
        h264 : {'baseline':20000, 'main':20000} 
    }, 
    '4' : { 
        name : 'Level 4',
        value: 4,
        tags : ['h264','h265'],
        h264 : {'baseline':20000, 'main':20000},
        h265 : {main : 12000, 'high':30000}//2.5
    }, 
    '4.1' : { 
        name : 'Level 4.1',
        value: 4.1,
        tags : ['h264','h265'],
        h264 : {'baseline':50000, 'main':50000},
        h265 : { main : 20000, 'high':50000}
    }, 
    '4.2' : { 
        name : 'Level 4.2',
        value: 4.2,
        tags : ['h264'],
        h264 : {'baseline':50000, 'main':50000}
    }, 
    '5' : { 
        name : 'Level 5',
        value: 5,
        tags : ['h264','h265'],
        h264 : {'baseline':135000, 'main':135000},
        h265 : {main : 25000, 'high': 100000}//4
    }, 
    '5.1' : { 
        name : 'Level 5.1',
        value: 5.1,
        tags : ['h264', 'h265'],
        h264 : {'baseline':240000, 'main':240000},
        h265 : {main : 40000, 'high': 160000}
    },
    '5.2' :  { 
        name : 'Level 5.2',
        value: 5.2,
        tags : ['h264', 'h265'],
        h264 : {'baseline':240000, 'main':240000},
        h265 : {'main':60000, 'high':240000} 
    },
    '6' :  { 
        name : 'Level 6',
        value: 6,
        tags : ['h264','h265'],
        h264 : {'baseline':240000, 'main':240000},
        h265 : {main : 60000, 'high':240000}
    },
    '6.1' :  { 
        name : 'Level 6.1',
        value: 6.1,
        tags : ['h264','h265'],
        h264 : {'baseline':480000, 'main':480000},
        h265 : {main : 120000, 'high':480000} 
    },
    '6.2' :  { 
        name : 'Level 6.2',
        value: 6.2,
        tags : ['h264','h265'],
        h264 : {'baseline':800000, 'main':800000},
        h265 : {main : 240000, 'high':1200000} //5
    }
});


export const ENCODE_FRAME_RATE = Object.freeze({
    // 10 : 10,
    // 15 : 15,
    // 18 : 18,
    // 22 : 22,
    // 25 : 25,
    // 29.97 : 29.97,
    30 : 30,
    50 : 50,
    // 59 : 59.94,
    60 : 60
});

export const ENCODE_GOP_MODE = Object.freeze({
    'normalp' : 'NORMALP',
    'dualp' : 'DUALP',
    'smartp' : 'SMARTP',
    'bipredb' : 'BIPREDB'
});

export const ENCODE_ENTROPY_MODE = Object.freeze({
    'cavlc' : 'CAVLC',
    'cabac' : 'CABAC'
});

export const ENCODE_NULL_PACKET = Object.freeze({
    'on' : 'ON',
    'off' : 'OFF'
});

export const ENCODE_OUTPUT_RATIO = Object.freeze({
    0 : 'Original ratio',
    1 : '16:9',
    2 : '4:3'

});

export const ENCODE_AUDIO_CHANNEL = Object.freeze({
    'mono' : {
        name : 'Mono',
        tags : ['aac']
    },
    'stereo' : {
        name : 'Stereo',
        tags : ['aac', 'mp3']
    }
});

export const ENCODE_AUDIO_CODEC = Object.freeze({
    'aac' : 'AAC',
    'mp3' : 'MP3',
    // 'pcm' : 'PCM'
});


export const AUDIO_SAMPLE_MAP_BITRATE = Object.freeze({
      'aac' : {
          'mono' : {
            '48000' : [48, 64, 96, 128, 256]
          },
          'stereo' : {
            '48000' : [48, 64, 96, 128, 256,320]
          }
       },
      'mp3' : {
          'stereo' : {
             '48000' : [32, 40,48, 56,64,80,96,112,128,160,192,224,256,320]
          }
      }
});


  

    
    