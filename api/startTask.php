<?php 
// var_dump($_SERVER['REQUEST_METHOD']);
// var_dump($_SERVER['REQUEST_URI']);
// var_dump($_SERVER['PATH_INFO']);
// echo $_SERVER['REQUEST_METHOD'];
// echo $_SERVER['REQUEST_URI'];
$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

$json = json_decode('{"result":0}');
echo json_encode($json);

?>