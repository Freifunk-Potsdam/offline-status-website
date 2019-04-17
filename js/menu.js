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

function sidebarIsVisible(id) {
  var sidebar = document.getElementById(id);
  return !sidebar.classList.contains("hidden");
}

window.addEventListener("load", function() {
  toggleHeader();
  toggleSidebar('routers');toggleSidebar('routers');
});




