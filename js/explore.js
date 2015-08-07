(function() {
  var map = L.map('map', {zoomControl: false}).setView([0,-30], 3);
  new L.Control.Zoom({ position: 'topright' }).addTo(map);

  L.tileLayer('http://{s}.tiles.mapbox.com/v4/smbtc.7d2e3bf9/{z}/{x}/{y}@2x.png?access_token={access_token}', {
    access_token: 'pk.eyJ1Ijoic21idGMiLCJhIjoiVXM4REppNCJ9.pjaLujYj-fcCPv5evG_0uA'
  }).addTo(map);

  var hasClass = function(el, className) {
    var domEl = document.querySelector(el);
    return domEl.classList.contains(className)
  };

  var toggleClass = function(el, className) {
    var domEl = document.querySelector(el);

    if (hasClass(el, className)) {
      domEl.classList.remove(className);
    } else {
      domEl.classList.add(className);
    }
  };

  var mapExpandButton = document.querySelector(".js--map-expand");
  mapExpandButton.onclick = function(event) {
    event.preventDefault();

    toggleClass('.js--explore--map', 'explore--map-open');
    toggleClass('.js--explore--content', 'explore--content-closed');

    var iconEl = document.querySelector('.explore--map-button i');
    if (hasClass('.js--explore--map', 'explore--map-open')) {
      iconEl.classList.remove('fa-chevron-left');
      iconEl.classList.add('fa-chevron-right');
    } else {
      iconEl.classList.remove('fa-chevron-right');
      iconEl.classList.add('fa-chevron-left');
    }

    setTimeout(map.invalidateSize.bind(map), 1100);
  };

  var selectedVisualisations = {};
  var mapVisualisations = [
    "https://insights.cartodb.com/api/v2/viz/c572a394-3cda-11e5-9e01-0e4fddd5de28/viz.json",
    "https://insights.cartodb.com/api/v2/viz/bf63525c-3cdd-11e5-afd4-0e4fddd5de28/viz.json",
  ];

  var addLayerToMap = function(id, $el) {
    var layerUrl = mapVisualisations[id];
    cartodb.createLayer(map, layerUrl)
      .addTo(map)
      .on('done', function(layer) {
        selectedVisualisations[id] = layer;

        $el.text("Active");
        $el.addClass("explore--active-dataset");
      });
  };

  var removeLayerFromMap = function(id, $el) {
    var layer = selectedVisualisations[id];
    map.removeLayer(layer);

    $el.text("Add to map");
    $el.removeClass("explore--active-dataset");

    delete selectedVisualisations[id];
  };

  $('.add-to-map').on('click', function(event) {
    var $el = $(this),
        id = $el.data('id');

    if (selectedVisualisations[id] === undefined) {
      addLayerToMap(id, $el);
    } else {
      removeLayerFromMap(id, $el);
    }
  });
})();
