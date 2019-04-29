/* Quality of connections
 */

/* this lookup is hardcoded on the page
   http://frei.funk/cgi-bin/luci/freifunk/olsr/neighbors */
var qualities = [
  { id: "very-good",
    color: "#00cc00",
    text: "sehr gut",
    max: 2000},
  { id: "good",
    color: "#ffcb05",
    text: "gut",
    max: 4000},
  { id: "still-usable",
    color: "#ff6600",
    text: "nutzbar",
    max: 10000},
  { id: "bad",
    color: "#bb3333",
    text: "schlecht",
    max:100000},
  { id: "broken",
    color: "#000000",
    text: "unterbrochen"},
];

function getLinkQualityFromCost(cost) {
  var quality;
  if (!cost && cost != 0) {
    quality = qualities[qualities.length - 1];
  } else {
    for (var i = 0; i < qualities.length; i++) {
      quality = qualities[i];
      if (quality.max && cost < quality.max) {
        break;
      }
    }
  }
  return Object.assign({
    etx: cost == null ? null : cost / 1000,
    image : {
      connection: "img/connection/" + quality.id + ".png",
      signal: "img/signal/" + quality.id + ".png",
    },
    setClass: function(element){
      qualities.forEach(function(quality){
        element.classList.remove(quality.id);
      });
      element.classList.add(quality.id);
    }
  }, quality);
}

function getRouteQualityTo(ip) {
  if (isSourceRouter(ip)) {
    return getLinkQualityFromCost(0);
  }
  var route = getRouteTo(ip);
  return getLinkQualityFromCost(isValidRoute(route) ? route.rtpMetricCost : null);
}

