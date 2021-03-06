<?php 
$code = 200;
http_response_code($code);
header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// $json = json_decode('{"result":0}');
// echo json_encode($json);

// $ip = getHostByName(getHostName());

/*{
    "nic": [
        {
            "dhcp": "auto_ip",
            "dns": [],
            "gateway": "",
            "id": "00181af1b256",
            "ip": "169.254.80.141",
            "mask": "255.255.0.0",
            "name": "eth0",
            "nic_mask": 0
        },
        {
            "dhcp": "auto_ip",
            "dns": [
                "10.1.1.57",
                "10.1.1.55"
            ],
            "gateway": "10.1.9.254",
            "id": "00181af1b257",
            "ip": "10.1.9.99",
            "mask": "255.255.255.0",
            "name": "eth1",
            "nic_mask": 0
        }
    ],
    "result": 0
}*/

if( $method === 'POST' ) {

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

			$nic["isConnected"] = rand(0,1);

			if (preg_match("/(Description)/i", $o)) {
				// echo substr($o, 0, -1)."\n";
				$pos = strrpos($o, ":") + 2;
				$nic["id"] = (string)$nicCount;
				$nic["name"] = substr($o, $pos);
			}

			if (preg_match("/(DHCP)/i", $o)) {
				if (preg_match("/(YES)/i", $o)) {
					$dnsType = 0;
				}else{
					$dnsType = 2;
				}

			}

			if (preg_match("/(Autoconfiguration)/i", $o)) {
				if (preg_match("/(YES)/i", $o)) {
					if($dnsType === 0) {
						$dnsType = 1;
					}
				}

				$nic["dhcp"] = $dnsTypes[$dnsType];
			}

			if (preg_match($regIpv4, $o, $matchs)) {

				foreach ($matchs as $i => $_ip) {
					if(preg_match("/(IPv4)/i", $o)) {
						// echo $_ip;
						$nic["ip"] = $_ip;
					}
					if(preg_match("/(DNS Servers)/i", $o) || preg_match("/^\s+((?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:[.](?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3})\$/i", $o)) {
						// echo $o."\n";
						// $nic["dns"] = array($_ip);
						array_push($nic["dns"], $_ip);

					}
					if(preg_match("/(Default)/i", $o)) {
						$nic["gateway"] = $_ip;
					}

					if(preg_match("/(Subnet)/i", $o)) {
						$nic["mask"] = $_ip;
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