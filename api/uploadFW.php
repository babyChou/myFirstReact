<?php 
include_once('./_db.php');
$taskColl = $collection->TASK;

$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

$req = json_decode(file_get_contents('php://input'), true);


if(isset($_FILES["file"])) {
	$file = $_FILES["file"];

	$json = json_decode('{"result":0, "size": '.$file['size'].', "version": "v134"}');
}else{
	$json = json_decode('{"result":-1}');
}


echo json_encode($json);

?>