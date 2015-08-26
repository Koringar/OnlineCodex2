<?php namespace codexIndex;

//json_encode($value)
//json_decode($json)
// name and filename
$armee = array();
$codexDir = "codex";
$files = scandir($codexDir);
foreach ($files as $file) {
  if ($file == "." || $file == ".." || preg_match('/.php$/', $file)) {
    continue;
  }
  $content = json_decode(file_get_contents($codexDir . "/" . $file));
  $name = $content->{"name"};
  $armee[$name] = $file;
}
  
echo(json_encode($armee));
