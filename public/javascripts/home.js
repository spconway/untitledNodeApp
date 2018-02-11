function submitForm() {
    var http = new XMLHttpRequest();
    http.open("POST", "/home/send", true);
    http.setRequestHeader("Content-type","application/json");
    var params = {
    	phone: document.getElementById('phone').value,
    	message: document.getElementById('message').value
    }
    console.log('params: ', params);
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