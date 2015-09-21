define([
  'lib/controls/OrbitControls',
  'lib/threex.rendererstats'
], function() {

  var Globe = function(elementId) {

    var webglEl = elementId ? document.getElementById(elementId) : document.body;

    // Vars
    var w = this.w = elementId ? webglEl.clientWidth : window.innerWidth;
    var h = this.h = elementId ? webglEl.clientHeight : window.innerHeight;

    var radius = 0.5;
    var segments = 32;
    var rotation = 6;

    // var statsRender = stats();
    var layers = {};

    function stats() {
      var rendererStats = new THREEx.RendererStats();
      rendererStats.domElement.style.position = 'absolute'
      rendererStats.domElement.style.left = '0px'
      rendererStats.domElement.style.bottom   = '0px'
      document.body.appendChild( rendererStats.domElement );
      return rendererStats;
    }

    function createEarth(radius, segments) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshPhongMaterial({
          map: THREE.ImageUtils.loadTexture(document.getElementById('basemap1').src),
          bumpMap: THREE.ImageUtils.loadTexture(document.getElementById('basemap3').src),
          bumpScale: 0.001,
          specularMap: THREE.ImageUtils.loadTexture(document.getElementById('basemap6').src),
          specular: new THREE.Color('grey')
        })
      );
    }

    function createClouds(radius, segments) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius + 0.003, segments, segments),
        new THREE.MeshPhongMaterial({
          map: THREE.ImageUtils.loadTexture(document.getElementById('basemap4').src),
          side: THREE.DoubleSide,
          opacity: 0.8,
          transparent: true,
          depthWrite: false
        })
      );
    }

    function createSpace(radius, segments) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshBasicMaterial({
          map: THREE.ImageUtils.loadTexture(document.getElementById('basemap5').src),
          side: THREE.BackSide
        })
      );
    }

    function createLayer(name, imageUrl) {
      var layer = new THREE.Mesh(
        new THREE.SphereGeometry(radius + 0.002, segments, segments),
        new THREE.MeshPhongMaterial({
          map: THREE.ImageUtils.loadTexture(imageUrl),
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false
        })
      );

      layer.rotation.y = rotation;
      layers[name] = layer;
      scene.add(layer);
    }

    function removeLayer(name) {
      if (layers[name]) {
        scene.remove(layers[name]);
      }
    }

    // Scene
    var scene = new THREE.Scene();

    // Camera
    var camera = new THREE.PerspectiveCamera(40, w / h, 0.01, 1000);
    camera.position.z = 2;

    // Renderer
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);

    // Ambient light
    var ambientLight = new THREE.AmbientLight(0x444444);
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-5, 3, 5);

    scene.add(ambientLight);
    scene.add(light);

    // Earth
    var sphere = createEarth(radius, segments);
    sphere.rotation.y = rotation;
    scene.add(sphere);

    // Clouds
    var clouds = createClouds(radius, segments);
    clouds.rotation.y = rotation;
    scene.add(clouds);

    // Space
    var space = createSpace(90, 64);
    scene.add(space);

    // Controls
    // var controls = new THREE.TrackballControls(camera);
    var controls = new THREE.OrbitControls(camera);
    // var controls = new THREE.OrthographicTrackballControls(camera);

    controls.minDistance = 1;
    controls.maxDistance = 15;

    // Helper functions
    function setPosition(x, y) {
      if (x || x === 0) {
        sphere.position.x = x;
        clouds.position.x = x;
        camera.position.x = x;
      }

      if (y || y === 0) {
        sphere.position.y = y;
        clouds.position.y = y;
        camera.position.y = y;
      }

      for (l in layers) {
        if (x || x === 0) {
          layers[l].position.x = x;
        }
        if (y || y === 0) {
          layers[l].position.y = y;
        }
      }
    }

    // Add element to DOM and render
    webglEl.appendChild(renderer.domElement);

    render();

    function render() {
      controls.update();

      sphere.rotation.y += 0.0005;
      clouds.rotation.y += 0.0006;

      for (l in layers) {
        layers[l].rotation.y += 0.0005;
      }

      rotation = sphere.rotation.y;

      requestAnimationFrame(render);
      renderer.clear();
      renderer.render(scene, camera);
      // statsRender.update(renderer);
    }

    function onWindowResize() {
      w = this.w = elementId ? webglEl.clientWidth : window.innerWidth;
      h = this.h = elementId ? webglEl.clientHeight : window.innerHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    window.addEventListener('resize', onWindowResize, false);

    this.setPosition = setPosition;

    this.addClouds = function() {
      scene.add(clouds);
    };

    this.removeClouds = function() {
      scene.remove(clouds);
    };

    this.camera = camera;

    this.resize = onWindowResize;

    this.createLayer = createLayer;
    this.removeLayer = removeLayer;

    this.ambientLight = ambientLight;
    this.sphere = sphere;

    this.element = webglEl;

    return this;

  };

  return Globe;

});
