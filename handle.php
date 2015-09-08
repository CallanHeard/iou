<?php
//Database Connection Settings
$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'iou';

//Code for log-in request
if (isset($_GET['login'])) {

	$connection = new mysqli($servername, $username, $password, $dbname); //Create new connection

	//Check connection
	if ($connection->connect_error) {
		die("Connection failed: " . $connection->connect_error); //Die if error occured
	}

	$sql = "SELECT * FROM user WHERE id={$_GET['login']}";	//Generate SQL
	$result = $connection->query($sql);					//And execute
	
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

}
?>