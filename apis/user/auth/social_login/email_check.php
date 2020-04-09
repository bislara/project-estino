<?php 
include('../../../db.php');

$email=$_POST['email'];
mysqli_real_escape_string($conn, $email);
$query_email=mysqli_query($conn,"SELECT * from users where email='$email'");
if(!empty($email)){
	if(mysqli_num_rows($query_email)>0){
                echo(json_encode(array('status' => 'sucess', 'result' => 'Email exists')));
	}
	else {
                echo(json_encode(array('status' => 'failure', 'result' => 'Not registered email')));
	}
}else{
                echo(json_encode(array('status' => 'failure', 'result' => 'Email not received')));
}