<?php

$action = $argv[1];

function checkCodexJson() {
  $codexDir = "codex";
  $files = scandir($codexDir);
  foreach ($files as $file) {
    if ($file == "." || $file == ".." || preg_match('/.php$/', $file)) {
      continue;
    }
    $content = json_decode(file_get_contents($codexDir . "/" . $file));
    //TODO
  }
}

function minJson($infile, $outfile) {
  file_put_contents($outfile, json_encode(json_decode(file_get_contents($infile))));
}

switch ($action) {
  case "checkCodexJson":
    checkCodexJson();
    break;
  case "minJson":
    minJson($argv[2], $argv[3]);
    break;
  default:
    break;
}