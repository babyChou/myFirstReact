[TOC]

### Error Message
	{
		"result": 102,
		"message": "invalid Arg ...."
	}

## 3 Configuration Management

### 3.1 getConfig

* URL: http://HostName:Port/api/configuration
* Method: GET
* Response

```
{
    "result":%d,
    "config":{
        "language":"%s",
        "deviceName":%s
        "version":"%s",
        "SKU":"%s",
        "keepLogin":%d,
        "sn":"%s"
        ……
    },
    "streamSetting" : {
        "autoStart" : %d,
    }
}

```

### 3.2 setConfig

* URL: http://HostName:Port/api/configuration
* Method: PATCH/POST
* Parameters

```
{
    "config":{
        "language":"%s",
        "deviceName":%s
        "version":"%s",
        "SKU":"%s",
        "keepLogin":%d,
        "sn":"%s"
         ……
    },
    "streamSetting" : {
        "autoStart" : %d,
    }
}

```
#### getConfig/setConfig Parameters Description

|      Name     |  type  |                               Description                                |
|---------------|--------|--------------------------------------------------------------------------|
| config        |        | Contain setting of BOX basic parameters setting                          |
| language      | String | Language system of UI                                                    |
| deviceName    | String | Device name, Default is the 6 hex codes of the last 3 MAC codes of eth2. |
| version       | String | Firmware version                                                         |
| streamSetting |        | Global stream attribute setting                                          |
| autoStart     | int    | 1, mean auto start when boot up. 0, mean do not auto start               |

### 3.3 setUser

* URL: http://HostName:Port/api/setUser
* Method: PATCH / POST 
* Parameters

```json
{
   "oldUserName": "%s",
   "oldPassword": "%s",
   "userName": "%s",
   "password": "%s"

}
```

* Response

```
{
    "result":%d
}

```
#### setUser Parameters Description

|     Name    |  type  |       Description        |
|-------------|--------|--------------------------|
| oldUserName | String | Old user account of box  |
| oldPassword | String | Old user password of box |
| userName    | String | New user account of box  |
| password    | String | New user password of box |

### 3.4 getConfigBackup 

* URL: http://HostName:Port/api/getConfigBackup
* Method: GET 
* Response

```
{
    "result": 0,
    "downloadFile": "/download/SE5820_YYYYMMDDHHII_cfg.tgz"
}
```

### 3.5 restoreConfigBackup
* URL: http://HostName:Port/api/restoreConfigBackup
* Method: POST 
* Parameters

|  Name  | type |                      Description                       |
|--------|------|--------------------------------------------------------|
| config | file | The file contained SE5820 configuration to be restored |

* Response

```
{
    "result": 0
}
```


### 3.6   getUserLog

* URL: http://HostName:Port/api/userLog
* Method: GET 
* Parameters

|    Name   | type |           Description           |
|-----------|------|---------------------------------|
| startLine | Int  | The start line that user wants. |
| getLines  | Int  | The line count of response.     |

* Response

```json
{
  "result": 0,
   "totalCounts": 300,
   "currntLine": 26,
   "logs":[
      "2015/02/06 16:30:00, warn : ethernet plug out",
      "%s",
   ]
}
```

* Description

|     Name    |                Description                |
|-------------|-------------------------------------------|
| totalCounts | The total lines of user log.              |
| currentLine | After get log, the current line position. |
| logs        | String array of logs.                     |
| message     | Return which parameters occur error.      |


### 3.7   downloadLog

* URL: http://HostName:Port/api/downloadLog
* Method: POST 
* Response

```json
{
  "result": 0,
  "downloadFile":" /download/SE5820_YYYYMMDDHHII_log.tgz"
}
```

## 6 Stream Profiles Management

streamType:

- 1: TS over TCP
- 2: TS over UDP
- 3: TS Multicast
- 4: TS over RTP
- 5: TS RTP Multicast
- 6: RTMP publish
- 7: HLS(Maximum of 5 people watching)
- 8:RTSP
- 11: ustream
- 12: twitch
- 13: youtube
- 14: CDNvideo
- 15: Facebook
- 21: TS over Http
- 22: MPEG-DASH Push
- 23: RTMP Pull
- 51: Record

