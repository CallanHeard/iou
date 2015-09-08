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

//Function for loading page content
function dashboard() {
	
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
		var amount	= payments[i].childNodes[2].childNodes[0].nodeValue; //Amount

		//Create new Payment object with details from XML and add to list of payments
		document.getElementById('payments').innerHTML += new Payment(id, name, amount);
			
	}
	
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

//User class
function User(id, firstName, lastName, email) {
	
	//User properties
	this.id				= id;											//ID
	this.firstName		= firstName;									//First name
	this.lastName		= lastName;										//Last name
	this.fullName		= firstName + ' ' + lastName;					//Full name
	this.email			= email;										//Email
	this.profileImage	= 'http://lorempixel.com/40/40/people/?' + id;	//Link to profile image
	
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
function Payment(id, name, amount) {
	
	//Payment properties
	this.id		= id;		//ID
	this.name	= name;		//Name
	this.amount	= amount;	//Amount
	
	//Override object 'toString()' method to generate mark-up
	Payment.prototype.toString = function() {
		
		//Return mark-up for displaying payment
		return '<li><a href="#"><p class="name">' + this.name + '</p><p class="amount">' + this.amount + '</p></a></li>';
		
	}
	
}