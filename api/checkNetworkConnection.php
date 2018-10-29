<?php 

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// $reqJson = json_decode(file_get_contents('php://input'), true);
// var_dump($reqJson);


$json = json_decode('{"result":0}');
echo json_encode($json);

?>