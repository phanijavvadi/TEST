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
