<?php namespace codexIndex;

//json_encode($value)
//json_decode($json)
// name and filename
$armee = array();
$codexDir = "codex";
if(!isset($argv)) {
    $codexDir = ".";
}
$files = scandir($codexDir);
foreach ($files as $file) {
  if ($file == "." || $file == ".." || preg_match('/.php$/', $file)) {
    continue;
  }
  $content = json_decode(file_get_contents($codexDir . "/" . $file));
  $name = $content->{"name"};
  $armee[$file] = $name;
  /*$armee[] = [
      "name" => $name,
      "file" => $file
      ];*/
}
  
echo(json_encode($armee));
