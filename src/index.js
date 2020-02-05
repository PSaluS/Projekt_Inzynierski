import "./style.scss";
function sizeupdate() {
  var charh = window.innerHeight;
  charh = charh - document.getElementById("header").offsetHeight;
  charh = charh - document.getElementById("menu").offsetHeight;
  charh = charh - document.getElementById("foot").innerHeight;
  document.getElementById("chart").style.height = `${charh}px`;
  document.getElementById("data").style.maxHeight = `${charh}px`;
  var topm = document.getElementById('menu').offsetHeight + 6;
  document.getElementById("main").style.marginTop = `${topm}px`;
  var fw =
    document.getElementById("data").offsetWidth +
    document.getElementById("chart").offsetWidth -
    5;
  document.getElementById("foot").style.width = `${fw}px`;
  document.getElementById("header").style.width = `${fw}px`;
  document.getElementById("all").style.width = `${fw+10}px`;
}

window.addEventListener("resize", sizeupdate());
window.onload = sizeupdate();
document.getElementById("header").onclick = function() {
  document.location.reload();
};
