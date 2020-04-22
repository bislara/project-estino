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
                // echo $user_id;
                $query = mysqli_query($conn, "SELECT * FROM users where user_id ='".$user_id."'");
                if (mysqli_num_rows($query) == 0) {
                    return json_encode(array('status' => 'failure', 'result' => 'user_id not found'));
                } else {

                        $extension = array('jpg', 'JPG', 'png' ,'PNG' ,'jpeg' ,'JPEG');
        
                        $errors = array();
                        $path = "../../../assets/images/profile_images/";
                        $uploadThisFile = true;
                        
                        $file_name=$_FILES["files"]["name"];
                        $file_tmp=$_FILES["files"]["tmp_name"];
                        
                        $ext=pathinfo($file_name,PATHINFO_EXTENSION);
                        // echo $ext;
                        // echo $file_name;
                        if(!in_array(strtolower($ext),$extension))
                        {
                            array_push($errors, "File type is invalid. Name:- ".$file_name);
                            $uploadThisFile = false;
                        }               
                        
                        if($uploadThisFile){
                            // echo "inside update";
                            $filename=strval($user_id);
                            $filename=$filename.".".$ext;
                            
                            $res = mysqli_fetch_array($query,MYSQLI_ASSOC);
                            if ($res["picture"]!="") {
                                unlink($path.$res["picture"]);
                            }  

                            $q = "UPDATE users SET picture = '".$filename."' WHERE user_id='".$user_id."'";
                            $r = mysqli_query($conn, $q);            
                            if ($r) {
                                move_uploaded_file($_FILES["files"]["tmp_name"],$path.$filename);
                                echo json_encode(array('status' => 'success', 'result' => 'Successfully inserted'));
                            }
                            else
                            {
                                array_push($errors, "Unable to insert into table.");
                                return json_encode(array('status' => 'error', 'result' => $errors));
                            }
                            
                        }
                        else
                         echo json_encode(array('status' => 'error', 'result' => $errors));

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