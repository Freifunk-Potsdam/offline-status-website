
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

