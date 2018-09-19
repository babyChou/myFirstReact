<?php

require 'vendor/autoload.php';

$dbhost = 'localhost';
$dbport = '27017';

//cmd
// $client = new MongoDB\Driver\Manager("mongodb://$dbhost:$dbport");
// $collection = $client->se5820;
// print_r($client);

$client = new MongoDB\Client("mongodb://$dbhost:$dbport");
$collection = $client->se5820;



?>