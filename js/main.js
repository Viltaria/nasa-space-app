window.addEventListener('load', init, false);

function init() {
  createScene();
  createLights();
  createEarth();
  createPlayer();

  createLoops();
  // JQUERY START

  function handleOnKeyDown(event) {
    // event.preventDefault();

    if (event.which == 37) { // Left key
      turnDir = 1;
    }
    if (event.which == 38) { // Up key
      forwardDir = -0.25;
    }
    if (event.which == 39) { // Right key
      turnDir = -1;
    }
  }

  function handleOnKeyUp(event) {
    if (event.keyCode == 37) {
      turnDir = 0;
    }
    if (event.keyCode == 38) {
      forwardDir = 0;
    }
    if (event.keyCode == 39) {
      turnDir = 0;
    }
  }

  $(function() {

    $('#inputButton').click(function() {

      // Get rid of the input box from the screen
      $('#inputBox').transition('fade up', 2000);
      var tween = new TWEEN.Tween(camera.position).to({
        x: player.camera.getWorldPosition().x,
        y: player.camera.getWorldPosition().y,
        z: player.camera.getWorldPosition().z
      }, 2000).easing(TWEEN.Easing.Linear.None).onUpdate(function() {
        camera.position.set(this.x, this.y, this.z);
        camera.lookAt(player.position);
      }).start();


      // Enable the controlls for plane movement
      $(document).keydown(function(event) {
        handleOnKeyDown(event);
      });

      $(document).keyup(function(event) {
        handleOnKeyUp(event);
      });


      // Grab the destination string
      destination = $('#inputText').val();

      popup = new PopUpInformationBox(destination);
      scene.add(popup);

      geocodeAddress(geocoder, destination);

      // button = new Button("testButton");
      // scene.add(button);

      backButton = new BackButton();
      scene.add(backButton);

      updateWeather();
    });
  });

  // JQUERY END


}

var scene, camera, renderer, container;

function createScene() {
  scene = new THREE.Scene();

  let aspectRatio = WINDOW_WIDTH / WINDOW_HEIGHT,
    fieldOfView = 60,
    nearPlane = 10,
    farPlane = 10000;

  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
  );
  camera.position.set(0, 2000, 300);

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
  renderer.autoClear = false;

  container = document.getElementById('world');
  container.appendChild(renderer.domElement);


  var editText = new EditText();
  scene.add(editText);

  var input = document.getElementById('inputText');
  var autocomplete = new google.maps.places.Autocomplete(input);

  window.addEventListener('resize', handleWindowResize, false);

}

function handleWindowResize() {
  WINDOW_HEIGHT = window.innerHeight;
  WINDOW_WIDTH = window.innerWidth;

  renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);

  camera.aspect = WINDOW_WIDTH / WINDOW_HEIGHT;
  camera.updateProjectionMatrix();
}


var hemisphereLight;

function createLights() {
  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
  hemisphereLight.position.set(0, 0, -700);
  scene.add(hemisphereLight);

  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.45);
  hemisphereLight.position.set(700, 0, 1000);
  scene.add(hemisphereLight);

  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 0.5);
  hemisphereLight.position.set(0, 700, 0);
  scene.add(hemisphereLight);



  var ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);
}


var renderingLoop, physicsLoop;

function createLoops() {
  renderingLoop = new THREEx.RenderingLoop();
  renderingLoop.add(updateRender);
  renderingLoop.start();

  physicsLoop = new THREEx.PhysicsLoop(60);
  physicsLoop.add(updatePhysics);
  physicsLoop.start();

}

function updateRender() {
  TWEEN.update();
  renderer.render(scene, camera);
}

var earth;

function createEarth() {
  earth = new Earth();
  scene.add(earth);
}

var player;

function createPlayer() {
  player = new Player();
  scene.add(player);
}


var geocoder;

function initMap() {
  geocoder = new google.maps.Geocoder();
}


