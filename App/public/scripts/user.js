function showRegister(){
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("buttonRegister").style.display = "none";
  document.getElementById("buttonLogin").style.display = "inline-block";
}

function showLogin(){
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("buttonRegister").style.display = "inline-block";
  document.getElementById("buttonLogin").style.display = "none";
}

function setTrue(id) {
  document.getElementById('save').value=true;
  document.getElementById(id).style.background = "#87C78A";
  document.getElementById(id).style.color = "black";
  document.getElementById('privacyFalse').style.background = "#38404D";
  document.getElementById('privacyFalse').style.color = "#f2f2f2";
}

function setFalse(id) {
  document.getElementById('save').value=false;
  document.getElementById(id).style.background = "#87C78A";
  document.getElementById(id).style.color = "black";
  document.getElementById('privacyTrue').style.background = "#38404D";
  document.getElementById('privacyTrue').style.color = "#f2f2f2";
}

function register(){
  let username = document.getElementById("registerUsername").value;
  let password = document.getElementById("registerPassword").value;
  let first_name = document.getElementById("inputFirst_name").value;
  let last_name = document.getElementById("inputLast_name").value;
  let phone_number = document.getElementById('inputPhone_number').value;
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 403) {
      alert(this.responseText)
      return;
    }else if(this.status == 200){
      window.location.replace(this.responseURL);
    }
  };
  xhttp.open("POST", "/register", true);
  xhttp.setRequestHeader('content-type', 'application/json');
  xhttp.send(JSON.stringify({"username":username, "password": password, "first_name":first_name, "last_name": last_name, "phone_number":phone_number}));
}
