/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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

function initArmeeDialog(){
    var indexJson = getArmyIndex();
    $.each(indexJson, function (file, name) {
        $("#addArmee ul").append('<li data-icon="false"><a href="#" class="ui-btn" json="' + file + '">'+name+'</a></li>');
    });
    $("#addArmee ul li a").click(function() {
        console.log("Load: " + $(this).attr("json"));
    });
}
