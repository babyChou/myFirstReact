<?php
// phpinfo(); 
$location = realpath('H:\TEST_FILE\img\techi.jpg');

$resp = new stdClass();
if(!isset($_GET['id'])) {
	$resp->result = 102;
	echo json_encode($resp);
	exit();
}

$id = $_GET['id'];


$imgArr = [
    realpath('H:\TEST_FILE\img\6be772fe477919520623da8aadd03086.jpg'),
    realpath('H:\TEST_FILE\img\techi.jpg'),
    realpath('H:\TEST_FILE\img\yurina.jpg'),
    realpath('H:\TEST_FILE\img\aramajapan.com-keyakizaka46.jpg'),
    realpath('H:\TEST_FILE\img\img_Keyakizaka46_AS_5th.jpg'),
    realpath('H:\TEST_FILE\img\keyakizaka46.jpg'),
    realpath('H:\TEST_FILE\img\Keyakizaka46-Fukyouwaon-keyakizaka46-40327669-1019-342.jpg'),
    realpath('H:\TEST_FILE\img\maxresdefault.jpg'),
    realpath('H:\TEST_FILE\img\keyakizaka46-discord.jpg'),
    realpath('H:\TEST_FILE\img\kanji.jpg')
];


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

$arrIndx = rand(0, count($imgArr) - 1);
$code = 200;
http_response_code($code);
header('Content-Type: image/jpeg');


// $img = LoadJpeg($imgArr[$id]);
$img = LoadJpeg($imgArr[$arrIndx]);

imagejpeg($img);
imagedestroy($img);

?>