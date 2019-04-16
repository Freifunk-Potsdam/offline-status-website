/* Configuring the router side bar
 */
 
function getRouterListId(ip) {
  return "list-" + ip;
}

function displayRouter(router) {
  var routerList = document.getElementById(router.type);
  var routerElement = document.createElement("a");
  routerElement.innerText = router.ip;
  routerElement.classList.add("router");
  routerElement.id = getRouterListId(router.ip);
  routerElement.router = router;
  prepareRouterMenuEntryForMapInteraction(routerElement, router);
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

function setRouterVisibilityStatus(router) {
  var routerListElement = document.getElementById(getRouterListId(router.ip));
  if (!routerListElement) {
    return;
  }
  withConfig(function(config){
    if (config.visibleRouters[router.ip]) {
      routerListElement.classList.add("visible");
    } else {
      routerListElement.classList.remove("visible");
    }
  });
}

