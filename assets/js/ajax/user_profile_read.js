var url = location.href;
if (window.location.href.indexOf("?id=") >= 0) {
	var user_id = url.split("?")[1].split("=")[1];
	console.log(user_id);
	sessionStorage.setItem("user_id", user_id);
}
else
{
	swal('Please Login First to open profile page !', ': [', 'warning').then((value) => {
	window.location = './register_login.html';
	});
}

var paid=-1;
var id = 0;
var name = "";
var email = "";
var lat = [];
var lon = [];
var cycle_ids = [];
var rent_mode = 0;
$(document).ready(function() {

	  if(user_id)
	   {

		//var id=0;
		$.ajax({
			url: '../apis/user/auth/profile.php',
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
						
						for (var i = 0; i < response.result['cycle_ids'].length; i++) {
				            cycle_ids[i] = response.result['cycle_ids'][i];
						}
						console.log(cycle_ids);
						$("#distance_travel").append(response.result['basicInfo']['distance_travelled'] + " Kms");

						if (response.result['basicInfo']['no_cycles']!=0)
						{
							for (var i = 0; i < cycle_ids.length; i++) {
					            lat[i] = response.result['basicInfo']['gps_details'][cycle_ids[i].cycle_id][0];
					            lon[i] = response.result['basicInfo']['gps_details'][cycle_ids[i].cycle_id][1];
							}	
							
							var script = document.createElement('script');
	             			script.src = '../assets/js/ajax/map/google_map.js';
	             			document.body.appendChild(script);		
						}
						else
							console.log("No cycles")
						rent_mode = response.result['basicInfo']['rent_mode'];
						// console.log(lat,lon)

						$(".user_name").append(name);
						
						if (response.result['basicInfo']['picture'] == '') 
						{							
							$(".profile_img").attr("src","../assets/img/anime3.png");
						}
						else
						{
							$(".profile_img").attr("src","../assets/images/profile_images/"+response.result['basicInfo']['picture']);
						}
						
				}
				else if (response.status == 'failure' && response.result =="update_profile") {
					swal('Please Update Profile to use the app !', ': [', 'warning').then((value) => {
                          window.location = './user_profile.html?id='+user_id;
					});
				}

				else if (response.status == 'failure') {
					swal('Please Login First to open profile page !', ': [', 'warning').then((value) => {
						window.location = './register_login.html';
					});
				}
				else
				{
					swal('Please Login First to open profile page !', ': [', 'warning').then((value) => {
						window.location = './register_login.html';
					});
				}
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
			sessionStorage.removeItem("user_id");
			sessionStorage.clear();
			swal("Logged out!", "", "success");
			window.location='./register_login.html';
        }
    });
})

$('.dashboard_link').click(()=>{
	window.location='./user_dashboard.html?id=' + user_id;
})

$('.profile_link').click(()=>{
	window.location='./user_profile.html?id=' + id;
})
