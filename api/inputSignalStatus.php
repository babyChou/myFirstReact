<?php

include_once('./_db.php');
$deviceConfigColl = $collection->DEVICE_CONFIG;

$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];


    $resp = new stdClass();
  
    $results = $deviceConfigColl->find();
    $sourceArr = [];

    // var_dump($results->$database);


    foreach ($results as $result) {
        // echo $result['id'];
        // var_dump($result['videoInput']);

        foreach ($result['videoInput'] as $sourceType) {
            $fillData = [
                'deviceID' => $result['id'],
                'sourceType' => $sourceType,
                'hdcp' => !!(rand(0,1)),
                'sourceChange' => 0,
                'quality' => rand(0,100),
                'height' => 1920,
                'width' => 620,
                'isInterlaced' => !!(rand(0,1)),
                'currentBitrate' => rand(300,10000) 
            ];

            switch($sourceType) {
                case 'hdmi1':
                    $fillData['quality'] = 0;
                    $fillData['height'] = 720;
                    break;
                case 'hdmi2':
                    $fillData['quality'] = 100;
                    $fillData['hdcp'] = false;
                    break;
                case 'sdi1':
                    $fillData['currentBitrate'] = 5000;
                    break;
                case 'sdi2':
                    $fillData['width'] = rand(0, 320);
                    break;

            }
            array_push($sourceArr, $fillData);
        }
    
    }


    // echo json_encode($sourceArr);
    echo json_encode([
        'result' => 0,
        'signalStatuses' => $sourceArr
    ]);



// [
// {
//   "result ": 0,
//   "sourceType":"%s",
//   "hdcp":%d,
//   "sourceChange":%d,
//   "quality ":%d,
//   "height ":%d,
//   "width ":%d,
//   "isInterlaced ":%d,
//   "currentBitrate":%d
// }
// ]
?>
