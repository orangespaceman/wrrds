/*
 * Admin form JS
 */
window.onload = function() {
 admin.init();
};  


/*
 * admin form functionality
 */
var admin = function() {
  
  var forms,
      header,
      messageContainer,
      approvedEl,
      totalEl,
      approvedCount,
      totalCount,
      latestId = 0,
      counter,
      timeCheck = 5000,
      blockStatuses = { },
      headerLoader,
      loaderTemplate,
      

  // on dom load, init
  init = function() {

    // get global dom elements
    header = document.getElementsByTagName("header")[0];
    messageContainer = document.getElementById("messages");
    approvedEl = document.getElementById("approved");
    totalEl = document.getElementById("total");
    approvedCount = parseInt(approvedEl.innerHTML, 10);
    totalCount = parseInt(totalEl.innerHTML, 10);
            
    // create loader, and add one to the header
    createLoaderTemplate();

    // init ajax block/unblock button click ajax
    setFormListeners();
    
    // create timeout to test for new messages
    setTimeout(checkForNewMessages, timeCheck);
    
    // create timeout to test whether message statuses have been updated elsewhere
    setTimeout(getAllStatuses, timeCheck + (timeCheck/2));
    
    // fix iOS bug with #hash fragment in URL and fixed positioned element
    header.getElementsByTagName("a")[0].onclick = function(e) {
      window.scrollTo(0,0);
      e = e || window.event;
      e.preventDefault();
      return false;
    };
  },
  
  
  // set listener on form submits
  setFormListeners = function() {
    forms = document.getElementsByTagName("form");
    for (counter = 0; counter < forms.length; counter++) {
      formSubmit(forms[counter]);
    }
  },
  
  
  // for each form set up ajax call for block/unblock 
  formSubmit = function(form) {
    form.onsubmit = function() {
      var loader, values, submit;

      // disable submit button
      submit = form.querySelector("input[type=submit]");
      submit.setAttribute('disabled', 'disabled');
      submit.classList.add('disabled');
    
      // add loader
      loader = loaderTemplate.cloneNode(true);
      form.querySelector(".message-block").appendChild(loader);

      // ajax!
      values = ajax.serialise(form);
      values += "&method=blockUnblock";
      ajax.init({
        ajaxUrl: "../_assets/php/ajax.php",
        values: values,
        callback: formSubmitCallback
      });
      return false;
    };
  
    // cache message state
    blockStatuses[form.getAttribute("id")] = Math.abs(form.querySelector("input[name=block]").value-1);
  
    // save latest id (for requesting new ids)
    latestId = Math.max(latestId, parseInt(form.querySelector("input[name=id]").value, 10));    
  },


  // block/unblock ajax callback
  formSubmitCallback = function(rtn) {
    var form;
    rtn = json_parse(rtn);
    form = document.getElementById("form-"+rtn.id);
    toggleMessageBlock(form, rtn.isbanned);
  },


  // update block state after block/unblock
  toggleMessageBlock = function(form, isBanned) {
    var block = form.querySelector(".message-block"),
        blockInput = form.querySelector("input[name=block]"),
        submit = form.querySelector("input[type=submit]"),
        loader = form.querySelector(".loader");
  
    if (isBanned == 1) {
      block.classList.add('banned');
      blockInput.value = 0;
      submit.value = "unblock";
      approvedEl.innerHTML = --approvedCount;
    } else {
      block.classList.remove('banned');
      blockInput.value = 1;
      submit.value = "block";
      approvedEl.innerHTML = ++approvedCount;
    }
  
    // update cached state of message
    blockStatuses[form.getAttribute("id")] = isBanned;
  
    if (loader) {
      setTimeout(function() { 
        loader.parentNode.removeChild(loader); 
        submit.removeAttribute('disabled');
        submit.classList.remove('disabled');
      }, 500);
    }
  },


  //
  checkForNewMessages = function() {
    headerLoader.classList.remove('hidden');
    ajax.init({
      ajaxUrl: "../_assets/php/ajax.php",
      values: "id="+latestId+"&method=getAllSinceId",
      callback: addNewMessagesCallback
    });
  },
  

  // ajax callback to insert new messages
  addNewMessagesCallback = function(messages) {
    messages = json_parse(messages);
    if (messages.length > 0) {
    
      for (var counter=0; counter < messages.length; counter++) {
        addNewMessage(messages[counter]);
      }
    
      // if messages are being added, show new messages text
      var messageAdded = document.createElement("p");
      messageAdded.id = "message-added";
      messageAdded.innerHTML = messages.length + " new messages added";
      header.appendChild(messageAdded);
      setTimeout(function() { 
        var node = document.getElementById("message-added");
        node.parentNode.removeChild(node);
      }, 3000);
    }
    setTimeout(function() { headerLoader.classList.add('hidden'); }, 500);
    setTimeout(checkForNewMessages, timeCheck);
  },
  

  // add each message
  addNewMessage = function(message) {
    var html = ''+
      '<form method="post" action="" id="form-'+message.id+'">' +
    		'<fieldset>' +
    			'<legend>Messages!</legend>' +
    			'<div class="message-block added-message'+((message.isbanned == 1) ? " banned" : "")+'">' +
    				'<h2>'+message.message+'</h2>' +
    				'<p>'+message.name+' <span>('+message.ip+')</span></p>' +
    				'<time>'+message.date_added+'</time>' +
//  				  '<p class="views meta">Viewed '+message.plays+' times</p>' +
  				  '<p class="counter meta">'+message.id+((message.isflagged == 1) ? ' <span class="flagged">(Flagged)</span>' : '')+'</p>' +
      		  '<input type="hidden" name="id" value="'+message.id+'" />' +
      		  '<input type="hidden" name="block" value="'+((message.isbanned == 1) ? "0" : "1")+'" />' +
      		  '<input type="submit" class="button" value="'+((message.isbanned == 1) ? "unblock" : "block")+'" />' +
    			'</div>' +
    		'</fieldset>' +
    	'</form>';
  	messageContainer.innerHTML = html + messageContainer.innerHTML;
  	latestId = Math.max(latestId, message.id);
  	totalEl.innerHTML = ++totalCount;
  	if (message.isbanned != 1) {
  	  approvedEl.innerHTML = ++approvedCount;
  	}

    // add ajax request for form submit (to stop page reload)
  	setFormListeners();
  },
  

  // loader, to clone
  createLoaderTemplate = function() {
    loaderTemplate = document.createElement("div");
    loaderTemplate.classList.add("loader");
    loaderTemplate.innerHTML = '' +
        '<div class="loader-bar loader-bar-1"></div>' + 
        '<div class="loader-bar loader-bar-2"></div>' + 
        '<div class="loader-bar loader-bar-3"></div>' + 
        '<div class="loader-bar loader-bar-4"></div>' + 
        '<div class="loader-bar loader-bar-5"></div>' + 
        '<div class="loader-bar loader-bar-6"></div>';

    // add loader to header
    headerLoader = loaderTemplate.cloneNode(true);
    headerLoader.classList.add('hidden');
    header.appendChild(headerLoader);
  },
  

  // check status of all messages (so others can also use admin screen to block/unblock)
  getAllStatuses = function() {
    headerLoader.classList.remove('hidden');
    ajax.init({
      ajaxUrl: "../_assets/php/ajax.php",
      values: "method=getAllStatuses",
      callback: getAllStatusesCallback
    });
  },

  // check statuses ajax callback
  getAllStatusesCallback = function(data) {
    var statuses = json_parse(data),
        form,
        counter;
      
    if (statuses.length > 0) {
      for (status in statuses) {
        form = document.getElementById("form-"+statuses[status].id);        
      
        // if a message status has changed, update it
        if (form && blockStatuses[form.getAttribute("id")] != statuses[status].isbanned) {
          toggleMessageBlock(form, statuses[status].isbanned);
        }
      };
    }
    setTimeout(function() { headerLoader.classList.add('hidden'); }, 500);
    setTimeout(getAllStatuses, timeCheck);
  };
  
  
  // expose any of the methods above
  return {
    init: init
  };
}();