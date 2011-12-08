/*
 * Ajax
 * Super-simple!
 */
var ajax = function() {

  //
  var ajaxUrl = null;

  
  //
  var callback = null;


  //
  var init = function(options) {
    ajaxUrl = options.ajaxUrl;
    callback = options.callback;
    request(options.values);
  };

  
  //
  var getXMLHttp = function() {
    var xmlHttp;

    try {
      //Firefox, Opera 8.0+, Safari
      xmlHttp = new XMLHttpRequest();
    }
    catch(e) {
      //Internet Explorer
      try {
        xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
      } catch(e) {
        try {
          xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch(e) {
          //alert("Your browser does not support AJAX!")
          return false;
        }
      }
    }
    return xmlHttp;
  };


  //
  var request = function(values) {
    var xmlHttp = getXMLHttp();
    xmlHttp.onreadystatechange = function() {
      if(xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          callback(xmlHttp.responseText);
        }     
      }
    };
    xmlHttp.open("POST", ajaxUrl, true); 
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //xmlHttp.setRequestHeader("Content-length", values.length);
    //xmlHttp.setRequestHeader("Connection", "close");
    xmlHttp.send(values);
  };
  
  
  //
  var serialise = function(formEl) {
    var values = "";
    for (var i=0; i < formEl.elements.length; i++) {
      el = formEl.elements[i]; 
      if (el.type != "submit") {
        if (el.type == "checkbox" || el.type == "radio") {
          if (!el.checked) {
            continue;
          }
        }
        values += encodeURIComponent(el.name) + "=" + encodeURIComponent(el.value) + "&";
      }
    }
    return values.slice(0, -1);
  };


  // 
  return {
    init: init,
    serialise: serialise
  };
}();