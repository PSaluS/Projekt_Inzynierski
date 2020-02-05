import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

var scena = new THREE.Scene();
var kamera = new THREE.PerspectiveCamera(
  45,
  document.getElementById("chart").offsetWidth /
  document.getElementById("chart").offsetHeight,
  0.1,
  1000
);
var renderer = new THREE.WebGLRenderer();
var labelRenderer = new CSS2DRenderer();

function init() {
  kamera.position.z = 6.5;
  renderer.setSize(
    document.getElementById("chart").offsetWidth * 0.996,
    document.getElementById("chart").offsetHeight * 0.996
  );
  renderer.setClearColor(0xc0c0c0, 1);
  document.getElementById("chart").appendChild(renderer.domElement);

  labelRenderer.setSize(document.getElementById("chart").offsetWidth * 0.996, document.getElementById("chart").offsetHeight * 0.996);
  labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = 0;
	document.getElementById('chart').appendChild(labelRenderer.domElement);

  var controls = new OrbitControls(kamera, labelRenderer.domElement);

  mouse = new THREE.Vector2()
}
var xmlLoad = document.getElementById("xmlload");
var char_type = 1;
var char_color = 1;
var char_form = 3;
var dates = [];
var geometriaBox = [];
var BoxMaterial = [];
var Boxs = [];
var X = [];
var Y = [];
var Z = [];
var dateX = [], dateY = [], dateZ =[];
var trash;
var mouse;
var text;
var label;
var labelVisibility = [];

menuActiv();

var light = function() {
  var AmbientLight = new THREE.AmbientLight(0xffffff, 0.4);
  var DirectionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  DirectionalLight.position.set(1,5,5);
  scena.add(DirectionalLight);
  scena.add(AmbientLight);
};

var render = function() {
  requestAnimationFrame(render);
  renderer.render(scena, kamera);
  labelRenderer.render(scena,kamera);
};

var dl = 8;

function stringToXML(text) {
  try {
    var xml = null;

    var parser = new DOMParser();
    xml = parser.parseFromString(text, "text/xml");

    var foundErr = xml.getElementsByTagName("parsererror");

    if (!foundErr || !foundErr.length || !foundErr[0].childNodes.length) {
      return xml;
    }
    return null;
  } catch (e) {}
}

function clearTable(tab) {
  if(tab.length > 0) {
  for (var i = 0; i < tab.length; i++) {
    trash = tab.splice(i, tab.length);
  }
}
};

function charFromCHange() {
  var new_data = `<form action=" ">
      `;
  for (var i = 0; i < dl; i++) {
    if (char_form == 3) {
      new_data += `<div class="data_el">
          <input type="number" name="x${i}" id="x${i}">
          <input type="number" name="y${i}" id="y${i}">
          <input type="number" name="z${i}" id="z${i}">
      </div>`;
    }
    if (char_form == 2) {
      new_data += `<div class="data_el">
          <input type="number" name="x${i}" id="x${i}">
          <input type="number" name="y${i}" id="y${i}">
      </div>`;
    }
    if (char_form == 1) {
      new_data += `<div class="data_el">
          <input type="number" name="x${i}" id="x${i}"">
      </div>`;
    }
  }
  new_data += `<div class="data_el">
      <button id="data_button" type="button">Wygeneruj wykres</button>
      <button id="add_slot" type="button">Dodaj wiersz</button>
  </div>
  </form>`;

  document.getElementById("data").innerHTML = new_data;
  document.getElementById("data_button").onclick = buttClick;
  document.getElementById("add_slot").onclick = addSlot;
};

xmlLoad.onchange = function () {
  var uploader = this;
  var reader = new FileReader();
  reader.readAsText(uploader.files[0], "UTF-8");
  reader.onprogress = function(evt) {};
  reader.onload = function(evt) {
    var xml_data = stringToXML(reader.result);

    dl = ([] = xml_data.documentElement.childNodes).length;
    char_form = xml_data.documentElement.childNodes[0].children.length;

    charFromCHange();

    for (var i = 0; i < dl; i++) {
      document.getElementById(`x${i}`).value =
        xml_data.documentElement.childNodes[
          i
        ].childNodes[0].firstChild.nodeValue;
    }
    if (char_form >= 2) {
      for (var i = 0; i < dl; i++) {
        document.getElementById(`y${i}`).value =
          xml_data.documentElement.childNodes[
            i
          ].childNodes[1].firstChild.nodeValue;
      }
    }
    if (char_form >= 3) {
      for (var i = 0; i < dl; i++) {
        document.getElementById(`z${i}`).value =
          xml_data.documentElement.childNodes[
            i
          ].childNodes[2].firstChild.nodeValue;
      }
    }
  };
  reader.onerror = function(evt) {
    alert("Błąd wczytywania pliku!");
  };
};

