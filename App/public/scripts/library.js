let checkoutList = [];
let totalPrice = 0;

window.onload= function init(){
  if(checkoutList.length == 0){
    document.getElementById("checkoutButton").disabled = true;
  }
}

function search(){
  let type = document.getElementById("searchType").value;
  let search = document.getElementById('searchInput').value;
  window.location.href="/library?"+type+"="+search
}

function addOrder(id){
  let title = document.getElementById(id+"-title").firstElementChild.innerHTML;
  let price = document.getElementById(id+"-price").innerHTML.replace("$", "");
  let include = 0;
  checkoutList.forEach((item, i) => {
    if(item.id === id){
      include = 1;
    }
  });
  if(include === 1){
    checkoutList.forEach((item, i) => {
      if(item.id === id){
        item.quantity ++;
      }
    });
  }else{
    checkoutList.push({"id": id, "title": title, "price": price, "quantity": 1})
  }

  document.getElementById("checkoutButton").disabled = false;

  while(document.getElementById("checkoutItems").firstElementChild){
    document.getElementById("checkoutItems").removeChild(document.getElementById("checkoutItems").firstElementChild)
  }
  totalPrice = 0;


  checkoutList.forEach((item, i) => {
    let checkoutItemTable = document.createElement('table');
    checkoutItemTable.className = "checkoutItemTable";
    let tr1 = document.createElement('tr');
    let tdTitle = document.createElement('td')
    tdTitle.className = "checkoutName";
    tdTitle.innerHTML = item.title;
    let tdPrice = document.createElement('td')
    tdPrice.className = "checkoutPrice";
    tdPrice.innerHTML = "$"+item.price;
    tdPrice.style.float = "right";
    tr1.appendChild(tdTitle);
    tr1.appendChild(tdPrice);
    let tr2 = document.createElement('tr');
    let tdQuantity = document.createElement('td')
    tdQuantity.className = "checkoutQuantity";
    tdQuantity.innerHTML = "Quantity: " +item.quantity;
    let tdButton = document.createElement('button')
    tdButton.innerHTML = "-";
    tdButton.id = "removeButton"
    tdButton.style.float = "right";
    tr2.appendChild(tdQuantity);
    tr2.appendChild(tdButton);
    checkoutItemTable.appendChild(tr1)
    checkoutItemTable.appendChild(tr2)
    document.getElementById("checkoutItems").appendChild(checkoutItemTable)

    totalPrice += Number(item.price * item.quantity)

  });

  document.getElementById("totalPrice").innerHTML = "$"+Number(totalPrice).toFixed(2);


  console.log(checkoutList)
}

function submit(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

        while(document.getElementById("checkoutItems").firstElementChild){
          document.getElementById("checkoutItems").removeChild(document.getElementById("checkoutItems").firstElementChild)
        }
        document.getElementById("totalPrice").innerHTML = "";
        checkoutList = [];
        totalPrice = 0;
        window.location.href = (this.responseURL);

    }
};

xhttp.open("POST", "/submit", true);
xhttp.setRequestHeader("Content-Type", "application/json");
xhttp.send(JSON.stringify({"order": checkoutList, "total": totalPrice}));
}
