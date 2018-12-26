<?php
$dirPath = realpath('C:\Program Files\AVerMedia\AVerCaster\Profiles\\');

$VIDEO_TYPE = ["h264","h265"/*,"mjpeg"*/];
$AUDIO_TYPE = ["aac","mp3"/*,"pic"*/];
$CONTAINER = [ "flv","avi","mp4","mov","ts","aac","mp3"];
// $category = [0-7];
$STREAM_TYPE = [1,2,3,6,7,8,11,13,14,51,106];
$ENCODE_GOP_MODE = ['normalp','dualp','smartp','bipredb'];


$ENCODE_MODE = ['cbr','vbr','avbr_fixqp','avbr_fixqp'];//
$OUTPUT_RATIO = ['source type','16:9','4:3','4:3'];//
$PROFILE = ['baseline','high','main'];//
$ENTROPY_MODE = ['cavlc','cabac','main'];//

$CHANNEL = [0,'mono','stereo'];

// if ($handle = opendir($dirPath)) {
//     echo "Directory handle: $handle\n";
//     echo "Entries:\n";

//     /* This is the correct way to loop over the directory. */
//     while (false !== ($entry = readdir($handle))) {
//         echo "$entry\n";
//     }

//     /* This is the WRONG way to loop over the directory. */
//     while ($entry = readdir($handle)) {
//         echo "$entry\n";
//     }

//     closedir($handle);
// }

function listdir($dir='.') { 
    if (!is_dir($dir)) { 
        return false; 
    } 
    
    $files = array(); 
    listdiraux($dir, $files); 

    return $files; 
} 

function listdiraux($dir, &$files) { 
    $handle = opendir($dir); 
    while (($file = readdir($handle)) !== false) { 
        if ($file == '.' || $file == '..') { 
            continue; 
        } 
        $filepath = $dir == '.' ? $file : $dir . '\\' . $file; 
        if (is_link($filepath)) 
            continue; 
        if (is_file($filepath)) 
            $files[] = $filepath; 
        else if (is_dir($filepath)) 
            listdiraux($filepath, $files); 
    } 
    closedir($handle); 
} 

$files = listdir($dirPath); 
sort($files, SORT_LOCALE_STRING); 

// echo "[";
// foreach ($files as $f) { 
//     // echo  $f, "\n"; 
//     // echo  str_replace($dirPath."\\", '', $f), "\n"; 
//     $xml = simplexml_load_file($f);
//     // print_r($xml->attributes()->Id);
//     echo "{\"id\":".$xml->attributes()->Id.",\"filename\":\"".str_replace("\\", '/', $f)."\"},", "\n";
// } 
// echo "]";

$profiles = array();

foreach ($files as $f) { 
    $xml = simplexml_load_file($f);
    $vidoeCodc = '';
    $audioCodc = '';
    $streamTypeSlotNum = rand(3, 11);
    $containerSlotNum = rand(3, 7);

    $containerSlot = array($containerSlotNum);
    $streamTypeSlot = array($streamTypeSlotNum);


    for ($i=0; $i < $containerSlotNum; $i++) { 
        $format = $CONTAINER[rand(0, 6)];
        while (in_array($format, $containerSlot)) {
            $format = $CONTAINER[rand(0, 6)];
        }
        $containerSlot[$i] = $format;
        // echo "$i : $containerSlot[$i]", "\n";
    }

    for ($i=0; $i < $streamTypeSlotNum; $i++) { 
        $streamType = $STREAM_TYPE[rand(0, 10)];
        while (in_array($streamType, $streamTypeSlot)) {
            $streamType = $STREAM_TYPE[rand(0, 10)];
        }
        $streamTypeSlot[$i] = $streamType;
    }


    $profile = array();

    $profile['id'] = (int)$xml->attributes()->Id;
    $profile['name'] = (string)$xml->Name;
    $profile['container'] = $containerSlot;
    $profile['streamType'] = $streamTypeSlot;
    $profile['category'] = (int)$xml->attributes()->Group;

    if(!$profile['category']) {
        $profile['category'] = 0;
    }


    if(!empty((array)$xml->VideoInfo)) {
        $vidoeCodc = (string)$xml->VideoInfo->attributes()->Type;
        if(!in_array($vidoeCodc, $VIDEO_TYPE)) {
            $vidoeCodc = 'h264';
        }
    }

    if(!empty((array)$xml->AudioInfo)) {
        $audioCodc = (string)$xml->AudioInfo->attributes()->Type;
        if(!in_array($audioCodc, $AUDIO_TYPE)) {
            $audioCodc = 'aac';
        }
    }



    if($vidoeCodc !== '') {
        $profile['videoType'] = $vidoeCodc;
        $profile['videoInfo'] = array();


        $videoInfo = array();
        $videoInfo['width'] = (int)$xml->VideoInfo->Width;
        $videoInfo['height'] = (int)$xml->VideoInfo->Height;
        $videoInfo['bitrate'] = (int)$xml->VideoInfo->Bitrate/1000;
        $videoInfo['bframeNum'] = (int)$xml->VideoInfo->BFrameNum;
        $videoInfo['frame'] = (int)$xml->VideoInfo->KeyFrame;
        $videoInfo['frameRate'] = (int)$xml->VideoInfo->FrameRate/100;
        $videoInfo['level'] = (int)$xml->VideoInfo->Level;
        $videoInfo['nullPacket'] = 'off';
        
        $_profile = (int)$xml->VideoInfo->Profile > 2 ? 1 : (int)$xml->VideoInfo->Profile;
        $encodeMode = (int)$xml->VideoInfo->EncodeMode;
        $entropyMode = (int)$xml->VideoInfo->EntropyMode;
        $outputRatio = (int)$xml->VideoInfo->AspectRatio;


        $videoInfo['profile'] = $PROFILE[$_profile];
        $videoInfo['encodeMode'] = $ENCODE_MODE[$encodeMode];
        $videoInfo['entropyMode'] = $ENTROPY_MODE[$entropyMode];

        $videoInfo['outputRatio'] = $outputRatio > 2 ? 2 : $outputRatio;
       
        
        $profile['videoInfo'] = $videoInfo;
    }

    if($audioCodc !== '') {
        $profile['audioType'] = $audioCodc;
        $audioInfo = array();
        $audioInfo['channel'] = $CHANNEL[(int)$xml->AudioInfo->Channel];
        $audioInfo['sampleRate'] = (int)$xml->AudioInfo->SampleRate/1000;
        $audioInfo['bitrate'] = (int)$xml->AudioInfo->Bitrate/1000;
        $audioInfo['encodeMode'] = (int)$xml->AudioInfo->EncodeMode;
        $audioInfo['nullPacket'] = 'off';

        $profile['audioInfo'] = $audioInfo;
    }



    // print_r($xml);
    $profiles[] =  $profile;

} 




$str = json_encode($profiles);

// $file = fopen("./encodeProfileList.json","w");
// echo fwrite($file, $str);
// fclose($file);
?>