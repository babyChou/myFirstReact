
<?php

include_once('./_db.php');

$collection = $collection->STREAM_PROFILE;
$code = 200;
http_response_code($code);
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
// if($method === "OPTIONS") {
//     $headers = apache_request_headers();
//     foreach ($headers as $header => $value) {
//         if($header === 'Access-Control-Request-Method') {
//             $method = $value;
//         }
//         // echo "$header: $value; <br />\n";
//     }

//     echo file_get_contents('php://input');
// }


switch ($method) {
    case 'POST':

        $req = json_decode(file_get_contents('php://input'), true);
        $profile = $req['streamProfile'];
        // var_dump($profile);
        // $sqlResult = $collection->insertOne($profile);

        
        echo json_encode(array(
            'result' => 0,
            // 'id' => $profile['id']
            'id' => 1
        ));


        break;
    case 'PATCH':
        break;
    case 'PUT':
        $req = json_decode(file_get_contents('php://input'), true);
        $profile = $req['streamProfile'];
        $resp = new stdClass();
        if(!isset($profile['id'])) {
            $resp->result = 102;
            echo json_encode($resp);
            exit();
        }

        $streamID = $profile['id'];

        echo json_encode(array(
            'result' => 0,
            'id' => $streamID
        ));

        break;
    case 'GET':
        $resp = new stdClass();
        if(!isset($_GET['id'])) {
            $resp->result = 102;
            echo json_encode($resp);
            exit();
        }

        $streamID = (int)$_GET['id'];

        // $sqlResult = $collection->find( [ '_id' => $streamID] );

        // echo json_encode(array(
        //     'result' => 0,
        //     'streamProfile' => $sqlResult
        // ));

        $a = '{
              "result": 0,
              "streamProfile": {
                "id": '.$streamID.',
                "name": "aaaa",
                "setPid": true,
                "streamType": 6,
                "nic" : 1,
                "rtmp": {
                    "rtmpUrl": "",
                    "playBackUrl": "",
                    "rtmpBackupUrl": "",
                    "rtmpStreamName":"%s ",
                    "enableAuthorize": true ,
                    "rtmpUser":"%s",
                    "rtmpPasswd":"%s"
                }
              }
        }';

        $a = trim(preg_replace('/\s+/', ' ', $a));
        $a = json_decode($a);
        echo json_encode($a);
        break;
}
?>


