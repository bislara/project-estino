<?php

    include('../../db.php');
    session_start();
	

    if (isset($_SESSION['logged_in']) && isset($_SESSION['user_id']))
    { 
    if($_SERVER["REQUEST_METHOD"] === "POST" && $_SESSION['logged_in']!=0) {
        try 
        {
            $user_id = $_POST["id"];
            $min_lat = $_POST["min_lat"];
            $max_lat = $_POST["max_lat"];
            $min_lon = $_POST["min_lon"];
            $max_lon = $_POST["max_lon"];
                //basicInfo
            $basicInfo=[];
            $required_data = [];

            $query = mysqli_query($conn, "SELECT * FROM users where rent_mode = 1 AND user_id != '".$user_id."'");
            $no_of_rows = mysqli_num_rows($query);
            if (mysqli_num_rows($query) == 0) {
                return json_encode(array('status' => 'failure', 'result' => 'no user with rent mode on found'));
            } 
            else {
                $basicInfo = mysqli_fetch_all($query,MYSQLI_ASSOC);           

                while ($no_of_rows>0) {
                    $basicInfo[$no_of_rows-1]["gps_details"] =  unserialize($basicInfo[$no_of_rows-1]["gps_details"]);
                    
                    if ($basicInfo[$no_of_rows-1]["gps_details"][1][0]<$max_lat &&  $basicInfo[$no_of_rows-1]["gps_details"][1][0]>$min_lat && $basicInfo[$no_of_rows-1]["gps_details"][1][1]<$max_lon && $basicInfo[$no_of_rows-1]["gps_details"][1][1]>$min_lon) {

                        array_push($required_data,$basicInfo[$no_of_rows-1]);
                               }           

                    $no_of_rows-=1;
                }

            }

            // $basicInfo["gps_details"] =  unserialize($basicInfo["gps_details"]);
                
            
            echo json_encode(array('status' => 'success', 'result' => $required_data));



        }
        catch(Exception $e) 
        {
            echo json_encode(array('status' => 'failure', 'result' => $e->getMessage()));
        }
        
	}
}

?>