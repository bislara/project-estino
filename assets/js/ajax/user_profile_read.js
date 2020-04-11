var url = location.href;
if (window.location.href.indexOf("?id=") >= 0) {
	var user_id = url.split("?")[1].split("=")[1];
	console.log(user_id);
	sessionStorage.setItem("user_id", user_id);
}
else
{
	swal('Please Login First to open profile page !', ': [', 'warning').then((value) => {
	window.location = './login.html';
	});
}

var paid=-1;
var id = 0;
var name = "";
var email = "";
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
										
						// document.getElementById('user_id').innerHTML = '<b>NU ID</b> : ' + id;
						// document.getElementById('user_name').innerHTML = '<b>Name</b> : ' + name;
						// document.getElementById('user_email').innerHTML = '<b>Email</b> : ' + email;
						// document.getElementById('user_phone').innerHTML = '<b>Phone</b> : ' + phone;
	     //                document.getElementById('user_address').innerHTML = '<b>Address</b> : ' + address;

						
				}
				else if (response.status == 'failure' && response.result =="update_profile") {
					swal('Please Update Profile to use the app !', ': [', 'warning').then((value) => {
                          window.location = './update_profile.html?id='+user_id;
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
			swal("Logged out!", "", "success");
			window.location='./register_login.html';
        }
    });
})

