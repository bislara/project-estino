<?php

    include('../../db.php');
    session_start();
	

    if (isset($_SESSION['logged_in']) && isset($_SESSION['user_id']))
    { 
    if($_SERVER["REQUEST_METHOD"] === "POST" && $_SESSION['logged_in']!=0 && $_POST['user_id']!=0) {
        try 
        {

            $user_id = $_POST['user_id'];
            if ($user_id==$_SESSION['user_id']) {

                $email = mysqli_real_escape_string($conn, $_POST['email']);
            
                
                $query = mysqli_query($conn, "SELECT * FROM users where user_id ='".$user_id."'");
                if (mysqli_num_rows($query) == 0) {
                    return json_encode(array('status' => 'failure', 'result' => 'user_id not found'));
                } else {

                    $q = "INSERT INTO request_cycle_id (user_id,email) VALUES ('".$user_id."','".$email."')"; 
                    $query = mysqli_query($conn, $q);

                    if($query)
                    {
                        echo json_encode(array('status' => 'success', 'result' => 'successfully sent'));                        
                    }
                    else
                    {
                        echo json_encode(array('status' => 'failure', 'result' => 'Unable to send request'));
                    }

                }
            }
            else
            {
                echo json_encode(array('status' => 'failure', 'result' => 'incorrect ID'));
            }
            // $user_id=$_SESSION['user_id'];

        }
        catch(Exception $e) 
        {
            echo json_encode(array('status' => 'failure', 'result' => $e->getMessage()));
        }
        
	}
}

else
{
    echo json_encode(array('status' => 'failure', 'result' => 'not logged in'));
}

?>