/* Configuring the router side bar
 */
 
function getRouterListId(ip) {
  return "list-" + ip;
}

function listRouter(router) {
  var routerList = document.getElementById(router.type);
  var routerElement = document.createElement("a");
  routerElement.innerText = router.ip;
  routerElement.classList.add("router");
  routerElement.id = getRouterListId(router.ip);
  routerElement.router = router;
  makeElementDraggableRouter(routerElement, router, function() {
    if (routerIsVisible(router)) {
      removeVisibleRouterWith(router.ip);
    } else {
      addVisibleRouterWith(router.ip);
    }
  });
  routerList.appendChild(routerElement);
  setRouterVisibilityStatus(router);
}

function removeAllRoutersFromList() {
  var routerLists = document.getElementsByClassName("routerList");
  for (var i = 0; i < routerLists.length; i++) {
    var routerList = routerLists[i];
    routerList.innerHTML = "";
  }
}

function getRouterListElementFromIp(ip) {
  return document.getElementById(getRouterListId(ip));
}

function setRouterVisibilityStatus(router) {
  var routerListElement = getRouterListElementFromIp(router.ip);
  if (!routerListElement) {
    return;
  }
  if (routerIsVisible(router)) {
    routerListElement.classList.add("visible");
  } else {
    routerListElement.classList.remove("visible");
  }
}

function hideRelationToMap(ip) {
  getRouterListElementFromIp(ip).classList.remove("hasNeighborOnMap");
}

function showRelationToMap(ip) {
  getRouterListElementFromIp(ip).classList.add("hasNeighborOnMap");
}

