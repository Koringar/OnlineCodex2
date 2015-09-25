<?php namespace codexIndex;

$armee = array();
$codexDir = "codex";
if(!isset($argv)) {
    $codexDir = ".";
}
$files = scandir($codexDir);
foreach ($files as $file) {
  if ($file == "." || $file == ".." || preg_match('/.php$/', $file) || preg_match('/default_formations.json$/', $file)) {
    continue;
  }
  $content = json_decode(file_get_contents($codexDir . "/" . $file));
  $name = $content->{"name"};
  $armee[$file] = $name;
}
  
echo(json_encode($armee));
