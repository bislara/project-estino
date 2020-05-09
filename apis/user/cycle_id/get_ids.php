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

                //basicInfo
                $query = mysqli_query($conn, "SELECT * FROM request_cycle_id where user_id = '".$user_id."' AND approved = '1'" );
                if (!$query && mysqli_num_rows($query) == 0) {
                    return json_encode(array('status' => 'failure', 'result' => 'user_id not found'));
                } else {

                    $result = array();
                    while($r = mysqli_fetch_array($query, MYSQLI_ASSOC)) 
                    {
                        $result[] = $r;
                    }   
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
    else
        echo "error";
}
else
{
    echo json_encode(array('status' => 'failure', 'result' => 'not logged in'));
}

?>