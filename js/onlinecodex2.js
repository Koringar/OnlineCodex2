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
