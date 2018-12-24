<?php 

header('Content-Type: application/json');
$json = json_decode('{"result":0, "downloadFile":"/api/download/SE5820_YYYYMMDDHHII_cfg.tgz"}');
echo json_encode($json);

?>