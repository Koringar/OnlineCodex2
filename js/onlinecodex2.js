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
    //Seite neu aufbauen
    renderSelectetArmees();
});

// Dialog initialisieren
$("#addArmee").ready(function() {
    initArmeeDialog();
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
    $.each(indexJson, function (file, name) {
        $("#addArmee ul").append('<li data-icon="false"><a href="#" class="ui-btn" json="' + file + '">'+name+'</a></li>');
    });
    //Registrie den Click und lade dann die Armee
    $("#addArmee ul li a").click(function() {
        loadArmee($(this).attr("json"));
        $("#addArmee").popup( "close" );
    });
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
 * @param {type} file: JSON File
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
    allSelectetArmees.push(armeeId);
    
    //Initialisere Armeeabschnitt in Body
    $("div[data-role='content']").append('<div id="' + armeeId + '" class="armee"><div class="armeeName">' + armeeJson.name + '</div><div class="armeeType">(' + ((allSelectetArmees.length===1)?defaultFormations.formations[0].name:defaultFormations.formations[1].name) + ')</div><button href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-shadow ui-corner-all" title="anpassen"></button><a href="#addUnit' + armeeJson.name + '" data-rel="popup" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-shadow ui-corner-all" title="Einheit hinzufügen"></a><div style="clear: both;"><div class="armeeSummary">Gesamtpunkte ' + armeeJson.name + ': 0</div></div>');
    
    if(codexNotExist){
        //Erweitere den Einheiten Dialog
        $("div[data-role='content']").prepend('<div data-role="popup" id="addUnit' + armeeJson.name + '" data-theme="a" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
        //Inhalt setzen
        $('div[id="addUnit' + armeeJson.name + '"]').append("<div></div>");
        $('div[id="addUnit' + armeeJson.name + '"] > div:first-child').append("<div>Armee:" + armeeJson.name + "</div>");
        $.each(armeeJson.groups, function (group, array) {
            $.each(array, function (counter, unit) {
                $('div[id="addUnit' + armeeJson.name + '"] > div:first-child').append("<div>" + group + ": "+ unit.name + "</div>");
            });
        });
    }
    //Popup nachträglich initialisieren
    $("#addUnit" + armeeJson.name).popup();
}

/*
 * Entfernt die Armee aus dem globalen Speicher, aktualisert den Dialog für die verschiedenen Einheiten und
 * löscht den Abschnitt im Body für die Armee
 */
function removeArmee(armee){
    console.log(armee);
}
