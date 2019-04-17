/* Persistent configuration
 */
var activeConfig = null;

/* initialize and migrate an existing configuration */
function initConfig(config) {
  config = typeof config == "object" ? config : {};
  config.visibleRouters = config.visibleRouters || {};
  config.invisibleRouters = config.invisibleRouters || {};
  return config;
}

function withConfig(func) {
  var data = document.location.hash.substr(1);
  if (activeConfig == null) {
    // loading config
    try {
      activeConfig = JSON.parse(decodeURIComponent(data));
    } catch (e) {
      if (data) {
        console.error("invalid data " + data);
      }
      activeConfig = {};
    }
    activeConfig = initConfig(activeConfig);
    try {
      var result = func(activeConfig);
      var newData = encodeURIComponent(JSON.stringify(activeConfig));
      if (data != newData) {
        _fireConfigEvent(activeConfig);
        console.log(activeConfig);
        document.location.hash = "#" + newData;
      }
      return result;
    } finally {
      activeConfig = null;
    }
  } else {
    return func(activeConfig);
  }
}

function routerIsVisible(router) {
  return routerIpIsVisible(router.ip);
}

function routerIpIsVisible(ip) {
  return Boolean(readConfig().visibleRouters[ip]);
}


function readConfig() {
  return withConfig(function(config){
    return config;
  });
}

function _fireConfigEvent(config) {
      // see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
    var event = new CustomEvent("config", {detail: config});
    window.dispatchEvent(event);
}

window.addEventListener("load", function() {
  _fireConfigEvent(readConfig());
});

