<?php 
include_once('./_db.php');

$deviceConfigColl = $collection->DEVICE_CONFIG;
$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

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
        	if($k === 'audioParam') {
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
			'result' => 0
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