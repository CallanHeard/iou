var user; //User object to be instantiated

//Function for handling log-in
function login(id) {
	
	xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
	
	xmlhttp.open("GET","../handle.php?login=" + id, false);	//Specify AJAX request
	xmlhttp.send();											//And send
	
	parser	= new DOMParser();
	userXml	= parser.parseFromString(xmlhttp.responseText, "text/xml");
	
	//Retrieve user details from XML
	var id			= 'id=' 		+ userXml.getElementsByTagName('id')[0].childNodes[0].nodeValue;		//Get ID
	var firstName	= 'firstName='	+ userXml.getElementsByTagName('firstName')[0].childNodes[0].nodeValue;	//Get first name
	var lastName	= 'lastName='	+ userXml.getElementsByTagName('lastName')[0].childNodes[0].nodeValue;	//Get last name
	var email		= 'email='		+ userXml.getElementsByTagName('email')[0].childNodes[0].nodeValue;		//Get email
	
	document.cookie = id + ',' + firstName + ',' + lastName + ',' + email; //Store details in a cookie
	
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
	
	updatePage(); //Update page with user details
	
}

//Function for updating page with user details
function updatePage() {

	//Update profile details
	document.getElementById('profile').childNodes[1].src		= user.profileImage	//Update profile image
	document.getElementById('profile').childNodes[3].innerHTML	= user.fullName;	//Update name
	document.getElementById('profile').childNodes[5].innerHTML	= user.email;		//Update email
	
}

//User class
function User(id, firstName, lastName, email) {
	
	this.id				= id;
	this.firstName		= firstName;
	this.lastName		= lastName;
	this.fullName		= firstName + ' ' + lastName;
	this.email			= email;
	this.profileImage	= 'http://lorempixel.com/40/40/people/?' + id;
	
}