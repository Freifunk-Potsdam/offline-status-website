/* Configuring the router side bar
 */

function displayRouter(router) {
  var routerList = document.getElementById(router.type);
  var routerElement = document.createElement("a");
  routerElement.innerText = router.ip;
  routerElement.classList.add("router");
  prepareRouterMenuEntryForMapInteraction(routerElement, router);
  routerList.appendChild(routerElement);
}

function removeAllRoutersFromList() {
  var routerLists = document.getElementsByClassName("routerList");
  for (var i = 0; i < routerLists.length; i++) {
    var routerList = routerLists[i];
    routerList.innerHTML = "";
  }
}

