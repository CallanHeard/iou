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
		echo json_encode(mysqli_fetch_array($result)); //Return user details in JSON form
	}
	
	$connection->close(); //Close database connection

}

//Code for handling user payments retrieval
if (isset($_GET['payments'])) {
	
	$connection = establishConnection(); //Connect to database

	$sql = "SELECT payment.id, payment.host_id, payment.name, payment.total, payment.portion FROM user, payment WHERE user.id={$_GET['payments']}";	//Generate SQL
	$result = $connection->query($sql);																								//And execute
	
	//If there is some payments
	if ($result->num_rows > 0) {
	
		echo '<result>'; //Generate base XML element
	
		//Loop through the results
		while ($row = $result->fetch_row()) {
			
			echo "<payment>";						//XML root element
			echo "<id>{$row[0]}</id>";				//Return payment ID
			echo "<hostId>{$row[1]}</hostId>";		//Return payment host ID
			echo "<name>{$row[2]}</name>";			//Return payment name
			echo "<total>{$row[3]}</total>";		//Return payment total
			echo "<portion>{$row[4]}</portion>";	//Return payment portion
			echo "</payment>";
			
		}
		
		echo '</result>'; //Close base XML element
	
	}
	
	$connection->close(); //Close database connection
	
}

//Code for getting amount user owes/is owed
if (isset($_GET['owes']) || isset($_GET['owed'])) {
	
	$connection = establishConnection();	//Connect to database
	$sql;									//Variable for storing generated SQL
	
	//If getting amount user owes
	if(isset($_GET['owes'])) {
		
		//Generate SQL
		$sql = "SELECT SUM(p.portion) AS result
				FROM user u
				INNER JOIN contributes c ON u.id = c.user_id
				INNER JOIN payment p ON c.payment_id = p.id
				WHERE c.paid = 0 AND u.id ={$_GET['owes']}";
				
	}
	
	//If getting amount user is owed
	if(isset($_GET['owed'])) {
		
		//Generate SQL
		$sql = "SELECT SUM(portion) AS result
				FROM user u
				INNER JOIN contributes c ON u.id = c.user_id
				INNER JOIN payment p ON c.payment_id = p.id
				WHERE c.paid=0 AND p.host_id = {$_GET['owed']}";
				
	}
	
	$result = $connection->query($sql); //And execute

	//There should only be one
	if ($result->num_rows == 1) {
		
		$user = mysqli_fetch_array($result);											//Get result row
		echo "<result>".($user['result'] == null ? '0' : $user['result'])."</result>";	//Return result (checking for null)
		
	}
	
	$connection->close(); //Close database connection
	
}
?>