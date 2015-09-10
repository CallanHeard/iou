//User prototype definition
User.prototype = {
	
	loadUser: function(json) {
		return new this(json);
	},
	
	owes: 0, //How much the user owes (Used in balance function to reduce server requests)
	owed: 0, //How much the user is owed (Used in balance function to reduce server requests)
	
	//Method for retrieving and updating owed/owes values from server
	get: function(field) {
		
		xmlhttp = new XMLHttpRequest();											//Create new AJAX request object
		xmlhttp.open("GET","../handle.php?" + field + "=" + user.id, false);	//Specify AJAX request
		xmlhttp.send();															//And send
		
		parser	= new DOMParser();											//Parser object for parsing XML data
		result	= parser.parseFromString(xmlhttp.responseText, "text/xml");	//Parse response string into XML document

		//Store result in appropriate property
		switch(field) {
			//Store owes
			case 'owes':
				this.owes = result.childNodes[0].childNodes[0].nodeValue;
				break;
			//Store owed
			case 'owed':
				this.owed = result.childNodes[0].childNodes[0].nodeValue;
				break;
		}
		
		return result.childNodes[0].childNodes[0].nodeValue; //Return result
		
	},
		
	//Method for calculating and returning user's balance (owed-owes)
	balance: function() {
		return this.owed - this.owes; //Calculate and return
	},
	
	//Method for displaying the user's profile
	loadProfile: function() {
		
		//Generate profile mark-up
		var profile	 = '<img src="' + this.profileImage + '" alt="' + this.fullName + '"\'s Profile Image"" />';	//Add profile image
		profile		+= '<p>' + this.fullName + '</p>';																//Add name
		profile		+= '<p>' + this.email + '</p>';																	//Add email
		
		document.getElementById('profile').innerHTML = profile; //Add profile mark-up to page
		
	}
	
}

//User class
function User(json) {
	
	//User properties
	this.id				= json['id'];											//Initialise ID
	this.firstName		= json['first_name'];									//Initialise first name
	this.lastName		= json['last_name'];									//Initialise last name
	this.fullName		= json['first_name'] + ' ' + json['last_name'];			//Initialise full name
	this.email			= json['email'];										//Initialise email
	this.profileImage	= 'http://lorempixel.com/40/40/people/?' + json['id'];	//Initialise link to profile image
	
}

//Payment class
function Payment(id, hostId, name, total, portion) {
	
	//Payment properties
	this.id			= id;												//ID
	this.hostId		= hostId;											//Host ID
	this.name		= name;												//Name
	this.total		= total;											//Amount
	this.portion	= portion;											//Portion
	this.image		= 'http://lorempixel.com/40/40/people/?' + hostId;	//Link to payment image (host's)
	
	//Override object 'toString()' method to generate mark-up
	Payment.prototype.toString = function() {
		
		//Return mark-up for displaying payment
		return '<li><img src="' + this.image + '" alt"Payment ' + this.id + ' Image" /><a href="#"><p class="name">' + this.name + '</p><p class="portion">' + this.portion + '</p></a></li>';
		
	}
	
}