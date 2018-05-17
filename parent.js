var loadTime = 0; // Child
  var startTime = 0; // Parent
  var url = window.location.href;

  document.addEventListener("DOMContentLoaded", function() {
      // If iFrame, execute child code
      if(urlParam('iframe') == 'true'){
          loadTime = time();
          parent.postMessage({timeLoaded: loadTime}, "*");
      }
      // Otherwise execute parent code
      else{
          speedTest();
      }

  });

  function speedTest(){
      if(!window.postMessage){ return false; }

      var iframe = document.createElement('iframe');
      iframe.setAttribute('width', '1');
      iframe.setAttribute('height', '1');
      iframe.setAttribute('style', 'display:none;');
      iframe.setAttribute('allowTransparency', 'true');

      var qString = (url.indexOf('?') > 0) ? '&iframe=true' : '?iframe=true';
      iframe.setAttribute('src', url + qString);

      document.getElementsByTagName('body')[0].appendChild(iframe);
      startTime = parseInt(time());
      console.log('Time Triggered: ' + startTime);


      // Create IE + others compatible event handler
      var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      var eventer = window[eventMethod];
      var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

      // Listen to message from child window
      eventer(messageEvent,function(e) {
          var timeLoaded = parseInt(e.data.timeLoaded);
          var totalLoadTime = timeLoaded - startTime;
          console.log('Page Loaded At:  ', e.data.timeLoaded);
          pushUrlParam('speed', totalLoadTime);
      },false);
  }

  function time(){
      var d = new Date();
      return d.getTime();
  }

  function pushUrlParam(param, value){
      var url = window.location.href;
      var char = (window.location.href.indexOf('?') > 1) ? '&' : '?';
      var newUrl = url + char + param + '=' + value;
      window.history.replaceState(null, null, newUrl);
  }

  function urlParam(name, url, caseSensitive){
      if (!url) url = window.location.href;
      if(typeof url == 'boolean'){
          caseSensitive = url;
          url = window.location.href;
      }
      caseSensitive = caseSensitive || false;
      if(!caseSensitive){
          url = url.toLowerCase();
          name = name.toLowerCase();   
      }
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
