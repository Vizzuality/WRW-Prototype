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

    setInterval(map.invalidateSize.bind(map), 1100);
  };
})();
