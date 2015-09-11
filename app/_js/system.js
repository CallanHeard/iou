var user; //User object to be instantiated

//Function for loading generic page content
function loadPage() {
	user = new User(JSON.parse(sessionStorage.user));	//Load user object from session storage
	user.loadProfile();									//Display user profile
}

//Function for loading Dashboard page content
function dashboard() {
	
	//Update owes header
	document.getElementById('owes').childNodes[1].innerHTML += user.get('owes');	//Update owes value
	if (user.owes > 0) {															//Update owes colouring
		document.getElementById('owes').childNodes[1].className = 'negative';		//Update for owing an amount
	}
	else {
		document.getElementById('owes').childNodes[1].className = 'positive';		//Update for not owing anything
	}
	
	//Update owed header
	document.getElementById('owed').childNodes[1].innerHTML += user.get('owed');	//Update owed value
	if (user.owed > 0) {															//Update owes colouring
		document.getElementById('owes').childNodes[1].className = 'positive';		//Update for being owed an amount
	}
	
	//Update balance header
	document.getElementById('balance').childNodes[1].innerHTML += user.balance();	//Update balance value
	if (user.balance() < 0) {														//Update balance colouring
		document.getElementById('balance').childNodes[1].className = 'negative';	//Update for negative balance
	}
	else {
		document.getElementById('balance').childNodes[1].className = 'positive';	//Update for positive balance
	}
	
	xmlhttp = new XMLHttpRequest();											//Create new AJAX request object
	xmlhttp.open("GET","../handle.php?user_payments=" + user.id, false);	//Specify AJAX request
	xmlhttp.send();															//And send
	
	var payments = JSON.parse(xmlhttp.responseText); //Parse returned JSON string into objects

	//Loop through all of the payments
	for (var i=0; i<payments.length; i++) {
		document.getElementById('payments').innerHTML += new Payment(payments[i]); //And create new Payment object from JSON and add to page
	}
	
}