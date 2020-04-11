<?php

$_SESSION['logged_in']=0;
$_SESSION['login_type']="";
$_SESSION['user_id']=0;
$_SESSION['email']="";

session_start();

// remove all session variables
session_unset();
// destroy the session
session_destroy();


echo(json_encode(array('status' => 'success', 'message' => 'Logged Out')));

?>
