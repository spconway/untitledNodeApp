function submitForm() {
  var params = {
  	phone: document.getElementById('phone').value,
  	message: document.getElementById('message').value,
  	date: document.getElementById('date').value
  }
  console.log('params: ', params);

  var http = new XMLHttpRequest();
  if(params.date == "0000-00-00T00:00" || params.date == "" || params.date == null) {
  	http.open("POST", "/home/send", true);
  }else {
  	http.open("POST", "/home/send/queued", true);
  }
  http.setRequestHeader("Content-type","application/json");

  http.onreadystatechange = function() {
    if (http.readyState === 4) {
      console.log(http.response); //Outputs a DOMString by default
      updateStatus(JSON.parse(http.response));
    }
  }
  
  http.send(JSON.stringify(params));
  clearForm();
  return false;
}

function clearForm() {
	document.getElementById('phone').value = '';
	document.getElementById('message').value = '';
	document.getElementById('date').value = '';
}

function updateStatus(data) {
	var message = document.getElementById('messageStatus');
	var messageId = document.getElementById('messageId');
	var error = document.getElementById('error');

	message.innerHTML = data["message"];
	messageId.innerHTML = "Message id: " + data["messageId"];
	error.innerHTML = data["error"];

	console.log('message: ', message);
	console.log('messageId: ', messageId);
	console.log('error: ', error);
}