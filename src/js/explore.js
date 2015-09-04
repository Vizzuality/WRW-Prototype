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
    {name: "Energy Plants", url: "https://insights.cartodb.com/api/v2/viz/c572a394-3cda-11e5-9e01-0e4fddd5de28/viz.json"},
    {name: "Global Water Risk", url: "https://insights.cartodb.com/api/v2/viz/bf63525c-3cdd-11e5-afd4-0e4fddd5de28/viz.json"},
    {name: "Country Flood Risk", url: "https://insights.cartodb.com/api/v2/viz/7676a37a-3ce0-11e5-a016-0e0c41326911/viz.json"}
  ];

  var renderLegend = function() {
    var $legendEl = $('.explore--map-legend');
    if (_.isEmpty(selectedVisualisations)) {
      $legendEl.hide();
      return;
    }

    var $list = $('.explore--map-legend-layers');
    $list.empty();

    _.each(selectedVisualisations, function(value, key) {
      var layerId = mapVisualisations.indexOf(mapVisualisations[key]);
      var isLayerVisible = selectedVisualisations[layerId].isVisible();

      var li = '<li><!--<span class="bullet">--></span>'+mapVisualisations[key].name;
      li += '<span class="onoffswitch' + (!isLayerVisible ? ' off"' : '"');
      li += 'data-id="'+mapVisualisations.indexOf(mapVisualisations[key])+'"><span></span></span></li>';

      $list.append(li);
    });

    $list.find('.onoffswitch').off().on('click', function(e) {
      var $el = $(this),
          id  = $el.data('id');
      toggleLayer(id, $el);
    });

    $legendEl.show();
  };

  var addLayerToMap = function(id, $el) {
    $el.text("Active");
    $el.addClass("explore--active-dataset");

    var layerUrl = mapVisualisations[id].url;
    cartodb.createLayer(map, layerUrl)
      .addTo(map)
      .on('done', function(layer) {
        selectedVisualisations[id] = layer;
        renderLegend();
      });
  };

  var removeLayerFromMap = function(id, $el) {
    var layer = selectedVisualisations[id];
    map.removeLayer(layer);

    $el.text("Add to map");
    $el.removeClass("explore--active-dataset");

    delete selectedVisualisations[id];
    renderLegend();
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

  var toggleLayer = function(id, $el) {
    var layer = selectedVisualisations[id];
    if(layer.isVisible()) {
      layer.hide();
      $el.addClass('off');
    } else {
      layer.show();
      $el.removeClass('off');
    }
  };

  /* For mobile devices */
  var checkbox = document.querySelector('#js--show--map');
  var showMapClass = '.js--show--map';
  var hideMapClass = '.js--hide--map';
  var legendClass = '.explore--map-legend';
  var headerClass = '.header-container';
  var headerContainer = document.querySelector(headerClass);
  var subHeaderClass = '.sub-header-container';
  var subHeaderContainer = document.querySelector(subHeaderClass);
  var mapContainer = document.querySelector('#map');
  var cachedOffsetTop;
  var setMapPosition = function() {
    if(!!navigator.userAgent.match(/iPad|iPhone|iPod|Android|BlackBerry|webOS/i) ||
      window.innerWidth <= 540) {

      mapContainer.style.top =  '130px';
      if(!isMapOpened()) {
        mapContainer.style.left = window.innerWidth + 'px';
      }
    }

    if (window.innerWidth > 580 && window.innerWidth <= 800) {
        mapContainer.style.top =  '130px';
        mapContainer.style.left = window.innerWidth + 'px';
    };
  };
  var isMapOpened = function() {
    return checkbox.checked;
  };
  var fixSubHeaderPosition = function() {
    if(isMapOpened()) { return; }

    var offsetTop = subHeaderContainer.offsetTop;
    if(window.scrollY > offsetTop && !hasClass(subHeaderClass, 'is-fixed')) {
      cachedOffsetTop = offsetTop;
      toggleClass(subHeaderClass, 'is-fixed');
    } else if(window.scrollY < cachedOffsetTop && hasClass(subHeaderClass, 'is-fixed')) {
      toggleClass(subHeaderClass, 'is-fixed');
    }
  };

  window.addEventListener('resize', setMapPosition);
  setMapPosition();
  window.addEventListener('scroll', fixSubHeaderPosition);
  fixSubHeaderPosition();

  checkbox.addEventListener('change', function() {

    if(isMapOpened()) {
      if(hasClass(hideMapClass, 'is-hidden')) {
        toggleClass(hideMapClass, 'is-hidden');
      }
      if(!hasClass(showMapClass, 'is-hidden')) {
        toggleClass(showMapClass, 'is-hidden');
        setTimeout(map.invalidateSize.bind(map), 1100);
      }
      if(!hasClass(legendClass, 'is-hidden')) {
        setTimeout(function() { toggleClass(legendClass, 'is-mobile-hidden'); }, 800);
      }

      var offsetTop = subHeaderContainer.offsetTop;
      if(window.scrollY < offsetTop) {
        if(!hasClass(headerClass, 'is-fixed')) {
          toggleClass(headerClass, 'is-fixed');
        }
        if(hasClass(subHeaderClass, 'is-fixed')) {
          toggleClass(subHeaderClass, 'is-fixed');
        }
        mapContainer.style.top =  '114px';
      } else {
        if(!hasClass(subHeaderClass, 'is-fixed')) {
          toggleClass(subHeaderClass, 'is-fixed');
        }
        mapContainer.style.top =  '33px';
      }


      mapContainer.style.left = '0';
    } else {
      if(hasClass(showMapClass, 'is-hidden')) {
        toggleClass(showMapClass, 'is-hidden');
        setTimeout(map.invalidateSize.bind(map), 1100);
      }
      if(!hasClass(hideMapClass, 'is-hidden')) {
        toggleClass(hideMapClass, 'is-hidden');
      }
      if(hasClass(headerClass, 'is-fixed')) {
        toggleClass(headerClass, 'is-fixed');
      }
      if(!hasClass(legendClass, 'is-hidden')) {
        toggleClass(legendClass, 'is-mobile-hidden');
      }

      mapContainer.style.left = window.innerWidth + 'px';
      fixSubHeaderPosition();
    }
  });

})();