- 1: TS over TCP

        "tcp" : {
            "port":%d,
            "setPid":%b,
            "videoPid":%d,
            "audioPid":%d,
            "pmtPid":%d,
            "pcrPid":%d
        }

- 2: TS over UDP
- 3: TS Multicast

        "udp" : {
            "ip":%s,
            "port":%d,
            "setPid":%b,
            "videoPid":%d,
            "audioPid":%d,
            "pmtPid":%d,
            "pcrPid":%d
        }


- 4: TS over RTP
- 5: TS RTP Multicast

        "rtp" : {
            "ip":%s,
            "port":%d,
            "nic":"%s ",
            "ttl":%d,
            "sap":%d,
            "sapName":%s,
            "setPid":%b,
            "videoPid":%d,
            "audioPid":%d,
            "pmtPid":%d,
            "pcrPid":%d,
        },

- 6: RTMP publish

        "rtmp" : {
            "infoId":%d,
            "rtmpUrl":"%s ",
            "playBackUrl":"%s ",
            "rtmpBackupUrl":"%s ",
            "rtmpStreamName":"%s ",
            "enableAuthorize’":%d ,
            "rtmpUser":"%s",
            "rtmpPasswd":"%s",  
        },

- 7: HLS(Maximum of 5 people watching)

        "hls" : {
            "hlsSegmentFileNumbe":%d,
            "hlsChunkDuration":%d,
            "hlsPushMode":%b,
            "hlsUrl":%s,
            "hlsLocation:%s,
            "username":%s,
            "password":%s
        },


- 8:RTSP

        "rtsp" : {
            "maxClient": %d,
            "rtspUrl" : %s,
            "port": %d
        },

- 11: ustream

        "ustream": {
           "userID " : %d,
            "password" ": %s ,
            "channelID":%d ,
        },

- 12: twitch

        "twitch": {
            "userID:%d,
        },

- 13: youtube

        "youtube" : {
            "userID " : %d,
            "videoID":%s,
            "title": "%s",
            "description": "%s",
            "privacy": "%s", //"unlisted", "private", "public"
            "tag": "%s,"
        },

- 14: CDNvideo

        "cdnVideo" : {
            "userID:%d,
            "password": %s
            "channelID:%d,
        }

- 15: Facebook

        "facebook": {
            "userID:%d,
        },

- 51: Record

        "record" : {
            "container":%s, //"flv","avi","mp4","mov","ts","aac" and "mp3"
            "storeDevice":%s, //"nas","sd" and “usb"
            "recordPath":%s, // --> \\ip\location 
            "filePrefix":%s,
            "username":%s, // --> recordUserName
            "password":%s, // --> recordPassword
            "segmentDuration": %d //minutes
        },

- 21: TS over Http
- 22: MPEG-DASH Push
- 23: RTMP Pull



### 6.2 getStreamProfile

* URL: http://HostName:Port/api/streamProfile
* Method: GET 
* Parameters:

| Name | type |              Description               |
|------|------|----------------------------------------|
| id   | int  | Get corresponding id of stream profile |

* Response

```
{
   "result": 0,
   "streamProfile" : {
      "id":%d,
      "name":"%s ",
      "streamType":%d,
      "uri":"%s ",
      "nic":"%s ",
      "youtube" : {....},
      "twitch": {...},
      "ustream": {...},
      "facebook": {...},
      "rtmp" : {...},
      "tcp" : {...},
      "udp" : {...},
      "rtp" : {...},
      "hls" : {...},
      "rtsp" : {...},
      "record" : {...},
      "cms" : {...},
   }
}
```


### 6.3 addStreamProfile

* URL: http://HostName:Port/api/streamProfile

* Method: POST
* Parameters:

```
{
   "streamProfile" : {
      "name":"%s ",
      "autoStart":%d,
      "sourceType":"%s",
      "streamType":%d,
      "setPid":%b,
      "uri":"%s ",
      "youtube" : {....},
      "twitch": {...},
      "ustream": {...},
      "rtmp" : {...},
   }
}
```
* Response

