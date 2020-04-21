<?php

	include('../../../db.php');

	$name = $_POST["name"];
	$email = $_POST["email"];
	$picture = $_POST['picture'];
	$login_id = $_POST['login_id'];
	$login_type = $_POST['login_type'];

	function checkExistingEmail($email) {

		global $conn;

		$query = mysqli_query($conn, 'SELECT * FROM users WHERE email="'.$email.'"');
		return (mysqli_num_rows($query) != 0);
	}

	function validateEmail($email) {

		if ($email == '') {

			echo(json_encode(array('status' => 'failure', 'result' => 'Email is required')));
		} else {

			if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {

				echo(json_encode(array('status' => 'failure', 'result' => 'Valid email is required')));
			} else {

				if (checkExistingEmail($email)) {
					
					echo(json_encode(array('status' => 'failure', 'result' => 'Email is already registered')));
					
				}
				else
				{
					return 1;
				}
			}
			return 0;
		}
	}

	
	if ( isset($name) && isset($picture) && isset($email) && isset($login_type) && isset($login_id) ) {
		
		if(validateEmail($email))
		{
			$name = mysqli_real_escape_string($conn, $name);
			$picture = mysqli_real_escape_string($conn, $picture);
			$email = mysqli_real_escape_string($conn, $email);
			$login_type = mysqli_real_escape_string($conn, $login_type);
        	

			$q = "INSERT INTO users (name, login_id , email, login_type) VALUES('".$name."','".$login_id."','".$email."','".$login_type."')";

			$query = mysqli_query($conn, $q);

		if ($query) {

			$query = mysqli_query($conn, 'SELECT user_id,email,login_type,name FROM users WHERE email="'.$email.'"');
			$info = mysqli_fetch_array($query,MYSQLI_ASSOC);
                $user_id = $info["user_id"];
                $email = $info["email"];
                $login_type = $info["login_type"];

                session_start();

                $_SESSION['login_type'] = $login_type;
                $_SESSION['logged_in'] = 1;
                $_SESSION['user_id']=$user_id;
                
            if($_SESSION['logged_in'])
            {
			    error_reporting(0);			    
				echo(json_encode(array('status' => 'success', 'message' => $user_id)));
			}
			else{

				echo(json_encode(array('status' => 'failure', 'message' => 'token not set')));
			}
		}

		else {
			echo(json_encode(array('status' => 'failure', 'message' => 'DB operation failed')));
		}
	}
		
	}

?>