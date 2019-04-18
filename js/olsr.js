/* Interfacing with OLSR JSON plugin
 */
window.addEventListener("load", function() {
  updateOLSR();
  setInterval(updateOLSR, 5000);
});

var olsr = null;

function updateOLSR() {
  requestJSON(getOlsrUrl(), function(data) {
    olsr = data;
    // see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
    var event = new CustomEvent("olsr", {detail: olsr});
    window.dispatchEvent(event);
  });
}

function isInternetGateway(ip) {
  return olsr && olsr.gateways.some(function(gateway){return gateway.ipAddress==ip;})
}