```
{
    "result":%d
    "id":%d
}
```
   

### 6.4 modifyStreamProfile

* URL: http://HostName:Port/api/streamProfile
* Method: PATCH (Modify some attribute)
* Method: PUT (Replace entire attribute)
* Parameters:

```
{
   "streamProfile" : {
      "name":"%s ",
      "autoStart":%d,
      "sourceType":"%s",
      "streamType":%d,
      "setPid":%b,
      "uri":"%s ",
      "youtube" : {....},
      "twitch": {...},
      "ustream": {...},
      "rtmp" : {...},
   }
}
```
* Response

```
{
    "result":%d
}
```

### 6.5 removeStreamProfile

* URL: http://HostName:Port/api/streamProfile
* Method: DELETE
* Parameters:  id

## 4 Facilities Management

### 4.1 getDevicefacilities

* URL: http://HostName:Port/api/getDevicefacilities

* Method: GET 
* Parameters: ahth
* Response

```
{
   "result":0,
   "devices":[
      {
         "id":1,
         "videoInput":["hdmi1","hdmi2","sdi1","sdi2"],
         "audioInput": [ "hdmi1", "hdmi2", "sdi1", "sdi2", "3.5mm"],
         "mixInput": ["3.5mm","xlr"],
         "audioMix":true
      },
      {
         "id":2,
         "videoInput":["hdmi1","hdmi2","sdi1","sdi2"],
         "audioInput": [ "hdmi1", "hdmi2", "sdi1", "sdi2", "3.5mm"]
         "mixInput": [],
         "audioMix":false
      }
   ]
}
```

### 4.2 getDeviceConfig

* URL: http://HostName:Port/api/deviceConfig
* Method: GET
* Parameters: 

| Name | type |                      Description                       |
|------|------|--------------------------------------------------------|
| id   | Int  | Identify of the device config. To get the spcific data |

* Response

```
{
   "device":
   {
        "id":%d,
        "videoInput":["%s",…], //"hdmi1","hdmi2","sdi1","sdi2"
        "audioInput":"%s", //embed, 3.5mm
        "audioParam":{
            "micMix":%b, // enable/disable
            "micInput":"%s", //xlr , 3.5mm
            "soundControl":%d, //0~100
            "micPercentage":%d, //0~100
            "audioPercentage":%d //0~100
        },
        "videoParam":{
            "brightness":%d,
            "contrast":%d,
            "hue":%d,
            "saturation":%d
        }
        "format":"%s", //ntsc, pal
        "deInterlace":"%s",//none","weave","bob" or "blend
        "currentPIPId":%d ,
        "reverseInputSource" : %b
   }
}
```


### 4.3 setDeviceConfig

* URL: http://HostName:Port/api/deviceConfig
* Method: PATCH
* Parameters: 

```
{
   "device":
   {
        "id":%d,
        "videoInput":["%s",…], //"hdmi1","hdmi2","sdi1","sdi2"
        "audioInput":"%s", //embed, 3.5mm
        "audioParam":{
            "micMix":%b, // enable/disable
            "micInput":"%s", //xlr , 3.5mm
            "soundControl":%d, //0~100
            "micPercentage":%d, //0~100
            "audioPercentage":%d //0~100
        },
        "videoParam":{
            "brightness":%d,
            "contrast":%d,
            "hue":%d,
            "saturation":%d
        }
      "format":"%s", //ntsc, pal
      "deInterlace":"%s",//none","weave","bob" or "blend
      "currentPIPId":%d ,
      "reverseInputSource" : %b
   }
}
```

### 4.4 getInputSignalStatus

* URL: http://HostName:Port/api/inputSignalStatus
* Method: GET

* Response

```
    {
        "result ":%d,
        "signalStatuses":[
           {
              "deviceID" : %d,
              "sourceType":"%s",
              "hdcp":%b,
              "sourceChange":%b,
              "quality ":%d,
              "height ":%d,
              "width ":%d,
              "isInterlaced ":%b,
              "currentBitrate":%d
           }
        ]
    }
```

