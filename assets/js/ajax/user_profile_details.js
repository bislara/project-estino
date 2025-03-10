var paid=-1;
var id = 0;
var name = "";
var email = "";
var lat = 0;
var lon = 0;
var rent_mode = 0;
var user_id = sessionStorage.getItem("user_id");
var cycle_no = 0;
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
						console.log(lat,lon);
						console.log(rent_mode);

						$(".user_name").append(name);
						$(".user_email").append(email);

						$("#profile_name").val(name);
						$("#profile_no").val(phone);
						$("#profile_gender").val(response.result['basicInfo']['gender']);
						$("#profile_email").val(email);
						$("#profile_cycles").val(response.result['basicInfo']['no_cycles']);
						$("#profile_address").val(address);

						cycle_no = response.result['basicInfo']['no_cycles'];
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


						$.ajax({
					        url: '../apis/user/cycle_id/get_ids.php',
					        data : {user_id:user_id , user_name :name , email:email},     
					        type: 'POST',
					        success:(response)=>{
					        	// console.log(response);
								response=JSON.parse(response);
								if(response.status == 'success'){

									 var data_arr = response.result;
							         var temp="";
							         for (var i = 0; i < data_arr.length; i++) {
							                    
							                    temp = temp + (i+1) + ". " +  data_arr[i].cycle_id + '<br>';

							              }
							        	// console.log(temp);
							        	if(data_arr.length==0)
							        	{
							        		temp = "None"
							        	}

							          $('#cycle_id_content').append(temp);
								}
								else
								{

								}

					        }
					    });
						
						
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


$('#request_btn').click(()=>{

	if(user_id==0 || user_id =="" || email =="" )
	    swal("Invalid Email or user ID", "Please login again!", "error");              
	else{
	$.ajax({
        url: '../apis/user/cycle_id/request.php',
        data : {user_id:user_id , user_name :name , email:email},     
        type: 'POST',
        success:(response)=>{
        	console.log(response);
			response=JSON.parse(response);
			if(response.status == 'success'){
				swal("Request Sent!", "", "success");
			}
			else
			{
	          swal(response.result, "", "error");              
			}

        }
    });
    return false;
	}
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

$("#profile_no").focusout(function(){
            var phone=$("#profile_no").val();
            if(phone.length != 10){
              $("#error").html("Not a valid phone number");
              $("#good").html("");
              $("#update_btn").prop('disabled', true);
            }
            else{
              $("#good").html("Valid phone number");
              $("#error").html("");
              $("#update_btn").prop('disabled', false);
            }   
        });


        $("#profile_email").focusout(function(){
            var email_check=$("#profile_email").val();
            var atpos = email_check.indexOf("@");
            var dotpos = email_check.lastIndexOf(".");  
            var link_email = "email="+email_check;
            if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email_check.length) {
                // $("#error").html("<div style=\"color:#ff6666;height:40px;padding : 10px;\"><center><strong>Not a valid email address</center></strong></div>");
                $("#error").html("Not a valid email address");
                $("#good").html("");
	            $("#update_btn").prop('disabled', true);
                   
              return false;
            }
            else{
                $.ajax({
                url: '../apis/user/auth/check_email.php',
                type: 'post',
                data:link_email,
                    success: function(response) {
                    console.log(email_check,email);
                    if (email_check == email) 
                    {
                    	$("#error").html("");
                    	$("#good").html("");
	            		$("#update_btn").prop('disabled', false);	
                    }
                    else if (response == "<div style=\"color:green;height:40px;padding : 10px;margin-top:auto;margin-bottom:auto;\"><center><strong>You can signup using this email id.<strong></center></div><script>$(\"#signup\").removeClass(\"disabled\");$(\"#signup\").addClass(\"active\");</script>") 
                    {
						$("#error").html("");
                    	$("#good").html("Valid Email ID");
	            		$("#update_btn").prop('disabled', false);
                    }
                    else
                    {
						$("#error").html("Email Id already exists");
                    	$("#good").html("");
	            		$("#update_btn").prop('disabled', true);                    	
                    }
                    
                    }
                });
            }
        });



        $('#update_btn').on('click', function(){ 
          
          	if (cycle_no!=$("#profile_cycles").val())
          	{
	          swal("Cannot change no of cycles", "", "error");              
          	}

          	else
          	{
            if ($("#profile_name").val() == "" || $("#profile_no").val() == "" || $("#profile_cycles").val() == "" || $("#profile_address").val() == "" || $("#profile_gender").val() == "" || $("#profile_rent").val() == "") 
            {
	          swal("Enter required details", "", "error");              
            }
            else
            {
             
            var e = document.getElementById("profile_gender");
            var gender = e.options[e.selectedIndex].value;

            var user_data="user_id="+user_id+"&name="+$("#profile_name").val()+"&gender="+gender+"&phone="+$("#profile_no").val()+"&no_cycles="+$('#profile_cycles').val()+"&address="+$("#profile_address").val()+"&email="+$("#profile_email").val()+"&rent_mode=" + $("#profile_rent").val();

             	$.ajax({
                        url: '../apis/user/auth/update_profile.php',
                        data:{user_id:user_id , name:$("#profile_name").val() , gender : gender,phone:$("#profile_no").val(), no_cycles : $("#profile_cycles").val(), address : $("#profile_address").val(), email: $("#profile_email").val(), rent_mode : $("#profile_rent").val()},
                        type: 'post',
                        success: function(response) {
                            // console.log(response)
                            var response = JSON.parse(response);
                            if(response.status == "success")
                            {
                                var url='./user_dashboard.html?id='+response.message;
                                swal('Profile Updated!!', '', 'success').then((value) => {
	                          		window.location = url;
	                        	});
                            }
                            else
                            {
                                 //swal(response.message, ": [", "warning");
                              $("#error").html(response.result);
                              $("#good").html("");
                            }
                       }
                    });
                            
            }
        }
          return false;
        });


