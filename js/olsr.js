/* Interfacing with OLSR JSON plugin
 */
window.addEventListener("load", function() {
  updateOLSR();
  setInterval(updateOLSR, 5000);
});

var olsr = null;

function updateOLSR() {
  var request = new XMLHttpRequest();
  var url = "http://" + sourceIp.value + ":9090/all";
  request.open("GET", url);
  request.addEventListener('load', function(event) {
     if (request.status >= 200 && request.status < 300) {
        try {
          olsr = JSON.parse(request.responseText);
          // see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
          var event = new CustomEvent("olsr", {detail: olsr});
          window.dispatchEvent(event);
        } catch (e) {
          console.warn(e);
          console.warn(request.responseText);
        }
     } else {
        console.warn(request.statusText, request.responseText);
     }
  });
  request.send();
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
    var int = ip.split(".")
      .map(function(x, index){return parseInt(x);})
      .reduce(function(a, b){return a * 256 + b;});
    return {ip:ip, type:type, int: int};
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

