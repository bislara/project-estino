<?php

    include('../../db.php');
    session_start();
	

    if (isset($_SESSION['logged_in']) && isset($_SESSION['nu_id']))
    { 
    if($_SESSION['nu_id']!=0) {
        try 
        {

                $nu_id = $_SESSION['nu_id'];
                $basicInfo=[];
                //basicInfo
                $query = mysqli_query($conn, "SELECT nu_id,name FROM users where nu_id ='".$nu_id."'");
                if (mysqli_num_rows($query) == 0) {
                    return json_encode(array('status' => 'failure', 'result' => 'nu_id not found'));
                } else {
                    $basicInfo = mysqli_fetch_array($query,MYSQLI_ASSOC);           
                }
 

                $result = (object) [
                    'basicInfo'=>$basicInfo,
                ];
                echo json_encode(array('status' => 'success', 'result' => $result));

        }
        catch(Exception $e) 
        {
            echo json_encode(array('status' => 'failure', 'result' => $e->getMessage()));
        }
        
	}
    else
    {
       echo json_encode(array('status' => 'failure', 'result' => 'incorrect nu_id'));
    }
}
else
{
    echo json_encode(array('status' => 'failure', 'result' => 'not logged in'));
}

?>