<?php

    include('../../db.php');
    session_start();
	

    if (isset($_SESSION['logged_in']) && isset($_SESSION['nu_id']))
    { 
    if($_SERVER["REQUEST_METHOD"] === "GET" && $_SESSION['logged_in']!=0 && $_GET['nu_id']!=0) {
        try 
        {

            $nu_id = $_GET['nu_id'];
            if ($nu_id==$_SESSION['nu_id']) {
                $basicInfo=[];
                $regEvents=[];
                $certificates=[];
                //basicInfo
                $query = mysqli_query($conn, "SELECT * FROM users where nu_id ='".$nu_id."'");
                if (mysqli_num_rows($query) == 0) {
                    return json_encode(array('status' => 'failure', 'result' => 'nu_id not found'));
                } else {
                    $basicInfo = mysqli_fetch_array($query,MYSQLI_ASSOC);           
                }

                //Registered Events
                $sql1 = "SELECT * FROM events WHERE eid=ANY(SELECT event_id from events_registration WHERE nu_id=".$nu_id.")";
                $res1 = mysqli_query($conn, $sql1);
                if(mysqli_num_rows($res1) > 0)
                {
                    $regEvents = mysqli_fetch_all($res1,MYSQLI_ASSOC);
                    for($i=0; $i<count($regEvents); ++$i){
                        unset($regEvents[$i]['loginId']);
                        unset($regEvents[$i]['loginPassword']);
                        unset($regEvents[$i]['winner1']);
                        unset($regEvents[$i]['winner2']);
                        unset($regEvents[$i]['filled']);
                        unset($regEvents[$i]['results_submitted']);
                    }
                }    
                //Certificate
                /*$query = mysqli_query($conn, "SELECT img_path FROM certificate where inno_id ='".$inno_id."'");
                if (mysqli_num_rows($query) == 1) {
                    $certificates = mysqli_fetch_array($query,MYSQLI_ASSOC);            
                } */


                $result = (object) [
                    'basicInfo'=>$basicInfo,
                    'regEvents'=>$regEvents,
                    //'certificates'=>$certificates
                ];
                echo json_encode(array('status' => 'success', 'result' => $result));

            }
            else
            {
                echo json_encode(array('status' => 'failure', 'result' => 'incorrect ID'));
            }
            // $nu_id=$_SESSION['nu_id'];

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