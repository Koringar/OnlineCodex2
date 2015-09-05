<!doctype html>
<html lang="de"<?php if ($useCacheManifest) { ?> manifest="cache.manifest"<?php } ?>>
    <head>
        <title>Online Codex2</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="js/libs/jquery-mobile/jquery.mobile<?php echo $live ? '.min' : '' ?>.css">
        <link rel="stylesheet" href="css/onlinecode2.css">
        <script src="js/libs/jquery/jquery<?php echo $live ? '.min' : '' ?>.js"></script>
        <script src="js/libs/jquery-mobile/jquery.mobile<?php echo $live ? '.min' : '' ?>.js"></script>
        <script src="js/onlinecodex2.js"></script>
        <script type="text/javascript">
          $(document).ready(function() {
            // kleiner Test
            var indexJson = getArmyIndex(<?php echo $live ? 'true' : 'false' ?>);
            if(console && console.log) {
              console.log(typeof indexJson);
              console.log(indexJson);
            }
          });
        </script>
    </head>
    <body>
        <div data-role="page">
 
            <div data-role="header" style="overflow:hidden;">
                <h1>Online Codex2</h1>
                <a href="#optionsMenu" data-rel="popup" data-icon="gear" data-iconpos="notext" data-transition="none" class="ui-btn-right">Einstellungen</a>
                <div data-role="popup" id="optionsMenu" data-theme="a">
                    <ul data-role="listview" data-inset="true">
                        <li data-icon="false"><a href="#">Speichern</a></li>
                        <li data-icon="false"><a href="#">Laden</a></li>
                        <li data-icon="false"><a href="#">Drucken</a></li>
                        <li data-icon="false"><a href="#">Teilen</a></li>
                        <li data-icon="false"><a href="#">Hilfe</a></li>
                        <li data-icon="false"><a href="#">Über diese Anwendung</a></li>
                    </ul>
                </div>
                <div data-role="navbar" data-iconpos="left">
                    <a href="#addArmee" data-rel="popup" data-icon="plus" data-transition="none" data-iconpos="left">Armee</a>
                    <!--  Durch JavaScript und JSon ersetzen-->
                    <div data-role="popup" id="addArmee" data-theme="a">
                        <ul data-role="listview" data-inset="true">
                            <li data-icon="false" style="float:none;min-width:200px;"><a href="#">Necrons</a></li>
                            <li data-icon="false" style="float:none;min-width:200px;"><a href="#">Sternenreich der Tau</a></li>
                            <li data-icon="false" style="float:none;min-width:200px;"><a href="#">...</a></li>
                        </ul>
                    </div>
                    <a href="#addTroop" data-icon="plus" data-iconpos="left">Einheit</a>
                    <div id="summary">Gesamtpunkte: 1008</div>
                </div><!-- /navbar -->
            </div><!-- /header -->
 
            <div data-role="content">
                <div class="armee">
                    <div>
                        <div class="armeeName">Sternenreich der Tau (Hauptkontigent)</div>
                            <button href="#" data-icon="edit" data-iconpos="notext" title="anpassen"></button>
                            <div style="clear: both;"></div>
                        </div>
                        <div class="group">
                            <div class="ui-grid-b">
                                <div class="ui-block-a groupName">HQ (1)</div>
                                <div class="ui-block-b groupPoints">128 Punkte</div>
                            </div>
                            <div class="ui-grid-b">
                                <div class="ui-block-a selectionName">Commander</div>
                                <div class="ui-block-b selectionPoints">128 Punkte</div>
                                <div class="ui-block-c"><button href="#" data-icon="edit" data-iconpos="notext" title="anpassen"></button></div>
                                <div class="selectionOptions">+ Drohnensteuerung<br />- Kommando-Kontroll-Modul<br />- Multispektrum-Sensorpaket</div>
                            </div>
                        </div>
                        <div class="group">
                            <div class="ui-grid-b">
                                <div class="ui-block-a groupName">Elite (2)</div>
                                <div class="ui-block-b groupPoints">412 Punkte</div>
                            </div>
                            <div class="ui-grid-b">
                                <div class="ui-block-a selectionName">Krisis Kampfanzugteam</div>
                                <div class="ui-block-b selectionPoints">219 Punkte</div>
                                <div class="ui-block-c"><button href="#" data-icon="edit" data-iconpos="notext" title="anpassen"></button></div>
                                <div class="selectionOptions">+ Krisis-Shas'ui<br />- 1 x Plasmagewehr<br />- Zyklischer-Ionenblaster<br />- Multiple Zielerfassung</div>
                                <div class="selectionOptions">+ Krisis-Shas'ui<br />- 2 x Plasmagewehr<br />- Multiple Zielerfassung</div>
                                <div class="selectionOptions">+ Krisis-Shas'ui<br />- 2 x Plasmagewehr<br />- Multiple Zielerfassung</div>
                                <div class="selectionOptions">4 x Markiererdrohnen</div>
                            </div>
                            <div class="ui-grid-b">
                                <div class="ui-block-a selectionName">XV104 Sturmflut</div>
                                <div class="ui-block-b selectionPoints">193 Punkte</div>
                                <div class="ui-block-c"><button href="#" data-icon="edit" data-iconpos="notext" title="anpassen"></button></div>
                                <div class="selectionOptions">+ sync. Schwärmer Raketensystem<br />- Ionenbeschleuniger<br />- Frühwarn-Reaktivsystem<br />- Hochentwickeltes Zielsystem</div>
                            </div>
                        </div>
                        <div class="group">
                            <div class="ui-grid-b">
                                <div class="ui-block-a groupName">Standard (2)</div>
                                <div class="ui-block-b groupPoints">198 Punkte</div>
                            </div>
                            <div class="ui-grid-b">
                                <div class="ui-block-a selectionName">6 Feuerkrieger</div>
                                <div class="ui-block-b selectionPoints">144 Punkte</div>
                                <div class="ui-block-c"><button href="#" data-icon="edit" data-iconpos="notext" title="anpassen"></button></div>
                                <div class="selectionOptions">+ Teufelsrochen<br />- sync. Schwärmer Raketensystem</div>
                            </div>
                            <div class="ui-grid-b">
                                    <div class="ui-block-a selectionName">6 Feuerkrieger</div>
                                    <div class="ui-block-b selectionPoints">54 Punkte</div>
                                    <div class="ui-block-c"><button href="#" data-icon="edit" data-iconpos="notext" title="anpassen"></button></div>
                            </div>
                        </div>
                        <div class="group">
                            <div class="ui-grid-b">
                                <div class="ui-block-a groupName">Unterstützung (2)</div>
                                <div class="ui-block-b groupPoints">270 Punkte</div>
                            </div>
                            <div class="ui-grid-b">
                                <div class="ui-block-a selectionName">XV-88-Breitseite-Team</div>
                                <div class="ui-block-b selectionPoints">140 Punkte</div>
                                <div class="ui-block-c"><button href="#" data-icon="edit" data-iconpos="notext" title="anpassen"></button></div>
                                <div class="selectionOptions">+ Breitseite<br />- sync. Hochleistungs-Raketenmagazin<br />- sync. Schwärmer Raketensystem<br />- Frühwarn-Reaktivsystem</div>
                                <div class="selectionOptions">+ Breitseite<br />- sync. Hochleistungs-Raketenmagazin<br />- sync. Schwärmer Raketensystem<br />- Frühwarn-Reaktivsystem</div>
                            </div>
                            <div class="ui-grid-b">
                                <div class="ui-block-a selectionName">Hammerhai-Gefechtspanzer</div>
                                <div class="ui-block-b selectionPoints">130 Punkte</div>
                                <div class="ui-block-c"><button href="#" data-icon="edit" data-iconpos="notext" title="anpassen"></button></div>
                                <div class="selectionOptions">+ Massebeschleuniger<br />- Streugeschosse<br />- sync. Schwärmer Raketensystem</div>
                            </div>
                        </div>
                    <div id="armeeSummary">Gesamtpunkte Tau : 1008</div>
                </div>
            </div><!-- /content -->

        </div><!-- /page -->
    </body>
</html>
