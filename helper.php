<?php

require './helper.lib.php';

include 'config.php.dist';
if (file_exists('config.php')) {
  include 'config.php';
}

$action = $argv[1];

switch ($action) {
  case "checkCodexJson":
    checkCodexJson();
    break;
  case "minJson":
    minJson($argv[2], $argv[3]);
    break;
  case "minJsCss":
    minJsCss($argv[2], $argv[3]);
    break;
  case "genCacheManifest":
    if($useCacheManifest) {
      genCacheManifest($argv);
    }
    break;
  default:
    echo "Options: checkCodexJson minJson minJsCss";
    break;
}