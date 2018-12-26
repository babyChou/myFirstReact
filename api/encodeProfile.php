<?php 

include_once('./_xml2json.php');

$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');


$method = $_SERVER['REQUEST_METHOD'];
$string = file_get_contents("./encodeProfileList.json");
$json_data = json_decode($string, true);



if($method === 'GET') {
	$resp = new stdClass();

	if(!isset($_GET['id'])) {
		$resp->result = 102;
		echo json_encode($resp);
		exit();
	}

	$id = (int)$_GET['id'];
	$resp->result = 0;
	

	foreach ($json_data as $obj) {
		if($obj['id'] === $id) {
			$resp->profile = $obj;
		}
	}

	echo json_encode($resp);

}else if($method === 'POST'){
	$reqJson = json_decode(file_get_contents('php://input'), true);
	$customIDArr = array();
	$newID = 0;
	$add_data = [
		'category' => 0,
		'container' => ["avi", "mov","mp4"],
		'streamType' => [1,2,3]
	];

	foreach ($json_data as $obj) {
		if($obj['id'] > 1000) {
			$customIDArr[] = $obj['id'];
		}
	}

	if(empty($customIDArr)) {
		$customIDArr[] = 1000;
	}

	$newID = max($customIDArr) + 1;

	$add_data['id'] = $newID;

	foreach($reqJson['profile'] as $key => $value) {
		// echo $key;
	    if(is_array($value)) {
		    foreach($value as $key2 => $value2) {//config , streamSetting
		    	$add_data[$key][$key2] = $value2;
		    }
	    }else{
	    	$add_data[$key] = $value;
	    }

	}
	$json_data[] = $add_data;

/*	echo $newID,"\n";
	print_r($json_data);*/

	$fp = fopen('./encodeProfileList.json', 'w');
	fwrite($fp, json_encode($json_data));
	fclose($fp);

	echo json_encode(array(
		'result' => 0
	));
}else if($method === 'PUT'){

	$reqJson = json_decode(file_get_contents('php://input'), true);
	$id = $reqJson['profile']['id'];

	foreach ($json_data as $indx => $obj) {
		if($obj['id'] === $id) {
			foreach($reqJson['profile'] as $key => $value) {
				$json_data[$indx][$key] = $value;
			}

			foreach ($obj as $mKey => $mVal) {
				if(!in_array($mKey, ['category', 'container', 'streamType'])) {

					if(empty($reqJson['profile'][$mKey])) {
						unset($json_data[$indx][$mKey]);
					}
				}
				
			}


		}
	}

/*
echo $id,"\n";
print_r($json_data);*/



	$fp = fopen('./encodeProfileList.json', 'w');
	fwrite($fp, json_encode($json_data));
	fclose($fp);

	echo json_encode(array(
		'result' => 0
	));

}else{
	$reqJson = json_decode(file_get_contents('php://input'), true);
	$id = $reqJson['id'];

	foreach ($json_data as $indx => $obj) {
		if($obj['id'] === $id) {
			unset($json_data[$indx]);
		}
	}

	$fp = fopen('./encodeProfileList.json', 'w');
	fwrite($fp, json_encode($json_data));
	fclose($fp);

	echo json_encode(array(
		'result' => 0
	));

}


?>