function MouseClickDown(event) {
	mouse.x = ( (event.clientX - document.getElementById('chart').offsetLeft) / document.getElementById('chart').offsetWidth ) * 2 - 1;
  mouse.y = - ( (event.clientY - document.getElementById('chart').offsetTop)/ document.getElementById('chart').offsetHeight ) * 2 + 1;
  let ray = new THREE.Raycaster();
  ray.setFromCamera( mouse, kamera );
  var intersects = ray.intersectObjects(Boxs);
  if ( intersects.length > 0 ) {
    showLabel(Number(intersects[0].object.name));
  }
}

function buttClick() {
  init();
  clearTable(dates);
  clearTable(dateX);
  clearTable(dateY);
  clearTable(dateZ);
  for (var i = 0; i < dl; i++) {
    if (char_type == 1) {
      dates.push(Math.abs(document.getElementById(`x${i}`).value));
      dateX.push(Math.abs(document.getElementById(`x${i}`).value));
    }
    else {
       dates.push(document.getElementById(`x${i}`).value);
       dateX.push(document.getElementById(`x${i}`).value);
    }
    if (char_form >= 2) {
      if (char_type == 1) {
        dates.push(Math.abs(document.getElementById(`y${i}`).value));
        dateY.push(Math.abs(document.getElementById(`y${i}`).value));
      }
      else {
        dates.push(document.getElementById(`y${i}`).value);
        dateY.push(document.getElementById(`y${i}`).value);
      }
    }
    if (char_form == 3) {
      if (char_type == 1) {
        dates.push(Math.abs(document.getElementById(`z${i}`).value));
        dateZ.push(Math.abs(document.getElementById(`z${i}`).value));
      }
      else {
        dates.push(document.getElementById(`z${i}`).value);
        dateZ.push(document.getElementById(`z${i}`).value);
      }
    }
  }
  var max_X = 0;
  var max_Y = 0;
  var max_Z = 0;

  for (var i = 0; i < dates.length; i++) {
    if (char_type == 1) {
      if (dates[i] > max_X) max_X = Number(dates[i]);

      if (char_form >= 2) {
        i++;
        if (dates[i] > max_Y) max_Y = Number(dates[i]);
      }
      if (char_form == 3) {
        i++;
        if (dates[i] > max_Z) max_Z = Number(dates[i]);
      }
    }
    if (char_type == 2) {
      if (Math.abs(dates[i]) > max_X) max_X = Math.abs(Number(dates[i]));
      if (char_form >= 2) {
        i++;
        if (Math.abs(dates[i]) > max_Y) max_Y = Math.abs(Number(dates[i]));
      }
      if (char_form == 3) {
        i++;
        if (Math.abs(dates[i]) > max_Z) max_Z = Math.abs(Number(dates[i]));
      }
    }
  }

  if (char_type == 1) {
    if (char_form == 1) var mux_X = 5 / max_X;
    if (char_form >= 2) {
      var mux_X = 5 / max_X;
      var mux_Y = 5 / max_Y;
    }
    if (char_form == 3) var mux_Z = 5 / max_Z;
  }

  if (char_type == 2) {
    var mux_X = 7 / max_X;
    if (char_form >= 2) var mux_Y = 7 / max_Y;
    if (char_form == 3) var mux_Z = 7 / max_Z;
  }
    var mux2 = mux_X;
    if (mux_Y < mux2) mux2 = mux_Y;
    if (mux_Z < mux2) mux2 = mux_Z;

  clearTable(X);
  clearTable(Y);
  clearTable(Z);

  for (var i = 0; i < dates.length; i++) {
      X.push(dates[i] * mux2);
    if (char_form >= 2) {
      i++;
      Y.push(dates[i] * mux2);
    }
    if (char_form == 3) {
      i++;
       Z.push(dates[i] * mux2);
    }
  }

  while (scena.children.length > 0) {
    scena.remove(scena.children[0]);
  }

  if (char_type == 1) {
    var skala = [];
    var skala2 = [];
    var skala3 = [];
    var skala4 = [];
    var geometriaPlaszczyzny = new THREE.PlaneGeometry(5 * dl, 5.5);
    var geometriaPlaszczyzny2 = new THREE.PlaneGeometry(5 * dl, 5.5);
    var podlogaMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    var podloga = new THREE.Mesh(geometriaPlaszczyzny, podlogaMaterial);
    var sciana = new THREE.Mesh(geometriaPlaszczyzny2, podlogaMaterial);
    var geometriaosi = new THREE.CylinderGeometry(0.03, 0.03, 5 * dl, 32);
    var geometriaosi2 = new THREE.CylinderGeometry(0.03, 0.03, 5.5, 32);
    var materialosi = new THREE.MeshBasicMaterial({ color: 0x00000 });
    var materialosi2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
    scena.add(podloga);
    scena.add(sciana);
    podloga.rotation.x = -Math.PI / 2;
    podloga.position.x += -2.5 + (dl * 2.5);
    sciana.position.x += -2.5 + (dl * 2.5);
    podloga.position.y -= 4;
    sciana.position.y -= 1.25;
    sciana.position.z -=  2.75;

    for (var i = 0; i < 11; i++) {
      skala[i] = new THREE.Mesh(geometriaosi, materialosi);
      scena.add(skala[i]);
      skala[i].rotation.z = -Math.PI / 2;
      skala[i].position.z = -2.75;
      skala[i].position.y = i * 0.5 - 4;
      skala[i].position.x += -2.5 + (dl * 2.5);

      skala2[i] = new THREE.Mesh(geometriaosi, materialosi);
      scena.add(skala2[i]);
      skala2[i].rotation.z = -Math.PI / 2;
      skala2[i].position.z = i * 0.5 - 2.75;
      skala2[i].position.y = -4;
      skala2[i].position.x += -2.5 + (dl * 2.5);
    }
    for(var i = 0; i < (10*dl)+1; i++) {
      if(i%10 == 0) {
        skala3[i]= new THREE.Mesh(geometriaosi2, materialosi2);
        skala4[i]= new THREE.Mesh(geometriaosi2, materialosi2);
      }
      else {
        skala3[i]= new THREE.Mesh(geometriaosi2, materialosi);
        skala4[i]= new THREE.Mesh(geometriaosi2, materialosi);
      }
      scena.add(skala3[i]);
      skala3[i].position.z = -2.75;
      skala3[i].position.x = -2.5 + (0.5*i);
      skala3[i].position.y = -1.25;

      scena.add(skala4[i]);
      skala4[i].rotation.x= -Math.PI / 2;
      skala4[i].position.y = -4;
      skala4[i].position.x = -2.5 + (0.5*i);
    }
  } else {
    //układ kartezjański
    var geometriaosi = new THREE.CylinderGeometry(0.03, 0.03, 18, 32);
    var geometriaskali = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 32);
    var geometriastrzaly = new THREE.CylinderGeometry(0.001, 0.1, 0.5, 32);
    var materialosi = new THREE.MeshBasicMaterial({ color: 0x00000 });
    var osx = new THREE.Mesh(geometriaosi, materialosi);
    var arrowx = new THREE.Mesh(geometriastrzaly, materialosi);
    var skalax = [];
    var skalay = [];
    var skalaz = [];
    scena.add(osx);
    scena.add(arrowx);
    arrowx.rotation.z = -Math.PI / 2;
    arrowx.position.x = 9;
    if (char_form >= 1) {
      for (var i = 0; i < 10; i++) {
        skalax[i] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalax[i]);
        skalax[i].rotation.z = -Math.PI / 2;
        skalax[i].position.x = i * (7 / 10) + 7 / 10;
        skalax[i + 10] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalax[i + 10]);
        skalax[i + 10].rotation.z = -Math.PI / 2;
        skalax[i + 10].position.x = (i * (7 / 10) + 7 / 10) * -1;
      }
    }
    osx.rotation.z = -Math.PI / 2;
    if (char_form == 1) {
      var geometriaskaliC = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32);
      var skalaZero = new THREE.Mesh(geometriaskaliC, materialosi);
      scena.add(skalaZero);
      skalaZero.rotation.z = -Math.PI / 2;
    }
    if (char_form >= 2) {
      var osy = new THREE.Mesh(geometriaosi, materialosi);
      var arrowx = new THREE.Mesh(geometriastrzaly, materialosi);
      scena.add(osy);
      scena.add(arrowx);
      arrowx.position.y = 9;

      for (var i = 0; i < 10; i++) {
        skalay[i] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalay[i]);
        skalay[i].position.y = i * (7 / 10) + 7 / 10;
        skalay[i + 10] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalay[i + 10]);
        skalay[i + 10].position.y = (i * (7 / 10) + 7 / 10) * -1;
      }
    }
    if (char_form == 3) {
      var osz = new THREE.Mesh(geometriaosi, materialosi);
      var arrowx = new THREE.Mesh(geometriastrzaly, materialosi);
      scena.add(osz);
      osz.rotation.x = -Math.PI / 2;
      scena.add(arrowx);
      arrowx.rotation.x = Math.PI / 2;
      arrowx.position.z = 9;

      for (var i = 0; i < 10; i++) {
        skalaz[i] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalaz[i]);
        skalaz[i].rotation.x = -Math.PI / 2;
        skalaz[i].position.z = i * (7 / 10) + 7 / 10;
        skalaz[i + 10] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalaz[i + 10]);
        skalaz[i + 10].rotation.x = -Math.PI / 2;
        skalaz[i + 10].position.z = (i * (7 / 10) + 7 / 10) * -1;
      }
    }
  }

  kamera.rotation.x = -Math.PI / 6;
  kamera.position.set(0, 4, 11);

  light();

  if (char_type == 1) {
    clearTable(geometriaBox);
    for (var i = 0; i < X.length; i++) {
      if (char_form == 1)
        geometriaBox[i] = new THREE.BoxGeometry(3, X[i], 3);
      if (char_form == 2)
        geometriaBox[i] = new THREE.BoxGeometry(X[i], Y[i], X[i]);
      if (char_form == 3)
        geometriaBox[i] = new THREE.BoxGeometry(X[i], Y[i], Z[i]);
    }
  }

  if (char_type == 2) {
    clearTable(geometriaBox);
    for (var i = 0; i < X.length; i++)
      geometriaBox[i] = new THREE.SphereGeometry(0.1, 32, 32);
  }

  var ic = 0;

  if (char_color == 1) {
    clearTable(BoxMaterial);
    for (var i = 0; i < 8; i++)
      switch (ic) {
        case 0:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0xff0000 });
          ic++;
          break;
        case 1:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
          ic++;
          break;
        case 2:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x0000ff });
          ic++;
          break;
        case 3:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0xff00ff });
          ic++;
          break;
        case 4:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x007777 });
          ic++;
          break;
        case 5:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x770077 });
          ic++;
          break;
        case 6:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x777700 });
          ic++;
          break;
        case 7:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x00ffff });
          ic++;
          break;
      }
    if (ic == 7) ic = 0;
  }

  if (char_color == 2) {
    clearTable(BoxMaterial);
    for (var i = 0; i < 8; i++)
      switch (ic) {
        case 0:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0xff0000 });
          ic++;
          break;
        case 1:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0xff8800 });
          ic++;
          break;
        case 2:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0xe5ff00 });
          ic++;
          break;
        case 3:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x51ff00 });
          ic++;
          break;
        case 4:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x007710 });
          ic++;
          break;
        case 5:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x00ffdd });
          ic++;
          break;
        case 6:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x0026ff });
          ic++;
          break;
        case 7:
          BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x7700ff });
          ic++;
          break;
      }
    if (ic >= 7) ic = 0;
  }

  if (char_color == 3) {
    clearTable(BoxMaterial);
    for (var i = 0; i < 8; i++)
      BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x111111 });
  }

  clearTable(Boxs);
  var ic = 0;
  for (var i = 0; i < X.length; i++) {
    Boxs[i] = new THREE.Mesh(geometriaBox[i], BoxMaterial[ic]);
    Boxs[i].name = i;
    labelVisibility[i] = 0;
    if (ic >= 7) ic = 0;
    else ic++;
  }

  if (char_type == 1) {
    let pozx = -2.5;
    let pozz = -2.75;
    for (var i = 0; i < X.length; i++) {
      if(char_form > 1)
      Boxs[i].position.x = pozx + (X[i]/2);
      else
      Boxs[i].position.x = pozx + 1.5;
      if(char_form == 3) {
      Boxs[i].position.z = pozz + (Z[i]/2);
      }
      if(char_form == 2) {
        Boxs[i].position.z = pozz + (X[i]/2);
      }
      if(char_form == 1) {
        Boxs[i].position.z = pozz + 1.5;
      }
      pozx += 5;
      if (Y[i]) Boxs[i].position.y = -4 + Y[i] / 2;
      else Boxs[i].position.y = -4 + X[i] / 2;
    }
  }

  if (char_type == 2) {
    for (var i = 0; i < X.length; i++) {
      Boxs[i].position.x = X[i];
      if (Y[i]) Boxs[i].position.y = Y[i];
      if (Z[i]) Boxs[i].position.z = Z[i];
    }
  }

  for (var i = 0; i < X.length; i++) {
    scena.add(Boxs[i]);
  }

  document.addEventListener( 'mousedown', MouseClickDown, false );
  render();
}

