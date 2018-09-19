<?php
// $collection = $collection->STREAM_PROFILE;
// $code = 200;
// http_response_code($code);
// header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];


echo '{
  "result": 0,
  "tasks": [
    {
      "dievceID": 1,
      "errorCode": "",
      "isStart": 0,
      "status": 1,
      "streamTime": "",
      "taskID": 1
    }
  ]
}';

?>