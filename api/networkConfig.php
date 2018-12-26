<?php 
$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// $json = json_decode('{"result":0}');
// echo json_encode($json);

// $ip = getHostByName(getHostName());


if( $method === 'POST' || $method === 'PATCH') {
	$result = new stdClass();
	$result->result = -1;
}else{

	$regIpv4 = '/(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:[.](?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}/';

	exec("ipconfig/all",$output_array, $return_val);
	// echo "Returned $return_val <br><pre>";

	$result = new stdClass();
	$result->result = 0;
	$nicCount = 0;

	$nics = array();
	$nic = array(
		"dhcp" => "auto_ip", // auto_ip, auto_ip_dns, static_ip,
		"dns" => array(),
		"id" => 0,
		"ip" => "",
		"mask" => "",
		"name" => "",
		"gateway" => ""
	);

	$dnsTypes = array("auto_ip", "auto_ip_dns", "static_ip");
	$dnsType = 0;

	$enableWrite = false;

	foreach ($output_array as $o)
	{
		if(preg_match("/^(Ethernet)/i", $o)) {
			$enableWrite = true;
			$nicCount ++;
		}

		if($enableWrite) {
			// echo $o."\n";

			if (preg_match("/(Description)/i", $o)) {
				// echo substr($o, 0, -1)."\n";
				$pos = strrpos($o, ":") + 2;
				$nic["id"] = $nicCount.'';
				$nic["name"] = substr($o, $pos);
			}

			if (preg_match("/(DHCP)/i", $o)) {
				if (preg_match("/(YES)/i", $o)) {
					$dnsType = 1;
				}else{
					$dnsType = 2;
				}

			}

			if (preg_match("/(Autoconfiguration)/i", $o)) {
				if (preg_match("/(YES)/i", $o)) {
					if($dnsType === 0) {
						$dnsType = 0;
					}
				}

				// $nic["dhcp"] = $dnsTypes[0];
				$nic["dhcp"] = $dnsTypes[$dnsType];
			}

			if (preg_match($regIpv4, $o, $matchs)) {

				foreach ($matchs as $i => $_ip) {
					if(preg_match("/(IPv4)/i", $o)) {
						// echo $_ip;
						// $nic["ip"] = $_ip;//a003670
					}
					if(preg_match("/(DNS Servers)/i", $o) || preg_match("/^\s+((?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:[.](?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3})\$/i", $o)) {
						// echo $o."\n";
						// $nic["dns"] = array($_ip);
						// array_push($nic["dns"], $_ip);//a003670

					}
					if(preg_match("/(Default)/i", $o)) {
						// $nic["gateway"] = $_ip;//a003670
					}

					if(preg_match("/(Subnet)/i", $o)) {
						// $nic["mask"] = $_ip;//a003670
					}
					
					// echo filter_var($_ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4);
				}
			}

			if(preg_match("/(NetBIOS)/i", $o)) {
				$enableWrite = false;
				array_push($nics,$nic);
			}

		}
			
		// echo "$o \n";
	}
	$result->nic = $nics;
}

echo json_encode($result);
// var_dump( $nics);
// $info = system('ipconfig /all');
// echo $return_val;
?>