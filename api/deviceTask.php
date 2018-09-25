<?php 
include_once('./_db.php');
$taskColl = $collection->TASK;

$code = 200;
http_response_code($code);
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];//Access-Control-Request-Method


// foreach (array_expression as $value)
//     statement
// foreach (array_expression as $key => $value)
//     statement

// echo $_SERVER['REQUEST_METHOD'];

switch ($method) {
	case 'POST':
		//>>> MOCK TEST
		// $req = json_decode(file_get_contents('php://input'), true);
		// $devices = $req['devices'];

		// $deviceID = $devices[0]['id'];
		// $taskID = 1;

	
		// echo json_encode(array(
		// 	'result' => 0,
		// 	'tasks' => [[
		// 		'deviceID' => $deviceID,
		// 		'taskID' => $taskID
		// 	]]
		// ));
		// exit();
		//<<< MOCK TEST
	
		$req = json_decode(file_get_contents('php://input'), true);

		$devices = $req['devices'];

		foreach($devices as $key => $device) {
			$deviceID = $device['id'];
			$result = $taskColl->find([ 'DEVICE_ID' => $deviceID ]);
			$newTaskID = 1;
			$tasks = [];
			
			foreach ($result as $entry) {
				
				if($newTaskID <= $entry['TASK_ID']) {
					$newTaskID++;
				}
			}

		
			foreach($device['tasks'] as $task) {
				$t = new stdClass();
				$document = $taskColl->findOneAndUpdate(
					['DEVICE_ID' => $deviceID],
					['$set' => [
						'TASK_ID' => $newTaskID,
						'STREAM_ID' => $task['streamID'],
						'PROFILE_ID' => $task['profileID'],
						'isStart' => 0,
						'status' => 0
						]
					],
					['upsert' => true]
				);

				$t->deviceID = $deviceID;
				$t->taskID = $newTaskID;

				array_push($tasks, $t);

				$newTaskID++;
			}
		
	
		}

		echo json_encode(array(
			'result' => 0,
			'tasks' => $tasks
		));

		// $result = $taskColl->insertOne( [ 'name' => 'Hinterland', 'brewery' => 'BrewDog' ] );

		break;
	case 'PATCH':
		$resp = new stdClass();
		if(!isset($_GET['deviceID']) || !isset($_GET['taskID'])) {
			$resp->result = 102;
			echo json_encode($resp);
			exit();
		}
		//>>> MOCK TEST
		// $req = json_decode(file_get_contents('php://input'), true);
		// $devices = $req['devices'];


		// $deviceID = $devices[0]['id'];
		// $taskID = $devices[0]['tasks'][0]['id'];

	
		// echo json_encode(array(
		// 	'result' => 0,
		// 	'tasks' => [[
		// 		'deviceID' => $deviceID,
		// 		'taskID' => $taskID
		// 	]]
		// ));
		// exit();
		//<<< MOCK TEST
		$req = json_decode(file_get_contents('php://input'), true);

		$devices = $req['devices'];

		foreach($devices as $key => $device) {
			$deviceID = $device['id'];
			$tasks = [];
		
			foreach($device['tasks'] as $task) {
				$t = new stdClass();
				$document = $taskColl->findOneAndUpdate(
					['DEVICE_ID' => $deviceID, 'TASK_ID' => $task['id']],
					['$set' => [
						'STREAM_ID' => $task['streamID'],
						'PROFILE_ID' => $task['profileID']
						]
					]
				);

				$t->deviceID = $deviceID;
				$t->taskID = $task['id'];

				array_push($tasks, $t);
			}
		
	
		}

		echo json_encode(array(
			'result' => 0,
			'tasks' => $tasks
		));
		break;
	case 'GET':
		$resp = new stdClass();
		if(!isset($_GET['deviceID']) || !isset($_GET['taskID'])) {
			$resp->result = 102;
			echo json_encode($resp);
			exit();
		}

		$deviceID = (int)$_GET['deviceID'];
		$taskID = (int)$_GET['taskID'];

		$devices = array();

		if($deviceID === 0 && $taskID === 0) {
			$result = $taskColl->find();
		}else{
			$result = $taskColl->find( [ 'DEVICE_ID' => $deviceID, 'TASK_ID' => $taskID ] );
		}

		
		foreach ($result as $entry) {
			$device = new stdClass();
			$device->id = $entry['DEVICE_ID'];
			$device->tasks = [];
			array_push($devices, $device);

			$task = new stdClass();
			$task->id = $entry['TASK_ID'];
			$task->streamID = $entry['STREAM_ID'];
			$task->profileID = $entry['PROFILE_ID'];

			foreach ($devices as $device) {
				if($device->id === $entry['DEVICE_ID']) {
					array_push($device->tasks, $task);
				}

			}
		}

		echo json_encode(array(
			'result' => 0,
			'devices' => $devices
		));

		break;
	
	// default:
	// 	echo $method;
	// 	break;
}


?>