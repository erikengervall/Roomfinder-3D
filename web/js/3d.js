$.ajax({
  url: "api.php",
  type: "GET"
})
  .done(function(data) {
    console.log(JSON.parse(data));
    roomData = JSON.parse(data);
    var time = translateTimeFromValue();
    checkBooked(time[0], time[1]);
  })
  .fail(function(e) {
    console.log(e);
  });

var roomData = undefined;

var scene, camera, renderer;
var geometry, material;

// text
var loader = new THREE.FontLoader();

var domEvents;
var sceneRotation = 0;

/*
 * translates the value from the slider to a time that acctually is a... time
 */
function translateTime(value) {
  //console.log(value);
  var startHour = 8,
    startMinute = 15,
    endHour,
    endMinute;

  endHour = startHour + Math.floor(value / 4);

  if (value % 4 == 3) {
    endHour++;
    endMinute = "00";
  } else {
    endMinute = startMinute + 15 * (value % 4);
  }

  return {
    time: endHour.toString() + ":" + endMinute.toString(),
    timePure: parseInt(endHour.toString() + endMinute.toString())
  };
  /*
  1 %4 -> 30
  2 %4 -> 45
  3 %4 -> 00
  4 % 4 -> 15
*/
}

/*
 * translates time to what the slider value is..
 */
function translateTimeFromValue() {
  var d = new Date(),
    hourElapsedFromStart = d.getHours() - 8,
    quarterHoursFromStart = Math.floor(hourElapsedFromStart * 4);

  return [quarterHoursFromStart, quarterHoursFromStart + 4];
}

function checkBooked(timeStart, timeEnd) {
  scene.traverse(function(node) {
    if (node instanceof THREE.Mesh) {
      var nodeName = node.name;
      if (roomData !== undefined && roomData[nodeName] !== undefined) {
        var nodeData = roomData[nodeName];
        for (var i = timeStart; i < timeEnd; i++) {
          if (nodeData[translateTime(i).timePure] !== undefined) {
            node.material.color.setHex(0xff0000);
            break;
          } else {
            node.material.color.setHex(0x00ff00);
          }
        }
      }
    }
  });
}

/*
 * When document is ready, fill canvas
 */
$(document).ready(function() {
  init();
  animate();

  // slider
  $("#ex1").slider({
    tooltip_position: "bottom",
    value: translateTimeFromValue(),
    formatter: function(value) {
      if (Array.isArray(value)) {
        //console.log(value);
        checkBooked(value[0], value[1]);
        //  console.log(timeObj);
        $("#timeOfDay").html(
          translateTime(value[0]).time + "-" + translateTime(value[1]).time
        );
        return (
          "Current value: " +
          translateTime(value[0]).time +
          "-" +
          translateTime(value[1]).time
        );
      }
    }
  }); // end of slider
});

// function to restore the scene to the original view angle
function reset() {
  console.log("reset");
  controls.reset();
}
$(document).keydown(function(event) {
  if (event.keyCode == 27) {
    reset();
  }
});

function toggleSpin() {
  if (sceneRotation == 0) {
    sceneRotation = 0.01;
  } else {
    sceneRotation = 0;
  }
}
function init() {
  scene = new THREE.Scene();
  scene.position.x = -300;
  scene.position.y = -100;
  camera = new THREE.PerspectiveCamera(
    110,
    $("#scene").outerWidth() / $("#scene").outerHeight(),
    1,
    10000
  );
  camera.position.z = 1000;
  camera.position.y = 400;

  // camera drag stuff
  controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 0.6;
  controls.zoomSpeed = 1.0;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  loadFloor1();
  loadFloor2();
  loadFloor3();
  loadFloor4();
  loadFloor5();

  /*
   * Turn the scene a bit to get that sweet 3D feeling.
   */
  //scene.rotation.y = -0.2;

  /*
   * Light for the scene
   */
  var pointlight = new THREE.PointLight(0xffffff);
  pointlight.position.y = 750;
  pointlight.position.z = 200;
  scene.add(pointlight);

  var light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  var canvas = document.getElementById("scene");

  renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x6cbed9, 1);

  domEvents = new THREEx.DomEvents(camera, renderer.domElement);
  setDomEvents();
  // enableDrag();

  // window.addEventListener('resize', onWindowResize, false);
}

/*
 * Functions for loading different floors in house 1 at ITC
 */
