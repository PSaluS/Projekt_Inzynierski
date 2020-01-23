var scena = new THREE.Scene();
var kamera = new THREE.PerspectiveCamera(
  45,
  // window.innerWidth / window.innerHeight,
  document.getElementById("chart").offsetWidth /
    document.getElementById("chart").offsetHeight,
  0.1,
  1000
);

var renderer = new THREE.WebGLRenderer();
// var controls = new THREE.OrbitControls(kamera, renderer.domElement);
// var controls;

function init() {
  kamera.position.z = 6.5;
  // console.log(document.getElementById("chart").offsetWidth);
  // console.log(document.getElementById("chart").offsetHeight);
  // console.log(document.getElementById("data").offsetWidth);
  renderer.setSize(
    document.getElementById("chart").offsetWidth * 0.996,
    document.getElementById("chart").offsetHeight * 0.996
  );
  // renderer.setSize(1198, 536);
  renderer.setClearColor(0xc0c0c0, 1);
  document.getElementById("chart").appendChild(renderer.domElement);
  // if(controls != undefined) {
  //   controls = undefined;
  //   console.log("czyszczenie controls : "+controls);
  // }

  var controls = new THREE.OrbitControls(kamera, renderer.domElement);

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  //controls.minDistance = 100;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2;
}

// var butt = document.getElementById("data_button");
//var rand_butt = document.getElementById("random_button");
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
// var colorTab1 = [
//   "0xff0000",
//   "0x00ff00",
//   "0x0000ff",
//   "0xff00ff",
//   "0x007777",
//   "0x770077",
//   "0x777700",
//   "0x00ffff"
// ];
// var colorTab2 = [
//   "0xff0000",
//   "0xff8800",
//   "0xe5ff00",
//   "0x51ff00",
//   "0x007710",
//   "0x00ffdd",
//   "0x0026ff",
//   "0x7700ff"
// ];
var trash;

menuActiv();

var light = function() {
  var PointLight = new THREE.PointLight(0xffffff, 2, 0);
  var AmbientLight = new THREE.AmbientLight( 0x808080 );
  scena.add(PointLight);
  scena.add(AmbientLight);
  PointLight.position.set(0, 10.0, 15.0);
};

var render = function() {
  requestAnimationFrame(render);
  renderer.render(scena, kamera);
};

function animate() {
  requestAnimationFrame(animate);
  // try{
  controls.update();
  // }
  // catch(err){}
  render();
}

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

function getRandom() {
  return Math.round((Math.random() * 10 + 0.01) * 100) / 100;
}

/*rand_butt.onclick = function () {

        document.getElementById('x0').value = getRandom();
        document.getElementById('y0').value = getRandom();

        document.getElementById('x1').value = getRandom();
        document.getElementById('y1').value = getRandom();

        document.getElementById('x2').value = getRandom();
        document.getElementById('y2').value = getRandom();

        document.getElementById('x3').value = getRandom();
        document.getElementById('y3').value = getRandom();

        document.getElementById('x4').value = getRandom();
        document.getElementById('y4').value = getRandom();

        document.getElementById('x5').value = getRandom();
        document.getElementById('y5').value = getRandom();

        document.getElementById('x6').value = getRandom();
        document.getElementById('y6').value = getRandom();

        document.getElementById('x7').value = getRandom();
        document.getElementById('y7').value = getRandom();
    }*/

setDataTable = function(new_data) {
  document.getElementById("data").innerHTML = new_data;
};

clearTable = function(tab) {
  for (var i = 0; i < tab.length; i++) {
    trash = tab.splice(i, tab.length);
  }
};

