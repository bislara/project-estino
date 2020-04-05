<?php

include ('../../db.php');

    $new_password= $_POST['password'];
    $nu_id = $_POST['token'];
	
    if (isset($nu_id) && $nu_id ){
        if($_SERVER["REQUEST_METHOD"] === "POST" && $nu_id != ""){
        	
            try 
            {
				
            	$new_password=md5($new_password);
                $query = mysqli_query($conn, "SELECT * FROM users where nu_id ='".$nu_id."'");

                if (mysqli_num_rows($query) == 1) {
                	$rst = mysqli_fetch_array($query)["reset_init"];
                	if($rst){
						$query=mysqli_query($conn,"UPDATE users set user_password='".$new_password."',reset_init='0' WHERE nu_id='".$nu_id."'");
                	
						if($query){
							echo(json_encode(array('status' => 'success', 'result' => 'Password Updated')));
						}else{
							echo(json_encode(array('status' => 'failure', 'result' => 'Password Could not be Updated')));
						}
                    
                    }else{
						echo(json_encode(array('status' => 'failure', 'result' => 'Link Expired')));
					}
                	
                    
                }else{
                    return json_encode(array('status' => 'failure', 'result' => 'Multiple Emails'));
                }

            }
            catch(Exception $e) 
            {
                echo json_encode(array('status' => 'failuree', 'result' => $e->getMessage()));
            }
        }else{
            echo json_encode(array('status' => 'failure', 'result' => 'Invalid Request'));    
        }
    }else{
        echo json_encode(array('status' => 'failure', 'result' => 'token missing'));
    }
    
   
?>