* Description

|      Name      |                        Description                        |
|----------------|-----------------------------------------------------------|
| sourceType     | Which source type is streaming at this task               |
| hdcp           | Hdcp=true, it meant protect on. Hdcp=false, it meant protect off |
| sourceChange   | 0 = not changed, 1 = changed.                             |
| quality        | The strength of stream signal. Between 0 and 100          |
| height         | The height of the stream resolution                       |
| width          | The width of the stream resolution                        |
| isInterlaced   | 0 = Progressive, 1 = Interlaced                           |
| currentBitrate | Current streaming bitrate.(kbit)                          |


### 4.5 getDeviceTask

* URL: http://HostName:Port/api/deviceTask
* Method: GET
* Parameters: 

session, deviceID, taskID = 0 , list all device tasks

|   Name   | type |            Description            |
|----------|------|-----------------------------------|
| deviceID | Int  | id = 0, mean get all device tasks |
| taskID   | Int  | id = 0, mean get all device tasks |

* Response:
```
{
	"result":%d,
	"devices": [{
		"id":%d,
		"tasks":
			[{
				"id":%d,
				"streamID":%d,
				"profileID":%d
			}]
	}]
}
  
```

### 4.6 setDeviceTask

* URL: http://HostName:Port/api/deviceTask

* Method: POST (New Task)

```
{
	"devices": {
		"id" : 1,
		"tasks": 
			[{
				"streamID":1,
				"profileID":1001
			}]
	} 
}
```

* Method: PATCH (Update the Task)

```
{
	"device": {
		"id" : 1,
		"tasks": {
			"id" : 1,
			"streamID":1, (option)
			"profileID":1001 (option)
		}
	} 
}
```

* Response

```
{
    "result":%d,
    "tasks":[
    {
        "dievceID": 1,
        "taskID": 1
    },
    {
        "dievceID": 1,
        "taskID": 2
    }]
}
```

### 4.7 startTask
* URL: http://HostName:Port/api/startTask
* Method: POST

### 4.8 stopTask
* URL: http://HostName:Port/api/stopTask
* Method: POST

### DeleteTask
* URL: http://HostName:Port/api/deleteTask
* Method: Delete

#### startTask/stopTask/DeleteTask paramters: 

```
{
   "tasks": [{
        "deviceID": 1,
        "taskID" : 1
   } ]
}
```

* Response

```
{
        "result":%d
}

```



### 4.9 getTaskStatus

* URL: http://HostName:Port/api/taskStatus
* Method: GET
* Parameters: 

| Name | type |               Description               |
|------|------|-----------------------------------------|
| id   | int  | device id , id = 0 get all tasks status |

* Response

```
{
	"result":%d,
	"tasks": 
		[{
         "dievceID": %d,
			"taskID": %d,
			"isStart":%d, //(streaming)
			"status":%d, 
			"errorCode":%d,
			"streamTime":%d
		}]
}
```
* Description

|   Name  |                          Description                          |
|---------|---------------------------------------------------------------|
| result  | 103:parameter value invalid, 102:session ineffective(Expired) |
| isStart | 1:stream start, 0:not start                                   |
| status  | 1:streaming, 2:prepare stream, 0: stream paused, -1:error     |



## 5. Profiles Management

* Description

|     Name    |                     Description                     |
|-------------|-----------------------------------------------------|
| x type        | the encoding type of the profile                    |
| streamType  | Filter by specific protocol."TCP,RTMP…"             |
| category    | Box define group.                                   |
| name        | Name of this profile                                |
| width       | the width of the video resolution                   |
| height      | the height of the video resolution                  |
| bitrate     | the bitrate of the video encoding, its unit is kbps  2~102400 |
| profile     | the profile type of the video encoding              |
| level       | the level of the video encoding                     |
| encodeMode  | the mode of the video encoding                      |
| entropyMode | the Entropy Mode of the video encoding              |
| frame       | Keyframe Value = 1~65536                                         |
| frameRate   | 30,50,60                                         |
| bframeNum   | the B frame number of the video encoding            |
| outputRatio |                                                     |
| audioInfo   | If is exist mean audio only                         |
| channel     | the channel number for audio encoding               |
| sampleRate  | the sample rate for audio encoding, its unit is Hz  |
| bitrate     | the bitrate for audio encoding, its unit is bps     |
| encodeMode  | the mode of the video encoding                      |

