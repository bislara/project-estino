<?php

    include('../../db.php');
    session_start();
	

    if (isset($_SESSION['logged_in']) && isset($_SESSION['user_id']) && !isset($_SESSION['login_type']))
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
                $q = mysqli_query($conn, "SELECT cycle_id FROM request_cycle_id where user_id ='".$user_id."' AND approved = 1");

                $basicInfo["gps_details"] =  unserialize($basicInfo["gps_details"]);
                $basicInfo["no_cycles"] = mysqli_num_rows($q);

                $cycle_ids = array();
                while($r = mysqli_fetch_array($q, MYSQLI_ASSOC)) 
                {
                    $cycle_ids[] = $r;
                }
                
                $result = (object) [
                    'basicInfo'=>$basicInfo,
                    'cycle_ids' => $cycle_ids,
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
else if (isset($_SESSION['logged_in']) && isset($_SESSION['user_id']) && isset($_SESSION['login_type']))
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
 
                if ($basicInfo["phone"] === "" || $basicInfo["address"] === "" || $basicInfo["gender"] === "" || $basicInfo["no_cycles"] ==="") {
                    # code...
                    echo json_encode(array('status' => 'failure', 'result' => 'update_profile'));

                }
                else{

                $basicInfo["gps_details"] =  unserialize($basicInfo["gps_details"]);
                $result = (object) [
                    'basicInfo'=>$basicInfo,
                ];
                echo json_encode(array('status' => 'success', 'result' => $result));                    
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