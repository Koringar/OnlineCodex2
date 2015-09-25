<?php

require './helper.lib.php';
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
  default:
    echo "checkCodexJson minJson";
    break;
}