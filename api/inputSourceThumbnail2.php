<?php
// phpinfo(); 

$currPath = realpath('./');

$resp = new stdClass();
if(!isset($_GET['id'])) {
	$resp->result = 102;
	echo json_encode($resp);
	exit();
}

$id = $_GET['id'];
//261,250
$fileArr = ['', realpath('H:\TEST_FILE\MP4\Keyakizaka46 - Fukyouwaon.mp4'), realpath('H:\TEST_FILE\MP4\不協和音 - Keyakizaka46.mp4')];
$imgArr = ['', "$currPath\sourceImg1.jpg", "$currPath\sourceImg2.jpg"];

$video = $fileArr[$id];
$image = $imgArr[$id];




function ffmpegJpg($video, $image, $max=250) {
    //https://stackoverflow.com/questions/9095918/ffmpeg-creating-thumbnail-for-video-file
    $ffmpeg = realpath('D:\webDav\ffmpeg.exe');

    //time to take screenshot at
    $interval = rand(5, $max);

    //screenshot size
    $size = '320x240';

    //ffmpeg command
    $cmd = "$ffmpeg -i \"$video\" -deinterlace -an -ss $interval -f mjpeg -t 1 -r 1 -y -s $size $image 2>&1";     
    // $cmd = "$ffmpeg -i \"$video\" -deinterlace -an -ss $interval -f mjpeg -t 1 -r 1 -y $image 2>&1";

    shell_exec($cmd);

    // echo shell_exec($cmd);

}


function LoadJpeg($imgname)
{
    /* Attempt to open */
    $im = @imagecreatefromjpeg($imgname);

    /* See if it failed */
    if(!$im)
    {
        /* Create a black image */
        $im  = imagecreatetruecolor(150, 30);
        $bgc = imagecolorallocate($im, 255, 255, 255);
        $tc  = imagecolorallocate($im, 0, 0, 0);

        imagefilledrectangle($im, 0, 0, 150, 30, $bgc);

        /* Output an error message */
        imagestring($im, 1, 5, 5, 'Error loading ' . $imgname, $tc);
    }

    return $im;
}

ffmpegJpg($video, $image);

header('Content-Type: image/jpeg');

$img = LoadJpeg($imgArr[$id]);

imagejpeg($img);
imagedestroy($img);

?>