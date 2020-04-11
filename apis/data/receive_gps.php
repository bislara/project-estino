<?php

    include('../db.php');
    
    $lat = $_POST["lat"];
    $lon = $_POST["lon"];
    $email = $_POST["email"];
    
    if ( isset($lat) && isset($lon) && isset($email) ) {
    
        $lat = mysqli_real_escape_string($conn, $lat);
        $lon = mysqli_real_escape_string($conn, $lon);
        $email = mysqli_real_escape_string($conn, $email);
    
        $q = "SELECT user_id,name,no_cycles,gps_details FROM users WHERE email ='".$email."' ";
        
        $query = mysqli_query($conn, $q);

        if ($query) {

            if (mysqli_num_rows($query) == 1) {

                $user_id = mysqli_fetch_array($query)["user_id"];
                $gps_details = mysqli_fetch_array($query)["gps_details"];
                
                if (!$gps_details) {
                    $gps_details = array(
                        "1" => array($lat, $lon)
                    );
                }
                else{
                       $gps_details = unserialize($gps_details);
                        
                        for($n = 0; $n < count($gps_details); $n++){ 
                            $gps_details[$n]["lat"] = $lat; 
                            $gps_details[$n]["lon"] = $lon; 
                        } 
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

                echo(json_encode(array('status' => 'failure', 'result' => 'Incorrect email id')));
            }
        } else {

            echo(json_encode(array('status' => 'failure', 'result' => 'DB operation failed')));
        }
    } else {

        echo(json_encode(array('status' => 'failure', 'result' => 'lat,lon or email not set')));
    }
?>