| container | "flv","avi","mp4","mov","ts","aac","mp3" |
| videoType | h264,h265,mjpeg                          |
| audioType | mp3,aac-lc                               |



- videoType ['h264','h265','mjpeg']
- audioType ['aac','mp3']

- category: 
    - 0: the custom profile (id from 1001 ~ )
    - 1: the best quality (id from 1 ~ 10)
    - 2: high quality (id from 11 ~ 20)
    - 3: medium quality (id from 21 ~ 30)
    - 4: low quality (id from 31 ~ 40)
    - 5: ustream group (id from 101 ~ 110)
    - 6: twitch group (id from 201 ~ 210)
    - 7: youtube (id from 301 ~ 310)

- profile: 
    - "baseline"
    - "high"
    - "main"

- bitrate : 2~102400 (video)

- frame : 1~65536

- entropyMode: 
  - CAVLC
  - CABAC

- bframeNum: 0-3
- level:
    - "1"
    - "1.1"
    - "1.2"
    - "1.3"
    - "2"
    - "2.1"
    - "2.2"
    - "3"
    - "3.1"
    - "3.2"
    - "4"
    - "4.1"
    - "4.2"
    - "5"
    - "5.1"

- encodeMode:
    - "cbr"
    - "vbr"
    - "avbr_fixqp"

- entropyMode:
    - "cavlc"
    - "cabac"


- outputRatio:
    - 0: original ratio 
    - 1: 16:9
    - 2: 4:3

- channel:
    - "mono"
    - "stereo"

- encodeMode:
    - "aac"
    - "mp3"

- bitrate : (audio)
  - AACLC:
    - Mono: 48000, 64000, 96000, 128000, 256000
    - Stereo : 48000, 64000, 96000, 128000, 256000,320000

  - MP3
    - Stereo : 32000, 40000,48000, 56000,64000,80000,96000,112000,128000,160000,192000,224000,256000,320000

### 5.1 getEncodeProfileList
* URL: http://HostName:Port/api/encodeProfileList
* Method: GET
* Response

```
{
		"result":%d,
		"profiles": 
			[
        {
            "id":1,
            "videoType":"h265",
            "audioType":"aac",
            "container":["mp4","mov","ts","aac"],
            "streamType":[1,2,3,6,7,8,11,13,14,51,106],
            "category":1,
            "name":"H.265 Main Profile VBR 1920x1080 [11.192 Mbps]"
        }
      ]
}

```



### 5.2 getEncodeProfile
* Method: GET
* Parameters: 

| Name | type |        Description         |
|------|------|----------------------------|
| id   | Int  | The specified profile’s id |

* Response:

Video

```
{
    "result":%d,
    "profile": 
    {
        "id": %d,
        "videoType":%d,
        "audioType":%d,
        "container": [%d,%d…],
        "streamType": [%d,%d…],
        "category ": %d,
        "name ": "%s",
        "dropFrameMode":%d,
        "delayTime":%d,
        "lastFrameMode:%d,
        "videoInfo" : {
            "width":%d,
            "height":%d,
            "bitrate":%d,
            "profile":%d,
            "level ":%s,
            "encodeMode":%d,
            "entropyMode":%d,
            "frame":%d, //keyframe
            "frameRate":%d,
            "bframeNum":%d,
            "outputRatio":%d,
            "nullPacket":%s
        }
        "audioInfo" : {
            "channel":%d,
            "sampleRate":%d,
            "bitrate":%d,
            "encodeMode":%d
        }
    }
}
```

Video Only

```
{
    "result":%d,
    "profile": 
    {
        "id": %d,
        "VideoType":%d,
        "streamType": [%d,%d…],
        "category ": %d,
        "name ": "%s",
        "dropFrameMode":%d,
        "delayTime":%d,
        "lastFrameMode:%d,
        "videoInfo" : { ... }
    }
}
```

