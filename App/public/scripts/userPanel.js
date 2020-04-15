function openUser(){
  document.getElementById("userPanel").style.left = "0vw";
  document.getElementById("main").style.left = "27vw";
  document.getElementById("toggleUser").setAttribute("onclick", "closeUser()");
}

function closeUser(){
  document.getElementById("userPanel").style.left = "-27vw";
  document.getElementById("main").style.left = "0vw";
  document.getElementById("toggleUser").setAttribute("onclick", "openUser()");
}
