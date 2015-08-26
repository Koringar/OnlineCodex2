<?php

// BEGIN CONFIG
$useCacheManifest = false;
// END CONFIG

$make = false;
if($argv[1] == "make") {
  $make = true;
}

require 'main.php';
