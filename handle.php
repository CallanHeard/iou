<?php
//Database Connection Settings
$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'iou';

function establishConnection() {
	
	$connection = new mysqli($GLOBALS['servername'], $GLOBALS['username'], $GLOBALS['password'], $GLOBALS['dbname']); //Create new connection

	//Check connection
	if ($connection->connect_error) {
		die("Connection failed: " . $connection->connect_error); //Die if error occurred
	}
	else {
		return $connection; //Or return new connection
	}
	
}

//Code for handling log-in request
if (isset($_GET['login'])) {

	$connection = establishConnection(); //Connect to database

	$sql = "SELECT * FROM user WHERE id={$_GET['login']}";	//Generate SQL
	$result = $connection->query($sql);						//And execute
	
	//There should only be one
	if ($result->num_rows == 1) {
		
		$user = mysqli_fetch_array($result); //Get user row
		
		echo "<user>";
		echo "<id>".$user['id']."</id>";						//Return user's ID
		echo "<firstName>".$user['first_name']."</firstName>";	//Return user's first name
		echo "<lastName>{$user['last_name']}</lastName>";		//Return user's last name
		echo "<email>{$user['email']}</email>";					//Return user's email
		echo "</user>";
		
	}
	
	$connection->close(); //Close database connection

}

//Code for handling user payments retrieval
if (isset($_GET['payments'])) {
	
	$connection = establishConnection(); //Connect to database

	$sql = "SELECT payment.id, payment.name, payment.amount FROM user, payment WHERE user.id={$_GET['payments']}";	//Generate SQL
	$result = $connection->query($sql);												//And execute
	
	//If there is some payments
	if ($result->num_rows > 0) {
	
		echo '<result>'; //Generate base XML element
	
		//Loop through the results
		while ($row = $result->fetch_row()) {
			
			echo "<payment>";
			echo "<id>{$row[0]}</id>";
			echo "<name>{$row[1]}</name>";
			echo "<amount>{$row[2]}</amount>";
			echo "</payment>";
			
		}
		
		echo '</result>'; //Close base XML element
	
	}
	
	$connection->close(); //Close database connection
	
}
?>