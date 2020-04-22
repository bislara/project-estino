<?php

	include('../../db.php');
	session_start();
	$user_id = $_POST["user_id"];
	$name = $_POST["name"];
	$gender = $_POST["gender"];
	$phone = $_POST["phone"];
	$no_cycles = $_POST["no_cycles"];
	$address = $_POST["address"];
	$email = $_POST["email"];
	$rent_mode = $_POST["rent_mode"];


	function validateName($name) {

		if ($name == '') {

			echo(json_encode(array('status' => 'failure', 'result' => 'Name is required')));
		} else {

			if (!preg_match("/^[a-zA-Z ]*$/", $name)) {

				echo(json_encode(array('status' => 'failure', 'result' => 'Name should only contain letters and spaces')));
				return 0;
			}
			return 1;
		}
	}

	function validateGender($gender) {

		if ($gender != 'male' && $gender != 'female' && $gender != 'others') {

			echo(json_encode(array('status' => 'failure', 'result' => 'Invalid gender','gender'=>$gender)));
			return 0;
		}
		return 1;
	}

	function validatePhone($phone) {

		if (!preg_match("/^[6789]\d{9}$/", $phone)) {

			echo(json_encode(array('status' => 'failure', 'result' => 'Phone number should have 10 digits and should start with 6,7,8, or 9')));
			return 0;
		}
		return 1;
	}


	function validateAddress($address) {

		if ($address == '') {

			echo(json_encode(array('status' => 'failure', 'result' => 'Address is required')));
			return 0;
		}
		return 1;
	}

	function checkExistingEmail($email) {

		global $conn;

		$query = mysqli_query($conn, 'SELECT * FROM users WHERE email="'.$email.'"');
		return (mysqli_num_rows($query) != 1);
	}

	function validateEmail($email) {

		if ($email == '') {

			echo(json_encode(array('status' => 'failure', 'result' => 'Email is required')));
		} else {
				// echo $email;
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


if (isset($_SESSION['logged_in']) && isset($_SESSION['user_id']) && $_SESSION['user_id']!=0) 
    {
	if ( isset($name) && isset($gender) && isset($phone) && isset($address) && isset($email) && isset($no_cycles) && isset($rent_mode)) {
		// /echo'<script>HIIIIIII</script>';
		//validateEmail($email);
		//validatePassword($password);
		//validateAccomodation($accomodation);
		if(validateEmail($email) && validateGender($gender) && validatePhone($phone) && validateName($name) && validateAddress($address))
		{
			$name = mysqli_real_escape_string($conn, $name);
			$gender = mysqli_real_escape_string($conn, $gender);
			$phone = mysqli_real_escape_string($conn, $phone);
			$address = mysqli_real_escape_string($conn, $address);
			$email = mysqli_real_escape_string($conn, $email);
        	$no_cycles = mysqli_real_escape_string($conn, $no_cycles);
			if ($rent_mode == "ON") {
				$rent = 1;
			}
			else if ($rent_mode == "OFF") {
				$rent = 0;
			}
			else
				$rent = 0;

			$query = mysqli_query($conn, 'SELECT user_id FROM users WHERE user_id="'.$user_id.'"');

			
		if (mysqli_num_rows($query) == 1) {

			
			$q = "UPDATE users SET name = '".$name."' , gender = '".$gender."' , phone = '".$phone."',address = '".$address."',email = '".$email."', no_cycles = '".$no_cycles."', rent_mode = '".$rent."' WHERE user_id = '".$user_id."' ";

			
			$query = mysqli_query($conn, $q);

            if($query)
            {
			    error_reporting(0);			    
				echo(json_encode(array('status' => 'success', 'message' => $user_id)));
			}
			else{

				echo(json_encode(array('status' => 'failure', 'message' => 'token not set')));
			}
		}

		else {
			echo(json_encode(array('status' => 'failure', 'message' => 'No such user ID')));
		}
	}
		
	}
}
else
{
    echo json_encode(array('status' => 'failure', 'result' => 'not logged in'));
}

?>