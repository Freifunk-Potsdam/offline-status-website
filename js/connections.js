
var visibleConnections = {};

function renderConnectionsOnMap() {
  if (!olsr) {
    return; // startup
  }
  withConfig(function(config){
    var visible = new Set();
    olsr.topology.forEach(function(link){
      if (routerIpIsVisible(link.destinationIP) && routerIpIsVisible(link.lastHopIP)) {
        var connections = [
          createConnection(
            link.destinationIP, link.lastHopIP,
            link.linkQuality, link.tcEdgeCost),
          createConnection(
            link.lastHopIP, link.destinationIP,
            link.neighborLinkQuality, link.tcEdgeCost),
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
  var element = connection.element = document.createElement("div");
  element.classList.add("connection");
  element.classList.add(connection.quality.id);
  map.appendChild(element);
  drawConnection(connection);
}

function updateConnection(connection) {
  console.log(connection);
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
}

function removeConnectionFromMap(connection) {
  if (connection.element) {
    map.removeChild(connection.element);
  }
  delete visibleConnections[connection.id];
}

function createConnection(sourceIp, destinationIp, quality, cost) {
  return withConfig(function(config) {
    return {
      id: sourceIp + "-" + destinationIp,
      quality: quality,
      cost: cost,
      source: config.visibleRouters[sourceIp],
      destination: config.visibleRouters[destinationIp],
      sourcePosition: getMapRouterPositionByIp(sourceIp),
      destinationPosition: getMapRouterPositionByIp(destinationIp),
      quality: getLinkQualityFromCost(cost),
    }
  });
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

function getLinkQualityFromCost(cost) {
  var quality = {
    etx: cost / 1000,
  };
  /* this lookup is hardcoded on the page
     http://frei.funk/cgi-bin/luci/freifunk/olsr/neighbors
     olsr colors:
     - bad: #bb3333
     - still-usable: #ff6600
     - good: #ffcb05
     - very-good: #00cc00
  */
  if (cost < 2000) {
    quality.id = "very-good";
    quality.color = "#00cc00";
  } else if (cost < 4000) {
    quality.id = "good";
    quality.color = "#ffcb05";
  } else if (cost < 10000) {
    quality.id = "still-usable";
    quality.color = "#ff6600";
  } else {
    quality.id = "bad";
    quality.color = "#bb3333";
  }
  quality.imageUrl = "img/connection/" + quality.id + ".png";
  return quality;
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


var width0 = null;
function checkResize() {
  var mapBB = map.getBoundingClientRect();
  if (width0 != mapBB.width) {
    width0 = mapBB.width;
    // see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
    var event = new Event("resize");
    window.dispatchEvent(event);
  }
}
window.setInterval(checkResize, 50);

window.addEventListener("resize", renderConnectionsOnMap);

