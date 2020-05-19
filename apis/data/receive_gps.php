<?php

    include('../db.php');
    
    $lat = $_POST["lat"];
    $lon = $_POST["lon"];
    $cycle_id = $_POST["cycle_id"];
    
    if ( isset($lat) && isset($lon) && isset($cycle_id) ) {
    
        $lat = mysqli_real_escape_string($conn, $lat);
        $lon = mysqli_real_escape_string($conn, $lon);
        $cycle_id = mysqli_real_escape_string($conn, $cycle_id);
    
        $q = "SELECT user_id FROM request_cycle_id WHERE cycle_id ='".$cycle_id."' AND  approved = 1 ";
        
        $query = mysqli_query($conn, $q);

        if ($query) {

            if (mysqli_num_rows($query) == 1) {

                $user_id = mysqli_fetch_array($query)["user_id"];
                $q = mysqli_query($conn,"SELECT gps_details FROM users WHERE user_id ='".$user_id."' ");
                $gps_details = mysqli_fetch_array($q)["gps_details"];
                
                if (!$gps_details) {
                    $gps_details = array(
                        $cycle_id => array($lat, $lon)
                    );
                }
                else{
                       $gps_details = unserialize($gps_details);
                        
                        $gps_details[$cycle_id][0] = $lat;
                        $gps_details[$cycle_id][1] = $lon;

                        // for($n = 0; $n < count($gps_details); $n++){ 
                        //     $gps_details[$n]["lat"] = $lat; 
                        //     $gps_details[$n]["lon"] = $lon; 
                        // } 
                }
                // Serialize the Array
                $gps_details = serialize($gps_details);

                $sql = "UPDATE users SET gps_details='".$gps_details."' WHERE user_id = '".$user_id."'";
                $query2 = mysqli_query($conn, $sql);

                if ($query) {
                    echo(json_encode(array('status' => 'success','message' => "Updated gps location",'data' => $gps_details)));
                }
                else
                {
                    echo(json_encode(array('status' => 'success','message' => "Update unsuccessful",'data' => $gps_details)));
                }



            } else {

                echo(json_encode(array('status' => 'failure', 'result' => 'Incorrect cycle id')));
            }
        } else {

            echo(json_encode(array('status' => 'failure', 'result' => 'DB operation failed')));
        }
    } else {

        echo(json_encode(array('status' => 'failure', 'result' => 'lat,lon or email not set')));
    }
?>