<?php 
$string = file_get_contents("./getCMSRegStatus");
$json_data = json_decode($string, true);

$reqJson = json_decode(file_get_contents('php://input'), true);

foreach($reqJson as $key => $value) {
	if(isset($json_data['instInfo'][$key])) {
		$json_data['instInfo'][$key] = $value;
	}else{
		$json_data['instInfo']['streamConnect'] = $value;
	}
	
}

$fp = fopen('./getCMSRegStatus', 'w');
fwrite($fp, json_encode($json_data));
fclose($fp);

echo json_encode(array(
	'result' => 0
));

?>