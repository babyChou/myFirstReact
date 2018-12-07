<?php 

$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');


$method = $_SERVER['REQUEST_METHOD'];
$string = file_get_contents("./encodeProfileList.json");
$json_data = json_decode($string, true);

if($method === 'GET') {
	
	$result = new stdClass();

	$result->result = 0;
	$result->profiles = [];

	foreach ($json_data as $obj) {
		$currProfile = [
			'id' => $obj['id'],
			'category' => $obj['category'],
			'name' => $obj['name'],
			'container' => $obj['container'],
			'streamType' => $obj['streamType']
		];
		

		if(isset($obj['videoType'])) {
			$currProfile['videoType'] = $obj['videoType'];
		} 
		if(isset($obj['audioType'])) {
			$currProfile['audioType'] = $obj['audioType'];
		} 

		array_push($result->profiles, $currProfile);

		// var_dump($obj);
	}

	echo json_encode($result);

	
}

?>