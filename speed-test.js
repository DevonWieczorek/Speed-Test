// Try to replicate CSS's '@import' functionality for front-end JS
// Similar to ES6's experimental 'import' feature
// @src - string, source of the script to 'include'
// @callback - function, callback to be executed after the script is loaded
// @options - JSON object
//          - @before - string, source of script to 'include' before
//          - @after - string, source of script to 'include' after
//          - @replace - string, script source or regex of source to replace with our new script
//          - @async - boolean, whether or not our new script should be async
// The include function only accepts before, after, or replace
// If multiple are present, the first one takes precedence
// Extend implementation found on https://jsfiddle.net/1vrkw1pc/

function include(src, callback, options){
    function appendHead(s){
        document.getElementsByTagName('head')[0].appendChild(s);
    }
    
    function replaceScript(target, replacement){
        var scripts = document.getElementsByTagName("script");
        for(var i = 0; i < scripts.length; i++) {
            if (scripts[i].src.match(target)) {
                // First add the new script after the target
                var parent = scripts[i].parentNode;
                console.log(parent.nodeType);
                parent.insertBefore(replacement, scripts[i].nextSibling);
                
                // Then remove the script to be 'replaced'
                parent.removeChild(scripts[i]);
                break;
            }
        }
    }
    
    // Vanilla JS implementation of jQuery $.extend();
    function extend(){
        for(var i = 1; i < arguments.length; i++){
            for(var key in arguments[i]){
                if(arguments[i].hasOwnProperty(key)) { 
                    if (typeof arguments[0][key] === 'object' && typeof arguments[i][key] === 'object'){
                        extend(arguments[0][key], arguments[i][key]);
                    }      
                    else{
                        arguments[0][key] = arguments[i][key];
                    } 
                 }
            }    
        }
        return arguments[0];
    }
    
    return (function(){
        
        // Allow options with no callback
        if(typeof callback !== 'function' && !options){
            options = callback;
            callback = undefined;
        }
        
        // Handle options
        var settings = {
            before: '',
            after: '',
            replace: '',
            async: false
        };
        settings = extend(settings, options);
        
        // Create our script tag
        var s = document.createElement('script');
        s.setAttribute('src', src);
        if(settings.async) s.async = true;
        
        // Handle callback
        if(callback && typeof callback == 'function') s.addEventListener('load', callback);
        
        // Handle different insertion cases
        if(settings.replace){
            replaceScript(settings.replace, s);
        }
        else if(settings.before){
            var target = document.querySelector('[src="' + settings.before + '"]');
            var parent = target.parentNode;
            parent.insertBefore(s, target);
        }
        else if(settings.after){
            var target = document.querySelector('[src="' + settings.after + '"]');
            var parent = target.parentNode;
            parent.insertBefore(s, target.nextSibling);
        }
        else{
            appendHead(s);
        }
    }());
}
