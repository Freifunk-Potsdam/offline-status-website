
function goBackToMap() {
  if (document.location) {
    window.history.back();
  } else {
    document.location = "index.html" + document.location.hash;
  }
}

