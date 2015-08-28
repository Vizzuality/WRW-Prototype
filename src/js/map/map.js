(function() {

  // Selectors
	var next = document.querySelector('.right-control');
  var scenarios = document.querySelectorAll('.scenarios > li');

  var hideArrow = document.querySelector('.hide-arrow');
  var showArrow = document.querySelector('.show-arrow');



  var hideSlide = function() {
    var slide = document.querySelector('.read-more-container');

    slide.setAttribute('class', 'insights--slideshow-container read-more-container is-priority show slide-left');

    hideArrow.setAttribute('class', 'hide-arrow is-hidden');
    showArrow.setAttribute('class', 'show-arrow');
  };

  var showSlide = function() {
    var slide = document.querySelector('.read-more-container');

    slide.setAttribute('class', 'insights--slideshow-container read-more-container is-priority show slide-right');

    showArrow.setAttribute('class', 'show-arrow is-hidden');
    hideArrow.setAttribute('class', 'hide-arrow');
  };

	var loadMap = function(viz) {
    var viz = viz;
    var map = document.querySelector('#map');

    if (!viz) {
      viz = 'https://insights.cartodb.com/api/v2/viz/eda2596a-3ce7-11e5-aea1-0e0c41326911/viz.json';
    }

    var mapDiv = map.querySelector('div');

    if (mapDiv) {
      mapDiv.remove();
    }


    cartodb.createVis('map', viz)
    .done(function(vis, layers) {
      
      var lmap = vis.getNativeMap();
      // var p1 = cartodb.L.latLng(-180.0000, -90.0000);
      // var p2 = cartodb.L.latLng(180.0000, 90.0000);
      // var bounds = cartodb.L.latLng(p2, p1);

      layers[0].leafletMap.setMaxBounds([
        [180.0000, 90.0000], 
        [-180.0000, -90.0000]
      ]);


      lmap.fitBounds([
        [180.0000, 90.0000],
        [-180.0000, -90.0000]
      ]);

      lmap.setZoom(3);
      if (!mapDiv) {
        map.setAttribute('class', 'hide-controls');
      };

    });
  };

  var changeMap = function(e) {
    e && e.preventDefault();
    var scenario = e.currentTarget.getAttribute('data-scenario');
    var viz;

    for (var i = 0; i < scenarios.length; i++) {
      scenarios[i].setAttribute('class', '');
    };

    e.currentTarget.setAttribute('class', 'current');

    switch(scenario) {

      case 'A':
        viz = 'https://insights.cartodb.com/api/v2/viz/eda2596a-3ce7-11e5-aea1-0e0c41326911/viz.json';
        break;
      case 'B':
        viz = 'https://insights.cartodb.com/api/v2/viz/3d2060a4-3ce8-11e5-b991-0e853d047bba/viz.json';
        break;
      case 'C':
        viz = 'https://insights.cartodb.com/api/v2/viz/dbece2a8-3cec-11e5-8d9a-0e4fddd5de28/viz.json';
        break;
    }

    loadMap(viz);
  }

  var goMap = function(e) {
    e && e.preventDefault();

    var exploreContainer = document.querySelector('.explore-container');
    var veil = document.querySelector('.veil');
    var navigation = document.querySelector('.map-navigation');

    exploreContainer.setAttribute('class', exploreContainer.className + ' slide-left');

    veil.setAttribute('class', veil.className + ' hide');

    navigation.setAttribute('class', navigation.className + ' show');

    
    window.setTimeout(function() {
      map.setAttribute('class', 'is-priority');
      hideSlide();
    }, 1500);

  }

  loadMap()

  for (var i = 0; i < scenarios.length; i++) {
    scenarios[i].onclick = changeMap; 
  }


  hideArrow.onclick = hideSlide;
  showArrow.onclick = showSlide;

	next.onclick = goMap;

}());