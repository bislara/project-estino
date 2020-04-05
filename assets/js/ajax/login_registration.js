function myFunction() {
  var x = document.getElementById("error");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function showFunction() {
  var x = document.getElementById("good");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

  
$(document).on("click","#signin",function(){
        // $('#login_btn').on('click', function(){
            var mail=$("#login_email").val();
            var passw=$("#login_password").val();  

            $.ajax({
                url:'../apis/user/auth/login.php',
                data:"email="+mail+"&password="+passw,
                type: 'post',
                success:function(response)
                {      
                    console.log(response);
                    var response = JSON.parse(response);
                    if(response.status == "success"){
                      swal('Congrats !', 'You are logged in!', 'success').then((value) => {
                          window.location = './profile.html?id='+response.message;
                        });

                   }
                  else if(response.status=="failure"){
                    //swal(response.result, ": [", "warning");
                    console.log(response.result)
                    // $("#error1").html('<div style="background-color:#ff6666;height:40px;padding:10px;width:50%;border-radius:10px;">'+response.result+'</div>');
                    // $("#error1").html(response.result);
          // myFunction();
                   swal("Incorrect Id or Password!", "", "error");
                  }               
              }

              });
        return false;
  });


$(document).ready(function(){
            
        $("#phone").focusout(function(){
            var phone=$("#phone").val();
            if(phone.length != 10){
              $("#error").html("Not a valid phone number");
              $("#good").html("");

                // $("#error").html("<div style=\"color:#ff6666;height:40px;padding : 10px;\"><center><strong>Not a valid phone number</strong></center></div>");
              myFunction();
            }
            else{
                // $("#error").html("<div style=\"color:#4dff88;height:40px;padding : 10px;\"><strong><center>Valid phone number</strong></center></div>");
              $("#good").html("Valid phone number");
              $("#error").html("");
              myFunction();
              showFunction();
            }   
        });


        $("#email").focusout(function(){
            var email=$("#email").val();
            var atpos = email.indexOf("@");
            var dotpos = email.lastIndexOf(".");  
            var link_email = "email="+email;
            if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
                // $("#error").html("<div style=\"color:#ff6666;height:40px;padding : 10px;\"><center><strong>Not a valid email address</center></strong></div>");
                $("#error").html("Not a valid email address");
                $("#good").html("");

                myFunction();   
              return false;
            }
            else{
                $.ajax({
                url: '../apis/user/auth/check_email.php',
                type: 'post',
                data:link_email,
                    success: function(response) {
                    // $("#error").html(response);
                    $("#error").html(response);
                    $("#good").html("");
                    
                      myFunction();
                    }
                });
            }
        });

       

        $('#signup').on('click', function(){ 
          
          
            var e = document.getElementById("gender");
            var gender = e.options[e.selectedIndex].value;

            if ($("#name").val() == "" || $("#phone").val() == "" || $("#no_cycles").val() == "" || $("#address").val() == "" || $("#gender").val() == "" || $("#password").val() == "" || $("#cpassword").val() == "" ) 
            {
              $("#error").html("Enter all the details");
              $("#good").html("");

              myFunction();
            }
            else
            {

              var user_data="name="+$("#name").val()+"&gender="+gender+"&phone="+$("#phone").val()+"&no_cycles="+$('#no_cycles').val()+"&address="+$("#address").val()+"&email="+$("#email").val()+"&password="+$("#password").val()+"&referal_no="+$("#referal_no").val();

              if($("#password").val() != $("#cpassword").val())
                {
                    // $("#error").html("<div style=\"color:#ff6666;height:40px;padding : 10px;\"><center><strong>Confirm your password</center></strong></div>");
                  $("#error").html("Confirm your password");
                  $("#good").html("");

                  myFunction();
                }
                else
                {
                    $.ajax({
                        url: '../apis/user/auth/registration.php',
                        data:user_data,
                        type: 'post',
                        success: function(response) {
                            console.log(response)
                            console.log(gender)
                            var response = JSON.parse(response);
                            if(response.status=="success")
                            {
                                var url='./profile.html?id='+response.message;
                                swal("successfully registered", ":)", "success");
                                window.location=url;
                            }
                            else
                            {
                                 //swal(response.message, ": [", "warning");
                                // $("#error").html("<div style=\"color:#ff6666;height:40px;padding : 10px;\"><center><strong>"+response.result+"</center></strong></div>");
                              $("#error").html(response.result);
                              $("#good").html("");

                            myFunction();
                            }
                       }
                    });
                }              
            }
            
        });
        return false;
    });

$(document).on("click","#recoveryEmailBtn",function(){
    var email=$("#recoveryEmail").val();
    
    if(email.length!==""){
        console.log(email);
        $.ajax({
            url: '../apis/user/auth/forgot_password.php',
            data: {
                email: email
            },
            type: 'POST',
            success: function(response) {
                console.log(response);
            
                var response = JSON.parse(response);
            
              if (response.status=="success") {
                $("#forgotPasswordModal .modal-body").html("<h1>Mail has been sent to your registered mail.Check INBOX/SPAM folder , The reset link will expire within 24hrs.</h1>");
              }
              else if (response.status=="failure") 
              {
                $("#forgotPasswordModal .modal-body").html("<h1> "+response.result+" </h1>");
              }
              else
              {
                $("#forgotPasswordModal .modal-body").html("<h1> Shouldn't Send a mail. Please try again after sometime </h1>");
              }
              
            }
        });
    }else{

    }
});