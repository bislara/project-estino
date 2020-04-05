<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require '../../../vendor/autoload.php';

include ('../../db.php');
$email = $_POST['email'];
    

    if (isset($email)) {

        $query = mysqli_query($conn, "SELECT * FROM users WHERE email='".$email."'");

        if ($query) {
            
            if (mysqli_num_rows($query) == 1) {
                
                // echo "inside query";
                $row=mysqli_fetch_array($query,MYSQLI_ASSOC);

                // Replace sender@example.com with your "From" address.
                // This address must be verified with Amazon SES.
                $sender = 'donotreply@nitrutsav.com';
                $senderName = 'Nitrutsav 2020';

                // Replace recipient@example.com with a "To" address. If your account
                // is still in the sandbox, this address must be verified.
                $recipient = $email;

                // Replace smtp_username with your Amazon SES SMTP user name.
                $usernameSmtp = 'donotreply@nitrutsav.com';

                // Replace smtp_password with your Amazon SES SMTP password.
                $passwordSmtp = 'Nitrutsav2020@456';

                // Specify a configuration set. If you do not want to use a configuration
                // set, comment or remove the next line.
                // $configurationSet = 'ConfigSet';

                // If you're using Amazon SES in a region other than US West (Oregon),
                // replace email-smtp.us-west-2.amazonaws.com with the Amazon SES SMTP
                // endpoint in the appropriate region.
                $host = 'mail.nitrutsav.com';
                $port = 465;

                // The subject line of the email
                $subject = "Nitrutsav 2020 Password reset link";

                // The plain-text body of the email
                $bodyText =  "Email Test\r\nThis email was sent through the
                    SMTP interface using the PHPMailer class.";
            
            	//JWT for URL
            	
            	$nu_id=$row['nu_id'];
				// The HTML-formatted body of the email
                $bodyHtml = "Hello user, <br><br>
								we have got a 'forgot password' request for your account ".$row['email']." at Nitrutsav 2020, <br>
                    			if you do not recognize this request you might simply ignore this link, your account is still safe. <br>
                    			In order to change your password please follow this link: <br>
								<a href='https://nitrutsav.com/views/forgot_password.html?q=".$nu_id."'>CLICK HERE</a>";


                $mail = new PHPMailer(true);
                // echo "inside try";
                try {
                    
                    // Specify the SMTP settings.
                    $mail->isSMTP();
                    $mail->setFrom($sender, $senderName);
                    $mail->Username   = $usernameSmtp;
                    $mail->Password   = $passwordSmtp;
                    $mail->Host       = $host;
                    $mail->Port       = $port;
                    $mail->SMTPAuth   = true;
                    $mail->SMTPSecure = 'ssl';
                    // $mail->addCustomHeader('X-SES-CONFIGURATION-SET', $configurationSet);

                    // Specify the message recipients.
                    $mail->addAddress($recipient);
                    // You can also add CC, BCC, and additional To recipients here.

                    // Specify the content of the message.
                    $mail->isHTML(true);
                    $mail->Subject    = $subject;
                    $mail->Body       = $bodyHtml; 	
                    $mail->AltBody    = $bodyText;
                    $mail->Send();
                	$query = mysqli_query($conn, "UPDATE users SET reset_init='1' WHERE email='".$email."'");
                	
                	
                    echo(json_encode(array('status' => 'success', 'result' => 'Mail has been sent to your registered mail.Check SPAM folder , The reset link will expire within 24hrs.')));
                }
                catch (phpmailerException $e) {
                    echo(json_encode(array('status' => 'failure', 'result' => "An error occurred. {$e->errorMessage()}")));
                }
                catch (Exception $e) {

                    echo(json_encode(array('status' => 'failure', 'result' => "Email not sent. {$mail->ErrorInfo}")));
                }
            } else {

                echo(json_encode(array('status' => 'failure', 'result' => 'This email is not registered with us')));
            }
        } else {
            echo(json_encode(array('status' => 'failure', 'result' => 'This email is not registered with us')));
        }
    } else {

        echo(json_encode(array('status' => 'failure', 'result' => 'Email or password not set')));
    }
?>