<!doctype html>
<html lang="de"<?php if ($useCacheManifest) { ?> manifest="cache.manifest"<?php } ?>>
    <head>
        <title>Online Codex2</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="js/libs/jquery-mobile/jquery.mobile.css">
        <link rel="stylesheet" href="css/onlinecode2.css">
        <script src="js/libs/jquery/jquery.js"></script>
        <script src="js/libs/jquery-mobile/jquery.mobile.js"></script>
        <script src="js/onlinecodex2.js"></script>
        <script src="js/oc2.h.js"></script>
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
                        <ul data-role="listview">
                            <li data-role="list-divider">Wähle eine Armee aus:</li>
                        </ul>
                    </div>
                    <div id="summary">Gesamtpunkte: 0</div>
                </div><!-- /navbar -->
            </div><!-- /header -->
 
            <div data-role="content">
            </div><!-- /content -->

        </div><!-- /page -->
    </body>
</html>
