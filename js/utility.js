
function listProperties(obj) {
  var properties = [];
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
        properties.push(property);
    }
  }
  return properties;
}

function forEachProperty(obj, func) {
  listProperties(obj).forEach(function(property){
    func(property, obj[property]);
  });
}

function createLineAngle(x, y, length, angle, element) {
    element = element || document.createElement("div");
    // from https://stackoverflow.com/a/5912283/1320237
    var styles = ''
               /*+'border: 1px solid black; '*/
               + 'width: ' + length + 'px; '
               /*+ 'height: 0px; '*/
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               /*+ 'position: absolute; '*/
               + 'top: ' + y + 'px; '
               + 'left: ' + x + 'px; ';
    element.setAttribute('style', styles);  
    return element;
}

function createLine(x1, y1, x2, y2, element) {
    // from https://stackoverflow.com/a/5912283/1320237
    var a = x1 - x2,
        b = y1 - y2,
        c = Math.sqrt(a * a + b * b);

    var sx = (x1 + x2) / 2,
        sy = (y1 + y2) / 2;

    var x = sx - c / 2,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineAngle(x, y, c, alpha, element);
}

function requestJSON(url, onSuccess, onError) {
  var request = new XMLHttpRequest();
  onError = onError || function() {
    console.warn(request.statusText, request.responseText);
  };
  request.open("GET", url);
  request.addEventListener('load', function(event) {
    if (request.status >= 200 && request.status < 300) {
      var data = JSON.parse(request.responseText);
      onSuccess(data);
    } else {
      onError(request);
    }
  });
  request.send();
}