function loadFloor1() {
  /*
   * Creating all the rooms for floor 1 on ITC
   * e.g.r1245 means room 45 on floor 2 in house 1
   */

  geometry = new THREE.BoxGeometry(100, 50, 100); // width, height, depth
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  }); // lambertMaterial to catch light
  r1106 = new THREE.Mesh(geometry, material); // create the mesh
  r1106.name = "1106"; // set a name to the room
  r1106.position.x = -500; // postition the room "correct" in the scene
  r1106.position.z = 250;
  scene.add(r1106); // add the room to the scene
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1106", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-400, -45, 300);
  scene.add(text);

  geometry = new THREE.BoxGeometry(80, 50, 50);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1110 = new THREE.Mesh(geometry, material);
  r1110.name = "1110";
  r1110.position.x = -640;
  r1110.position.z = 80;
  scene.add(r1110);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1110", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-540, -45, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(100, 50, 150);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1111 = new THREE.Mesh(geometry, material);
  r1111.name = "1111";
  r1111.position.x = -600;
  r1111.position.z = -50;
  scene.add(r1111);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1111", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-500, -45, 30);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1112 = new THREE.Mesh(geometry, material);
  r1112.name = "1112";
  r1112.position.x = -400;
  scene.add(r1112);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1112", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-300, -40, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1113 = new THREE.Mesh(geometry, material);
  r1113.name = "1113";
  r1113.position.x = -150;
  scene.add(r1113);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1113", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-50, -40, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1145 = new THREE.Mesh(geometry, material);
  r1145.name = "1145";
  r1145.position.x = 600;
  scene.add(r1145);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1145", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(700, -40, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1146 = new THREE.Mesh(geometry, material);
  r1146.name = "1146";
  r1146.position.x = 850;
  scene.add(r1146);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1146", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(950, -40, 110);
  scene.add(text);
}
function loadFloor2() {
  /*
   * Creating all the rooms for floor 2 on ITC
   */
  geometry = new THREE.BoxGeometry(100, 50, 100);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1206 = new THREE.Mesh(geometry, material);
  r1206.name = "1206";
  r1206.position.x = -500;
  r1206.position.y = 150;
  r1206.position.z = 250;
  scene.add(r1206);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1206", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-400, 105, 300);
  scene.add(text);

  geometry = new THREE.BoxGeometry(80, 50, 50);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1210 = new THREE.Mesh(geometry, material);
  r1210.name = "1210";
  r1210.position.x = -640;
  r1210.position.y = 150;
  r1210.position.z = 80;
  scene.add(r1210);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1210", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-540, 105, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(100, 50, 150);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1211 = new THREE.Mesh(geometry, material);
  r1211.name = "1211";
  r1211.position.x = -600;
  r1211.position.y = 150;
  r1211.position.z = -50;
  scene.add(r1211);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1211", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-500, 105, 30);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1212 = new THREE.Mesh(geometry, material);
  r1212.name = "1212";
  r1212.position.x = -400;
  r1212.position.y = 150;
  scene.add(r1212);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1212", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-300, 110, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1213 = new THREE.Mesh(geometry, material);
  r1213.name = "1213";
  r1213.position.x = -150;
  r1213.position.y = 150;
  scene.add(r1213);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1213", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-50, 110, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1245 = new THREE.Mesh(geometry, material);
  r1245.name = "1245";
  r1245.position.x = 600;
  r1245.position.y = 150;
  scene.add(r1245);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1245", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(700, 110, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1246 = new THREE.Mesh(geometry, material);
  r1246.name = "1246";
  r1246.position.x = 850;
  r1246.position.y = 150;
  scene.add(r1246);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1246", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(950, 110, 110);
  scene.add(text);
}
function loadFloor3() {
  /*
   * Creating all the rooms for floor 3 on ITC
   */
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  geometry = new THREE.BoxGeometry(100, 50, 100);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1306 = new THREE.Mesh(geometry, material);
  r1306.name = "1306";
  r1306.position.x = -500;
  r1306.position.y = 300;
  r1306.position.z = 250;
  scene.add(r1306);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1306", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-400, 255, 300);
  scene.add(text);

  geometry = new THREE.BoxGeometry(80, 50, 50);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1310 = new THREE.Mesh(geometry, material);
  r1310.name = "1310";
  r1310.position.x = -640;
  r1310.position.y = 300;
  r1310.position.z = 80;
  scene.add(r1310);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1310", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-540, 255, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(100, 50, 150);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1311 = new THREE.Mesh(geometry, material);
  r1311.name = "1311";
  r1311.position.x = -600;
  r1311.position.y = 300;
  r1311.position.z = -50;
  scene.add(r1311);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1311", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-500, 255, 30);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1312 = new THREE.Mesh(geometry, material);
  r1312.name = "1312";
  r1312.position.x = -400;
  r1312.position.y = 300;
  scene.add(r1312);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1312", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-300, 260, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1313 = new THREE.Mesh(geometry, material);
  r1313.name = "1313";
  r1313.position.x = -150;
  r1313.position.y = 300;
  scene.add(r1313); /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1313", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-50, 260, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1345 = new THREE.Mesh(geometry, material);
  r1345.name = "1345";
  r1345.position.x = 600;
  r1345.position.y = 300;
  scene.add(r1345);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1345", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(700, 260, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1346 = new THREE.Mesh(geometry, material);
  r1346.name = "1346";
  r1346.position.x = 850;
  r1346.position.y = 300;
  scene.add(r1346);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1346", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(950, 260, 110);
  scene.add(text);
}
function loadFloor4() {
  /*
   * Creating all the rooms for floor 4 on ITC
   */
  geometry = new THREE.BoxGeometry(100, 50, 100);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1406 = new THREE.Mesh(geometry, material);
  r1406.name = "1406";
  r1406.position.x = -500;
  r1406.position.y = 400;
  r1406.position.z = 250;
  scene.add(r1406);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1406", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-400, 355, 300);
  scene.add(text);

  geometry = new THREE.BoxGeometry(100, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1411 = new THREE.Mesh(geometry, material);
  r1411.name = "1411";
  r1411.position.x = -600;
  r1411.position.y = 400;
  scene.add(r1411);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,1)";
  context1.fillText("1411", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-500, 355, 100);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1412 = new THREE.Mesh(geometry, material);
  r1412.name = "1412";
  r1412.position.x = -400;
  r1412.position.y = 400;
  scene.add(r1412);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1412", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-300, 360, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1413 = new THREE.Mesh(geometry, material);
  r1413.name = "1413";
  r1413.position.x = -150;
  r1413.position.y = 400;
  scene.add(r1413);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1413", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(-50, 360, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1445 = new THREE.Mesh(geometry, material);
  r1445.name = "1445";
  r1445.position.x = 600;
  r1445.position.y = 400;
  scene.add(r1445);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1445", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(700, 360, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(200, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0xbfbfbf,
    wireframe: false,
    transparent: true,
    opacity: 0.4
  });
  r1446 = new THREE.Mesh(geometry, material);
  r1446.name = "1446";
  r1446.position.x = 850;
  r1446.position.y = 400;
  scene.add(r1446);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1446", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(950, 360, 110);
  scene.add(text);
}
function loadFloor5() {
  /*
   * Creating all the rooms for floor 5 on ITC
   */
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  geometry = new THREE.BoxGeometry(600, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1515 = new THREE.Mesh(geometry, material);
  r1515.name = "1515";
  r1515.position.x = 200;
  r1515.position.y = 500;
  r1515.position.z = 0;
  scene.add(r1515);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1515", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.position.set(300, 460, 110);
  scene.add(text);

  geometry = new THREE.BoxGeometry(100, 50, 200);
  material = new THREE.MeshLambertMaterial({
    color: 0x00ff00,
    wireframe: false
  });
  r1549 = new THREE.Mesh(geometry, material);
  r1549.name = "1549";
  r1549.position.x = 1000;
  r1549.position.y = 500;
  r1549.position.z = -100;
  scene.add(r1549);
  /////// draw text on canvas /////////
  // create a canvas element
  var canvas1 = document.createElement("canvas");
  var context1 = canvas1.getContext("2d");
  context1.font = "Bold 40px Arial";
  context1.fillStyle = "rgba(255,255,255,0.95)";
  context1.fillText("1549", 0, 50);
  // canvas contents will be used for a texture
  var texture1 = new THREE.Texture(canvas1);
  texture1.needsUpdate = true;
  var material1 = new THREE.MeshBasicMaterial({
    map: texture1,
    side: THREE.DoubleSide
  });
  material1.transparent = true;
  var text = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas1.width, canvas1.height),
    material1
  );
  text.name = "1549";
  text.position.set(1100, 460, 10);
  scene.add(text);
}

