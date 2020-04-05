<?php

    include('../../db.php');
    
    $email = $_POST["email"];
    $password = $_POST["password"];
    $email = mysqli_real_escape_string($conn, $email);
    $password = mysqli_real_escape_string($conn, $password);

    if (isset($email) && isset($password)) {
        
        $q = "SELECT user_id FROM users WHERE email='".$email."' AND user_password ='".md5($password)."' ";
        
        $query = mysqli_query($conn, $q);

        if ($query) {

            if (mysqli_num_rows($query) == 1) {

                $user_id = mysqli_fetch_array($query)["user_id"];
                $email = mysqli_fetch_array($query)["email"];

                session_start();
                $_SESSION['logged_in'] = 1;
                $_SESSION['user_id']=$user_id;

                if ($_SESSION['logged_in']) 
                {

                echo(json_encode(array('status' => 'success','message' => $user_id)));
                }


            } else {

                echo(json_encode(array('status' => 'failure', 'result' => 'Incorrect email id or password')));
            }
        } else {

            echo(json_encode(array('status' => 'failure', 'result' => 'DB operation failed')));
        }
    } else {

        echo(json_encode(array('status' => 'failure', 'result' => 'Email or password not set')));
    }
?>