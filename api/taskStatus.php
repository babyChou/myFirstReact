<?php
include_once('./_db.php');
$taskColl = $collection->TASK;

$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

$result = $taskColl->find();

$tasks = [];

foreach ($result as $entry) {

    $task = new stdClass();
    $task->taskID = $entry['TASK_ID'];
    $task->deviceID = $entry['DEVICE_ID'];
    $task->isStart = $entry['isStart'];
    $task->status = $entry['status'];
    $task->errorCode = "";
    $task->streamTime = 0;

    array_push($tasks, $task);
}

echo json_encode(array(
  'result' => 0,
  'tasks' => $tasks
));


    // echo '{
    //  "result": 030ae767,
    //  "invalidArg": ["id"]
    // }';

// echo '{
//   "result": 0,
//   "tasks": [
//     {
//       "deviceID": 1,
//       "errorCode": "",
//       "isStart": 0,
//       "status": 1,
//       "streamTime": "",
//       "taskID": 1
//     }
//   ]
// }';

    // echo '{
    //  "result": 0,
    //  "tasks": []
    // }';

?>