// fix camera when window is resized.
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/*****************************
 *           domEvents
 ******************************/
// creates onclick functions for all the rooms.
function setDomEvents() {
  scene.traverse(function(node) {
    if (node instanceof THREE.Mesh) {
      domEvents.addEventListener(
        node,
        "click",
        function() {
          console.log(node.name);
          $("#chosenRoom").html(node.name);
          //rotationSpeedY = 0.02;
          //console.log(node.material.color.setRGB(255255255));
          //node.material.color.setHex(0xFFFFFF);
        },
        false
      );
      node.castShadow = true;
      node.recieveShadow = true;
    }
  });
}

/**************************
 * Drag and move
 * https://jsfiddle.net/MadLittleMods/n6u6asza/
 ***************************/
/* */
function enableDrag() {
  var isDragging = false;
  var previousMousePosition = {
    x: 0,
    y: 0
  };
  $(renderer.domElement)
    .on("mousedown", function(e) {
      isDragging = true;
      console.log("isDragging: " + isDragging);
    })
    .on("mousemove", function(e) {
      //console.log(e);
      var deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };

      if (isDragging) {
        var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            deltaMove.y * 0.2 * (3.14 / 180),
            deltaMove.x * 0.05 * (3.14 / 180),
            0,
            "XYZ"
          )
        );

        scene.quaternion.multiplyQuaternions(
          deltaRotationQuaternion,
          scene.quaternion
        );
      }

      previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
      };
    })
    .on("mouseup", function(e) {
      isDragging = false;
      console.log("isDragging: " + isDragging);
    });
}

function animate() {
  requestAnimationFrame(animate);
  //r1111.rotation.x += 0.01;
  scene.rotation.y += sceneRotation;
  controls.update();
  renderer.render(scene, camera);
}
