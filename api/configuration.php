<?php 

$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');


$method = $_SERVER['REQUEST_METHOD'];
$string = file_get_contents("./configuration.json");
$json_data = json_decode($string, true);

if($method === 'GET') {
	// $result = new stdClass();
	// $config = new stdClass();
	// $config->language = "zh_CN";
	// $config->deviceName = "deviceName";
	// $config->version = "v123";

	// $result->result = 0;
	// $result->config = $config;
	// $result->streamSetting = [
	// 	'autoStart' => 0
	// ];

	// echo $string;//51137894
	
	echo json_encode($json_data);
}else if($method === 'POST'){
	$reqJson = json_decode(file_get_contents('php://input'), true);
	// var_dump(file_get_contents('php://input'));

	foreach($reqJson as $key => $value) {
		// echo $key;
	    if(is_array($value)) {
		    foreach($value as $key2 => $value2) {//config , streamSetting
		    	$json_data[$key][$key2] = $value2;
		    }
	    }else{
	    	$json_data[$key] = $value;
	    }

	}

	// echo json_encode($json_data); //debug

	$fp = fopen('./configuration.json', 'w');
	fwrite($fp, json_encode($json_data));
	fclose($fp);

	echo json_encode(array(
		'result' => 0
	));
}


?>