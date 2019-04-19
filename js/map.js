/* Map image and events
 */

var defaultMapImage = "map.png";

var oldMapBB = null;
function checkResize() {
  var mapBB = getBoundingBox(map);
  if (!oldMapBB || oldMapBB.width != mapBB.width || oldMapBB.height != mapBB.height) {
    oldMapBB = mapBB;
    // see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
    var event = new Event("resize");
    window.dispatchEvent(event);
  }
}
window.setInterval(checkResize, 50);

function updateImageFromSidebar() {
  setMapImage(mapImageInput.value);
}

function getMapImage() {
  return readConfig().mapImage || defaultMapImage;
}

function setMapImage(url) {
  withConfig(function(config) {
    config.mapImage = url;
  });
}

function updateMapImage() {
  size.src = getMapImage();
}

window.addEventListener("load", updateMapImage);
window.addEventListener("config", updateMapImage);

