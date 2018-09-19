<?php

require 'vendor/autoload.php';

use Aws\DynamoDb\Exception\DynamoDbException;

$sdk = new Aws\Sdk([
    'version'  => 'latest',
    'region'   => 'us-west-1',
    'endpoint' => 'http://localhost:8000'
]);

$dynamodb = $sdk->createDynamoDb();

?>