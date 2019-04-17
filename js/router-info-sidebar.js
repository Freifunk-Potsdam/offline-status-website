/* Siebar which informs about a router
 */

var lastSelectedRouterIpForInfoSidebar = null;

function addRouterIp(ip) {
  var element = document.createElement("a");
  element.innerText = ip;
  element.classList.add("ip");
  element.href = "http://" + ip;
  element.target = "_blank";
  ips.appendChild(element)
}

function openRouterSidebar(ip) {
  if (!sidebarIsVisible("router") || lastSelectedRouterIpForInfoSidebar == ip) {
    toggleSidebar("router");
  }
  lastSelectedRouterIpForInfoSidebar = ip;
  updateRouterSidebar(ip);
  openHeader();
}

function addConnectionToRouterSidebar(connection) {
  var element = document.createElement("div");
  element.classList.add(connection.quality.id);
  element.classList.add("connection");
  // etx + image
  var etxElement = document.createElement("a");
  etxElement.innerText = "ETX: " + connection.quality.etx;
  etxElement.classList.add("etx");
  var imageElement = document.createElement("img");
  imageElement.src = connection.quality.image.signal;
  imageElement.alt = connection.quality.text;
  etxElement.appendChild(imageElement);
  element.appendChild(etxElement);
  etxElement.onclick = function() {
    openConnectionSidebar(connection);
  }
  // ip
  var ipElement = document.createElement("a");
  ipElement.innerText = connection.destinationIp;
  ipElement.classList.add("ip");
  ipElement.onclick = function() {
    openRouterSidebar(connection.destinationIp);
  }
  element.appendChild(ipElement);
  // link quality
  var connectionElement = document.createElement("div");
  connectionElement.innerText =
    "→" + connection.quality.fromSourceToDestination + "→📡→" + 
    connection.quality.fromDestinationToSource + "→";
  connectionElement.classList.add("lq");
  element.appendChild(connectionElement);
  mid.appendChild(element);
}

function addRouterHna(hna) {
  var element = document.createElement("div");
  element.innerText = hna.destination + "/" + hna.genmask;
  element.classList.add("route");
  routes.appendChild(element);
}
function addRouterGateway() {
  var element = document.createElement("div");
  element.innerText = "0.0.0.0/0"
  element.classList.add("route");
  element.classList.add("gateway");
  var img = document.createElement("img");
  img.src = "img/www.png";
  element.appendChild(img);
  routes.appendChild(element);
}

function updateRouterSidebar(ip) {
  var config = readConfig();
  // fill ips
  ips.innerHTML = "";
  addRouterIp(ip);
  var router = config.visibleRouters[ip] || config.invisibleRouters[ip];
  if (olsr) {
    olsr.mid.forEach(function(mid){
      if (mid.ipAddress == ip) {
        mid.aliases.forEach(function(alias){
          addRouterIp(alias.ipAddress);
        });
      }
    });
    // fill connections
    var addedConnections = new Set();
    var connections = [];
    mid.innerHTML = "";
    olsr.topology.forEach(function(link){
      var connection = null;
      if (link.destinationIP == ip) {
        connection = createConnectionAsDestination(link);
      } else if (link.lastHopIP == ip) {
        connection = createConnectionAsLastHop(link);
      }
      if (connection && !addedConnections.has(connection.id)) {
        addedConnections.add(connection.id);
        connections.push(connection);
      }
    });
    connections.sort(function(a, b){return a.quality.etx - b.quality.etx});
    connections.forEach(addConnectionToRouterSidebar);
    // fill gateway in routes
    routes.innerHTML = "";
    if (isInternetGateway(ip)) {
      addRouterGateway();
    }
    // fill routes
    olsr.hna.forEach(function(hna){
      if (hna.gateway == ip) {
        addRouterHna(hna);
      }
    });
  }
}

window.addEventListener("olsr", function() {
  if (sidebarIsVisible("router") && lastSelectedRouterIpForInfoSidebar) {
    updateRouterSidebar(lastSelectedRouterIpForInfoSidebar);
  }
});

