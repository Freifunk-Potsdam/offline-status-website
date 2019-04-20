/* sidebar for showing connection information
 */
 
var lastSelectedConnectionIdForInfoSidebar = null;

function openConnectionSidebar(connection) {
  if (!sidebarIsVisible("connection") ||
      lastSelectedConnectionIdForInfoSidebar == connection.id) {
    toggleSidebar("connection");
  }
  lastSelectedConnectionIdForInfoSidebar = connection.id;
  updateConnectionSidebar(connection);
  openHeader();
}

function updateConnectionSidebar(connection) {
  console.log(connection.quality.etx, connection);
  connectionEtx.innerText = "ETX: " + connection.quality.etx;
  connectionImage.src = connection.quality.image.signal;
  connection.quality.setClass(connectionWrapper);
  if (ipToInt(connection.sourceIp) < ipToInt(connection.destinationIp)) {
    lqFromDestination.innerText = connection.quality.fromDestinationToSource;
    lqFromSource.innerText = connection.quality.fromSourceToDestination;
    connectionSource.innerText = connection.sourceIp;
    connectionDestination.innerText = connection.destinationIp;
  } else {
    lqFromDestination.innerText = connection.quality.fromSourceToDestination;
    lqFromSource.innerText = connection.quality.fromDestinationToSource;
    connectionSource.innerText = connection.destinationIp;
    connectionDestination.innerText = connection.sourceIp;
  }
}

function openRouterFromElementText(element) {
  openRouterSidebar(element.innerText);
}

window.addEventListener("olsr", function(){
  if (lastSelectedConnectionIdForInfoSidebar) {
    var connection = getConnectionFromId(lastSelectedConnectionIdForInfoSidebar);
    if (connection) {
      updateConnectionSidebar(connection);
    } else {
      updateConnectionSidebar(getBrokenConnection(lastSelectedConnectionIdForInfoSidebar));
    }
  }
});
