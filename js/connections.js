
var visibleConnections = {};

function getConnectionFromId(id) {
  var ips = id.split("-");
  var ip1 = ips[0];
  var ip2 = ips[1];
  var result = null;
  olsr.topology.some(function(link){
    if (link.destinationIP == ip1 && link.lastHopIP == ip2 ||
        link.destinationIP == ip2 && link.lastHopIP == ip1) {
      result = createConnectionAsDestination(link);
    }
  });
  return result;
}

function renderConnectionsOnMap() {
  if (!olsr) {
    return; // startup
  }
  withConfig(function(config){
    var visible = new Set();
    olsr.topology.forEach(function(link){
      if (routerIpIsVisible(link.destinationIP) && routerIpIsVisible(link.lastHopIP)) {
        var connections = [
          createConnectionAsLastHop(link),
          createConnectionAsDestination(link)
        ];
        connections.forEach(function(connection) {
          if (visibleConnections[connection.id]) {
            updateConnection(connection)
          } else {
            visibleConnections[connection.id] = connection;
            showConnectionOnMap(connection);
          }
          visible.add(connection.id);
        });
      }
    });
    forEachProperty(visibleConnections, function(id, connection){
      if (!visible.has(id)) {
        removeConnectionFromMap(connection);
      }
    });
  });
}

function showConnectionOnMap(connection) {
  var element = connection.element = document.createElement("a");
  map.appendChild(element);
  drawConnection(connection);
  connection.element.onclick = function(){
    var newConnection = getConnectionFromId(connection.id)
    if (newConnection) {
      openConnectionSidebar(newConnection);
    }
  }
}

function updateConnection(connection) {
  connection.element = visibleConnections[connection.id].element;
  visibleConnections[connection.id] = connection;
  drawConnection(connection);
}

function drawConnection(connection) {
  createLine(
    connection.sourcePosition.x,
    connection.sourcePosition.y,
    connection.destinationPosition.x,
    connection.destinationPosition.y,
    connection.element
  );
  connection.element.classList.add("connection");
  connection.quality.setClass(connection.element);
}

function removeConnectionFromMap(connection) {
  if (connection.element) {
    map.removeChild(connection.element);
  }
  delete visibleConnections[connection.id];
}

function createConnectionAsDestination(link) {
  return createConnection(
    link.destinationIP, link.lastHopIP,
    link.linkQuality, link.neighborLinkQuality,
    link.tcEdgeCost);
}

function createConnectionAsLastHop(link) {
  return createConnection(
    link.lastHopIP, link.destinationIP,
    link.neighborLinkQuality, link.linkQuality, 
    link.tcEdgeCost);
}

function createConnection(sourceIp, destinationIp, linkQuality, neighborLinkQuality, cost) {
  return withConfig(function(config) {
    var quality = getLinkQualityFromCost(cost);
    quality.fromSourceToDestination = linkQuality;
    quality.fromDestinationToSource = neighborLinkQuality;
    var connection = {
      id: sourceIp + "-" + destinationIp,
      source: config.visibleRouters[sourceIp],
      sourceIp: sourceIp,
      destination: config.visibleRouters[destinationIp],
      destinationIp: destinationIp,
      sourcePosition: getMapRouterPositionByIp(sourceIp),
      destinationPosition: getMapRouterPositionByIp(destinationIp),
      quality: quality,
    }
    return connection;
  });
}

function getBrokenConnection(id) {
  var ips = id.split("-");
  return createConnection(ips[0], ips[1], 0, 0, null);
}

function displayRelationsToRoutersOnMap() {
  if (!olsr) {
    return; // startup
  }
  var visible = new Set();
  withConfig(function(config){
    olsr.topology.forEach(function(link){
      if (routerIpIsVisible(link.destinationIP) || routerIpIsVisible(link.lastHopIP)) {
        showRelationToMap(link.destinationIP);
        visible.add(link.destinationIP);
        showRelationToMap(link.lastHopIP);
        visible.add(link.lastHopIP);
      } else {
        if (!visible.has(link.destinationIP)) {
          hideRelationToMap(link.destinationIP);
        }
        if (!visible.has(link.lastHopIP)) {
          hideRelationToMap(link.lastHopIP);
        }
      }
    });
  });
}

function updateAllConnections() {
  renderConnectionsOnMap();
  displayRelationsToRoutersOnMap();
}

window.addEventListener("olsr", function(event){
  renderConnectionsOnMap();
});
window.addEventListener("config", updateAllConnections);
window.addEventListener("load", updateAllConnections);
window.addEventListener("resize", renderConnectionsOnMap);