function showLabel(obj) {
  if(labelVisibility[obj] == 0)
  {
  text = document.createElement('div');
  text.className ='label';
  text.remove('labelH');
  text.style.color = 'white';

  if(char_form == 3)
  text.textContent = `${dateX[obj]} ${dateY[obj]} ${dateZ[obj]}`;

  if(char_form == 2)
  text.textContent = `${dateX[obj]} ${dateY[obj]}`;

  if(char_form == 1)
  text.textContent = `${dateX[obj]}`;

  label = new CSS2DObject(text);
  label.position.set(0,0,0);
  Boxs[obj].add(label);

  labelVisibility[obj] = 1;
  }

  else
  {
    text.className = "labelH";
    labelVisibility[obj] = 0;
    label.remove();
  }
}

function addSlot() {
  dl++;
  charFromCHange();
}

function keyPutDown (event) {
  const keyCode = event.which;
  const arrDash = 5;
  switch (keyCode) {
    case(39):
    kamera.position.x += arrDash;
    break;
    case(37):
    kamera.position.x += (-arrDash);
    break;
    case(38):
    kamera.position.z += (-arrDash);
    break;
    case(40):
    kamera.position.z +=arrDash2;
    break;
  }
  }

function menuActiv() {
  document.getElementById("chart1").classList.remove("menuActive");
  document.getElementById("chart2").classList.remove("menuActive");
  document.getElementById("color1").classList.remove("menuActive");
  document.getElementById("color2").classList.remove("menuActive");
  document.getElementById("color3").classList.remove("menuActive");
  document.getElementById("color4").classList.remove("menuActive");
  document.getElementById("form1").classList.remove("menuActive");
  document.getElementById("form2").classList.remove("menuActive");
  document.getElementById("form3").classList.remove("menuActive");

  document.getElementById(`chart${char_type}`).classList.add("menuActive");
  document.getElementById(`color${char_color}`).classList.add("menuActive");
  document.getElementById(`form${char_form}`).classList.add("menuActive");
}

document.getElementById("data_button").onclick = buttClick;

document.getElementById("chart1").onclick = function() {
  char_type = 1;
  menuActiv();
};
document.getElementById("chart2").onclick = function() {
  char_type = 2;
  menuActiv();
};
document.getElementById("color1").onclick = function() {
  char_color = 1;
  menuActiv();
};
document.getElementById("color2").onclick = function() {
  char_color = 2;
  menuActiv();
};
document.getElementById("color3").onclick = function() {
  char_color = 3;
  menuActiv();
};
document.getElementById("color4").onclick = function() {
  char_color = 4;
  menuActiv();
};
document.getElementById("form1").onclick = function() {
  char_form = 1;
  charFromCHange();
  menuActiv();
};
document.getElementById("form2").onclick = function() {
  char_form = 2;
  charFromCHange();
  menuActiv();
};
document.getElementById("form3").onclick = function() {
  char_form = 3;
  charFromCHange();
  menuActiv();
};
document.getElementById("add_slot").onclick = addSlot;
document.addEventListener("keydown", keyPutDown, flase);