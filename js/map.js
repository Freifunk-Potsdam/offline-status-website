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
  mapImageFileInput.value = "";
}

function loadPictureFromFile() {
  /* picture uploading, see
     - https://stackoverflow.com/a/3814285
     - https://stackoverflow.com/a/16153675 */
  var files = mapImageFileInput.files;

  // FileReader support
  if (FileReader && files) {
    if (files.length) {
      var fileReader = new FileReader();
      fileReader.onload = function () {
        size.src = fileReader.result;
      }
      fileReader.readAsDataURL(files[0]);
      return true;
    }
  } else {
    hideFileInput();
  }
  return false;
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
  if (!loadPictureFromFile()) {
    size.src = getMapImage();
  }
}

function hideFileInput() {
  mapImageFileInput.classList.add("hidden");
}

window.addEventListener("config", updateMapImage);
window.addEventListener("load", updateMapImage);

