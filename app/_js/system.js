var user; //User object to be instantiated

//Function for handling log-in
function login(id) {
	
	xmlhttp = new XMLHttpRequest();							//Create new AJAX request object
	xmlhttp.open("GET","../handle.php?login=" + id, false);	//Specify AJAX request
	xmlhttp.send();											//And send
	
	parser	= new DOMParser();											//Parser object for parsing XML data
	userXml	= parser.parseFromString(xmlhttp.responseText, "text/xml");	//Parse response string into XML document
	
	//Retrieve user details from XML
	var id			= 'id=' 		+ userXml.getElementsByTagName('id')[0].childNodes[0].nodeValue;		//Get ID
	var firstName	= 'firstName='	+ userXml.getElementsByTagName('firstName')[0].childNodes[0].nodeValue;	//Get first name
	var lastName	= 'lastName='	+ userXml.getElementsByTagName('lastName')[0].childNodes[0].nodeValue;	//Get last name
	var email		= 'email='		+ userXml.getElementsByTagName('email')[0].childNodes[0].nodeValue;		//Get email
	
	document.cookie = id + ',' + firstName + ',' + lastName + ',' + email; //Store details in a cookie
	
}

//Function for loading generic page content
function loadPage() {
	loadUser();			//Load user details from cookie
	user.loadProfile();	//Display user profile
}

//Function for loading user details into an object
function loadUser() {

	var details	= [];							//Array for storing key-value pairings for user properties
	var fields	= document.cookie.split(',');	//Get cookie fields
	
	//Loop through all cookie fields
	for (var i=0; i<fields.length; i++) {
		
		var key		= fields[i].split('=')[0]; //Get key
		var value	= fields[i].split('=')[1]; //Get value
		
		details[key] = value; //Store value in key index
		
	}
	
	//Instantiate User object with details from cookie
	user = new User(details['id'], details['firstName'], details['lastName'], details['email']);
	
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
		var name	= payments[i].childNodes[1].childNodes[0].nodeValue; //Name
		var total	= payments[i].childNodes[2].childNodes[0].nodeValue; //Total
		var portion	= payments[i].childNodes[3].childNodes[0].nodeValue; //Portion

		//Create new Payment object with details from XML and add to list of payments
		document.getElementById('payments').innerHTML += new Payment(id, name, total, portion);
			
	}
	
}

//User class
function User(id, firstName, lastName, email) {
	
	//User properties
	this.id				= id;											//ID
	this.firstName		= firstName;									//First name
	this.lastName		= lastName;										//Last name
	this.fullName		= firstName + ' ' + lastName;					//Full name
	this.email			= email;										//Email
	this.profileImage	= 'http://lorempixel.com/40/40/people/?' + id;	//Link to profile image
	this.owes			= 0;											//How the user owes (default = 0)
	this.owed			= 0;											//How the user is owed (default = 0)
	
	//Method for retrieving and updating owed/owes values from server
	this.get = function(field) {
		
		xmlhttp = new XMLHttpRequest();											//Create new AJAX request object
		xmlhttp.open("GET","../handle.php?" + field + "=" + user.id, false);	//Specify AJAX request
		xmlhttp.send();															//And send
		
		parser	= new DOMParser();											//Parser object for parsing XML data
		result	= parser.parseFromString(xmlhttp.responseText, "text/xml");	//Parse response string into XML document

		//Store result in appropriate property
		switch(field) {
			//Store owes
			case 'owes':
				this.owes = result.childNodes[0].childNodes[0].nodeValue
				break;
			//Store owed
			case 'owed':
				this.owed = result.childNodes[0].childNodes[0].nodeValue
				break;
		}
		
		return result.childNodes[0].childNodes[0].nodeValue; //Return result
		
	}
	
	//Method for calculating and returning user's balance (owed-owes)
	this.balance = function() {
		return this.owed - this.owes; //Calculate and return
	}
	
	//Method for displaying the user's profile
	this.loadProfile = function() {
		
		//Generate profile mark-up
		var profile	 = '<img src="' + this.profileImage + '" alt="' + this.fullName + '"\'s Profile Image"" />';	//Add profile image
		profile		+= '<p>' + this.fullName + '</p>';																//Add name
		profile		+= '<p>' + this.email + '</p>';																	//Add email
		
		document.getElementById('profile').innerHTML = profile; //Add profile mark-up to page
		
	}
	
}

//Payment class
function Payment(id, name, total, portion) {
	
	//Payment properties
	this.id			= id;		//ID
	this.name		= name;		//Name
	this.total		= total;	//Amount
	this.portion	= portion;	//Portion
	
	//Override object 'toString()' method to generate mark-up
	Payment.prototype.toString = function() {
		
		//Return mark-up for displaying payment
		return '<li><a href="#"><p class="name">' + this.name + '</p><p class="portion">' + this.portion + '</p></a></li>';
		
	}
	
}