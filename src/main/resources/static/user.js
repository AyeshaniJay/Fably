//add function for browser onload event
window.addEventListener('load',loadUI);

//create function for browser onload event
function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=User");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    refreshTable();
    refreshForm();
}

// function create for refresh table
const refreshTable = () =>{
    users = new Array();
    users = getServiceRequest("user/findall");

    let displayPropertyList = ['employee_id.callingname', 'roles', 'status']
    let dPTypeList = [getEmployeeNameNumber, getUserRoles, getUserStatus]

    fillDataIntoTable(tblUser , users , displayPropertyList , dPTypeList , formReFill , deleteRow , viewUser, true,userPrivilege);

    for (let index in users){
        tblUser.children[1].children[index].children[4].children[1].style.display = "none" ;
        tblUser.children[1].children[index].children[4].children[2].style.display = "none" ;
        // if (users[index].status == "Deactive"){
        //     tblUser.children[1].children[index].children[3].children[0].style.color = "red";
        //
        //     tblUser.children[1].children[index].children[4].children[1].disabled = true ;
        //     tblUser.children[1].children[index].children[4].children[1].style.pointerEvents = "all" ;
        //     tblUser.children[1].children[index].children[4].children[1].style.cursor = "not-allowed" ;
        // }
    }

    // table identify by jquery
    $('#tblUser').dataTable();

    disableButton(true,false);
}

function getEmployeeNameNumber(ob){
    if (ob.employee_id != null){
        return ob.employee_id.callingname + "-" + ob.employee_id.number;
    }else {
        return "-";
    }
}

function getUserRoles(ob){
    let userRoleList = getServiceRequest('/role/byuserid/'+ ob.id)
    let userRoles = "";
    for(let index in userRoleList){
        if (userRoleList.length-1 == index)
        userRoles = userRoles + userRoleList[index].name;
        else userRoles = userRoles + userRoleList[index].name + ", ";
    }
    return userRoles;
}
//add eka liynna

function getUserStatus(ob){
    let status = "Deactive";
    if(ob.status){
        status = "Active";
    }
    return status;
}

// view function
function viewUser(user, rowind){

    let userPrint = user;

    printUserEmp.innerHTML = userPrint.employeestatus_id.name;
    txtUsername.innerHTML = userPrint.username;
    tdPEmpFullName.innerHTML = userPrint.fullname;
    tdPEmpNIC.innerHTML = userPrint.nic;
    // tdPEmpDesignation.innerHTML = userPrint.designation_id.name;
    if(userPrint.photo == null){
        tdPEmpImg.src = showImg.value;
    }else tdPEmpImg.src = userPrint.photo;

    // show print model
    $('#modelViewUser').modal('show');

}

const printUserRow = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<script src='resources/jquery/jquery.js'></script>" +
        '<h2>User Details</h2>'
        + tablePrintUser.outerHTML
    );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
            newWindow.print();
        },1000
    );
}

// function create for refresh form
const refreshForm = () =>{

    //new object for add new user
    user = new Object();
    olduser = null;

    user.roles = new Array();

    //userRole list for create user roles checkbox
    let userRolesList = getServiceRequest("role/list");

    divRoles.innerHTML = "";

    for(let index in userRolesList){
        divroles = document.createElement('div');
        divroles.classList.add('form-check');
        inputCheckBox = document.createElement('input');
        inputCheckBox.type = "checkbox";
        inputCheckBox.value = index;
        inputCheckBox.classList.add('form-check-input');
        inputCheckBox.onchange = function(){
            if(this.checked){
                console.log("checked")
                console.log(this.value)
                user.roles.push(userRolesList[this.value]);
            }else{
                console.log("unchecked")
                console.log(this.value)
                let uncheckedRole = userRolesList[this.value];

                for (let index in user.roles){
                    if (user.roles[index]['id'] == uncheckedRole.id){
                        user.roles.splice(index,1);
                        break;
                    }
                }
            }
        }

        // if(user.roles.length != 0){
        //     let extIndex = user.roles.map(e => e.name).indexOf(userRolesList[index]['name']);
        //     console.log(extIndex);
        // }

        inputLable = document.createElement('lable');
        inputLable.innerHTML = userRolesList[index]['name'];
        inputLable.classList.add('form-check-label');
        inputLable.classList.add('font-weight-bold');

        divroles.appendChild(inputCheckBox);
        divroles.appendChild(inputLable);
        divRoles.appendChild(divroles);
    }

    //fill data into select element
    employeeWithoutUserAccount = getServiceRequest("/employee/withoutuseraccount");
    fillSelectFeild2(selectEmployee, "Select Employee", employeeWithoutUserAccount, 'number','callingname');

    function btnSubmitMC(){
        console.log(user);
    }

    //need to set value empty for text field
    txtUsername.value = "";
    txtPassword.value = "";
    txtRetypePassword.value = "";
    txtPassword.disabled = false;
    txtRetypePassword.disabled = false;
    txtEmail.value = "";

    chkUserStatus.checked = true;
    user.status = true;

    // set initial color for ui element
    setStyle("2px solid #ced4da");

    setDisabledButton();
}

// function for disable buttons
function setDisabledButton(){
    for(let index in users){
        if(users[index]['status']){
            // tblUser.children[1].children[index].style.backgroundColor = "green";
            tblUser.children[1].children[index].children[4].style.color = "green";
        }else{
            // tblUser.children[1].children[index].style.backgroundColor = "red";
            tblUser.children[1].children[index].children[4].style.color = "red";
        }
    }

}

// function for set ui into given color
function setStyle(style){
    selectEmployee.style.borderBottom = style;
    txtUsername.style.borderBottom = style;
    txtPassword.style.borderBottom = style;
    txtRetypePassword.style.borderBottom = style;
    txtEmail.style.borderBottom = style;

}

// function for check object value
function checkErros(){
    let errors = "";

    if(user.employee_id == null){
        errors = errors + "Please select Employee. \n";
    }
    if(user.username == null){
        errors = errors + "Please enter Username. \n";
    }
    if (olduser == null){
        if(user.password == null){
            errors = errors + "Please enter Password. \n";
        }
        if(txtRetypePassword.value == ""){
            errors = errors + "Please re-enter Password. \n";
        }
        if(txtRetypePassword.value != user.password){
            errors = errors + "Password not match. \n";
        }
    }
    if(user.email == null){
        errors = errors + "Please enter Email. \n";
    }
    if(user.roles.length == 0){
        errors = errors + "Please select user roles. \n";
    }
    if (user.status == null){
        errors = errors + "Please select Status. \n"
    }

    return errors;
}

// function for submit button
function btnSubmitMC(){
    console.log(user);
    let errors = checkErros();

    if(errors == ""){
        let confirmMsg = "Are you sure to add following user ?" +
            "\n Employee : " + user.employee_id.callingname +
            "\n Username : " + user.username +
            "\n Email : " + user.email +
            "\n User status : " + getUserStatus(user);

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/user","POST",user);
            if(responce == "0"){
                window.alert("Saved Successfully");
                refreshTable();
                refreshForm();
            }else{
                window.alert("Save not completed. You have following errors. \n" + responce);
            }
        }
    }else{
        window.alert("You have following errors. \n" + errors);
    }
}

// function for refill form
function formReFill(ob,rowno){
    user = JSON.parse(JSON.stringify(ob));
    olduser = JSON.parse(JSON.stringify(ob));

    user.roles = getServiceRequest("role/byuserid/" + user.id);
    olduser.roles = getServiceRequest("role/byuserid/" + olduser.id);

    //fill data into select element
    employeeWithoutUserAccount.push(user.employee_id);
    fillSelectFeild2(selectEmployee,"Select Employee", employeeWithoutUserAccount,"number","callingname",user.employee_id.number)

    txtUsername.value = user.username;
    txtPassword.disabled = true;
    txtRetypePassword.disabled = true;
    txtEmail.value = user.email;

    if(user.status){
        chkUserStatus.checked = true;
        lblUserStatus.innerText = 'User Account is Active';
    }else{
        chkUserStatus.checked = false;
        lblUserStatus.innerText = 'User Account is Deactive';
    }

    let userRolesList = getServiceRequest("role/list");

    divRoles.innerHTML = "";
    for(let index in userRolesList){
        divroles = document.createElement('div');
        divroles.classList.add('form-check');
        inputCheckBox = document.createElement('input');
        inputCheckBox.type = "checkbox";
        inputCheckBox.value = index;
        inputCheckBox.classList.add('form-check-input');
        inputCheckBox.onchange = function(){

            if(this.checked){
                console.log("checked");
                console.log(this.value);
                user.roles.push(userRolesList[this.value]);
            }else{
                console.log("unchecked");
                console.log(this.value);
                userRolesList[this.value]
                for (let ind in user.roles){
                    if (user.roles[ind]["name"] == userRolesList[this.value]["name"]){
                        user.roles.splice(ind,1);
                    }
                }
            }
        }

        if(user.roles.length != 0){
            let extIndex = user.roles.map(e => e.name).indexOf(userRolesList[index]['name']);
            if(extIndex != -1){
                inputCheckBox.checked = true;
            }
        }

        inputLable = document.createElement('lable');
        inputLable.innerHTML = userRolesList[index]['name'];
        inputLable.classList.add('form-check-label');
        inputLable.classList.add('font-weight-bold');

        divroles.appendChild(inputCheckBox);
        divroles.appendChild(inputLable);
        divRoles.appendChild(divroles);
    }

    setStyle("2px solid green");

    txtPassword.style.borderBottom = "2px solid #ced4da";
    txtRetypePassword.style.borderBottom = "2px solid #ced4da";

    disableButton(false,true)
}

// function for check valible update values
const getUpdates = () => {
    let updates = "";

    if(user != null && olduser != null){

        if(user.employee_id.number != olduser.employee_id.number){
            updates = updates + "Employee is changed. " + olduser.employee_id.number + " into " + user.employee_id.number + "\n";
        }
        if(user.username != olduser.username){
            updates = updates + "User name is changed. " + olduser.username + " into " + user.username + "\n";
        }
        if(user.email != olduser.email){
            updates = updates + "User email is changed. " + olduser.email + " into " + user.email + "\n";
        }
        if(user.roles.length != olduser.roles.length){
            updates = updates + "User role changed. \n";
        }
        else {
            let extRoleCount = 0;
            for (let index in olduser.roles){
                for (let ind in user.roles){
                    if (olduser.roles[index].id == user.roles[ind].id){
                        extRoleCount = parseInt(extRoleCount) + 1;
                        break;
                    }
                }
            }
            if (user.roles.length != extRoleCount){
                updates = updates + "User role changed. \n";
            }
        }

        if(user.status != olduser.status){
            updates = updates + "User status is changed. \n";
        }

    }
    return updates;
}

// function for update button
function btnUpdateMC(){
    let errors = checkErros();
    if(errors == ""){
        let updates = getUpdates();
        if(updates != ""){

            let userUpdateResponce = window.confirm("Are you sure to update following changes ? \n" + updates);

            if (userUpdateResponce){
                let responce = getHttpBodyResponce("/user","PUT",user);
                if(responce == "0"){
                    window.alert("Updated Successfully !");
                    refreshTable();
                    refreshForm();
                }else {
                    window.alert("You have following server errors ! \n" + responce);
                }
            }



        }else{
            window.alert("Nothing Updated !");
        }
    }else{
        window.alert("You have following errors ! \n" + errors);
    }
}

// function for delete row
const deleteRow = (ob,rowno) => {
    user = ob;
    //get user confirmation
    let userResponce = window.confirm("Are you sure to delete following user? \n" +
    "User Name : " + user.username +
    "\nEmail : " + user.email);

    //check user confirmation ok or not
    if (userResponce){//if ok
        let serverResponce = getHttpBodyResponce("/user","DELETE",user); //call ajax request
        //check server responce
        if (serverResponce == '0'){ //if responce ok
            alert("Delete successfully.");
            refreshTable();
        }else { //if not
            alert("Delete not completed : You have following errors \n" + serverResponce);
        }
    }
}

// function for check re-enter password matching
function checkPassword(){
    let password = txtPassword.value;
    let repassword = txtRetypePassword.value;

    if(password == repassword){
        txtRetypePassword.style.borderBottom = "2px solid green";
        user.repassword = repassword;
    }else{
        // window.alert("password does not match");
        txtRetypePassword.style.borderBottom = "2px solid red";
        user.repassword = null;
    }
}


const disableButton = (buttonAdd, buttonUpdate) =>{
    if (buttonAdd && userPrivilege.ins){
        btnAdd.disabled = false;
        $("#btnAdd").css("cursor", "pointer");
    }else {
        btnAdd.disabled = true;
        $("#btnAdd").css("cursor", "not-allowed");
    }

    if (buttonUpdate && userPrivilege.upd){
        btnUpdate.disabled = false;
        $("#btnUpdate").css("cursor", "pointer");

    }else {
        btnUpdate.disabled = true;
        $("#btnUpdate").css("cursor", "not-allowed");
    }
}