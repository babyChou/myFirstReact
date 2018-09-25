<?php 
include_once('./_db.php');
$taskColl = $collection->TASK;

$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

$req = json_decode(file_get_contents('php://input'), true);

$tasks = $req['tasks'];

// $resp = new stdClass();
// if(!isset($tasks[0]['dievceID']) || !isset($tasks[0]['taskID'])) {
// 	$resp->result = 102;
// 	echo json_encode($resp);
// 	exit();
// }


foreach ($tasks as $task) {
	$deviceID = $tasks['dievceID'];
	$taskID = $tasks['taskID'];
	
	$document = $taskColl->findOneAndUpdate(
			['DEVICE_ID' => $deviceID, 'TASK_ID' => $taskID],
			['$set' => [
				'isStart' => 1,
				'status' => 1
			]
		]
	);
}





$json = json_decode('{"result":0}');
echo json_encode($json);

?>