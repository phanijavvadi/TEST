export function orgUserCreation(user) {

  const body = `<div>
  Dear ${user.firstName} ${user.lastName},<br>
    
    <p> Please use below information to login care monitor platform
     </p>
    <p> Username: ${user.email}</p>
     <p>password: ${user.password}</p><br/>
     
   Thanks,
   Care monitor Team </div>
  `;
  const subject = "Care monitor Team login details";
  return {body, subject}
}
export function practiceSignupNotificationMailtoSuperAdmin(org) {

  const body = `<div>
 
    
    <p> ${org.name} sign into caremonitor , Please find below details.
     </p>
    <p> Name: ${org.name}</p>
    <p> address: ${org.address}</p>
    <p> Phone No: ${org.phoneNo}</p>
     <p>Contact Person: ${org.contPerFname} ${org.contPerLname}</p><br/>
     <p>Contact Email: ${org.contPerEmail}</p><br/>
     <p>Contact Phone No: ${org.contPerPhoneNo}</p><br/>
     <p>Contact Role: ${org.contPerUserType.name}</p><br/>
     
   Thanks,
   Care monitor portal </div>
  `;
  const subject = "Care monitor practice sign up notification";
  return {body, subject}
}
