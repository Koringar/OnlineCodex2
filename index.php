<?php

// BEGIN CONFIG
$useCacheManifest = false;
// END CONFIG

$live = false;
if($argv[1] <> "make") {
  $live = true;
}

require 'main.php';
