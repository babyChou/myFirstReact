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

$imgArr = ['', realpath('H:\TEST_FILE\img\techi.jpg'), realpath('H:\TEST_FILE\img\yurina.jpg')];


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

header('Content-Type: image/jpeg');

$img = LoadJpeg($imgArr[$id]);

imagejpeg($img);
imagedestroy($img);

?>