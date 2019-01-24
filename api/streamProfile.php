
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
        $id = 1;

        $qProfiles = $collection->find();

        foreach ($qProfiles as $item) {
            if($item['id'] >= $id) {
                $id += 1;
            }
        }

        $profile['id'] = $id;

        $insertOneResult = $collection->insertOne($profile);

        
        echo json_encode(array(
            'result' => 0,
            'id' => $profile['id']
        ));


        break;
    case 'PATCH':
        $req = json_decode(file_get_contents('php://input'), true);
        $profile = $req['streamProfile'];
        $resp = new stdClass();
        if(!isset($profile['id'])) {
            $resp->result = 102;
            echo json_encode($resp);
            exit();
        }

        $setArr = new stdClass();

        foreach ($profile as $k => $val) {
            if(is_object($val) || is_array($val)) {
                // $setArr[$k] = $val;
                 foreach ($val as $k2 => $val2) {
                    // $setArr[$k.'.'.$k2] = $val2;
                    $setArr->$k->$k2 = $val2;
                 }
            }else{
                $setArr->$k = $val;
            }

        }

        $document = $collection->findOneAndUpdate(
            ['id' => $profile['id']],
            ['$set' => $setArr],
            ['upsert' => true]
        );

        echo json_encode(array(
            'result' => 0
        ));

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

        $document = $collection->replaceOne(
            ['id' => $profile['id']],
            $profile,
            ['upsert' => true]
        );

        echo json_encode(array(
            'result' => 0
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

        $sqlResult = $collection->find( [ 'id' => $streamID] );

        $streamProfile = [];


        foreach ($sqlResult as $result) {
            // echo $result['id'];
            foreach ($result as $k => $val) {
                // echo $k;
                if($k !== '_id') {
                    $streamProfile[$k] = $val;
                }
            }

        }

        echo json_encode(array(
            'result' => 0,
            'streamProfile' => $streamProfile
        ));

        // $a = '{
        //       "result": 0,
        //       "streamProfile": {
        //         "id": '.$streamID.',
        //         "name": "aaaa",
        //         "setPid": true,
        //         "streamType": 6,
        //         "nic" : 1,
        //         "rtmp": {
        //             "rtmpUrl": "",
        //             "playBackUrl": "",
        //             "rtmpBackupUrl": "",
        //             "rtmpStreamName":"%s ",
        //             "enableAuthorize": true ,
        //             "rtmpUser":"%s",
        //             "rtmpPasswd":"%s"
        //         }
        //       }
        // }';

        // // echo $a;
        // $a = trim(preg_replace('/\s+/', ' ', $a));
        // $a = json_decode($a);
        // echo json_encode($a);
        break;
}
?>


