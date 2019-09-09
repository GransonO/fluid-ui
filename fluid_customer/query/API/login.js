
$('button#mobileLogin').on('click',function(){

	var phoneNumber = $('input#phoneNumber').val();

	if(phoneNumber.trim() !== "" ){
		phoneNumber = validatephoneNumber(phoneNumber)
		swal({
			title: "Validating...",
			text: "checking for your account...",
			type: "info",
			confirmButtonColor: "#1dbf07",
			showCancelButton: true,
			closeOnConfirm: false,
			showLoaderOnConfirm: true,
			  },function(isConfirm){
				  if (isConfirm) {
				   validateUser(phoneNumber);
				  }
		  });
	}	
 
});

function validateUser(phoneNumber){
    $.ajax({
		type: 'POST',
        crossDomain: true,
        data: {
            phone:phoneNumber
        },
		dataType: 'json',
		url: 'https://0bab949b.ngrok.io/auth/mobile',
		success: function(jsondata){
			// open customers page

			if(jsondata.data.result.status) {
				const userData = {
					"customer_name": jsondata.data.customer_name,
					"customer_phone" : jsondata.data.customer_phone
				}
				localStorage.setItem("jade-userdata", JSON.stringify(userData));
				window.open('./profile.htm', '_self');
			}else{
				swal({
					title: "Login error",
					text: "We could not get your account. Contact support",
					type: "warn",
					timer: 4500,
				  });
			}
		},
		error: function (request,status, error) {
            console.log("There was an error : ", error);
            swal({
                title: "Error alert",
                text: "Something happened, contact support for assistance",
                type: "error",
                timer: 3500,
                showConfirmButton: false
              });
        }
	 });
}

function validatephoneNumber(phoneNumber) {
	
	if(phoneNumber.length !== 10){
		swal({
			title: "Phone number error!",
			text: "Your phone number should have (10) digits",
			type: "warning",
			timer: 3500,
			showConfirmButton: false
		  });
		return "error"

	} else if(phoneNumber.split("")[0] !== '0'){
		swal({
			title: "Phone number error!",
			text: "Your phone number should start with zero (0)",
			type: "warning",
			timer: 3500,
			showConfirmButton: false
		});
		return "error";
	} if(!parseInt(phoneNumber, 10)){
		swal({
			title: "Phone number error!",
			text: "The phone number is not identifiable",
			type: "warning",
			timer: 3500,
			showConfirmButton: false
		});
		return "error";
	} else {
		return phoneNumber;
	}
};
