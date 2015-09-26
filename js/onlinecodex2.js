/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var defaultFormations = new Array(); // Globale Variable für die Default Formationen
var allLoadedJson = new Array(); // Globale Variablen für alle JSON Object vom Codex
// TODO: Vielleicht doch lieber in window.sessionStorage
var allSelectetArmees = new Array(); // Globale Variable für alle ausgewählten Armeen

// Seite initialisieren
$(document).ready(function() {
    //Init Popups
    initOptionDialog();
    initArmeeDialog();
    
    //Seite neu aufbauen
    renderSelectetArmees();
});

/*
 * Gibt das JSON Object wieder
 * 
 * @param {type} uri
 * @param {type} callback
 * @returns {data|@var;callback|Boolean}
 */
function get(uri, callback) {
    uri = typeof uri !== "undefined" ? uri : "";
    callback = typeof callback !== "undefined" ? callback : false;
    var ajax = $.ajax({
        method: "GET",
        url: uri,
        dataType: "json",
        async: (callback === false ? false : true)
    });
    if(callback === false) {
        var returnValue;
        ajax.done(function (data){
            returnValue = data;
        });
        return returnValue;
    } else {
        ajax.done(callback);
        return callback;
    }
}

/*
 * Initialisert den Dialog für die verschiedenen Armeen
 */
function initArmeeDialog(){
    //Hole die Default Formationen, für die spätere Verarbeitung
    defaultFormations = get("codex/default_formations.json");
    
    //Hole alle Armeen
    var indexJson = getArmyIndex();
    //Fülle den Dialog mit den Elementen
    $("div[data-role='navbar']").prepend('<div data-role="popup" id="addArmee" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
    $("#addArmee").append('<ul data-role="listview" class="ui-grid-solo ui-listview"></ul>');
    $("#addArmee ul").append('<li data-role="list-divider" class="ui-block-a ui-li-divider ui-bar-inherit ui-first-child ui-last-child" role="heading">Wähle eine Armee aus:</li>');
    $.each(indexJson, function (file, name) {
        $("#addArmee ul").append('<li data-icon="false"><a href="#" class="ui-btn" json="' + file + '">'+name+'</a></li>');
    });
    //Popup nachträglich initialisieren
    $("#addArmee").popup();
    //Registrie den Click und lade dann die Armee
    $("#addArmee ul li a").click(function() {
        loadArmee($(this).attr("json"));
        $("#addArmee").popup( "close" );
    });
}

/*
 * Initialisert die Optionen auf der Seite
 */
function initOptionDialog(){
    $("div[data-role='header']").prepend('<div data-role="popup" id="optionsMenu" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
    $("#optionsMenu").append('<ul data-role="listview" class="ui-listview ui-listview-inset ui-corner-all ui-shadow"></ul>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Speichern</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Laden</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Drucken</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Teilen</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Hilfe</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Über diese Anwendung</a></li>');
    //Popup nachträglich initialisieren
    $("#optionsMenu").popup();
}

/*
 * Initialisert die Optionen für den Einheiten Dialog
 * 
 * @param {Object} armeeJson: Das geladene JSON Object
 */
function iniUnitDialog(armeeJson){
    //Fülle den Dialog mit den Elementen
    $("div[data-role='content']").prepend('<div data-role="popup" id="addUnit' + armeeJson.name + '" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
    //Inhalt setzen
    $('div[id="addUnit' + armeeJson.name + '"]').append('<div class="unitPopup"></div>');
    $('div[id="addUnit' + armeeJson.name + '"] > div:first-child').append('<div>' + armeeJson.name + '</div><div class="unitGroups"></div>');
    $.each(armeeJson.groups, function (group, array) {
        //TODO: Die Gruppenbezeichnungen aus einem NLS oder so ziehen
        $('div[id="addUnit' + armeeJson.name + '"] div[class="unitGroups"]').append('<div class="' + group + '"><div><div>' + group + '</div><div>Punkte</div></div></div>');
        $.each(array, function (counter, unit) {
            $('div[id="addUnit' + armeeJson.name + '"] div[class="' + group + '"]').append("<div><div>" + unit.name + "</div><div>" + unit.cost + "</div></div>");
        });
    });
    
    //Der Popup muss mit seinen Daten nur einmal Initialsiert werden
    $("#addUnit" + armeeJson.name).popup();
}

/*
 * Initialisiert den Armee Container im Body
 * 
 * @param {String} UnID: Eindeutige ID
 * @param {String} ArmeeName: Name der Armee
 */
function iniArmeeContainer(UnID, ArmeeName){
    //Der Container
    $("div[data-role='content']").append('<div id="' + UnID + '" class="armee"></div>');
    //Anzeige des Name
    $("#" + UnID).append('<div class="armeeName">' + ArmeeName + '</div>');
    //Anzeige der Formation, die ersten Formation ist das Hauptkontigent ansonsten eben Verbündetenkontigent
    $("#" + UnID).append('<div class="armeeType">(' + ((allSelectetArmees.length===1)?defaultFormations.formations[0].name:defaultFormations.formations[1].name) + ')</div>');
    //Schaltfläche zum ändern der Formation
    $("#" + UnID).append('<a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-shadow ui-corner-all" title="anpassen"></a>');
    //Für Einheitenauswahl
    $("#" + UnID).append('<a href="#addUnit' + ArmeeName + '" data-rel="popup" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-shadow ui-corner-all" title="Einheit hinzufügen"></a>');
    //Floating wieder normal
    $("#" + UnID).append('<div style="clear: both;">');
    //Für die Punkte der Armee
    $("#" + UnID).append('<div class="armeeSummary">Gesamtpunkte ' + ArmeeName + ': 0</div>');
    
    //TODO: Anpassen Popup/Dialog initialisieren
}

/*
 * Rendert beim neuladen der Seite alles wieder
 */
function renderSelectetArmees(){
    
}

/*
 * Läde die Armee in den globalen Speicher, aktualisert den Dialog für die verschiedenen Einheiten und
 * initialisert den Abschnitt im Body für die Armee
 * 
 * @param {String} file: JSON File
 */
function loadArmee(file){
    var date = new Date(); // Für die Millisekunden, für Eindeutigkeit
    
    var codexNotExist = false;
    var armeeJson;
    //Prüfe vorher ob nicht schon geladen
    for (var i = 0; i < allLoadedJson.length; ++i) {
        console.log(allLoadedJson[i]);
        if(allLoadedJson[i].file === file){
            armeeJson = allLoadedJson[i];
        }
    }
    //Lade JSON und speicher sie Global
    if(armeeJson === null || armeeJson === undefined){
        armeeJson = get("codex/"+file);
        armeeJson.file = file;
        allLoadedJson.push(armeeJson);
        codexNotExist = true;
    }
    /*
     * Die selektierten Armeen erweitern,
     * die Auswahl Eindeutig machen damit die
     * besser Erweitert werden kann
     */
    var armeeId = armeeJson.name + date.getTime();
    //TODO: Eher ein Object erzeugen mit dem Wert
    allSelectetArmees.push(armeeId);
    
    //Die Daten des Codex werden nur einmal gespeichert
    if(codexNotExist){
        iniUnitDialog(armeeJson);
    }
    
    //Initialisere Armeeabschnitt in Body
    iniArmeeContainer(armeeId, armeeJson.name);
}

/*
 * Entfernt die Armee aus dem globalen Speicher, aktualisert den Dialog für die verschiedenen Einheiten und
 * löscht den Abschnitt im Body für die Armee
 */
function removeArmee(armee){
    console.log(armee);
}
