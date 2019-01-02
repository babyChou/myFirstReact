<?php 

// $dirPath = realpath('D:\www\\');
$dir = realpath('D:\www\_tmp\\');



function dirToArray($dir) { 
   $hostname = 'http://localhost:9998';

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
					// 'time' => date ("m/d/Y H:i A", filemtime($curDir))
					'time' => filemtime($curDir)
				);

			} else { 
				$mediaObj = array(
					'name' => $value,
					// 'time' => date ("m/d/Y H:i A", filemtime($curDir)),
					'time' => filemtime($curDir),
					'size' => filesize($curDir)/1048576, //mb
					'duration' => rand(10,10000) //seconds
				);

				if(preg_match('/(\.png)$|(\.jpeg)$|(\.jpg)$/', $value)) {

					$mediaObj['videoInfo'] = 'MP4';
					$mediaObj['audioInfo'] = 'AAC';
					// $mediaObj['aaa'] = $dir;
					// $mediaObj['thumbnail'] = preg_replace('/[\\]/g','/',$dir).$value;
					$mediaObj['thumbnail'] = str_replace('D:/www','localhost:9998', str_replace('\\', '/',$dir)).$value;
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

}else if($method === 'POST') {
	echo json_encode(['result' => 0]);	
}else if($method === 'DELETE'){
	echo json_encode(['result' => 0]);	
}


?>