Audio Only

```
{
    "result":%d,
    "profile": 
    {
        "id": %d,
        "streamType": [%d,%d…],
        "category ": %d,
        "name ": "%s",
        "dropFrameMode":%d,
        "delayTime":%d,
        "lastFrameMode:%d,
        "audioType" : "%s"
        "audioInfo" : { ... }
    }
}
```

### 5.3 addEncodeProfile

* URL: http://HostName:Port/api/encodeProfile
* Method: POST
```
{
    "profile": {
        "audioInfo": {
            "bitrate": 64000,
            "channel": "stereo"
        },
        "audioType": "aac",
        "name": "asdasd",
        "videoInfo": {
            "bframeNum": 0,
            "bitrate": 17500,
            "encodeMode": "avbr_fixqp",
            "entropyMode": "cabac",
            "frame": 28,
            "frameRate": 30,
            "gopMode": "normalp",
            "height": 720,
            "outputRatio": 0,
            "profile": "high",
            "width": 1280
        },
        "videoType": "h264"
    }
}
```
### 5.4 modifyEncodeProfile

* URL: http://HostName:Port/api/encodeProfile
* Method: PATCH (Modify some attribute)
* Method: PUT (Replace entire attribute)

### 5.5 removeEncodeProfile

* URL: http://HostName:Port/api/encodeProfile
* Method: DELETE
* Parameters

| Name | type |           Description            |
|------|------|----------------------------------|
| id   | Int  | the specified profile identifier |

## 7. CDN Management

### 7.1 authenticateCDN 
* URL: http://HostName:Port/api/authenticateCDN
* Method: POST
* Parameters:

|   Name   |  Type  |                  Description                  |
|----------|--------|-----------------------------------------------|
| streamType     | int    | 6  RTMP, 14 CDNvideo, 106 RTMP CMS, 11:Ustream |
| username | String | Login username                                |
| password | String | Login password                                |

### 7.2 authenticateOauth
* URL: http://HostName:Port/api/authenticateOauth
* Description: Authenticate CDN for youtube, facebook, twitch
* Method: POST
* Parameters:

| Name |  Type  |    Description    |
|------|--------|-------------------|
| streamType   | int | 12:twitch, 13:youtube, 15:facebook |
| code | String | Authenticate code |

* Response 

```
{
  "result" : %d,
  "userID" : "%s"
}
```

### 7.13 getCDNchannelList
* URL: http://HostName:Port/api/CDNchannelList
* Description: for CDNvideo, Ustream
* Method: GET

| Name | Type |       Description       |
|------|------|-------------------------|
| streamType | int  | 14 CDNvideo, 11:Ustream |streamTy


* Response:
```
{
    "result":%d,
    "channelList":{
        "streamType":%d,//streamType
        "channels":[ 
            {
               "channelID":%d,
               "channelName":%s
               "channelUrl":%s,
               "channelStreamName":%s,
               "videoID":%s
            },
            …
        ],
    }
}

```

### 7.4 logoutCDN
* URL: http://HostName:Port/api/logoutCDN
* Method: POST
* Parameters:


## 8 CMS Management

### 8.1 getCMSRegStatus
* URL: http://HostName:Port/api/getCMSRegStatus
* Method: GET
* Response:

```
{
    "result": 0,
    "instInfo":{
        "cmsDomain": "10.1.9.122:80",
        "streamConnect": 0
    }
}
```
* Description

|      Name     |  Type  |                           Description                            |
|---------------|--------|------------------------------------------------------------------|
| cmsDomain     | string | If cmsdomain has no value , it has not registered to CMS server. |
| streamConnect | int    | 0 : disconnect,   1 : connect                                    |

### 8.1 connectToCMS
* URL: http://HostName:Port/api/connectToCMS
* Method: POST
* Parameters:
```
{
    "connect": 1, 2//disconnect
    "cmsDomain" : "10.1.9.122:80"
}
```

* Response:
```
{
    "result":0
}
```
## 9 System

