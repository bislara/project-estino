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
							$(".profile_img").attr("src",response.result['basicInfo']['picture']);
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

"https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2047436132069314&height=50&width=50&ext=1590092856&hash=AeQu2uPiSt7KnZjO"
