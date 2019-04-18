/* Interfacing with OLSR JSON plugin
 */
window.addEventListener("load", function() {
  updateOLSR();
  setInterval(updateOLSR, 5000);
});

var olsr = null;

function updateOLSR() {
  var request = new XMLHttpRequest();
  var url = "http://" + sourceIp.value + 
    (sourceIp.value.includes(":") ? "" : ":9090") + "/all";
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

function isInternetGateway(ip) {
  return olsr && olsr.gateways.some(function(gateway){return gateway.ipAddress==ip;})
}

