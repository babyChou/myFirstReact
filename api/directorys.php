<?php 

// $dirPath = realpath('D:\www\\');
$dir = realpath('D:\www\_tmp\\');



function dirToArray($dir) { 
   $hostname = 'http://localhost:9998/_tmp/keyaki/';
	$result = array(
		'result' => 0,
		'directory' => array(),
		'file' => array()
	);

   $cdir = scandir($dir); 
   foreach ($cdir as $key => $value) 
   { 
		if (!in_array($value,array(".",".."))) 
		{ 
			$curDir = $dir . DIRECTORY_SEPARATOR . $value;
			if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) 
			{ 
				// $result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value);

				$subDir = dirToArray($curDir);
				$subDirectory = false;

				// if(count($subDir['directory']) > 0 || count($subDir['file']) > 0) {
				if(count($subDir['directory']) > 0) {
					$subDirectory = true;
				}

				$result['directory'][] = array(
					'name' => $value,
					'subDirectory' => $subDirectory,
					'time' => date ("m/d/Y H:i A", filemtime($curDir))
				);

			} else { 
				$mediaObj = array(
					'name' => $value,
					'time' => date ("m/d/Y H:i A", filemtime($curDir)),
					'size' => filesize($curDir)
				);

				if(preg_match('/(\.png)$|(\.jpeg)$|(\.jpg)$/', $value)) {

					$mediaObj['videoCodec'] = 'MP4';
					$mediaObj['audioCodec'] = 'AAC';
					$mediaObj['thumbnail'] = $hostname.$value;
				}


				$result['file'][] = $mediaObj;
			} 
		} 
   } 
   
   return $result; 
}
// dirToArray($dir);
// print_r(dirToArray($dir));


$method = $_SERVER['REQUEST_METHOD'];

if($method === 'GET') {
	$reqDir = $_GET['directory'];

	echo json_encode(dirToArray($dir.$reqDir));
}


?>