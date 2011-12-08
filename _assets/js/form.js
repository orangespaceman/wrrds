window.onload = function() {
  
  var configForm = document.getElementsByTagName("form")[0],
      name = document.getElementById("name"),
      message = document.getElementById("message"),
      submit = document.getElementById("submit"),
      username = cookie.get("username");
      
  // username
  if (!!username && username.length > 0) {
    name.value = username;
  }

  // ajax save
  configForm.onsubmit = function() {
    if (name.value.length > 0 && message.value.length > 0) {
      submit.className = "button disabled";
      submit.setAttribute("disabled", "disabled");
      var values = ajax.serialise(configForm);
      values += "&method=save";
      ajax.init({
        ajaxUrl: "./_assets/php/ajax.php",
        values: values,
        callback: messageSavedCallback
      });
    } 
    name.style.borderColor = (name.value.length === 0) ? "#f90" : "#fff";
    message.style.borderColor = (message.value.length === 0) ? "#f90" : "#fff";
    return false;
  };
  
  // ajax callback
  function messageSavedCallback() {
    cookie.set("username", name.value, 2);
    message.value = "";
    var messageSaved = document.createElement("p");
    messageSaved.id = "message-saved";
    messageSaved.innerHTML = "Message saved";
    submit.parentNode.appendChild(messageSaved);
    setTimeout(function() { 
      var node = document.getElementById("message-saved");
      node.parentNode.removeChild(node);
      submit.className = "button";
      submit.removeAttribute("disabled");
    }, 3000);
  }
  
  // character counr
  function countCharacters(el) {
    var interval, 
        label = el.parentNode.firstChild.nextSibling,
        counter = document.createElement('span'),
        limit = el.getAttribute("maxlength");

    label.appendChild(counter);

    el.onfocus = function(e){
      interval = window.setInterval(countChars,100);
    };

    el.onblur = function(){
      clearInterval(interval);
      countChars();
    };

    function countChars(){ 
      var length = el.value.length;
      counter.innerHTML = length+"/"+limit;
    }
    countChars();    
  }
  
  countCharacters(name);
  countCharacters(message);
};