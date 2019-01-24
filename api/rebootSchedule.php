<?php 

header('Content-Type: application/json');


$method = $_SERVER['REQUEST_METHOD'];

$string = file_get_contents("./rebootSchedule.json");
$config_data = json_decode($string, true);


if($method === 'POST') {
	$req = json_decode(file_get_contents('php://input'), true);

	foreach($req as $key => $value) {
		// echo $key;
	    if(is_array($value)) {
		    foreach($value as $key2 => $value2) {//config , streamSetting
		    	$config_data[$key][$key2] = $value2;
		    }
	    }else{
	    	$config_data[$key] = $value;
	    }

	}

	// echo json_encode($config_data); //debug

	$fp = fopen('./rebootSchedule.json', 'w');
	fwrite($fp, json_encode($config_data));
	fclose($fp);


	$json = json_decode('{"result":0}');
}else{
	$config_data['result'] = 0;
	$json = $config_data;
}

echo json_encode($json);

?>