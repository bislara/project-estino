
$(document).on("click","#fb_button",function(){

  checkLoginState();

return false;
});

window.fbAsyncInit = function() {
    FB.init({
      appId      : '224029792004094',
      cookie     : true,
      xfbml      : true,
      version    : 'v6.0'
    });
      
    FB.AppEvents.logPageView();   
    
  };


function checkLoginState() {
  // FB.getLoginStatus(function(response) {
  //   // statusChangeCallback(response);
  // 		console.log(response);
  //       // var response = JSON.parse(response);
  //        if(response["status"] == "connected"){
  //        	console.log("connected");
  //         	FB.api(
		// 	    '/me',
		// 	    function (result) {
		// 	      if (result && !result.error) {
		// 	        /* handle the result */
		// 	        console.log(result)
		// 	      }
		// 	    }
		// 	);

  //         }
  //        else
  //        {
  //        	console.log("Not connected");
  //        }

  // });
	  FB.login(function(response) {
	    if (response.authResponse) {
	     console.log('Welcome!  Fetching your information.... ');
	     console.log(response)
	     FB.api('/me','GET',  {"fields":"location,picture,link,name,birthday,email,hometown,gender"}, function(response) {
	     	console.log(response);

        var email = response.email;
        var atpos = email.indexOf("@");
            var dotpos = email.lastIndexOf(".");  
            var link_email = "email="+email;
            
    
                $.ajax({
                url: '../apis/user/auth/social_login/email_check.php',
                type: 'post',
                data:link_email,
                    success: function(output) {
                      console.log(output);
                      var output = JSON.parse(output);
                      if(output.status == "sucess"){
                        console.log("User already registered");
                        var data_str = 'email='+email+'&name='+response.name;
                        $.ajax({
                        url: '../apis/user/auth/social_login/login_fb.php',
                        type: 'post',
                        data:data_str,
                            success: function(response) {
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
                               swal("Unable to login! Please try again", "", "error");
                              }

                            }
                        });

                      }
                      else if(output.status=="failure")
                      {                      
                        console.log("New user");
                        var user_data="name="+response.name+"&login_id="+response.id+"&gender="+response.gender+"&address="+response.location.name+"&email="+response.email+"&picture="+response.picture.data.url+"&login_type=Facebook";
                        $.ajax({
                        url: '../apis/user/auth/social_login/registration_fb.php',
                        type: 'post',
                        data:user_data,
                            success: function(response) {
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
                               swal("Unable to login! Please try again", "", "error");
                              }

                            }
                        });

                      }

                    }
                });
            
	       console.log('Good to see you, ' + response.name + response.email + response.gender + response.birthday+ '.');
	     });
	    } else {
	     console.log('User cancelled login or did not fully authorize.');
	    }
	},{scope: 'email,user_birthday,user_gender,user_location,user_link',return_scopes: true});

	 //  FB.logout(function(response) {
  // 		// user is now logged out
		// });

		// onclick="javascript:FB.logout(function() { window.location.reload() }); return false;"


}

 (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

