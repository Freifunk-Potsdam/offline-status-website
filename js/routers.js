/* Positioning Routers
 */
 
function prepareRouterMenuEntryForMapInteraction(element, router) {
  // making elements draggable, see https://www.w3schools.com/HTML/html5_draganddrop.asp
  element.draggable = true;
  element.ondragstart = function(event) {
    event.dataTransfer.setData("ip", router.ip);
  }
  element.onclick = function() {
    addVisibleRouter(router.ip);
  }
}

function addVisibleRouter(ip, x, y) {
  withConfig(function(config){
    config.visibleRouters[ip] = {
      ip: ip,
      x: x || Math.floor(Math.random() * 100),
      y: y || Math.floor(Math.random() * 100),
    };
  });
}

function allowDrop(event) {
  event.preventDefault();
}

function dropOnBackground(event) {
  event.preventDefault();
  withConfig(function(config) {
    var ip = event.dataTransfer.getData("ip");
    if (ip) {
      addVisibleRouter(ip, event.x, event.y);
    }
  });
}

