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
    var router = config.visibleRouters[ip] = {
      ip: ip,
      x: x || Math.random(),
      y: y || Math.random(),
    };
    setRouterVisibilityStatus(router);
  });
}

function allowDrop(event) {
  event.preventDefault();
}

function dropOnBackground(event) {
  var bbox = background.getBoundingClientRect();
  var x = (event.x - bbox.left) / bbox.width;
  // we can not get the height directly because it is a background image
  var imagebbox = size.getBoundingClientRect();
  var height = bbox.width / imagebbox.width * imagebbox.height;
  var y = (event.y - bbox.top) / height;
  event.preventDefault();
  withConfig(function(config) {
    var ip = event.dataTransfer.getData("ip");
    console.log(x, y, ip);
    if (ip) {
      addVisibleRouter(ip, x, y);
    }
  });
}

function displayRouter(ip) {
  
}

