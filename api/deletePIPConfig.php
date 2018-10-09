<?php 
include_once('./_db.php');
$collection = $collection->PIP_CONFIG;

$code = 200;
http_response_code($code);
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];//Access-Control-Request-Method

$resp = new stdClass();

if($method !== 'DELETE') {
    
    $resp->result = 102;
    echo json_encode($resp);
}

$req = json_decode(file_get_contents('php://input'), true);
$ids = $req['ids'];

foreach ($ids as $k => $id) {    
    $document = $collection->deleteOne(['id' => $id]);
}

if($document->getDeletedCount() > 0) {
    $resp->result = 0;
}else{
    $resp->result = 123;
}

echo json_encode($resp);



?>