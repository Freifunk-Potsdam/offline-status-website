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

function ipToInt(ip) {
  return ip.split(".")
    .map(function(x, index){return parseInt(x);})
    .reduce(function(a, b){return a * 256 + b;});
}

function listRouters(event) {
  var olsr = event.detail;
  removeAllRoutersFromList();
  var ipsAdded = new Set();
  var ipsToAdd = [];
  function pushRouters() {
    var ips = Array.from(ipsToAdd);
    // sorting see https://www.w3schools.com/jsref/jsref_sort.asp
    ips.sort(function(a, b){return a.int - b.int;});
    ips.forEach(function(sortableIp){
      if (!ipsAdded.has(sortableIp.ip)) {
        listRouter(sortableIp);
        ipsAdded.add(sortableIp.ip);
      }
    });
    ipsToAdd = [];
  }
  function sortable(ip, type) {
    return {ip:ip, type:type, int: ipToInt(ip)};
  }
  // add ips
  ipsToAdd.push(sortable(olsr.config.mainIpAddress, "this"));
  pushRouters();
  olsr.neighbors.forEach(function (neighbor) {
    ipsToAdd.push(sortable(neighbor.ipAddress, "neighbor"));
  });
  pushRouters();
  olsr["2hop"].forEach(function (neighbor) {
    neighbor.twoHopNeighbors.forEach(function(nextNeighbor) {
      ipsToAdd.push(sortable(nextNeighbor.ipAddress, "twohop"));
    });
  });
  pushRouters();
  olsr.topology.forEach(function (link) {
    ipsToAdd.push(sortable(link.lastHopIP, "distant"));
  });
  pushRouters();
  displayRelationsToRoutersOnMap();
}

window.addEventListener("olsr", listRouters);


