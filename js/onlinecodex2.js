/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var defaultFormations = new Array(); // Globale Variable für die Default Formationen
var allLoadedJson = new Array(); // Globale Variablen für alle JSON Object vom Codex
var allSelectetArmees = new Array(); // Globale Variable für alle ausgewählten Armeen

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
 * Läde die Armee in den globalen Speicher, aktualisert den Dialog für die verschiedenen Einheiten und
 * initialisert den Abschnitt im Body für die Armee
 * 
 * @param {type} file: JSON File
 */
function loadArmee(file){
    var armeeJson;
    //Prüfe vorher ob nicht schon geladen
    for (var i = 0; i < allLoadedJson.length; ++i) {
        if(allLoadedJson[i].file === file){
            armeeJson = allLoadedJson[i];
        }
    }
    //Lade JSON und speicher sie Global
    if(armeeJson === null || armeeJson === undefined){
        armeeJson = get("codex/"+file);
        allLoadedJson.push(armeeJson);
    }
    //Die Selektierten Armeen erweitern
    allSelectetArmees.push(armeeJson.name);
    
    //Initialisere Armeeabschnitt in Body
    console.log(armeeJson.name);
    
    //Erweitere den Einheiten Dialog
}

/*
 * Entfernt die Armee aus dem globalen Speicher, aktualisert den Dialog für die verschiedenen Einheiten und
 * löscht den Abschnitt im Body für die Armee
 */
function removeArmee(armee){
    console.log(armee);
}
