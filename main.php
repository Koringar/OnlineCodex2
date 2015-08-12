<!doctype html>
<html lang="de"<?php if ($useCacheManifest) { ?> manifest="cache.manifest"<?php } ?>>
    <head>
        <title>Online Codex2</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/OnlineCodex2/js/libs/jquery-mobile/jquery.mobile.css">
        <link rel="stylesheet" href="/OnlineCodex2/css/onlinecode2.css">
        <script src="/OnlineCodex2/js/libs/jquery/jquery.js"></script>
        <script src="/OnlineCodex2/js/libs/jquery-mobile/jquery.mobile.js"></script>
    </head>
    <body>
        <div data-role="page">
 
            <div data-role="header" style="overflow:hidden;">
                <h1>Online Codex2</h1>
                <button href="#" data-icon="gear" data-iconpos="notext" class="ui-btn-right">Einstellungen</button>
                <div data-role="navbar" data-iconpos="left">
                    <button href="#" data-icon="plus" data-iconpos="left">Armee</button>
                    <button href="#" data-icon="plus" data-iconpos="left">Einheit</button>
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
