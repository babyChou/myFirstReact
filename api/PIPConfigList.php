<?php 
include_once('./_db.php');
$collection = $collection->PIP_CONFIG;

$code = 200;
http_response_code($code);
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];//Access-Control-Request-Method




switch ($method) {
	case 'POST':
	
		$req = json_decode(file_get_contents('php://input'), true);
		$id = 1;

		$config = $req['config'];

		$queryConfig = $collection->find();

        foreach ($queryConfig as $item) {
            if($item['id'] >= $id) {
                $id += 1;
            }
        }

        $config['id'] = $id;

        $insertOneResult = $collection->insertOne($config);

        echo json_encode(array(
            'result' => 0,
            'id' => $config['id']
        ));


		break;
	case 'PATCH':
		$resp = new stdClass();
		
		$req = json_decode(file_get_contents('php://input'), true);
		$config = $req['config'];

        if(!isset($config['id'])) {
            $resp->result = 102;
            echo json_encode($resp);
            exit();
        }

        foreach ($config as $k => $val) {
            if(is_object($val) || is_array($val)) {
                // $setArr[$k] = $val;
                 foreach ($val as $k2 => $val2) {
                    $setArr[$k.'.'.$k2] = $val2;
                 }
            }else{
                $setArr[$k] = $val;
            }

        }

        $document = $collection->findOneAndUpdate(
            ['id' => $config['id']],
            ['$set' => $setArr],
            ['upsert' => true]
        );

        echo json_encode(array(
            'result' => 0
        ));

		break;
	case 'GET':
		

		$result = $collection->find();

		$list = array();
		
		foreach ($result as $entry) {
			$resp = new stdClass();
			$resp->id = $entry['id'];
			$resp->name = $entry['name'];
			$resp->windowPosition = $entry['windowPosition'];
			$resp->windowSize = $entry['windowSize'];
            $resp->keepRatio = $entry['keepRatio'];
            $resp->duplicable = $entry['duplicable'];
            $resp->isPBP = $entry['isPBP'];
			$resp->custom = $entry['custom'];

			array_push($list, $resp);


		}

		echo json_encode(array(
			'result' => 0,
			'config' => $list
		));

		break;
	

}


?>