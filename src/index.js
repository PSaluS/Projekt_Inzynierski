import "./style.scss";
function sizeupdate() {
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
