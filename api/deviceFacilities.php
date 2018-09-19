<?php
$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

    echo '{
            "result":0,
            "devices":[
            {
                "id":1,
                "videoInput":["hdmi1","hdmi2","sdi1","sdi2"],
                "audioInput": [ "hdmi1", "hdmi2"],
                "audioMix":true,
                "mixInput": ["xlr", "3.5mm"]
            },
            {
                "id":2,
                "videoInput":["hdmi1","hdmi2","sdi1","sdi2"],
                "audioInput": [ "hdmi1", "hdmi2", "3.5mm"],
                "audioMix":false
            }
            ]
    }';
?>