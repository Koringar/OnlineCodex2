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
          godie("entity name not set after entity", $lastName, $file);
        } else {
          $lastName = $entity->{"name"};
        }
        // check cost
        if(!isset($entity->{"cost"})) {
          godie("entity don't has cost", $lastName, $file);
        }
        if(isset($entity->{"note"})) {
          warn("note: " . $entity->{"note"}, $lastName, $file);
        }
        // check minGroup <= maxGroup
        if(isset($entity->{"minGroup"}) || isset($entity->{"maxGroup"})) {
          // min and max exists
          if(!isset($entity->{"minGroup"})) {
            godie("minGroup not set", $lastName, $file);
          }
          if(!isset($entity->{"maxGroup"})) {
            godie("maxGroup not set", $lastName, $file);
          }
          // min <= max
          if($entity->{"minGroup"} > $entity->{"maxGroup"}) {
            godie("minGroup greater as maxGroup", $lastName, $file);
          }
          // more cost more
          if(!isset($entity->{"entityCost"})) {
            godie("no entity Cost", $lastName, $file);
          }
        }
        // "options"
        if(isset($entity->{"options"})) {
          $options = $entity->{"options"};
          foreach ($options as $option) {
            if(is_array($option)) {
              foreach ($option as $o) {
                checkOption($o, $lastName, $file);
              }
            } else {
              checkOption($option, $lastName, $file);
            }
          }
        } else {
          warn("entity has no options", $lastName, $file);
        }
        // "attach"
        if(isset($entity->{"attach"})) {
          foreach ($entity->{"attach"} as $attach) {
            $attachName = $attach->{"name"};
            if(!in_array($attachName, $names)) {
              godie("attach name \"$attachName\" not found", $lastName, $file);
            }
          }
        }
      }
    }
    
    // must = default
    // default = cost: 0
    // note: todo = print warning
  }
}

function checkOption($option, $lastName, $file) {
  if(!isset($option->{"name"}) && !isset($option->{"lists"})) {
    godie("option has no name and is not a list", $lastName, $file);
  }
  // TODO list
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
    $item["longname"] = $content->{"longname"};
    $item["date"] = $content->{"date"};
    $item["version"] = $content->{"version"};
    $armee[$file] = $item;
  }
  return json_encode($armee);
}

function godie($msg, $name, $file) {
  echo "ERROE: $msg => \"" . $file . "\":\"" . $name ."\"\n";
  exit(1);
}

function warn($msg, $name, $file) {
  echo "WARN: $msg => \"" . $file . "\":\"" . $name ."\"\n";
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