charFromCHange = function() {
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

// document.onchange = function() {
//   //document.getElementById("dota_button").addEventListener("click", buttClick());
//   document.getElementById("data_button").onclick = buttClick();
// };

xmlLoad.onchange = function() {
  var uploader = this;
  var reader = new FileReader();
  reader.readAsText(uploader.files[0], "UTF-8");
  reader.onprogress = function(evt) {
    // console.log("Postęp wczytywania", evt);
  };
  reader.onload = function(evt) {
    var xml_data = stringToXML(reader.result);

    dl = ([] = xml_data.documentElement.childNodes).length;
    char_form = xml_data.documentElement.childNodes[0].children.length;
    console.log(char_form);

    charFromCHange();
    //document.getElementById("dota_button").onclick = buttClick();
    //console.log(dl);

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

function buttClick() {
  // for (var i = 0; i < dates.length; i++) {
  //   trash = dates.splice(i, dates.length);
  // }
  init();
  clearTable(dates);
  //console.log(dates);
  for (var i = 0; i < dl; i++) {
    if (char_type == 1)
      dates.push(Math.abs(document.getElementById(`x${i}`).value));
    else dates.push(document.getElementById(`x${i}`).value);

    if (char_form >= 2) {
      if (char_type == 1)
        dates.push(Math.abs(document.getElementById(`y${i}`).value));
      else dates.push(document.getElementById(`y${i}`).value);
    }
    if (char_form == 3) {
      if (char_type == 1)
        dates.push(Math.abs(document.getElementById(`z${i}`).value));
      else dates.push(document.getElementById(`z${i}`).value);
    }
  }
  // console.log("Dates : \n" + dates);
  var max_X = 0;
  var max_Y = 0;
  var max_Z = 0;

  // if (char_type == 1 && char_form == 1 && dates.length > 8) {
  //   let buffx = 0;
  //   for (var i = 8; i < dates.length; i++) {
  //     buffx += dates.pop();
  //   }
  //   dates[7] += buffx;
  // }

  // if (char_type == 2 && char_form == 1 && dates.length > 16) {
  //   let buffx,
  //     buffy = 0;
  //   for (var i = 16; i < dates.length; i++) {
  //     buffy += dates.pop();
  //     buffx += dates.pop();
  //   }
  //   dates[15] += buffy;
  //   dates[14] += buffx;
  // }

  // if (char_type == 3 && char_form == 1 && dates.length > 24) {
  //   let buffx,
  //     buffy,
  //     buffz = 0;
  //   for (var i = 24; i < dates.length; i++) {
  //     buffz += dates.pop();
  //     buffy += dates.pop();
  //     buffx += dates.pop();
  //   }
  //   dates[23] += buffz;
  //   dates[22] += buffy;
  //   dates[21] += buffx;
  // }

  // if (max_X < dates[0]) max_X = dates[0];
  // if (max_X < dates[2]) max_X = dates[2];
  // if (max_X < dates[4]) max_X = dates[4];
  // if (max_X < dates[6]) max_X = dates[6];
  // if (max_X < dates[8]) max_X = dates[8];
  // if (max_X < dates[10]) max_X = dates[10];
  // if (max_X < dates[12]) max_X = dates[12];
  // if (max_X < dates[14]) max_X = dates[14];

  // if (max_Y < dates[1]) max_Y = dates[1];
  // if (max_Y < dates[3]) max_Y = dates[3];
  // if (max_Y < dates[5]) max_Y = dates[5];
  // if (max_Y < dates[7]) max_Y = dates[7];
  // if (max_Y < dates[9]) max_Y = dates[9];
  // if (max_Y < dates[11]) max_Y = dates[11];
  // if (max_Y < dates[13]) max_Y = dates[13];
  // if (max_Y < dates[15]) max_Y = dates[15];

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

  // console.log("max_X : \n" + max_X);
  // console.log("max_Y : \n" + max_Y);
  // console.log("max_Z : \n" + max_Z);

  if (char_type == 1) {
    if (char_form == 1) var mux_X = 5 / max_X;
    if (char_form >= 2) {
      var mux_X = 2 / max_X;
      var mux_Y = 5 / max_Y;
    }
    if (char_form == 3) var mux_Z = 2 / max_Z;
  }

  if (char_type == 2) {
    var mux_X = 7 / max_X;
    if (char_form >= 2) var mux_Y = 7 / max_Y;
    if (char_form == 3) var mux_Z = 7 / max_Z;

    var mux2 = mux_X;
    if (mux_Y < mux2) mux2 = mux_Y;
    if (mux_Z < mux2) mux2 = mux_Z;

    // console.log("mux2 = " + mux2);
  }

  // console.log("mux_X : \n" + mux_X);
  // console.log("mux_Y : \n" + mux_Y);
  // console.log("mux_Z : \n" + mux_Z);

  // var height = [
  //   dates[1] * mux_Y,
  //   dates[3] * mux_Y,
  //   dates[5] * mux_Y,
  //   dates[7] * mux_Y,
  //   dates[9] * mux_Y,
  //   dates[11] * mux_Y,
  //   dates[13] * mux_Y,
  //   dates[15] * mux_Y
  // ];

  // var weight = [
  //   dates[0] * mux_X,
  //   dates[2] * mux_X,
  //   dates[4] * mux_X,
  //   dates[6] * mux_X,
  //   dates[8] * mux_X,
  //   dates[10] * mux_X,
  //   dates[12] * mux_X,
  //   dates[14] * mux_X
  // ];

  clearTable(X);
  clearTable(Y);
  clearTable(Z);

  for (var i = 0; i < dates.length; i++) {
    if (char_type == 1) X.push(dates[i] * mux_X);
    if (char_type == 2) X.push(dates[i] * mux2);
    if (char_form >= 2) {
      i++;
      if (char_type == 1) Y.push(dates[i] * mux_Y);
      if (char_type == 2) Y.push(dates[i] * mux2);
    }
    if (char_form == 3) {
      i++;
      if (char_type == 1) Z.push(dates[i] * mux_Z);
      if (char_type == 2) Z.push(dates[i] * mux2);
    }
  }

  // console.log("X : \n" + X);
  // console.log("Y : \n" + Y);
  // console.log("Z : \n" + Z);

  while (scena.children.length > 0) {
    scena.remove(scena.children[0]);
  }

  if (char_type == 1) {
    var geometriaPlaszczyzny = new THREE.PlaneGeometry(2 + 2 * dl, 3);
    var geometriaPlaszczyzny2 = new THREE.PlaneGeometry(2 + 2 * dl, 5.5);
    var podlogaMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
    var podloga = new THREE.Mesh(geometriaPlaszczyzny, podlogaMaterial);
    var sciana = new THREE.Mesh(geometriaPlaszczyzny2, podlogaMaterial);
    var geometriaosi = new THREE.CylinderGeometry(0.03, 0.03, 2 + 2 * dl, 32);
    var skala = [];
    var materialosi = new THREE.MeshBasicMaterial({ color: 0x00000 });
    scena.add(podloga);
    scena.add(sciana);
    podloga.rotation.x = -Math.PI / 2;
    if (dl > 8) {
      podloga.position.x += dl - 8;
      sciana.position.x += dl - 8;
    }
    // podloga.position.x +=  2;
    // sciana.rotation.x = -Math.PI / 2;
    // sciana.rotation.z = -Math.PI / 2;
    podloga.position.y -= 4;
    sciana.position.y -= 1.5;
    sciana.position.z -= 1.5;

    for (var i = 0; i < 10; i++) {
      skala[i] = new THREE.Mesh(geometriaosi, materialosi);
      scena.add(skala[i]);
      skala[i].rotation.z = -Math.PI / 2;
      skala[i].position.z = -1.5;
      if (dl > 8) skala[i].position.x += dl - 8;
      if (char_form == 1) {
        skala[i].position.y = i * mux_X - 4;
      } else {
        skala[i].position.y = i * mux_Y - 4;
      }
    }
  } else {
    //układ kartezjański
    var geometriaosi = new THREE.CylinderGeometry(0.03, 0.03, 18, 32);
    var geometriaskali = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 32);
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
    if (char_form > 1) {
      for (var i = 0; i < 10; i++) {
        skalax[i] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalax[i]);
        skalax[i].rotation.z = -Math.PI / 2;
        skalax[i].position.x = i * mux2 + mux2;
        skalax[i + 10] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalax[i + 10]);
        skalax[i + 10].rotation.z = -Math.PI / 2;
        skalax[i + 10].position.x = i * mux2 * -1 - mux2;
      }
    }
    osx.rotation.z = -Math.PI / 2;
    if (char_form == 1) {
      skalax[0] = new THREE.Mesh(geometriaskali, materialosi);
      scena.add(skalax[0]);
      skalax[0].rotation.z = -Math.PI / 2;
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
        skalay[i].position.y = i * mux2 + mux2;
        skalay[i + 10] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalay[i + 10]);
        skalay[i + 10].position.y = i * mux2 * -1 - mux2;
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
        skalaz[i].position.z = i * mux2 + mux2;
        skalaz[i + 10] = new THREE.Mesh(geometriaskali, materialosi);
        scena.add(skalaz[i + 10]);
        skalaz[i + 10].rotation.x = -Math.PI / 2;
        skalaz[i + 10].position.z = i * mux2 * -1 - mux2;
      }
    }
  }
  // var geometriaPlaszczyzny = new THREE.PlaneGeometry(18, 3);

  kamera.rotation.x = -Math.PI / 6;
  kamera.position.set(0, 4, 11);

  light();
  render();

  if (char_type == 1) {
    // var geometriaBox0 = new THREE.BoxGeometry(weight[0], height[0], weight[0]);
    // var geometriaBox1 = new THREE.BoxGeometry(weight[1], height[1], weight[1]);
    // var geometriaBox2 = new THREE.BoxGeometry(weight[2], height[2], weight[2]);
    // var geometriaBox3 = new THREE.BoxGeometry(weight[3], height[3], weight[3]);
    // var geometriaBox4 = new THREE.BoxGeometry(weight[4], height[4], weight[4]);
    // var geometriaBox5 = new THREE.BoxGeometry(weight[5], height[5], weight[5]);
    // var geometriaBox6 = new THREE.BoxGeometry(weight[6], height[6], weight[6]);
    // var geometriaBox7 = new THREE.BoxGeometry(weight[7], height[7], weight[7]);

    clearTable(geometriaBox);
    for (var i = 0; i < X.length; i++) {
      if (char_form == 1)
        geometriaBox[i] = new THREE.BoxGeometry(1.5, X[i], 1.5);
      if (char_form == 2)
        geometriaBox[i] = new THREE.BoxGeometry(X[i], Y[i], X[i]);
      if (char_form == 3)
        geometriaBox[i] = new THREE.BoxGeometry(X[i], Y[i], Z[i]);
    }
  }

  if (char_type == 2) {
    // var geometriaBox0 = new THREE.SphereGeometry(0.1, 32, 32);
    // var geometriaBox1 = new THREE.SphereGeometry(0.1, 32, 32);
    // var geometriaBox2 = new THREE.SphereGeometry(0.1, 32, 32);
    // var geometriaBox3 = new THREE.SphereGeometry(0.1, 32, 32);
    // var geometriaBox4 = new THREE.SphereGeometry(0.1, 32, 32);
    // var geometriaBox5 = new THREE.SphereGeometry(0.1, 32, 32);
    // var geometriaBox6 = new THREE.SphereGeometry(0.1, 32, 32);
    // var geometriaBox7 = new THREE.SphereGeometry(0.1, 32, 32);

    clearTable(geometriaBox);
    for (var i = 0; i < X.length; i++)
      geometriaBox[i] = new THREE.SphereGeometry(0.1, 32, 32);
  }

  // console.log("Geometria : \n" + geometriaBox);

  var ic = 0;

  if (char_color == 1) {
    // var BoxMaterial0 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    // var BoxMaterial1 = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    // var BoxMaterial2 = new THREE.MeshPhongMaterial({ color: 0x0000ff });
    // var BoxMaterial3 = new THREE.MeshPhongMaterial({ color: 0xff00ff });
    // var BoxMaterial4 = new THREE.MeshPhongMaterial({ color: 0x007777 });
    // var BoxMaterial5 = new THREE.MeshPhongMaterial({ color: 0x770077 });
    // var BoxMaterial6 = new THREE.MeshPhongMaterial({ color: 0x777700 });
    // var BoxMaterial7 = new THREE.MeshPhongMaterial({ color: 0x00ffff });

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
    // var BoxMaterial0 = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    // var BoxMaterial1 = new THREE.MeshPhongMaterial({ color: 0xff8800 });
    // var BoxMaterial2 = new THREE.MeshPhongMaterial({ color: 0xe5ff00 });
    // var BoxMaterial3 = new THREE.MeshPhongMaterial({ color: 0x51ff00 });
    // var BoxMaterial4 = new THREE.MeshPhongMaterial({ color: 0x007710 });
    // var BoxMaterial5 = new THREE.MeshPhongMaterial({ color: 0x00ffdd });
    // var BoxMaterial6 = new THREE.MeshPhongMaterial({ color: 0x0026ff });
    // var BoxMaterial7 = new THREE.MeshPhongMaterial({ color: 0x7700ff });

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
    // var BoxMaterial0 = new THREE.MeshPhongMaterial({ color: 0x111111 });
    // var BoxMaterial1 = new THREE.MeshPhongMaterial({ color: 0x111111 });
    // var BoxMaterial2 = new THREE.MeshPhongMaterial({ color: 0x111111 });
    // var BoxMaterial3 = new THREE.MeshPhongMaterial({ color: 0x111111 });
    // var BoxMaterial4 = new THREE.MeshPhongMaterial({ color: 0x111111 });
    // var BoxMaterial5 = new THREE.MeshPhongMaterial({ color: 0x111111 });
    // var BoxMaterial6 = new THREE.MeshPhongMaterial({ color: 0x111111 });
    // var BoxMaterial7 = new THREE.MeshPhongMaterial({ color: 0x111111 });

    clearTable(BoxMaterial);
    for (var i = 0; i < 8; i++)
      BoxMaterial[i] = new THREE.MeshPhongMaterial({ color: 0x111111 });
  }

  // console.log("Materiały : \n" + BoxMaterial);

  // var box0 = new THREE.Mesh(geometriaBox0, BoxMaterial0);
  // var box1 = new THREE.Mesh(geometriaBox1, BoxMaterial1);
  // var box2 = new THREE.Mesh(geometriaBox2, BoxMaterial2);
  // var box3 = new THREE.Mesh(geometriaBox3, BoxMaterial3);
  // var box4 = new THREE.Mesh(geometriaBox4, BoxMaterial4);
  // var box5 = new THREE.Mesh(geometriaBox5, BoxMaterial5);
  // var box6 = new THREE.Mesh(geometriaBox6, BoxMaterial6);
  // var box7 = new THREE.Mesh(geometriaBox7, BoxMaterial7);

  clearTable(Boxs);
  var ic = 0;
  for (var i = 0; i < X.length; i++) {
    Boxs[i] = new THREE.Mesh(geometriaBox[i], BoxMaterial[ic]);
    if (ic >= 7) ic = 0;
    else ic++;
  }

  // console.log("BoxY : \n" + Boxs);

  if (char_type == 1) {
    // box0.position.x = -7;
    // box0.position.y = -4 + height[0] / 2;
    // box1.position.x = -5;
    // box1.position.y = -4 + height[1] / 2;
    // box2.position.x = -3;
    // box2.position.y = -4 + height[2] / 2;
    // box3.position.x = -1;
    // box3.position.y = -4 + height[3] / 2;
    // box4.position.x = 1;
    // box4.position.y = -4 + height[4] / 2;
    // box5.position.x = 3;
    // box5.position.y = -4 + height[5] / 2;
    // box6.position.x = 5;
    // box6.position.y = -4 + height[6] / 2;
    // box7.position.x = 7;
    // box7.position.y = -4 + height[7] / 2;
    let pozx = -7;
    for (var i = 0; i < X.length; i++) {
      Boxs[i].position.x = pozx;
      pozx += 2;
      if (Y[i]) Boxs[i].position.y = -4 + Y[i] / 2;
      else Boxs[i].position.y = -4 + X[i] / 2;
    }
  }

  if (char_type == 2) {
    // box0.position.x = weight[0] - 7;
    // box0.position.y = height[0] - 4;
    // box1.position.x = weight[1] - 7;
    // box1.position.y = height[1] - 4;
    // box2.position.x = weight[2] - 7;
    // box2.position.y = height[2] - 4;
    // box3.position.x = weight[3] - 7;
    // box3.position.y = height[3] - 4;
    // box4.position.x = weight[4] - 7;
    // box4.position.y = height[4] - 4;
    // box5.position.x = weight[5] - 7;
    // box5.position.y = height[5] - 4;
    // box6.position.x = weight[6] - 7;
    // box6.position.y = height[6] - 4;
    // box7.position.x = weight[7] - 7;
    // box7.position.y = height[7] - 4;
    //box0.position.x=-6;
    //box0.position.y=-4;

    for (var i = 0; i < X.length; i++) {
      Boxs[i].position.x = X[i];
      if (Y[i]) Boxs[i].position.y = Y[i];
      if (Z[i]) Boxs[i].position.z = Z[i];
    }
  }
  // if (dates[0] > 0 && dates[1] > 0) scena.add(box0);
  // if (dates[2] > 0 && dates[3] > 0) scena.add(box1);
  // if (dates[4] > 0 && dates[5] > 0) scena.add(box2);
  // if (dates[6] > 0 && dates[7] > 0) scena.add(box3);
  // if (dates[8] > 0 && dates[9] > 0) scena.add(box4);
  // if (dates[10] > 0 && dates[11] > 0) scena.add(box5);
  // if (dates[12] > 0 && dates[13] > 0) scena.add(box6);
  // if (dates[14] > 0 && dates[15] > 0) scena.add(box7);

  for (var i = 0; i < X.length; i++) {
    // console.log(Boxs[i].position.x);
    // console.log(Boxs[i].position.y);
    // console.log("x.length = "+X.length);
    scena.add(Boxs[i]);
  }
  animate();
}

function addSlot() {
  dl++;
  charFromCHange();
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

// export * from render.js;
