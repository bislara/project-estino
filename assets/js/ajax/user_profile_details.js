var paid=-1;
var id = 0;
var name = "";
var email = "";
var lat = 0;
var lon = 0;
var rent_mode = 0;
var user_id = sessionStorage.getItem("user_id");
$(document).ready(function() {

	  if(user_id)
	   {
		
		$.ajax({
			url: '../apis/user/auth/profile_details.php',
			data: "user_id="+user_id,
			type: 'get',
			success: function(response) {
				// console.log(response);
				if (response=="")
				{
					swal('Please Login First to open profile page !', ': [', 'warning').then((value) => {
						window.location = './register_login.html';
					});
				}
				else
				{
					response = JSON.parse(response);
            		console.log(response);
					if (response.status == 'success') {
						id = response.result['basicInfo']['user_id'];
						name = response.result['basicInfo']['name'];
						email = response.result['basicInfo']['email'];
						var phone = response.result['basicInfo']['phone'];
						var address = response.result['basicInfo']['address'];
						rent_mode = response.result['basicInfo']['rent_mode'];
						console.log(lat,lon)
						console.log(rent_mode)

						$(".user_name").append(name);
						$(".user_email").append(email);

						$("#profile_name").val(name);
						$("#profile_no").val(phone);
						$("#profile_gender").val(response.result['basicInfo']['gender']);
						$("#profile_email").val(email);
						$("#profile_cycles").val(response.result['basicInfo']['no_cycles']);
						$("#profile_address").val(address);

						if (rent_mode == "1") 
						{
							$("#profile_rent").val("ON");
						}
						else
							$("#profile_rent").val("OFF");



						if (response.result['basicInfo']['picture'] == '') 
						{							
							$(".profile_img").attr("src","../assets/img/anime3.png");
						}
						else
						{
							$(".profile_img").attr("src","../assets/images/profile_images/"+response.result['basicInfo']['picture']);
						}


						
						
				}
				else if (response.status == 'failure') {
					swal('Please Login First to open profile page !', ': [', 'warning').then((value) => {
						window.location = './register_login.html';
					});
				}
				else
					console.log("Some error happenned.")
				}
				
			},
			error: function (jqXHR,exception) {
			    // console.log(jqXHR);
			    swal('Please Login First to open profile page !', ': [', 'warning').then((value) => {
						window.location = './register_login.html';
					});
			}
			

		});
			

	   }
	   else
	   {
	   		swal('Please Login First to open profile page !', ': [', 'warning').then((value) => {
			window.location = './register_login.html';
			});
	   }	

});


$('#signoutBtn').click(()=>{

	$.ajax({
        url: '../apis/user/auth/logout.php',        
        type: 'POST',
        success:(response)=>{
			response=JSON.parse(response);
			swal("Logged out!", "", "success");
			sessionStorage.removeItem("user_id");
			sessionStorage.clear();

			window.location='./register_login.html';
        }
    });
})

$('.dashboard_link').click(()=>{
	window.location='./user_dashboard.html?id=' + user_id;
})

$('.profile_link').click(()=>{
	window.location='./user_profile.html?id=' + user_id;
})


$("#img_file").on('change', function() {

	var fd = new FormData();
	var files = $('#img_file')[0].files[0];
	fd.append('files',files);

	fd.append('user_id',user_id);

	// console.log(fd);
	
	if ($('#img_file').get(0).files.length === 0) {
    	console.log("No files selected");
        swal("No file selected", "", "error");	
	}
	else
	{
		$.ajax({
			url: '../apis/user/auth/upload_photo.php',
			data: fd,
			type: 'POST',
			contentType: false, 
            processData: false, 
			success: function(response){
				console.log(response);
				var response = JSON.parse(response);
				if(response.status == 'success'){

					 swal('Profile Picture Updated!!', '', 'success').then((value) => {
	                          location.reload();
	                        });
				}
				else{
					var error_string = "";
					for (var i = 0; i < response.result.length; i++) {
          				error_string += response.result[i];
          				error_string += "\n"
          			}
	                   swal(error_string, "", "error");

				}
			}
		});
		return false;
	}
	return false;
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
                            if(response.status == "success")
                            {
                                var url='./user_dashboard.html?id='+response.message;
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
          return false;
        });