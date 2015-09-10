var user; //User object to be instantiated

//Function for loading generic page content
function loadPage() {
	user = new User(JSON.parse(document.cookie.split('=')[1])); //Load user object from cookie
	user.loadProfile();											//Display user profile
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
	
	xmlhttp = new XMLHttpRequest();									//Create new AJAX request object
	xmlhttp.open("GET","../handle.php?payments=" + user.id, false);	//Specify AJAX request
	xmlhttp.send();													//And send
		
	parser		= new DOMParser();											//Parser object for parsing XML data
	paymentsXml	= parser.parseFromString(xmlhttp.responseText, "text/xml");	//Parse response string into XML document

	var payments = paymentsXml.getElementsByTagName('payment'); //Get payment elements from XML document
	
	//Loop through payment elements
	for (var i=0; i<payments.length; i++) {
		
		//Get payment details
		var id		= payments[i].childNodes[0].childNodes[0].nodeValue; //ID
		var hostId	= payments[i].childNodes[1].childNodes[0].nodeValue; //Host ID
		var name	= payments[i].childNodes[2].childNodes[0].nodeValue; //Name
		var total	= payments[i].childNodes[3].childNodes[0].nodeValue; //Total
		var portion	= payments[i].childNodes[4].childNodes[0].nodeValue; //Portion

		//Create new Payment object with details from XML and add to list of payments
		document.getElementById('payments').innerHTML += new Payment(id, hostId, name, total, portion);
			
	}
	
}