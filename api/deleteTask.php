<?php 
include_once('./_db.php');
$taskColl = $collection->TASK;
$streamColl = $collection->STREAM_PROFILE;

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// $reqJson = json_decode(file_get_contents('php://input'), true);
// var_dump($reqJson);


$req = json_decode(file_get_contents('php://input'), true);


$tasks = $req['tasks'];

$delStreamProfiles = [];


foreach ($tasks as $k => $task) {
	$deviceID = $task['deviceID'];
	$taskID = $task['taskID'];

	$result = $taskColl->find(['DEVICE_ID' => $deviceID, 'TASK_ID' => $taskID]);

	foreach ($result as $entry) {
		// echo  $entry['PROFILE_ID']; 
		array_push($delStreamProfiles, $entry['STREAM_ID']);
	}
	
	$document = $taskColl->deleteOne(['DEVICE_ID' => $deviceID, 'TASK_ID' => $taskID]);
}

foreach ($delStreamProfiles as $i=> $id) {
	$streamColl->deleteOne(['id' => $id ]);
}

// var_dump($delStreamProfiles);

$json = json_decode('{"result":0}');
echo json_encode($json);

?>