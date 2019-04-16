
/* open and close the header */
function toggleHeader() {
  document.body.classList.toggle("open");
  menuButton.innerText = document.body.classList.contains("open") ? "-" : "+";
}

function toggleSidebar(id) {
  var sidebars = document.getElementsByClassName("sidebar");
  for (var i = 0; i < sidebars.length; i++) {
    var sidebar = sidebars[i];
    if (sidebar.id == id) {
      sidebar.classList.toggle("hidden");
    } else {
      sidebar.classList.add("hidden");
    }
  }
}

function loaded() {
  toggleSidebar('routerList');
  updateOLSR();
  setInterval(updateOLSR, 5000);
}

function updateOLSR() {
  var request = new XMLHttpRequest();
  var url = "http://" + sourceIp.value + ":9090/all";
  request.open("GET", url);
  request.addEventListener('load', function(event) {
     if (request.status >= 200 && request.status < 300) {
        try {
          var olsr = JSON.parse(request.responseText);
          // see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_%E2%80%93_CustomEvent()
          var event = new CustomEvent("olsr", olsr);
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
  
}
document.addEventListener("olsr", listRouters);

window.addEventListener("load", loaded);

