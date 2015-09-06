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

    echo $content->{"name"} ."\n";
    echo $content->{"version"} ."\n";
    echo $content->{"date"} ."\n";
    $groups = $content->{"groups"};
    $names = array();
    $lastName = "";
    
    // suche namen für attach
    foreach ($groups as $group) {
      foreach ($group as $entity) {
        $names[] = $entity->{"name"};
      }
    }
    // checks
    foreach ($groups as $group) {
      foreach ($group as $entity) {
        // check name
        if(!isset($entity->{"name"})) {
          godie("entity name not set after entity $lastName");
        } else {
          $lastName = $entity->{"name"};
        }
        // check cost
        if(!isset($entity->{"cost"})) {
          godie("free as freebeer for $lastName");
        }
        if(isset($entity->{"note"})) {
          echo $entity->{"note"} . " in $lastName\n";
        }
        // check minGroup <= maxGroup
        if(isset($entity->{"minGroup"}) || isset($entity->{"maxGroup"})) {
          // min and max exists
          if(!isset($entity->{"minGroup"})) {
            godie("minGroup not set in $lastName");
          }
          if(!isset($entity->{"maxGroup"})) {
            godie("maxGroup not set in $lastName");
          }
          // min <= max
          if($entity->{"minGroup"} > $entity->{"maxGroup"}) {
            godie("minGroup greater as maxGroup in $lastName");
          }
          // more cost more
          if(!isset($entity->{"entityCost"})) {
            godie("no entity Cost in $lastName");
          }
        }
        // TODO "options"
        // TODO "attach"
      }
    }
    
    // must = default
    // default = cost: 0
    // note: todo = print warning
  }
}

function godie($msg) {
  echo "$msg\n";
  exit(1);
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