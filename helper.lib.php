<?php

function checkCodexJson() {
  $codexIndexJson = json_decode(getCodexIndexJson());
  $codexDir = "codex";
  foreach ($codexIndexJson as $file => $value) {
    $content = json_decode(file_get_contents($codexDir . "/" . $file));
    echo "check " . $value->{"name"} . "->" . $value->{"version"} . " from " . $value->{"date"} . "\n";
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
          godie("entity name not set after entity $file:$lastName");
        } else {
          $lastName = $entity->{"name"};
        }
        // check cost
        if(!isset($entity->{"cost"})) {
          godie("free as freebeer for $file:$lastName");
        }
        if(isset($entity->{"note"})) {
          echo  "note on $file:$lastName: " . $entity->{"note"} . "\n";
        }
        // check minGroup <= maxGroup
        if(isset($entity->{"minGroup"}) || isset($entity->{"maxGroup"})) {
          // min and max exists
          if(!isset($entity->{"minGroup"})) {
            godie("minGroup not set in $file:$lastName");
          }
          if(!isset($entity->{"maxGroup"})) {
            godie("maxGroup not set in $file:$lastName");
          }
          // min <= max
          if($entity->{"minGroup"} > $entity->{"maxGroup"}) {
            godie("minGroup greater as maxGroup in $file:$lastName");
          }
          // more cost more
          if(!isset($entity->{"entityCost"})) {
            godie("no entity Cost in $file:$lastName");
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

function getCodexIndexJson() {
  $armee = array();
  $codexDir = "codex";
  $files = scandir($codexDir);
  foreach ($files as $file) {
    if ($file == "." || $file == ".." || preg_match('/.php$/', $file) || preg_match('/default_formations.json$/', $file)) {
      continue;
    }
    $content = json_decode(file_get_contents($codexDir . "/" . $file));
    $item = array();
    $item["name"] = $content->{"name"};
    $item["date"] = $content->{"date"};
    $item["version"] = $content->{"version"};
    $armee[$file] = $item;
  }
  return json_encode($armee);
}

function godie($msg) {
  echo "$msg\n";
  exit(1);
}

function minJson($infile, $outfile) {
  file_put_contents($outfile, json_encode(json_decode(file_get_contents($infile))));
}

function minJsCss($infile, $outfile) {
  $infileArray = explode('.', $infile);
  $ext = $infileArray[count($infileArray) - 1];
  $infileArray[count($infileArray) - 1] = "min";
  $infileArray[] = $ext;
  $infile2 = implode('.', $infileArray);
  if(file_exists($infile2)) {
    copy($infile2, $outfile);
  } else {
    copy($infile, $outfile);
  }
}

function genCacheManifest($vars) {
  array_shift($vars); // dateiname raus
  array_shift($vars); // funktionsname raus
  $manifestName = array_shift($vars);
  $manifest = array();
  $manifest[] = "CACHE MANIFEST";
  $manifest[] = "# " . date("Y.m.d H:i:s");
  $manifest[] = "CACHE:";
  foreach ($vars as $file) {
    $manifest[] = $file;
  }
  $manifest[] = "";
  file_put_contents($manifestName, implode("\n", $manifest));
}
