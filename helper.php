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

switch ($action) {
  case "checkCodexJson":
    checkCodexJson();
    break;
  default:
    break;
}