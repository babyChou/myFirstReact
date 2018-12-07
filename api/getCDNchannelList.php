<?php 

$streamType = $_GET['streamType'];

$list = '{"result":0,"channelList":{"streamType": '.$streamType.',"channels":[ {"channelID":"aaacccAver","channelName": "aaacccAver","channelUrl": "18468504","channelStreamName": "aaacccAver","videoID": ""},{"channelID":"AVM%20FTE","channelName": "AVM%20FTE","channelUrl": "18476501","channelStreamName": "AVM%20FTE","videoID": ""}]}}';

$json = json_decode($list);
echo json_encode($json);

?>