<?php 

header('Content-Type: application/json');

$tzlist = file_get_contents("./_timezoneList.json");
$config = file_get_contents("./_systemTimeConfig.json");

$method = $_SERVER['REQUEST_METHOD'];

// $tzlist = DateTimeZone::listIdentifiers(DateTimeZone::ALL);

$config = json_decode($config, true);



if($method === 'GET') {

	$systemTime = [
		'result' => 0,
		'time' => $config
	];

	echo json_encode($systemTime);

}else{
	$req = json_decode(file_get_contents('php://input'), true);

	foreach($req as $key => $value) {
		// echo $key;
	    if(is_array($value)) {
		    foreach($value as $key2 => $value2) {
		    	$config[$key][$key2] = $value2;
		    }
	    }else{
	    	$config[$key] = $value;
	    }

	}


	$fp = fopen('./_systemTimeConfig.json', 'w');
	fwrite($fp, json_encode($config));
	fclose($fp);

	echo json_encode(array(
		'result' => 0
	));


}







?>

