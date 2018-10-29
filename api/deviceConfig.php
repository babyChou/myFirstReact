<?php 
include_once('./_db.php');

$deviceConfigColl = $collection->DEVICE_CONFIG;
$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

function getAuthorizationHeader(){
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    }
    else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        // Server-side fix for bug in old Android versions (a nice side-effect of this fix means we don't care about capitalization for Authorization)
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        //print_r($requestHeaders);
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}
// echo getAuthorizationHeader();
// var_dump(getAuthorizationHeader());


// var_dump(getBearerToken());

// foreach (array_expression as $value)
//     statement
// foreach (array_expression as $key => $value)
//     statement

switch ($method) {
	case 'PATCH':
		$req = json_decode(file_get_contents('php://input'), true);

        $device = $req['device'];
        $deviceID = $device['id'];
        $setArr = [];

        foreach ($device as $k => $val) {
        	if($k === 'audioParam' || $k === 'videoParam') {
        		// $setArr[$k] = $val;
        		 foreach ($val as $k2 => $val2) {
        		 	$setArr[$k.'.'.$k2] = $val2;

        		 }
        	}else{
        		$setArr[$k] = $val;
        	}

        }
        
        $document = $deviceConfigColl->findOneAndUpdate(
            ['id' => $deviceID],
            ['$set' => $setArr],
            ['upsert' => true]
        );

        // var_dump($document->findOne());
        // var_dump($device);

		echo json_encode(array(
			'result' => 0,
			'auth' => getAuthorizationHeader()
		));

		// $result = $taskColl->insertOne( [ 'name' => 'Hinterland', 'brewery' => 'BrewDog' ] );

		break;
	case 'GET':
		$resp = new stdClass();
		if(!isset($_GET['id'])) {
			$resp->result = 102;
			echo json_encode($resp);
			exit();
		}

		$deviceID = (int)$_GET['id'];
		$results = $deviceConfigColl->find( [ 'id' => $deviceID ] );
		$resultDevice = [];


		foreach ($results as $result) {
		    // echo $result['id'];
		    foreach ($result as $k => $val) {
		    	// echo $k;
		    	if($k !== '_id') {
		    		$resultDevice[$k] = $val;
		    	}
		    }

		}


		echo json_encode(array(
			'result' => 0,
			'device' => $resultDevice
		));
		
	
		break;
	
	default:
		# code...
		break;
}


?>