### 9.1 getSystemTime
* URL: http://HostName:Port/api/systemTime
* Method: GET
* Response:
```
{
    "result":%d,
    "isSet":%d,
    "time": {
        "year": %d,
        "month": %d,
        "day": %d,
        "hour": %d,
        "minute": %d,
        "second": %d,
        "timezone": %d,
        "timezoneid": %d
    }
}
```

### 9.2 setSystemTime

* URL: http://HostName:Port/api/systemTime
* Method: POST
* Parameters:
```
{
    "result":%d,
    "isSet":%d,
    "time": {
        "year": %d,
        "month": %d,
        "day": %d,
        "hour": %d,
        "minute": %d,
        "second": %d,
        "timezone": %d,
        "timezoneid": %d
    }
}
```

### 9.3 getNetworkConfig //???




* URL: http://HostName:Port/api/networkConfig
* Method: GET
* Response:

```
{
  "result": 0,
  "nic": [
    {
      "dhcp": "%s",
      "dns": ["%s", "%s",],
      "gateway": "%s ",
      "id": "000c56789012",
      "ip": "%s",
      "mask": "%s",
      "name": "%s",
      "enable" : 1 //? %b
    },
    {
      "dhcp": "%s",
      "dns": ["%s", "%s",],
      "gateway": "%s ",
      "id": "%s",
      "ip": "%s",
      "mask": "%s",
      "name": "%s"
    }
  ]
}
```

* Desc
    - dhcp =" auto_ip", auto get ip & dns
    - dhcp ="auto_ip_dns", auto get ip & manual set dns
    - dhcp ="static_ip"
    
### 9.4 setNetworkConfig

* URL: http://HostName:Port/api/networkConfig
* Method: POST / PATCH
* Parameters:

PATCH (Update attribute)
```
{
  "session": 0,
  "nic": {
      "id" : "macaddr",
      "dhcp": "%s",
      "dns": ["%s", "%s",],
      "gateway": "%s ",
      "id": "%s",
      "ip": "%s",
      "mask": "%s",
      "name": "%s"
    }
}
```

### 9.5 getCurrentNetworkStatus
* URL: http://HostName:Port/api/networkStatus
* Method: GET
* Response:

```
{
  "result": 0,
  "nic": [
    {
      "dhcp": "%s",
      "dns": ["%s", "%s",],
      "gateway": "%s ",
      "id": "%s",
      "ip": "%s",
      "mask": "%s",
      "name": "%s"
    },
    {
      "dhcp": "%s",
      "dns": ["%s", "%s",],
      "gateway": "%s ",
      "id": "%s",
      "ip": "%s",
      "mask": "%s",
      "name": "%s"
    }
  ]
}
```

### 9.6 recoveryFactoryConfig
* URL: http://HostName:Port/api/recoveryFactoryConfig
* Method: POST
* Response:

```
{
 "result":%d,
}
```

### 9.7 setRebootSchedule
* URL: http://HostName:Port/api/rebootSchedule
* Method: POST
* Parameters:

```
{
    "enable": true,
    "day": 1,
    "hour": 3,
    "minute": 4,
}
```

### 9.8 getRebootSchedule
* URL: http://HostName:Port/api/rebootSchedule
* Method: GET
* Parameters:

```
{
    "result":0,
    "enable": true,
    "day": 1,
    "hour": 3,
    "minute": 4,
}
```

### 9.9 checkNetworkConnection

* URL: http://HostName:Port/api/checkNetworkConnection
* Method: POST

```
{
    "recordPath": "",
    "username": "",
    "password": ""
}
```

### 9.10 reboot
* URL: http://HostName:Port/api/reboot
* Method: POST

## 10.HTTP FW Update API

### 10.1 uploadFW
* URL: http://HostName:Port/api/uploadFW
* Method: POST
* Parameters

| Name | type | Description |
|------|------|-------------|
| file | file |             |

* Response

```
{
    "result":%d,
    "size":%d,
    "version":%s,
    "fileIsOK":%d,
    "fileCompatible":%d
}

```

### 10.2 updateFW
* URL: http://HostName:Port/api/updateFW
* Method: POST

## 13 PIP Management

