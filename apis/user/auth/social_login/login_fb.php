<?php

    include('../../../db.php');
    
    $email = $_POST["email"];
    $name = $_POST["name"];
    $email = mysqli_real_escape_string($conn, $email);
    $name = mysqli_real_escape_string($conn, $name);

    if (isset($email) && isset($name)) {
        
        $q = "SELECT user_id,email,login_type,name FROM users WHERE email='".$email."' AND name ='".$name."' ";
        
        $query = mysqli_query($conn, $q);

        if ($query) {

            if (mysqli_num_rows($query) == 1) {

                $info = mysqli_fetch_array($query,MYSQLI_ASSOC);
                $user_id = $info["user_id"];
                $email = $info["email"];
                $login_type = $info["login_type"];

                session_start();

                $_SESSION['login_type'] = $login_type;
                $_SESSION['logged_in'] = 1;
                $_SESSION['user_id']=$user_id;

                if ($_SESSION['logged_in']) 
                {

                echo(json_encode(array('status' => 'success','message' => $user_id)));
                }


            } else {

                echo(json_encode(array('status' => 'failure', 'result' => 'Incorrect email id or name')));
            }
        } else {

            echo(json_encode(array('status' => 'failure', 'result' => 'DB operation failed')));
        }
    } else {

        echo(json_encode(array('status' => 'failure', 'result' => 'Email or name not set')));
    }
?>