<?php 
include_once('./_db.php');
$taskColl = $collection->TASK;

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// $reqJson = json_decode(file_get_contents('php://input'), true);
// var_dump($reqJson);

$req = json_decode(file_get_contents('php://input'), true);

$tasks = $req['tasks'];

foreach ($tasks as $k => $task) {
	$deviceID = $task['deviceID'];
	$taskID = $task['taskID'];
	
	$document = $taskColl->findOneAndUpdate(
			['DEVICE_ID' => $deviceID, 'TASK_ID' => $taskID],
			['$set' => [ 'isStart' => 0, 'status' => 0 ] ]
	);
}



$json = json_decode('{"result":0}');
echo json_encode($json);

?>