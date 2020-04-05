<?php

	include ('../../db.php');
	$nu_id = $_POST['token'];
    
	if (isset($nu_id) && $nu_id ){
		if($_SERVER["REQUEST_METHOD"] === "POST" && $nu_id != ""){
			try 
			{
				$query = mysqli_query($conn, "SELECT * FROM users where nu_id ='".$nu_id."'");
				if (mysqli_num_rows($query) == 1) {
					$rst = mysqli_fetch_array($query)["reset_init"];
					if($rst){
						echo(json_encode(array('status' => 'success', 'result' => 'Link Valid')));
					}else{
						echo(json_encode(array('status' => 'failure', 'result' => 'Link Used Already')));
					}
					
					
				}
				else{
					echo json_encode(array('status' => 'failure', 'result' => 'Multiple Emails'));
				}

			}
			catch(Exception $e) 
			{
				echo json_encode(array('status' => 'failure', 'result' => $e->getMessage()));
			}
		}else{
			echo json_encode(array('status' => 'failure', 'result' => 'Invalid Request'));    
		}
	}else{
		echo json_encode(array('status' => 'failure', 'result' => 'token missing'));
	}
    
?>