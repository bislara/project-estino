<?php 

	include('../../db.php');
    session_start();

    $user_id = 20;
			
				$query = mysqli_query($conn, "SELECT * FROM gps_details_log WHERE user_id = '".$user_id."' ORDER BY timestamp DESC LIMIT 2" );
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

$earthRadius = 6371000;
  // convert from degrees to radians
  $latFrom = deg2rad($result[0]["lat"]);
  $lonFrom = deg2rad($result[0]["lon"]);

  $latTo = deg2rad($result[1]["lat"]);
  $lonTo = deg2rad($result[1]["lon"]);

  $latDelta = $latTo - $latFrom;
  $lonDelta = $lonTo - $lonFrom;

  $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
    cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));
  
  $distance =  $angle * $earthRadius; // in meters
  $distance /=1000;   // in kilometers

  $update = mysqli_query($conn, "  UPDATE users  SET distance_travelled = distance_travelled + '".$distance."' WHERE user_id = '".$user_id."'");
  if($update)
  	echo "Updated";
 else
 	echo "error";


?>