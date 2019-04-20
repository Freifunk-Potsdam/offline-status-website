/* Interfacing with OLSR JSON plugin
 */

var failedUpdates = {
  number: 2,
  additionalMilliseconds: 1000 // also used by sources
};
var updateIntervalInMilliseconds = 5000;
var updateIntervalId = null;
function setOlsrUpdateInterval(milliseconds) {
  if (updateIntervalId != null) {
    clearInterval(updateIntervalId);
  }
  updateOLSR();
  updateIntervalInMilliseconds = milliseconds;
  updateIntervalId = setInterval(updateOLSR, milliseconds);
}

function updateOlsrIntervalFrom(input) {
  var secondsString = input.value.replace(",", ".");
  var interval = parseFloat(secondsString) * 1000;
  setOlsrUpdateInterval(interval);
}

var olsr = null;

function getOlsrUpdateTime() {
  // getting the milliseconds, see https://stackoverflow.com/a/9011304
  return +new Date();
}

function olsrUpdated() {
  failedUpdates.failedBefore = 0;
  failedUpdates.lastSuccessTime = getOlsrUpdateTime();
}

function updateOLSR() {
  failedUpdates.failedBefore++;
  requestJSON(getOlsrUrl(), function(data) {
    olsr = data;
    // see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
    var event = new CustomEvent("olsr", {detail: olsr});
    window.dispatchEvent(event);
    olsrUpdated();
  });
  if (failedUpdates.failedBefore > failedUpdates.number && 
      failedUpdates.lastSuccessTime + failedUpdates.additionalMilliseconds < getOlsrUpdateTime()) {
    notifyConnectionLost();
  } else if (failedUpdates.failedBefore == 1) {
    notifyConnectionEstablished();
  }
}

function isInternetGateway(ip) {
  return olsr && olsr.gateways.some(function(gateway){return gateway.ipAddress==ip;})
}

window.addEventListener("load", function() {
  olsrUpdated();
  olsrIntervalInput.value = olsrIntervalInput.value || updateIntervalInMilliseconds / 1000;
  updateOlsrIntervalFrom(olsrIntervalInput);
});

