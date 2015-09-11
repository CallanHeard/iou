//User prototype definition
User.prototype = {
	
	loadUser: function(json) {
		return new this(json);
	},
	
	owes: 0, //How much the user owes (stored and used in balance function to reduce server requests)
	owed: 0, //How much the user is owed (stored and used in balance function to reduce server requests)
	
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

	for (var property in json) this[sanitise(property)] = json[property]; //Initialise object from JSON
	
	this.fullName		= this.firstName + ' ' + this.lastName;				//Initialise full name
	this.profileImage	= 'http://lorempixel.com/40/40/people/?' + this.id;	//Initialise link to profile image
	
}

//Payment class
function Payment(json) {
	
	for (var property in json) this[sanitise(property)] = json[property]; //Initialise object from JSON

	this.image = 'http://lorempixel.com/40/40/people/?' + this.hostId;	//Initialise link to payment image (host's)
	
	//Override object 'toString()' method to generate mark-up
	Payment.prototype.toString = function() {
		
		//Return mark-up for displaying payment
		return '<li><img src="' + this.image + '" alt"Payment ' + this.id + ' Image" /><a href="#"><p class="name">' + this.name + '</p><p class="portion">' + this.portion + '</p></a></li>';
		
	}
	
}

//Function for sanitising field from database into JavaScript convention (convert '_' spaced into CamelCase)
function sanitise(string) {
	parts = string.split('_'); //Get each part of field name
	for (var i=1; i<parts.length; i++){
        parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);//Capitalise first letter of each part (other than first)
    }  
	return parts.join(''); //Recombine into string and return
}