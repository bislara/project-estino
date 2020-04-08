<?php

    include('../../db.php');
    session_start();
	

    if (isset($_SESSION['logged_in']) && isset($_SESSION['user_id']))
    { 
    if($_SERVER["REQUEST_METHOD"] === "GET" && $_SESSION['logged_in']!=0 && $_GET['user_id']!=0) {
        try 
        {

            $user_id = $_GET['user_id'];
            if ($user_id==$_SESSION['user_id']) {
                $basicInfo=[];

                //basicInfo
                $query = mysqli_query($conn, "SELECT * FROM users where user_id ='".$user_id."'");
                if (mysqli_num_rows($query) == 0) {
                    return json_encode(array('status' => 'failure', 'result' => 'user_id not found'));
                } else {
                    $basicInfo = mysqli_fetch_array($query,MYSQLI_ASSOC);           
                }


                $result = (object) [
                    'basicInfo'=>$basicInfo,
                ];
                echo json_encode(array('status' => 'success', 'result' => $result));

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