function geocodeAddress(geocoder, address) {
  geocoder.geocode({
    'address': address
  }, function(results, status) {
    if (status === 'OK') {
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      putMarker(lat, lng);
    } else {
      console.error('Geocode was not successful for the following reason: ' + status);
    }
  });
}

var marker;

function putMarker(lat, lng) {

  var geom = new THREE.ConeGeometry(15, 100, 24);
  var mat = new THREE.MeshBasicMaterial({
    color: COLORS.blue
  });
  var mesh = new THREE.Mesh(geom, mat);

  var cartesian = calculateCartesian(lat, lng, EARTH_RADIUS).multiplyScalar(1.2);
  mesh.position.set(cartesian.x, cartesian.y + 200, cartesian.z);

  // Rotation
  var gravityUp = earth.mesh.position.clone().sub(mesh.position).normalize();
  var bodyUp = new THREE.Vector3().copy(mesh.up).applyQuaternion(mesh.quaternion);

  var rotateQuaternion = new THREE.Quaternion().setFromUnitVectors(bodyUp, gravityUp);
  var curQuaternion = mesh.quaternion.multiplyQuaternions(rotateQuaternion, mesh.quaternion).normalize();

  mesh.setRotationFromQuaternion(curQuaternion);

  scene.add(mesh);
}

function getWeather(lat, lon, cb) {
  var secure_api_key = "65a0b9437917c8a3ac9149562da7fb67";
  $.getJSON(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${secure_api_key}`, function(data) {
    cb(data);
  });
}

function getColor(lat, long, cb) {
  $.ajax({
    type: "POST",
    url: "http://10.105.78.221:6969/",
    data: {
      lat: lat,
      lon: long
    },
    success: function(data) {
      //console.log(data);
      cb(data);
    }
  });
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}


function updateWeather() {
  setInterval(function() {
    var location = calculatePolar(player.position.clone());
    $.getJSON(`http://ws.geonames.org/countryCodeJSON?lat=${location.x}&lng=${location.y}&username=demo`, function(data) {
      if (!data.countryName) {
        $('#cuck').hide()
        return;
      }
      $('#imgFlag').attr('src', `http://www.geognos.com/api/en/countries/flag/${data.countryCode}.png`)
      $('#countryName').text(data.countryName);
      $('#cuck').show();
    });
    getWeather(location.x, location.y, function(data) {
      $('#weatherDesc').text(toTitleCase(data.weather[0].description));
      $('#weatherIcon').attr('src', `http://openweathermap.org/img/w/${data.weather[0].icon}.png`)
      if (data.weather[0].id == 800) {
        //console.log("WEATHER IS GOOD");
        player.sun.visible = true;
        var random = 2;
        var x = 0;
        var tween = new TWEEN.Tween(x).to(x, 1500).onUpdate(function() {
          player.sun.rotateOnAxis(new THREE.Vector3(0, 1, 0).applyQuaternion(player.sun.quaternion), x + 0.1);
        }).onComplete(function() {
          player.sun.visible = false;

        }).start();
      } else if (data.weather[0].id < 781 && data.weather[0].id > 500) {
        //console.log("WEATHER IS BAD");
        var random = player.rotation.z * 1.3;
        var tween = new TWEEN.Tween(player.rotation).to({
          z: player.rotation.z * 1.3
        }, 500).easing(TWEEN.Easing.Linear.None).onComplete(function() {
          tween = new TWEEN.Tween(player.rotation).to({
            z: player.rotation.z * 0.5
          }).start();

        }).start();
      } else {
        player.cloud.visible = true;
        var random = 2;
        var x = 0;
        var tween = new TWEEN.Tween(x).to(x, 1500).onUpdate(function() {
          player.cloud.rotateOnAxis(new THREE.Vector3(0, 1, 0).applyQuaternion(player.cloud.quaternion), x + 0.1);
          //console.log(x);
        }).onComplete(function() {
          player.cloud.visible = false;
        }).start();
      }

    });
    $('#lati').text(location.x.toFixed(2));
    $('#long').text(location.y.toFixed(2));

  }, 2000);
}

function componentToHex(c) {
  var hex = c.toString(16);

  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