### 13.1 getPIPConfigList
* URL: http://HostName:Port/api/PIPConfigList
* Method: GET
* Response
```
{
   "result":%d,
   "config":[
        {
            "id":%d,
            "name":%s,
            "windowPosition":{
                "x":%d,
                "y":%d
            },
            "windowSize": %d,
            "keepRatio":%b,
            "duplicable":%b,
            "isPBP":%b,
            "custom":%b,
        }
    ]
}
```

### 13.2 setPIPConfig

* URL: http://HostName:Port/api/PIPConfig
* Method: POST / PATCH
* Parameters

POST (New Config)

```
{
   "config":{
        "name":%s,
        "windowPosition":{
            "x":%d,
            "y":%d
        },
        "windowSize": %d,
        "keepRatio":%b,
        "duplicable":%b,
        "isPBP":%b,
    }
    
}
```

PATCH (Modify)
```
{
   "config":{
        "id":%d,
        "name":%s,
        "windowPosition":{
            "x":%d,
            "y":%d
        },
        "windowSize": %d,
        "keepRatio":%b,
        "duplicable":%b,
        "isPBP":%b,
    }
}
```

* Response 

```
{
   "result": 0,
   "id" : 1
    
}
```

### 13.3 deletePIPConfig
* URL: http://HostName:Port/api/deletePIPConfig
* Method: Delete
* Parameters

```
{ "ids" : [%d,%d] }
```


### 13.4 inputSourceThumbnail

* URL: http://HostName:Port/api/inputSourceThumbnail?id=1
* Method: GET
* Parameters

| Name | Type | Description |
|------|------|-------------|
| id   | Int  | Device ID   |


## 14. File System

### 14.1 getDirectory

* URL: http://HostName:Port/api/directorys
* Method: GET
* Parameters

|    Name   |  Type  |                       Description                        |
|-----------|--------|----------------------------------------------------------|
| type      | Int    | 0 USB, 1 cifs                                            |
| directory | String | \ 取得根目錄下的列表, \dir1 取得根目錄下的dir1其目錄列表 |


```
{
    "type": 0,
    "directory": "\"
}
```

* Response 
   	

```
{
	    "result": %d,
	    "empty": "%s",
	    "directory": [{
			"name": "%s",
			"subdirectory": "%s",
			"time": %d,
		}],
		"file": [{
			"name": "%s",
			"size": %d,
			"time": %d
			"videoCodec": "%s",
			"audioCodec": "%s",
			"thumbnail": "%s"
		}]
	}
```

   

|      Name      |  Type  |              Description              |
|----------------|--------|---------------------------------------|
| result         | Int    |                                       |
| empty          | String | 0 Is empty folder, 1 Non empty folder |
| directory      | String |                                       |
| - name         | String | directory Name                        |
| - subdirectory | String | Contain sub directory. 0 No, 1 Yes    |
| - time         | String | directory Modification time           |
| file           | String |                                       |
| - name         | String | File name                             |
| - size         | String | File Size                             |
| - time         | String | file Modification time                |
| - videoCodec   | String | Video Codec format                    |
| - audioCodec   | String | Audio Codec format                    |
| - thumbnail    | String | thumbnail Url                         |



### 14.2 Create/Delete Directory

* URL: http://HostName:Port/api/directorys
* Method: POST (New a Directory)
* Method: Delete (Delete Directory)
* Parameters

|    Name   |  Type  |                       Description                        |
|-----------|--------|----------------------------------------------------------|
| type      | int    | 0 USB, 1 cifs                                            |
| directory | String | \ 取得根目錄下的列表, \dir1 取得根目錄下的dir1其目錄列表 |


### 14.3 ModifyDirectory

* URL: http://HostName:Port/api/directorys
* Method: PUT (Modify Directory name)
* Parameters

|    Name   |  Type  |                       Description                        |
|-----------|--------|----------------------------------------------------------|
| type      | int    | 0 USB, 1 cifs                                            |
| directory | String | \ 取得根目錄下的列表, \dir1 取得根目錄下的dir1其目錄列表 |
| name      | String | Created or modification name                             |
