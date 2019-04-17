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
  toggleSidebar("router");
  lastSelectedRouterIpForInfoSidebar = ip;
}

function addConnectionToRouterSidebar(connection) {
  var element = document.createElement("div");
  element.classList.add(connection.quality.id);
  element.classList.add("connection");
  // etx + image
  var etxElement = document.createElement("div");
  etxElement.innerText = "ETX: " + connection.quality.etx;
  etxElement.classList.add("etx");
  var imageElement = document.createElement("img");
  imageElement.src = connection.quality.image.signal;
  imageElement.alt = connection.quality.text;
  etxElement.appendChild(imageElement);
  element.appendChild(etxElement);
  // ip
  var ipElement = document.createElement("a");
  ipElement.innerText = connection.destinationIp;
  ipElement.classList.add("ip");
  element.appendChild(ipElement);
  // link quality
  var connectionElement = document.createElement("div");
  connectionElement.innerText =
    "→" + connection.quality.fromSourcetoDestination + "→📡→" + 
    connection.quality.fromDestinationToSource + "→";
  connectionElement.classList.add("lq");
  element.appendChild(connectionElement);
  mid.appendChild(element);
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
  }
}

window.addEventListener("olsr", function() {
  if (sidebarIsVisible("router") && lastSelectedRouterIpForInfoSidebar) {
    updateRouterSidebar(lastSelectedRouterIpForInfoSidebar);
  }
});

