<?php

// BEGIN CONFIG
$useCacheManifest = false;
// END CONFIG

if($argv[1] <> "make") {
  $die = "live mode no longer supportet";
  echo "<h1>$die</h1>";
  die("$die");
}

require 'main.php';
