  var GoogleAuth;
  // var SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
  var SCOPE = "https://www.googleapis.com/auth/userinfo.profile";
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    // Retrieve the discovery document for version 3 of Google Drive API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyCHGhMCa6zPgqfYMY0BMvfVW1ld5wkBnN8',
      	'clientId': '231052077169-fr1vuf8j3qnqldsjffljav5rbqaacgkf.apps.googleusercontent.com',
      	'discoveryDocs': [discoveryUrl],
        'scope': SCOPE
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();
      console.log("All ready inside google..")
      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $('#google_btn').click(function() {
        handleAuthClick();
        return false;
      });
      $('#revoke-access-button').click(function() {
        revokeAccess();
      });
    });
  }


  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked "Sign out" button.
      GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {

    	if (GoogleAuth.isSignedIn.get()) {
		  var user2 = GoogleAuth.currentUser.get()
		  var profile = user2.getBasicProfile();
		  console.log('ID: ' + profile.getId());
		  console.log('Full Name: ' + profile.getName());
		  console.log('Given Name: ' + profile.getGivenName());
		  console.log('Family Name: ' + profile.getFamilyName());
		  console.log('Image URL: ' + profile.getImageUrl());
		  console.log('Email: ' + profile.getEmail());
		}

		// var options = new gapi.auth2.SigninOptionsBuilder(
		//         {'scope': 'email https://www.googleapis.com/auth/user.birthday.read'});


		// user2.grant(options).then(
		//     function(success){
		//       console.log(JSON.stringify({message: "success", value: success}));
		//     },
		//     function(fail){
		//       alert(JSON.stringify({message: "fail", value: fail}));
		//     });

		 

      var email = profile.getEmail();
      var atpos = email.indexOf("@");
      var dotpos = email.lastIndexOf(".");  
      var link_email = "email="+email;
      console.log("Starting...");      
    
                $.ajax({
                url: '../apis/user/auth/social_login/email_check.php',
                type: 'post',
                data:link_email,
                    success: function(output) {
                      console.log(output);
                      var output = JSON.parse(output);
                      if(output.status == "sucess"){
                        console.log("User already registered");
                        var data_str = 'email='+email+'&name='+profile.getName();
                        $.ajax({
                        url: '../apis/user/auth/social_login/login_fb.php',
                        type: 'post',
                        data:data_str,
                            success: function(response) {
                                console.log(response);
                                var response = JSON.parse(response);
                                if(response.status == "success"){
                                  var user_id = response.message;
                                  sessionStorage.setItem("user_id", user_id);

                                  swal('Congrats !', 'You are logged in!', 'success').then((value) => {
                                      window.location = './user_profile.html?id='+response.message;
                                    });

                               }
                              else if(response.status=="failure"){
                                //swal(response.result, ": [", "warning");
                                console.log(response.result)
                               swal("Unable to login! Please try again", "", "error");
                               window.location.reload();
                              }

                            }
                        });

                      }
                      else if(output.status=="failure")
                      {                      
                        console.log("New user");
                        var user_data="name="+profile.getName()+"&login_id="+profile.getId()+"&email="+email+"&picture="+profile.getImageUrl()+"&login_type=Google";
                        console.log(user_data);
                        $.ajax({
                        url: '../apis/user/auth/social_login/registration_google.php',
                        type: 'post',
                        data:user_data,
                            success: function(response) {
                                console.log(response);
                                var response = JSON.parse(response);
                                if(response.status == "success"){
                                  
                                  var user_id = response.message;
                                  sessionStorage.setItem("user_id", user_id);

                                  swal('Congrats !', 'You are logged in!', 'success').then((value) => {
                                      window.location = './user_profile.html?id='+response.message;
                                    });

                               }
                              else if(response.status=="failure"){
                                //swal(response.result, ": [", "warning");
                                console.log(response.result)
                               swal("Unable to login! Please try again", "", "error");
                               window.location.reload();

                              }

                            }
                        });

                      }

                    }
                });



      // $('#sign-in-or-out-button').html('Sign out');
      // $('#revoke-access-button').css('display', 'inline-block');
      // $('#auth-status').html('You are currently signed in and have granted ' +
      //     'access to this app.');
    } 
    else {
      console.log("Unable to login or the user has declined to accept")
      // $('#sign-in-or-out-button').html('Sign In/Authorize');
      // $('#revoke-access-button').css('display', 'none');
      // $('#auth-status').html('You have not authorized this app or you are ' +
      //     'signed out.');
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }