window.addEventListener('load',ev =>{
    let loggedUser = getServiceRequest("/getloggeduser");

    if (loggedUser != null){
        //imgloggedUser
        if (loggedUser.photopath & loggedUser.photoname != null){
            imgLoggedUser.src = loggedUser.photopath + loggedUser.photoname
        }

        ploggeduser.innerText = loggedUser.username;
        ploggeduserrole.innerText = loggedUser.role;
    }else {
        window.location.replace("/login")
    }


    let moduleList = getServiceRequest("/modulename/byuser/" + loggedUser.username);
    for (let index in moduleList){
        document.getElementById(moduleList[index]).remove(); //remove menu bar list element
    }
} );

// function for
function buttonLogoutMC(){

        window.location.replace("/login");

}

function userSetting(){
    $("#editUserModal").modal("show");

    userDetail = getServiceRequest("/getloggeduser");
    userDetail = null;
}