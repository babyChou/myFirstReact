<?php 
include_once('./_db.php');
$taskColl = $collection->TASK;

$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];



$json = json_decode('{"result":0, "seconds": 10}');
echo json_encode($json);

?>