<?php
// php pic.php > ..\_img.scss
$foemat = '%s{width:%dpx;height:%dpx;background-image:url("%s");}'."\r\n";
$i =0;
$stack = array();

$prefix = "%";
$dirs[$i++] = "./";
$imgDir = "./img/";


foreach($dirs as $dir)
{
	$d = dir($dir);
	while (false !== ($entry = $d->read())) 
	{			

		if( "Thumbs.db" == $entry || "."  == $entry[0]  || "0"  == $entry[0] || substr($entry, -4) !== ".png")
			continue;

			$size = 0;
			$size = @getimagesize($dir.$entry);
			if( 0 !== $size )
			{
				echo $prefix;
				echo sprintf($foemat,substr($entry, 0, -4), $size[0], $size[1], $imgDir.$entry );
				array_push($stack, ".".substr($entry, 0, -4)."{@extend %".substr($entry, 0, -4).";}\r\n");
			}
		
	}
	$d->close();
}

foreach($stack as $str)
{
	echo $str;
}






