// import "./style.scss";
// import "./js/three.js";
// import "./js/OrbitControls.js";
// import "./js/render.js";
function sizeupdate() {
  var fw =
    document.getElementById("data").offsetWidth +
    document.getElementById("chart").offsetWidth -
    5;
  // console.log("FW = "+fw);
  document.getElementById("foot").style.width = `${fw}px`;
  document.getElementById("header").style.width = `${fw}px`;
  //fw+=5;
  document.getElementById("all").style.width = `${fw+10}px`;
}

window.addEventListener("resize", sizeupdate());
window.onload = sizeupdate();
// document.getElementById("header").addEventListener('click', document.location.reload());
document.getElementById("header").onclick = function() {
  document.location.reload();
};
