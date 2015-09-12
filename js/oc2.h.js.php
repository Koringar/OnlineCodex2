<?php

$live = false;
if(@$argv[1] <> "make") {
  $live = true;
}
?>

function getArmyIndex() {
  return get("codex/index.json<?php echo $live ? '.php' : '' ?>");
}
