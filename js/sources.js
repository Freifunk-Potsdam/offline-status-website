/* Configuration sidebar
 */

var defaultRouterSources = [
  {
    name: "frei.funk",
    ip: "frei.funk"
  },
  {
    name: "Potsdam",
    ip: "olsr-info.ffp.quelltext.eu:80"
  }
];
var addedSourceIps = new Set();

function getSourceRouter() {
  return sourceRouterInput.value;
}

function isSourceRouter(ip) {
  return getSourceRouter() == ip || olsr && olsr.config.mainIpAddress == ip;
}

function getOlsrUrl(ip) {
  var sourceRouter = ip || getSourceRouter() || defaultRouterSources[0].ip;
  var hasPort = sourceRouter.match(/:[0-9]+$/);
  var hasProtocol = sourceRouter.match(/^https?:\/\//);
  return (hasProtocol ? "" : "http://")
    + sourceRouter
    + (hasPort ? "" : ":9090")
    + "/all";
}

function setSourceRouter(ip) {
  sourceRouterInput.value = ip;
}

function isValidOlsr(olsr) {
  return olsr.version && olsr.config;
}

function evaluateSource(ip, name) {
  if (addedSourceIps.has(ip)) {
    return;
  }
  var name = name || ip;
  requestJSON(getOlsrUrl(ip), function(olsr) {
    if (isValidOlsr(olsr)) {
      addSource(ip, name);
    }
  });
}

var hasSource = false;
function addSource(ip, name) {
  hasSource = true;
  if (addedSourceIps.has(ip)) {
    return;
  }
  name = name || ip;
  addedSourceIps.add(ip);
  var element = document.createElement("a");
  element.onclick = function() {
    setSourceRouter(ip);
  }
  element.innerText = "✓ " + name;
  element.classList.add("source");
  routerSources.appendChild(element);
  if (!getSourceRouter()) {
    setSourceRouter(ip);
  }
  withConfig(function(config){
    if (!config.olsrSourceIps.includes(ip)) {
      config.olsrSourceIps.push(ip);
    }
  });
}

function evaluateAllKnownSources() {
  var evaluated = new Set();
  // default sources
  defaultRouterSources.forEach(function(source) {
    evaluated.add(source.ip);
    evaluateSource(source.ip, source.name);
  });
  // sources from config
  readConfig().olsrSourceIps.forEach(function(ip){
    if (!evaluated.has(ip)) {
      evaluated.add(ip);
      evaluateSource(ip);
    }
  });
}

function isOlsrSource(ip) {
  return readConfig().olsrSourceIps.includes(ip);
}

// called by the input
function sourceRouterChanged() {
  updateOLSR();
  evaluateSource(getSourceRouter());
}

window.addEventListener("load", function() {
  evaluateAllKnownSources();
  window.setTimeout(function(){
    if (!hasSource) {
      notifyConnectionLost();
    }
  }, failedUpdates.additionalMilliseconds);
});

window.addEventListener("olsr", function(){
  addSource(olsr.config.mainIpAddress);
});

