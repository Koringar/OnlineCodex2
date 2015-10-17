/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// TODO: Vielleicht doch lieber in window.sessionStorage
var allSelectetArmees = new Array(); // Globale Variable für alle ausgewählten Armeen

// Seite initialisieren
$(document).ready(function() {
    //Paar Sachen der Seite übersetzen
    $('a[href="#optionsMenu"').attr({title: getNationalText("buttonGearTitle")}).html(getNationalText("buttonGearTitle"));
    $('a[href="#addArmee"').attr({title: getNationalText("buttonAddArmyTitle")}).html(getNationalText("buttonAddArmyText"));
    $("#summary").html(getNationalText("divSummaryPointsText") + ": 0");
    
    //Init Popups
    initOptionDialog();
    initAddArmeeDialog();
    
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
 * Gibt den Parameter der URl wieder, wenn dieser nicht gesetzt ist, ist
 * die Rückgabe leer.
 * 
 * @param {type} name: Gewünschter Parameter
 * @returns {String}
 */
function getUrlParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

/*
 * Gibt den Text für die aktuelle Sprache, wird über die URL ermittelt.
 * Wenn er nichts finden kann geht er auf Deutsch.
 * 
 * @param {String} key: Gewünschter Text Key
 * @param {String} suffix: optional, wird beim Suchen vorne an den Key gehangen
 * @returns {String}
 */
function getNationalText(key, suffix){
    var lang = getUrlParameterByName("lang");
    var langpack;
    if(lang !== null && lang !== undefined && lang !== ""){
        langpack = get("language/" + lang + ".json");
    }
    //Fallback auf das DE Package
    if(langpack === null || langpack === undefined){
        langpack = get("language/de.json");
    }
    var value;
    if(suffix !== null && suffix !== undefined && suffix !== ""){
        //Ersten Buchstaben des Key Sicherheitshalber groß machen
        key = key.charAt(0).toUpperCase() + key.slice(1);
        value = langpack[suffix + key];
    }else if(key !== null && key !== undefined && key !== ""){
        value = langpack[key];
    }
    //Fallback auf den Default Text
    if(value === null || value === undefined || value === ""){
        value = langpack["defaultText"];
    }
    return value;
}

function getArmyIndex() {
  return get("codex/index.json");
}

/*
 * Gibt den Index, welcher Codex vorhanden ist, als JSON Object wieder.
 * 
 * @returns {@var;callback|Boolean|data}
 */
function getArmyIndex() {
  return get("codex/index.json");
}

/*
 * Gibt das JSON Oject der Default Formation (Haup-, Verbündenten- und Loses Kontigent) wieder.
 * 
 * @returns {@var;callback|Boolean|data}
 */
function getDefaultFormationJson(){
    return get("codex/default_formations.json");
}

/*
 * Gibt das JSON Object der Armee wieder
 * 
 * @param {type} armee: Armee die man will
 * @returns {@var;callback|Boolean|data}
 */
function getArmeeJson(armee){
    return get("codex/" + armee);
}

/*
 * Gibt den Index der gesuchten Armee in den Ausgewählten Armeen wieder.
 * 
 * @param {type} UNID: ID der Armee
 * @returns {Number}
 */
function getIndexInSelectedArmees(UNID){
    var armeeCounter = 0;
    for (var i = 0; i < allSelectetArmees.length; i++) {
        if(allSelectetArmees[i].UNID === UNID){
            armeeCounter = i;
            break;
        }
    }
    return armeeCounter;
}

/*
 * Initialisert den Dialog für die verschiedenen Armeen
 */
function initAddArmeeDialog(){
    //Hole alle Armeen
    var indexJson = getArmyIndex();
    //Fülle den Dialog mit den Elementen
    $("div[data-role='navbar']").prepend('<div data-history="false" data-role="popup" id="addArmee" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
    $("#addArmee").append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right" title="' + getNationalText("buttonCloseTitle") + '"></a>');
    $("#addArmee").append('<ul data-role="listview" class="ui-grid-solo ui-listview popup"></ul>');
    $("#addArmee ul").append('<li data-role="list-divider" class="ui-block-a ui-li-divider ui-bar-inherit" role="heading">' + getNationalText("popupAddArmyText") + ':</li>');
    $.each(indexJson, function (file, data) {
        name = data.name;
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
    //TODO:
    $("div[data-role='header']").prepend('<div data-history="false" data-role="popup" id="optionsMenu" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
    $("#optionsMenu").append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right" title="' + getNationalText("buttonCloseTitle") + '"></a>');
    $("#optionsMenu").append('<ul data-role="listview" class="ui-listview ui-listview-inset ui-corner-all ui-shadow popup"></ul>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Speichern</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Laden</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Drucken</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Teilen</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Hilfe</a></li>');
    $("#optionsMenu ul").append('<li data-icon="false"><a href="#" class="ui-btn">Über diese Anwendung</a></li>');
    //Popup nachträglich initialisieren
    $("#optionsMenu").popup();
}

function initChangeArmeeDialog(armeeJson){
    var defaultFormations = getDefaultFormationJson().formations;
    var armeeFormations = armeeJson.formations;
    
    //Prüfe ob die Daten zum Anpassen Dialog der Armee schon existierren, die muss es nur einmal geben
    if($('div[id="changeArmee' + armeeJson.name + '"]').length === 0){
        //Fülle den Dialog mit den Elementen
        $("div[data-role='content']").prepend('<div data-history="false" data-role="popup" id="changeArmee' + armeeJson.name + '" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
        $('div[id="changeArmee' + armeeJson.name + '"]').append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right" title="' + getNationalText("buttonCloseTitle") + '"></a>');
        //Inhalt setzen
        $('div[id="changeArmee' + armeeJson.name + '"]').append('<ul data-role="listview" class="ui-grid-solo ui-listview popup"></ul>');
        $('div[id="changeArmee' + armeeJson.name + '"] ul').append('<li data-role="list-divider" class="ui-block-a ui-li-divider ui-bar-inherit">' + getNationalText("popupChangeArmeeText") + ':</li>');
        if(defaultFormations !== null && defaultFormations !== undefined){
            $.each(defaultFormations, function (counter, formation) {
                $('div[id="changeArmee' + armeeJson.name + '"] ul').append('<li data-icon="false"><a href="#changeArmee" class="ui-btn" type="' + formation.name + '">' + getNationalText(formation.name, "divArmeeType") + '</a></li>');
            });
        }
        if(armeeFormations !== null && armeeFormations !== undefined){
            $('div[id="changeArmee' + armeeJson.name + '"] ul').append('<li data-role="list-divider" class="ui-block-a ui-li-divider ui-bar-inherit">' + getNationalText("popupChangeFormationText") + ':</li>');
            $.each(armeeFormations, function (counter, formation) {
                $('div[id="changeArmee' + armeeJson.name + '"] ul').append('<li data-icon="false"><a href="#changeArmee" class="ui-btn" type="' + formation.name + '">' + formation.name + '</a></li>');
            });
        }
        //Button zum entfernen der Armee
        $('div[id="changeArmee' + armeeJson.name + '"] ul').append('<li data-icon="false"><a href="#changeArmee" class="ui-btn" type="deleteArmee">' + getNationalText("buttonDeleteArmeeTitle") + '</a></li>');
         
        //Der Popup muss mit seinen Daten nur einmal Initialsiert werden
        $("#changeArmee" + armeeJson.name).popup();
        //Clickevents einfangen und verarbeiten, im Anpassendialog
        $("#changeArmee" + armeeJson.name + " a[href=#changeArmee]").click(function() {
            changeArmee($(this));
        });
    }
}

/*
 * Initialisert die Optionen für den Einheiten Dialog
 * 
 * @param {Object} armeeJson: Das geladene JSON Object
 */
function initAddUnitDialog(armeeJson){
    //Prüfe ob die Daten zum Einheiten Dialog schon existierren, die muss es nur einmal geben
    if($('div[id="addUnit' + armeeJson.name + '"]').length === 0){
        //Fülle den Dialog mit den Elementen
        $("div[data-role='content']").prepend('<div data-history="false" data-role="popup" id="addUnit' + armeeJson.name + '" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
        $('div[id="addUnit' + armeeJson.name + '"]').append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right" title="' + getNationalText("buttonCloseTitle") + '"></a>');
        //Inhalt setzen
        $('div[id="addUnit' + armeeJson.name + '"]').append('<div class="popup"></div>');
        $('div[id="addUnit' + armeeJson.name + '"] > div:nth-child(2)').append('<div class="popupHeader">' + armeeJson.name + '</div><div class="unitGroups"></div>');
        $.each(armeeJson.groups, function (group, array) {
            $('div[id="addUnit' + armeeJson.name + '"] div.unitGroups').append('<div class="popupTable ' + group + '"><div class="popupTableRow"><div>' + getNationalText(group, "groupText") + '</div><div>' + getNationalText("divPointsText") + '</div></div></div>');
            $.each(array, function (counter, unit) {
                $('div[id="addUnit' + armeeJson.name + '"] div.' + group).append('<a href="#addUnitToArmee" class="ui-btn popupTableRow"><div>' + unit.name + '</div><div>' + unit.cost + '</div></a>');
            });
        });

        //Der Popup muss mit seinen Daten nur einmal Initialsiert werden
        $("#addUnit" + armeeJson.name).popup();
        //Clickevents einfangen und verarbeiten, im Einheitendialog
        $("#addUnit" + armeeJson.name + " a[href=#addUnitToArmee]").click(function() {
            addUnit($(this));
        });
    }
}

/*
 * Initialisiert den Armee Container im Body
 * 
 * @param {String} UnID: Eindeutige ID
 * @param {String} ArmeeName: Name der Armee
 */
function initArmeeContainer(Armee){
    var UNID = Armee.UNID;
    var ArmeeName = Armee.Name;
    //Der Container
    $("div[data-role='content']").append('<div id="' + UNID + '" class="armee"><div class="armeeHeader"></div></div>');
    //Anzeige des Name
    $("#" + UNID + " > div.armeeHeader").append('<div class="armeeName">' + ArmeeName + '</div>');
    //Anzeige der Formation, die ersten Formation ist das Hauptkontigent ansonsten eben Verbündetenkontigent
    $("#" + UNID + " > div.armeeHeader").append('<div class="armeeType" type="' + Armee.Type + '">(' + getNationalText(Armee.Type, "divArmeeType") + ')</div>');
    //Schaltfläche zum ändern der Formation
    $("#" + UNID + " > div.armeeHeader").append('<a href="#changeArmee' + ArmeeName + '" data-rel="popup" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-shadow ui-corner-all" title="' + getNationalText("buttonChangeArmeeTitle") + '"></a>');
    //Für Einheitenauswahl
    $("#" + UNID + " > div.armeeHeader").append('<a href="#addUnit' + ArmeeName + '" data-rel="popup" class="ui-btn ui-icon-plus ui-btn-icon-notext ui-shadow ui-corner-all" title="' + getNationalText("buttonAddUnitTitle") + '"></a>');
    //Alle Gruppen in einen Container mit Flex
    $("#" + UNID).append('<div class="groups"></div>');
    //Alle Gruppen initialisieren, aber verstecken
    $('#' + UNID + " > div.groups").append('<div style="display: none;" class="group HQ"><div class="ui-grid-b"><div class="ui-block-a groupName">' + getNationalText("groupTextHQ") + '()</div><div class="ui-block-b groupPoints">0 ' + getNationalText("divPointsText") + '</div></div></div>');
    $('#' + UNID + " > div.groups").append('<div style="display: none;" class="group elite"><div class="ui-grid-b"><div class="ui-block-a groupName">' + getNationalText("groupTextElite") + '()</div><div class="ui-block-b groupPoints">0 ' + getNationalText("divPointsText") + '</div></div></div>');
    $('#' + UNID + " > div.groups").append('<div style="display: none;" class="group default"><div class="ui-grid-b"><div class="ui-block-a groupName">' + getNationalText("groupTextDefault") + '()</div><div class="ui-block-b groupPoints">0 ' + getNationalText("divPointsText") + '</div></div></div>');
    $('#' + UNID + " > div.groups").append('<div style="display: none;" class="group storm"><div class="ui-grid-b"><div class="ui-block-a groupName">' + getNationalText("groupTextStorm") + '()</div><div class="ui-block-b groupPoints">0 ' + getNationalText("divPointsText") + '</div></div></div>');
    $('#' + UNID + " > div.groups").append('<div style="display: none;" class="group support"><div class="ui-grid-b"><div class="ui-block-a groupName">' + getNationalText("groupTextSupport") + '()</div><div class="ui-block-b groupPoints">0 ' + getNationalText("divPointsText") + '</div></div></div>');
    $('#' + UNID + " > div.groups").append('<div style="display: none;" class="group defence"><div class="ui-grid-b"><div class="ui-block-a groupName">' + getNationalText("groupTextDefence") + '()</div><div class="ui-block-b groupPoints">0 ' + getNationalText("divPointsText") + '</div></div></div>');
    $('#' + UNID + " > div.groups").append('<div style="display: none;" class="group hulk"><div class="ui-grid-b"><div class="ui-block-a groupName">' + getNationalText("groupTextHulk") + '()</div><div class="ui-block-b groupPoints">0 ' + getNationalText("divPointsText") + '</div></div></div>');
    //Für die Punkte der Armee
    $("#" + UNID).append('<div class="armeeSummary">' + getNationalText("divSummaryPointsText") + ' ' + ArmeeName + ': 0</div>');
    
    //Muss ich einfangen, um die ID zusetzen von wo aus der Dialog aufgerufen wird.
    $('#' + UNID + ' a[href="#changeArmee' + ArmeeName + '"]').click(function() {
        $('div[id="changeArmee' + ArmeeName + '"]').attr({UNID: UNID});
        //Außerdem noch setzen was momentan ausgewählt ist, TODO: noch nicht zufriedendstellend
        //var currentType = $('#' + UNID + ' div.armeeType').attr("type");
        //$('div[id="changeArmee' + ArmeeName + '"] div[type="' + currentType + '"]').attr({selected: true});
    });
    $('#' + UNID + ' a[href="#addUnit' + ArmeeName + '"]').click(function() {
        $('div[id="addUnit' + ArmeeName + '"]').attr({UNID: UNID});
    });
    //TODO: Anpassen Popup/Dialog initialisieren
}

/*
 * Rendert beim neuladen der Seite alles wieder
 */
function renderSelectetArmees(){
    console.log("Ausgewählte Armeen: " + allSelectetArmees.length);
}

/*
 * Läde die Armee in den globalen Speicher, aktualisert den Dialog für die verschiedenen Einheiten und
 * initialisert den Abschnitt im Body für die Armee
 * 
 * @param {String} file: JSON File
 */
function loadArmee(file){
    // Für die Millisekunden, für Eindeutigkeit
    var date = new Date();
    //Lade JSON
    var armeeJson = getArmeeJson(file);
    //Die Auswahl Eindeutig machen damit die besser auf sie zugegriffen werden kann
    var UNID = armeeJson.name + date.getTime();
    //Speicher die UNID und den Armee Name in ein Object, in diesem werden dann die Auswahlen gesetzt
    var newArmee = new Object();
    newArmee.UNID = UNID;
    newArmee.Name = armeeJson.name;
    newArmee.File = file;
    //Festelgen um welchen Type es sich handelt
    var defaultFormations = getDefaultFormationJson();
    newArmee.Type = ((allSelectetArmees.length===0)?defaultFormations.formations[0].name:defaultFormations.formations[1].name);
    //Gruppen für die Auswahl initialisieren
    newArmee.HQ = [];
    newArmee.elite = [];
    newArmee.default = [];
    newArmee.storm = [];
    newArmee.support = [];
    newArmee.hulk = [];
    //Zur Auswahl aller Selektierten Armee hinzufügen
    allSelectetArmees.push(newArmee);
    
    //Initialisiere den Dialog zum Anpassen der Armee (Formations/Löschen)
    initChangeArmeeDialog(armeeJson);
    //Initialisiere den Dialog für die Einheitenauswahl
    initAddUnitDialog(armeeJson);
    //Initialisiere Armeeabschnitt in Body
    initArmeeContainer(newArmee);
}

/*
 * Ändern den Type der Armee oder löscht sie, je nachdem was angeklickt wurde,
 * passt auch gleich den Globalen Speicher und Body an.
 */
function changeArmee(armee){
    var auswahl = armee.attr("type");
    var auswahlText = armee.html();
    var UNID = armee.parent().parent().parent().attr("UNID");
    var armeeIndex = getIndexInSelectedArmees(UNID);
    
    //Armee löschen
    if(auswahl === "deleteArmee"){
        $('#' + UNID).remove();
        allSelectetArmees.splice(armeeIndex, 1);
        //Zählte alle Punkte zusammen
        sumTotalPoins();
    } else {
    //Ansonsten Type oder Formation ändern
        $('#' + UNID + ' div.armeeType').attr({type: auswahl});
        if(auswahlText === null || auswahlText === undefined){
            $('#' + UNID + ' div.armeeType').html("(" + getNationalText(auswahl, "divArmeeType") + ")");
        }else{
            $('#' + UNID + ' div.armeeType').html("(" + auswahlText + ")");
        }
        allSelectetArmees[armeeIndex].Type = auswahl;
    }
}

/*
 * Fügt die Ausgewählte Einheit an die Armee an, von wo der Dialog aufgerufen wurde.
 * 
 * @param {type} unitToAdd, das Element
 */
function addUnit(unitToAdd){
    // Für die Millisekunden, für Eindeutigkeit
    var date = new Date();
    var auswahl = unitToAdd.children("div:first-child").html();
    //Die Auswahl Eindeutig machen damit die besser auf sie zugegriffen werden kann
    var auswahlUNID = "unit" + date.getTime();
    var groupname = unitToAdd.parent().attr("class").split(' ')[1];
    //Die ID der Armee, wo alles angehangen werden soll, ist am obersten Element
    var UNID = unitToAdd.parent().parent().parent().parent().attr("UNID");
    //Ausgewählte Armee merken
    var armeeIndex = getIndexInSelectedArmees(UNID);
    //JSON des Codex holen, dafür muss ich erstmal den Filename des JSON finden
    var codex = getArmeeJson(allSelectetArmees[armeeIndex].File);
    
    //Innerhalb des JSON die Auswahl suchen und das zur Seite und der Ausgewälten Armee hinzufügen
    var group = null;
    group = codex.groups[groupname];
    if(group !== null && group.length >= 0){
        for (var counter in group) {
            if(group[counter].name === auswahl){
                auswahl = group[counter];
                break;
            }
        }
    }
    //Gruppe sichtbar machen
    if($('#' + UNID + ' div.' + groupname).attr("style") === "display: none;"){
        $('#' + UNID + ' div.' + groupname).removeAttr("style");
    };
    
    $('#' + UNID + ' div.' + groupname).append('<div id="' + auswahlUNID + '" class="ui-grid-b value"></div>');
    //Dem gerade erstellten Container die Werte mitgeben
    $('#' + auswahlUNID).append('<div class="ui-block-a selectionName">' + auswahl.name + '</div>');
    $('#' + auswahlUNID).append('<div class="ui-block-b selectionPoints">' + auswahl.cost + ' Punkte</div>');
    $('#' + auswahlUNID).append('<div class="ui-block-c"><a href="#" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-shadow ui-corner-all" title="' + getNationalText("buttonChangeUnitTitle") + '"></a></div>');
    $('#' + auswahlUNID).append('<div class="selectionOptions"></div>');
    //Einheitenname ermitteln
    var entityName = "";
    if(auswahl.entityName !== null && auswahl.entityName !== undefined){
        entityName = auswahl.entityName;
    }else{
        entityName = auswahl.name;
    }
    //Wenn minGroup größer 1 ist, dann versuchen es zusammen zufassen, wenn es genau gleich ist Einmal erzeugen, ansonsten nichts machen
    if(auswahl.minGroup !== null && auswahl.minGroup !== undefined && auswahl.minGroup > 1){
        $('#' + auswahlUNID + ' div.selectionOptions').append(auswahl.minGroup + " x " + entityName + "<br />");
    }else if(auswahl.minGroup !== null && auswahl.minGroup !== undefined && auswahl.minGroup === 1){
        $('#' + auswahlUNID + ' div.selectionOptions').append(entityName + "<br />");
    }
    //Default Options Hinzufügen, der Rest geht über den Anpassen Dialog
    $.each(auswahl.options, function (counter, option) {
        //Wenn es eine Gruppen von Möglichkeiten sind, dann ist es ein Array. Brauch aber nur die Default Angabe
        if(Array.isArray(option)){
            for (var i = 0; i < option.length; i++) {
                if(option[i].default !== null && option[i].default !== undefined && option[i].default === true){
                    option = option[i];
                    break;
                }
            }
        }
        //Wenn es jetzt immer noch ein Array ist, dann ist keine Default Option vorhanden
        if(!Array.isArray(option)){
            //Default Angaben haben keine Kosten oder sind Default True
            if(option.cost === null || option.cost === undefined){
                if(auswahl.minGroup !== null && auswahl.minGroup !== undefined && auswahl.minGroup > 1){
                    $('#' + auswahlUNID + ' div.selectionOptions').append("- " + auswahl.minGroup + " x " + option.name + "<br />");
                }else{
                    $('#' + auswahlUNID + ' div.selectionOptions').append("- " + option.name + "<br />");
                }
            }else if(option.default !== null && option.default !== undefined && option[i].default === true){
                //TODO: Der Zweig notwendig???
                console.log(option);
            }
        }
    });
    
    //Selektierte Armee erweitern, es wird nur die Auswahl gemerkt, die Punkte haben da nichts zu suchen
    allSelectetArmees[armeeIndex][groupname].push(auswahl.name);
    //Werte für die Einheitenanzahl und Punktekosten ermitteln
    countGroupUnits(UNID, groupname);
    sumGroupPoints(UNID, groupname);
    //Zähle alle Punkte für die Armee
    sumArmeePoints(UNID);
    //Zähle alle Punkte zusammen
    sumTotalPoins();
    
    //TODO: Anpassen Popup/Dialog initialisieren
}

/*
 * Zählt innerhalb einer Gruppe alle Selectionen
 * 
 * @param {String} UnID: Eindeutige ID
 * @param {String} GroupName: Der interne Gruppenname
 */
function countGroupUnits(UNID, GroupName){
    var unitCounter = 0;
    $('#' + UNID + ' div.' + GroupName + ' div.selectionName').each(function () {
        //Einheit hochzählen
        unitCounter++;
    });
    //Neuen Wert setzen, mit altem Text
    var oldValue = $('#' + UNID + ' div.' + GroupName + ' div.groupName').html().split("(");
    $('#' + UNID + ' div.' + GroupName + ' div.groupName').html(oldValue[0] + " (" + unitCounter + ")");
}

/*
 * Zählt innerhalb einer Gruppe alle Punkte der Selectionen
 * 
 * @param {String} UnID: Eindeutige ID
 * @param {String} GroupName: Der interne Gruppenname
 */
function sumGroupPoints(UNID, GroupName){
    var sumPoints = 0;
    $('#' + UNID + ' div.' + GroupName + ' div.selectionPoints').each(function (counter, element) {
        var groupCosts = element.innerHTML;
        groupCosts = new Number(groupCosts.substring(0, groupCosts.indexOf(" " + getNationalText("divPointsText"))));
        //Punkte addieren
        sumPoints = sumPoints + groupCosts;
    });
    //Neuen Wert setzen, mit altem Text
    var oldValue = $('#' + UNID + ' div.' + GroupName + ' div.groupPoints').html().split(" ");
    $('#' + UNID + ' div.' + GroupName + ' div.groupPoints').html(sumPoints + " " + oldValue[1]);
}

/*
 * Zählt alle Gruppenpunkte zu einer Armee und setzt diese dann in das Summary der Armee
 * 
 * @param {String} UnID: Eindeutige ID
 */
function sumArmeePoints(UNID){
    var sumPoints = 0;
    $('#' + UNID + ' div.groupPoints').each(function (counter, element) {
        var groupCosts = element.innerHTML;
        groupCosts = new Number(groupCosts.substring(0, groupCosts.indexOf(" " + getNationalText("divPointsText"))));
        //Punkte addieren
        sumPoints = sumPoints + groupCosts;
    });
    //Neuen Wert setzen, mit altem Text
    var oldValue = $('#' + UNID + ' div.armeeSummary').html().split(":");
    $('#' + UNID + ' div.armeeSummary').html(oldValue[0] + ": " + sumPoints);
}

/*
 * Zählt alle Armeepunkte und setzt diese dann in das Globale Summary
 */
function sumTotalPoins(){
     var sumPoints = 0;
    $('div.armeeSummary').each(function (counter, element) {
        var armeeCosts = element.innerHTML;
        armeeCosts = new Number(armeeCosts.substring(armeeCosts.indexOf(":")+1, armeeCosts.length));
        //Punkte addieren
        sumPoints = sumPoints + armeeCosts;
    });
    //Neuen Wert setzen, mit altem Text
    var oldValue = $('#summary').html().split(":");
    $('#summary').html(oldValue[0] + ": " + sumPoints);
}