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
    initSiteContainer();    
    //Seite neu aufbauen
    renderSelectetArmees();
});

/*
 * Gibt das JSON Object wieder
 * 
 * @param {String} uri
 * @param {Function} callback
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
 * @param {String} name: Gewünschter Parameter
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
 * @param {String} armee: Armee die man will
 * @returns {@var;callback|Boolean|data}
 */
function getArmeeJson(armee){
    return get("codex/" + armee);
}

/*
 * Gibt den Index der gesuchten Armee in den Ausgewählten Armeen wieder.
 * 
 * @param {String} UNID: ID der Armee
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
 * Initialisert alles für die Seite, was am Anfang noch wendig ist
 */
function initSiteContainer(){
    //Paar Sachen der Seite übersetzen
    $('a[href="#optionsMenu"').attr({title: getNationalText("buttonGearTitle")}).html(getNationalText("buttonGearTitle"));
    $('a[href="#addArmee"').attr({title: getNationalText("buttonAddArmyTitle")}).html(getNationalText("buttonAddArmyText"));
    $("#summary").html(getNationalText("divSummaryPointsText") + ": 0");
    //Dialoge inialisieren
    initOptionDialog();
    initAddArmeeDialog();
    
    $('div[data-role="header"]').toolbar();
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
        if(data.longname !== null && data.longname !== undefined && data.longname !== ""){
            name = data.longname;
        }
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

/*
 * Initialisert den Dialog mit dem man das Kontigent, die Formation wechseln kann oder die Armee komplett löschen.
 * Um welche Armee es sich handelt, wird wo anders gesetzt
 * 
 * @param {Object} armeeCodex: Das JSON Object der Armee
 */
function initChangeArmeeDialog(armeeCodex){
    var defaultContingent = getDefaultFormationJson().contingent;
    var armeeContingent = armeeCodex.contingent;
    var armeeFormations = armeeCodex.formations;
    
    //Prüfe ob die Daten zum Anpassen Dialog der Armee schon existierren, die muss es nur einmal geben
    if($('#changeArmee' + armeeCodex.name).length === 0){
        //Fülle den Dialog mit den Elementen
        $("div[data-role='content']").prepend('<div data-history="false" data-role="popup" id="changeArmee' + armeeCodex.name + '" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
        $('#changeArmee' + armeeCodex.name).append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right" title="' + getNationalText("buttonCloseTitle") + '"></a>');
        //Inhalt setzen
        $('#changeArmee' + armeeCodex.name).append('<ul data-role="listview" class="ui-grid-solo ui-listview popup"></ul>');
        $('#changeArmee' + armeeCodex.name + ' ul').append('<li data-role="list-divider" class="ui-block-a ui-li-divider ui-bar-inherit">' + getNationalText("popupChangeArmeeText") + ':</li>');
        if(defaultContingent !== null && defaultContingent !== undefined && defaultContingent.length > 0){
            $.each(defaultContingent, function (counter, contingent) {
                $('#changeArmee' + armeeCodex.name + ' ul').append('<li data-icon="false"><a href="#changeArmee" class="ui-btn" type="' + contingent.name + '">' + getNationalText(contingent.name, "divArmeeType") + '</a></li>');
            });
        }
        if(armeeContingent !== null && armeeContingent !== undefined && armeeContingent.length > 0){
            $.each(armeeContingent, function (counter, contingent) {
                $('#changeArmee' + armeeCodex.name + ' ul').append('<li data-icon="false"><a href="#changeArmee" class="ui-btn" type="' + contingent.name + '">' + contingent.name + '</a></li>');
            });
        }
        if(armeeFormations !== null && armeeFormations !== undefined && armeeFormations.length > 0){
            $('#changeArmee' + armeeCodex.name + ' ul').append('<li data-role="list-divider" class="ui-block-a ui-li-divider ui-bar-inherit">' + getNationalText("popupChangeFormationText") + ':</li>');
            $.each(armeeFormations, function (counter, formation) {
                $('#changeArmee' + armeeCodex.name + ' ul').append('<li data-icon="false"><a href="#changeArmee" class="ui-btn" type="' + formation.name + '">' + formation.name + '</a></li>');
            });
        }
        //Button zum entfernen der Armee
        $('#changeArmee' + armeeCodex.name + ' ul').append('<li data-role="list-divider" class="ui-block-a ui-li-divider ui-bar-inherit">' + getNationalText("popupDeleteArmeeText") + ':</li>');
        $('#changeArmee' + armeeCodex.name + ' ul').append('<li data-icon="false"><a href="#changeArmee" class="ui-btn" type="deleteArmee">' + getNationalText("buttonDeleteArmeeTitle") + '</a></li>');
         
        //Der Popup muss mit seinen Daten nur einmal Initialsiert werden
        $("#changeArmee" + armeeCodex.name).popup();
        //Clickevents einfangen und verarbeiten, im Anpassendialog
        $("#changeArmee" + armeeCodex.name + " a[href=#changeArmee]").click(function() {
            changeArmee($(this));
        });
    }
}

/*
 * Initialisert die Optionen für den Einheiten Dialog
 * 
 * @param {Object} armeeCodex: Das JSON Object der Armee
 */
function initAddUnitDialog(armeeCodex){
    //Prüfe ob die Daten zum Einheiten Dialog schon existierren, die muss es nur einmal geben
    if($('#addUnit' + armeeCodex.name).length === 0){
        //Fülle den Dialog mit den Elementen
        $("div[data-role='content']").prepend('<div data-history="false" data-role="popup" id="addUnit' + armeeCodex.name + '" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
        $('#addUnit' + armeeCodex.name).append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right" title="' + getNationalText("buttonCloseTitle") + '"></a>');
        //Inhalt setzen
        $('#addUnit' + armeeCodex.name).append('<div class="popup"></div>');
        $('#addUnit' + armeeCodex.name + ' > div:nth-child(2)').append('<div class="popupHeader">' + armeeCodex.name + '</div><div class="unitGroups"></div>');
        $.each(armeeCodex.groups, function (group, array) {
            //Wenn nichts in der Gruppe existiert, dann nicht zur Auswahl anzeigen
            if(array !== null && array !== undefined && array.length > 0){
                $('#addUnit' + armeeCodex.name + ' div.unitGroups').append('<div class="popupTable ' + group + '"><div class="popupTableRow"><div>' + getNationalText(group, "groupText") + '</div><div>' + getNationalText("divPointsText") + '</div></div></div>');
                $.each(array, function (counter, unit) {
                    $('#addUnit' + armeeCodex.name + ' div.' + group).append('<a href="#addUnitToArmee" class="ui-btn popupTableRow"><div>' + unit.name + '</div><div>' + unit.cost + '</div></a>');
                });
            }
        });

        //Der Popup muss mit seinen Daten nur einmal Initialsiert werden
        $("#addUnit" + armeeCodex.name).popup();
        //Clickevents einfangen und verarbeiten, im Einheitendialog
        $("#addUnit" + armeeCodex.name + " a[href=#addUnitToArmee]").click(function() {
            addUnit($(this));
        });
    }
}

/*
 * Initialisiert den Container einmal und danach wird nur der Inhalt des Container immer wieder geändert auf die Einheit die man anpassen will.
 * Ein open braucht man nicht machen, das macht das Urspünglichen Click Event. Rückgegeben wird auch nichts, er schreibt die Änderungen gleich
 * in das unitObject
 * 
 * @param {Object} unitObject: Object der Einheit
 * @param {Object} codexUnit: Codex Eintrag der Einheit, hier holt es sich die Default Angaben
 * @param {Object} armeeCodex: Notwendig für paar Sachen die nicht in der Einheit zufinden sind (Option Listen)
 */
function initUnitChangeDialog(unitObject, unitCodex, armeeCodex){
    /* Etwas anderes Vorgehen als bei den anderen Popups/Dialogen. Dieser hier existiert wirklich nur einmal, egal welche Einheit man ändert.
     * Dafür muss nur der Container vorhanden sein und das Popup darauf einmal inialisiert werden. Danach kann der Inhalt des Popup immer wieder
     * an die Einheit angepasst werden, es gibt noch ein kleines Caching was die Einheit zweimal hintereinander geändert wird.
     */
    if($('#changeUnit > div[class="popup"] > div[class="popupHeader"]').attr("unitID") !== unitObject.UNID){
        if($("#changeUnit").length === 0){
            //Container für die Einheit, wird nur einmal benötigt
            $("div[data-role='content']").append('<div data-history="false" data-role="popup" id="changeUnit" class="ui-popup ui-body-a ui-overlay-shadow ui-corner-all"></div>');
            $("#changeUnit").append('<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right" title="' + getNationalText("buttonCloseTitle") + '"></a>');
            $("#changeUnit").append('<div class="popup"></div><div class="popupFooter"></div>');
            $('#changeUnit > div[class="popupFooter"]').append('<a href="#popupRemove" data-rel="back" class="ui-btn ui-corner-all ui-shadow" title="' + getNationalText("buttonRemoveTitle") + '">' + getNationalText("buttonRemoveTitle") + '</a>');
            $('#changeUnit > div[class="popupFooter"]').append('<a href="#popupCancel" data-rel="back" class="ui-btn ui-corner-all ui-shadow" title="' + getNationalText("buttonCancelTitle") + '">' + getNationalText("buttonCancelTitle") + '</a>');
            $('#changeUnit > div[class="popupFooter"]').append('<a href="#popopOk" data-rel="back" class="ui-btn ui-corner-all ui-shadow" title="' + getNationalText("buttonOkTitle") + '">' + getNationalText("buttonOkTitle") + '</a>');
            //Popup initialisieren
            $("#changeUnit").popup();
        }else{
            //Alle Daten des Popup löschen
            $('#changeUnit > div[class="popup"]').empty();
        }

        //Inhalt des Popup setzen
        $('#changeUnit > div[class="popup"]').append('<div class="popupHeader" unitID="' + unitObject.UNID + '">' + unitCodex.name + '</div>');
        //Momentane Einheitengröße ermittelt und ob die Anzeige zusammengefasst werden kann
        var unitSize = 0;
        var unitSizeMax = 0;
        var unitSizeMin = 0;
        var summary = false;
        //Default Anzahl ermitteln
        if(unitCodex.minGroup !== null && unitCodex.minGroup !== undefined && unitCodex.minGroup > 1){
            unitSize = unitCodex.minGroup;
            unitSizeMin = unitCodex.minGroup;
            summary = true;
        }else if(unitCodex.minGroup !== null && unitCodex.minGroup !== undefined && unitCodex.minGroup === 1){
            unitSize = unitCodex.minGroup;
            unitSizeMin = unitCodex.minGroup;
        }
        //Ermitteln was zum Default hinzukommt.
        if(unitObject.addToMin !== null && unitObject.addToMin !== undefined && unitSize > 0 && unitObject.addToMin > 0){
            unitSize = unitSize + unitObject.addToMin;
        }
        //Die Einheitenanzahl darf nicht das Maximum überschreiten
        if(unitCodex.maxGroup !== null && unitCodex.maxGroup !== undefined && unitCodex.maxGroup > 0){
            unitSizeMax = unitCodex.maxGroup;
            if(unitSize > unitSizeMax){
                unitSize = unitCodex.maxGroup;
            }
        }
        //Anzahl und Maximale rausschreiben
        if(unitSize > 0 && unitSizeMax > 0){
            $('#changeUnit > div[class="popup"]').append('<div class="popupUnitSize"></div>');
            $('#changeUnit div[class="popupUnitSize"]').append('<div>' + getNationalText("popupUnitSizeText") + ':</div>');
            $('#changeUnit div[class="popupUnitSize"]').append('<a href="#addToSize" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-carat-l ui-btn-icon-notext" title="' + getNationalText("buttonCloseTitle") + '"></a>');
            $('#changeUnit div[class="popupUnitSize"]').append('<div>' + unitSize + '/' + unitSizeMax + '</div>');
            $('#changeUnit div[class="popupUnitSize"]').append('<a href="#removeFromSize" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-carat-r ui-btn-icon-notext" title="' + getNationalText("buttonCloseTitle") + '"></a>');
        }
        //Optionen im Codex der Reihe nach durch gehen und schauen ob es eventuell ausgewählt wurde, TODO:
        $('#changeUnit > div[class="popup"]').append('<div class="popupOptions"></div>');
        $.each(unitCodex.options, function (counter, option) {
            //Eine Auswahl, aber mehre Möglichkeiten
            if(Array.isArray(option)){
                $('#changeUnit div[class="popupOptions"]').append('<div option="' + counter + '" data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u"></div>');
                $('#changeUnit div[class="popupOptions"] div[option="' + counter + '"]').append('<h4>Auswahl</h4><ul data-role="listview"></ul>');
                for (var a = 0; a < option.length; a++) {
                    $('#changeUnit div[class="popupOptions"] div[option="' + counter + '"] ul').append('<li>' + option[a].name + '</li>');
                }
                $('#changeUnit div[class="popupOptions"] div[option="' + counter + '"]').collapsible();
            }else if(option.lists !== null && option.lists !== undefined){
                $('#changeUnit div[class="popupOptions"]').append('<div option="' + counter + '" data-role="collapsible" data-collapsed-icon="carat-d" data-expanded-icon="carat-u"></div>');
                $('#changeUnit div[class="popupOptions"] div[option="' + counter + '"]').append('<h4>0/' + option.quantity + '</h4><ul data-role="listview"></ul>');
                for (var a = 0; a < option.lists.length; a++) {
                    var list = armeeCodex.optionLists[option.lists[a]];
                    $('#changeUnit div[class="popupOptions"] div[option="' + counter + '"] ul').append('<li>' + option.lists[a] + ':</li>');
                    for (var b = 0; b < list.length; b++) {
                        $('#changeUnit div[class="popupOptions"] div[option="' + counter + '"] ul').append('<li>' + list[b].name + '</li>');
                    }
                    $('#changeUnit div[class="popupOptions"] div[option="' + counter + '"]').collapsible();
                }
            }else{
                $('#changeUnit div[class="popupOptions"]').append('<div>' + option.name + '</div>');
            }
        });
    }
}

/*
 * Initialisiert den Armee Container im Body
 * 
 * @param {String} armeeObject: Das Armee Object
 */
function initArmeeContainer(armeeObject){
    var UNID = armeeObject.UNID;
    var ArmeeName = armeeObject.Name;
    //Der Container
    $("div[data-role='content']").append('<div id="' + UNID + '" class="armee"><div class="armeeHeader"></div></div>');
    //Anzeige des Name
    if(armeeObject.LongName !== null && armeeObject.LongName !== undefined && armeeObject.LongName !== ""){
        $("#" + UNID + " > div.armeeHeader").append('<div class="armeeName">' + armeeObject.LongName + '</div>');
    }else{
        $("#" + UNID + " > div.armeeHeader").append('<div class="armeeName">' + ArmeeName + '</div>');
    }
    //Anzeige der Formation, die ersten Formation ist das Hauptkontigent ansonsten eben Verbündetenkontigent
    $("#" + UNID + " > div.armeeHeader").append('<div class="armeeType" type="' + armeeObject.Type + '">(' + getNationalText(armeeObject.Type, "divArmeeType") + ')</div>');
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
    if(armeeObject.LongName !== null && armeeObject.LongName !== undefined && armeeObject.LongName !== ""){
        $("#" + UNID).append('<div class="armeeSummary">' + getNationalText("divSummaryPointsText") + ' ' + armeeObject.LongName + ': 0</div>');
    }else{
        $("#" + UNID).append('<div class="armeeSummary">' + getNationalText("divSummaryPointsText") + ' ' + ArmeeName + ': 0</div>');
    }
    //Muss ich einfangen, um die ID zusetzen von wo aus der Dialog aufgerufen wird.
    $('#' + UNID + ' a[href="#changeArmee' + ArmeeName + '"]').click(function() {
        //Und es auf dem Change Dialog geben
        $('#changeArmee' + ArmeeName).attr({UNID: UNID});
        //TODO: Außerdem noch setzen was momentan ausgewählt ist
        //var currentType = $('#' + UNID + ' div.armeeType').attr("type");
        //$('#changeArmee' + ArmeeName + ' a[type="' + currentType + '"]').attr({selected: true});
    });
    $('#' + UNID + ' a[href="#addUnit' + ArmeeName + '"]').click(function() {
        $('#addUnit' + ArmeeName).attr({UNID: UNID});
    });
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
 * @param {String} file: Pfad zum JSON File
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
    newArmee.LongName = armeeJson.longname;
    newArmee.File = file;
    //Festelgen um welchen Type es sich handelt
    var defaultContingent = getDefaultFormationJson();
    newArmee.Type = ((allSelectetArmees.length===0)?defaultContingent.contingent[0].name:defaultContingent.contingent[1].name);
    //Gruppen für die Auswahl initialisieren
    newArmee.HQ = [];
    newArmee.elite = [];
    newArmee.default = [];
    newArmee.storm = [];
    newArmee.support = [];
    newArmee.hulk = [];
    newArmee.defence = [];
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
 * 
 * @param {String} armeeHtml: HTML Container der Armee
 */
function changeArmee(armeeHtml){
    var auswahl = armeeHtml.attr("type");
    var auswahlText = armeeHtml.html();
    var UNID = armeeHtml.parent().parent().parent().attr("UNID");
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
 * @param {Object} unitToAdd: Die Einheit die hinzugefügt werden soll, das HTML Object was im Dialog geklickt wurde
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
    var group = codex.groups[groupname];
    if(group !== null && group.length >= 0){
        for (var counter in group) {
            if(group[counter].name === auswahl){
                auswahl = group[counter];
                break;
            }
        }
    }
    //Selektierte Armee erweitern, es wird nur die Auswahl gemerkt, die Punkte haben da nichts zu suchen
    var newUnit = new Object();
    newUnit.UNID = auswahlUNID;
    newUnit.name = auswahl.name;
    allSelectetArmees[armeeIndex][groupname].push(newUnit);
    
    //Gruppe sichtbar machen
    if($('#' + UNID + ' div.' + groupname).attr("style") === "display: none;"){
        $('#' + UNID + ' div.' + groupname).removeAttr("style");
    };
    
    $('#' + UNID + ' div.' + groupname).append('<div id="' + auswahlUNID + '"></div>');
    renderUnit(newUnit, auswahl, codex);
    
    //Werte für die Einheitenanzahl und Punktekosten ermitteln
    countGroupUnits(UNID, groupname);
    sumGroupPoints(UNID, groupname);
    //Zähle alle Punkte für die Armee
    sumArmeePoints(UNID);
    //Zähle alle Punkte zusammen
    sumTotalPoins();
}

/*
 * Erzeugt die Einheit mit ihrer Anzahl und der Optionen
 * 
 * @param {Object} unitObject: Object der Einheit
 * @param {Object} codexUnit: Codex Eintrag der Einheit, hier holt es sich die Default Angaben
 * @param {Object} armeeCodex: Notwendig für paar Sachen die nicht in der Einheit zufinden sind
 */
function renderUnit(unitObject, unitCodex, armeeCodex){
    //Dem erstellten Container die Werte mitgeben
    $('#' + unitObject.UNID).append('<div class="ui-grid-b unitHeader"></div>');
    $('#' + unitObject.UNID + ' > div.unitHeader').append('<div class="ui-block-a selectionName">' + unitObject.name + '</div>');
    //Standardpunkte setzen, das Endgültige Ergebnis wird am Ende berechnet
    $('#' + unitObject.UNID + ' > div.unitHeader').append('<div class="ui-block-b selectionPoints">' + unitCodex.cost + ' ' + getNationalText("divPointsText") + '</div>');
    $('#' + unitObject.UNID + ' > div.unitHeader').append('<div class="ui-block-c"><a href="#changeUnit" data-rel="popup" class="ui-btn ui-icon-edit ui-btn-icon-notext ui-shadow ui-corner-all" title="' + getNationalText("buttonChangeUnitTitle") + '"></a></div>');
    //ChangeUnit Handler registrieren
    $('#' + unitObject.UNID + ' a[href="#changeUnit"]').on("click", function() {
        initUnitChangeDialog(unitObject, unitCodex, armeeCodex);
    });
    $('#' + unitObject.UNID).append('<div class="selectionOptions"></div>');
    //Einheitengröße ermittelt und ob die Anzeige zusammengefasst werden kann
    var unitSize = 0;
    var summary = false;
    //Default Anzahl ermitteln
    if(unitCodex.minGroup !== null && unitCodex.minGroup !== undefined && unitCodex.minGroup > 1){
        unitSize = unitCodex.minGroup;
        summary = true;
    }else if(unitCodex.minGroup !== null && unitCodex.minGroup !== undefined && unitCodex.minGroup === 1){
        unitSize = unitCodex.minGroup;
    }
    //Ermitteln was zum Default hinzukommt.
    if(unitObject.addToMin !== null && unitObject.addToMin !== undefined && unitSize > 0 && unitObject.addToMin > 0){
        unitSize = unitSize + unitObject.addToMin;
    }
    //Die Einheitenanzahl darf nicht das Maximum überschreiten
    if(unitCodex.maxGroup !== null && unitCodex.maxGroup !== undefined && unitCodex.maxGroup > 0 && unitSize > unitCodex.maxGroup){
        unitSize = unitCodex.maxGroup;
    }
    
    //Wenn keine Gruppe, dann ist es nur ein Element
    var localUnitSize = unitSize>0?unitSize:1;
    //Es erstmal nur intern Aufbauen und dann am Ende ins HTML schreiben
    var localUnit = new Array(localUnitSize);
    for(var i = 0; i < localUnitSize; i++){
        localUnit[i] = new Object();
        var entityCost;
        //Einheitenkosten pro Model ermitteln
        if(unitCodex.entityCost !== null && unitCodex.entityCost !== undefined){
            entityCost = unitCodex.entityCost;
        }else if(unitCodex.cost !== null && unitCodex.cost !== undefined){
            entityCost = unitCodex.cost;
        }
        //Einheitenname ermitteln
        if(unitCodex.entityName !== null && unitCodex.entityName !== undefined){
            localUnit[i][unitCodex.entityName] = 1 + ";" + entityCost;
        }else{
            localUnit[i][unitObject.name] = 1 + ";" + entityCost;
        }
        //Default Sachen für Model ermitteln
        $.each(unitCodex.options, function (counter, option) {
            //Wenn es eine Gruppen von Möglichkeiten sind, dann ist es ein Array. Brauch aber nur die Default Angabe
            if(Array.isArray(option)){
                for (var a = 0; a < option.length; a++) {
                    if(option[a].default !== null && option[a].default !== undefined && option[a].default === true){
                        option = option[a];
                        break;
                    }
                }
            }
            //Wenn es jetzt immer noch ein Array ist, dann ist keine Default Option vorhanden
            if(!Array.isArray(option)){
                /* Default Angaben haben keine Kosten oder sind Default True,
                 * außerdem dürfen es keine Listen sein oder Vorrausetzungen haben
                 */
                if((option.lists === null || option.lists === undefined) && (option.requirement === null || option.requirement === undefined) && (option.cost === null || option.cost === undefined)){
                    if(option.min !== null && option.min !== undefined && option.min){
                    //Eventuell mehr als eine Auswahl
                        localUnit[i][option.name] = option.min + ";" + 0;
                    }else{
                        localUnit[i][option.name] = 1 + ";" + 0;
                    }
                }
            }
        });
        //Gewählte Optionen für Model ermitteln
        //TODO:
    }

    //Wenn minGroup größer 1 ist und es zusammen gefasst werden soll, dann versuchen es zusammen zufassen
    if(unitSize >= 1 && summary){
        //Es wird alles zum ersten Object hinzugefügt, gehe alles Rückwerts durch damit es mit .pop() geht.
        for(var i = localUnitSize-1; i > 0; i--){
            for (var property in localUnit[i]){
                var size = parseInt(localUnit[i][property].split(";")[0]);
                var cost = parseInt(localUnit[i][property].split(";")[1]);
                
                //Schaue nach ob das erste Object das schon hat und zähle es dann hoch, ansonsten hinzufügen
                if(localUnit[0][property] !== null && localUnit[0][property] !== undefined){
                    var sumSize = parseInt(localUnit[0][property].split(";")[0]);
                    var sumCost = parseInt(localUnit[0][property].split(";")[1]);
                    
                    sumSize = sumSize + size;
                    sumCost = sumCost + cost;
                    
                    localUnit[0][property] = sumSize + ";" + sumCost;
                }else{
                    localUnit[0][property] = localUnit[i][property];
                }
            }
            //Letztes Element entfernen
            localUnit.pop();
        }
    }
    var sumCost = 0;
    //Interne Einheit durchgehen und rausschreiben
    for(var i = 0; i < localUnitSize; i++){
        var isFirst = true;
        //Optionen durchgehen
        for (var property in localUnit[i]){
            //Schauen ob es mehr als eine Auswahl gibt und die Kosten stehen hinten dran
            var size = localUnit[i][property].split(";")[0];
            var cost = parseInt(localUnit[i][property].split(";")[1]);
            
            //Alle Kosten zusammen zählen
            sumCost = sumCost + cost;
            //Im ersten Object ist der Name des Modell
            if(isFirst){
                //Wenn es gar keine Größenangabe gibt dann ist es nur eine Einheit und die wird schon durch ihre Überschrift dargestellt, also nur Optionen darstellen
                if(unitSize >= 1){
                    if(size > 1){
                        $('#' + unitObject.UNID + ' div.selectionOptions').append(size + " x " + property + "<br />");
                    }else{
                        $('#' + unitObject.UNID + ' div.selectionOptions').append(property + "<br />");
                    }
                }
            }else{
                if(size > 1){
                    $('#' + unitObject.UNID + ' div.selectionOptions').append("- " + size + " x " + property + "<br />");
                }else{
                    $('#' + unitObject.UNID + ' div.selectionOptions').append("- " + property + "<br />");
                }
            }
            
            isFirst = false;
        }
    }
    //Das Ergebnis aller Kosten rausschreiben
    $('#' + unitObject.UNID + ' > div.unitHeader > div.selectionPoints').html(sumCost + ' ' + getNationalText("divPointsText"));
}

/*
 * Zählt innerhalb einer Gruppe alle Selectionen
 * 
 * @param {String} UNID: Eindeutige ID der Armee
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
 * @param {String} UNID: Eindeutige ID der Armee
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
 * @param {String} UNID: Eindeutige ID der Armee
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