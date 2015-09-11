//Function for handling log-in
function login(id) {
	
	xmlhttp = new XMLHttpRequest();							//Create new AJAX request object
	xmlhttp.open("GET","../handle.php?login=" + id, false);	//Specify AJAX request
	xmlhttp.send();											//And send
	
	sessionStorage.user = xmlhttp.responseText; //Get returned JSON string and store in session storage
	
}