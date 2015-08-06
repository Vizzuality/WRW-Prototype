require.config({

  baseUrl: 'js/dashboard',

  paths: {
    jquery:     '../vendor/jquery/dist/jquery.min',
    underscore: '../vendor/underscore/underscore-min',
    backbone:   '../vendor/backbone/backbone-min',
    handlebars: '../vendor/handlebars/handlebars.amd.min',
    d3:         '../vendor/d3/d3',
    d3chart:    'helpers/chart',
    moment:     '../vendor/moment/min/moment.min',
    text:       '../vendor/text/text',
    'backbone-super': '../vendor/backbone-super/backbone-super/' +
      'backbone-super-min',
    slick:      '../vendor/slick-carousel/slick/slick.min'
  },

  shim: {
    d3:   { exports: 'd3' }
  }

});

require([
  'underscore',
  'backbone',
  'slick'
], function(_, Backbone, slick) {

  'use strict';

  function Globe(container, layerName) {
    var w = container.offsetWidth || window.innerWidth;
    var h = container.offsetHeight || window.innerHeight;

    var curZoomSpeed = 0;
    var zoomSpeed = 50;
    var distance = 100000, distanceTarget = 100000;
    var mouse = { x: 0, y: 0 }, mouseOnDown = { x: 0, y: 0 };
    var rotation = { x: 0, y: 0 },
      target = { x: Math.PI*3/2, y: Math.PI / 6.0 },
      targetOnDown = { x: 0, y: 0 };
     var PI_HALF = Math.PI / 2;
    var overRenderer = false;

    var camera = new THREE.PerspectiveCamera( 30, w / h , 1, 10000 );
    camera.position.z = distance;

    var scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry(200, 32, 32);

    // Basemap
    var uniforms = THREE.UniformsUtils.clone({ texture: { type: 't', value: null } });
    uniforms.texture.value = THREE.ImageUtils.loadTexture('img/globe-layers/' + layerName + '.jpg');

    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: [
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
          'vNormal = normalize( normalMatrix * normal );',
          'vUv = uv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D texture;',
        'varying vec3 vNormal;',
        'varying vec2 vUv;',
        'void main() {',
          'vec3 diffuse = texture2D( texture, vUv ).xyz;',
          'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
          'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
          'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
        '}'
      ].join('\n')
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.y = Math.PI;
    scene.add(mesh);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.domElement.style.left = 0;
    renderer.domElement.style.position = 'absolute';

    container.appendChild( renderer.domElement );

    container.addEventListener('mousedown', onMouseDown, false);

    // container.addEventListener('mousewheel', onMouseWheel, false);

    container.addEventListener('mouseover', function() {
      overRenderer = true;
    }, false);

    container.addEventListener('mouseout', function() {
      overRenderer = false;
    }, false);

    function onMouseDown(event) {
      event.preventDefault();

      container.addEventListener('mousemove', onMouseMove, false);
      container.addEventListener('mouseup', onMouseUp, false);
      container.addEventListener('mouseout', onMouseOut, false);

      mouseOnDown.x = - event.clientX;
      mouseOnDown.y = event.clientY;

      targetOnDown.x = target.x;
      targetOnDown.y = target.y;

      container.style.cursor = 'move';
    }

    function onMouseMove(event) {
      mouse.x = - event.clientX;
      mouse.y = event.clientY;

      var zoomDamp = distance/1000;

      target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
      target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

      target.y = target.y > PI_HALF ? PI_HALF : target.y;
      target.y = target.y < - PI_HALF ? - PI_HALF : target.y;
    }

    function onMouseUp(event) {
      container.removeEventListener('mousemove', onMouseMove, false);
      container.removeEventListener('mouseup', onMouseUp, false);
      container.removeEventListener('mouseout', onMouseOut, false);
      container.style.cursor = 'auto';
    }

    function onMouseOut(event) {
      container.removeEventListener('mousemove', onMouseMove, false);
      container.removeEventListener('mouseup', onMouseUp, false);
      container.removeEventListener('mouseout', onMouseOut, false);
    }

    function onMouseWheel(event) {
      event.preventDefault();
      if (overRenderer) {
        zoom(event.wheelDeltaY * 0.3);
      }
      return false;
    }

    function zoom(delta) {
      distanceTarget -= delta;
      distanceTarget = distanceTarget > 1000 ? 1000 : distanceTarget;
      distanceTarget = distanceTarget < 350 ? 350 : distanceTarget;
    }

    function animate() {
      requestAnimationFrame(animate);
      render();
    }

    function render() {
      zoom(curZoomSpeed);

      rotation.x += (target.x - rotation.x) * 0.1;
      rotation.y += (target.y - rotation.y) * 0.1;
      distance += (distanceTarget - distance) * 0.3;

      camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
      camera.position.y = distance * Math.sin(rotation.y);
      camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);

      camera.lookAt(mesh.position);

      renderer.render(scene, camera);
    }

    this.start = animate;
    
    this.remove = function() {
      container.removeChild( renderer.domElement );
    };
  }

  var Slideshow = Backbone.View.extend({

    el: '.planet-pulse--slideshow-content',

    initialize: function() {;
      $(document).ready(_.bind(function() {

        this.$el.slick({
          arrows: false,
          draggable: false,
          infinite: false,
          fade: true
        });

      }, this));

      this.$backgroundContainer = $('.planet-pulse--slideshow-container');
      this.$asideContainer = $('.planet-pulse--slideshow-aside');
      this.$asideWideContainer = $('.planet-pulse--slideshow-wide-aside');

      this.globe = new Globe(this.$asideWideContainer.get(0), 'temperature').start();

      this.setListeners();
    },

    setListeners: function() {
      $('.planet-pulse--tabs li').on('click', _.bind(this.nextSlide, this));
    },

    nextSlide: function(e) {
      e.preventDefault();

      var $tab = $(e.currentTarget);
      var position = $tab.parent().find('li').index($tab) + 1;

      $('.planet-pulse--tabs .active').removeClass('active');
      $tab.addClass('active');

      this.$el.slick('slickGoTo', position);

      this.updateMap(position);
    },

    updateMap: function(index) {
      /*
        Index: the tab position [[1, 4]]

        this.$backgroundContainer: change tha background image
        this.$asideContainer: useless here (content on the right)
        this.$asideWideContainer: container for the map
      */
     
      var layer ='';
     
      if (index === 1) {
        layer = 'temperature';
      } else if (index === 2) {
        layer = 'climate';
      } else if (index === 3) {
        layer = 'preasure';
      } else if (index === 4) {
        layer = 'fires';
      }
      
      if (this.globe) {
        this.globe.remove();
      }
      this.$asideWideContainer.html(null);
      this.globe = new Globe(this.$asideWideContainer.get(0), layer).start();
    }

  });

  new Slideshow();

});
