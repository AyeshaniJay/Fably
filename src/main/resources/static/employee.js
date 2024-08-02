window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Employee");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // $('#selectDesignation').select2({
    //     theme:'bootstrap4',
    //     // if select2 in a model
    //      dropdownParent:$('#spnselectDesignation')
    // });

    // Call table refresh function
    refreshTable();
    // Call form refresh function
    refreshForm();
}

// Fill data into table
const refreshTable = () => {

    employees = new Array()

    employees = getServiceRequest("/employee/findall");

    displayProp = ['number','callingname','mobileno','designation_id.name','employeestatus_id.name','photo'];
    displayDt = ['text','text','text','object','object','imagearray'];
    
    fillDataIntoTable(tableEmployeeD, employees, displayProp, displayDt,
        formReFillData, deleteEmployee, viewEmployee,true,userPrivilege);

    clearTableStyle(tableEmployeeD);

    for (let index in employees){
        if (employees[index].employeestatus_id.name == "Deleted"){
            tableEmployeeD.children[1].children[index].children[5].children[0].style.color = "red";

            tableEmployeeD.children[1].children[index].children[7].children[1].disabled = true ;
            tableEmployeeD.children[1].children[index].children[7].children[1].style.pointerEvents = "all" ;
            tableEmployeeD.children[1].children[index].children[7].children[1].style.cursor = "not-allowed" ;
        }
    }

    $('#tableEmployeeD').DataTable(); 

    clearTableStyle(tableEmployeeD);
}

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect field value
    employee = new Object();
    oldemployee = null;

    //Create Arrays for fill drop down box select elements
    designations = getServiceRequest("/designation/list");
    statuses = getServiceRequest("/employeestatus/list");
    civilstatus = getServiceRequest("/civilstatus/list"); //create mapping list for fill all select elements

    // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    fillSelectFeild(selectCivilStatus, "Select Civil Status",civilstatus, "name");
    fillSelectFeild(selectDesignation, "Select Designation",designations, "name");
    fillSelectFeild(selectStatus, "Select Status",statuses, "name", "Working", false);

    employee.employeestatus_id = JSON.parse(selectStatus.value); //binding auto selected values

    // text field need to set empty
    txtFullname.value = "";
    callingName.value = "";
    inputEmail4.value = "";
    radioMale.checked = false;
    radioFemale.checked = false;
    lblMale.style.color = "#858796";
    lblFemale.style.color = "#858796";
    inputDOB.value = "";

    let minDate = new Date();
    let maxDate = new Date();

    maxDate.setFullYear(maxDate.getFullYear()-18);
    inputDOB.max = getCurrentDate("date",maxDate);

    minDate.setFullYear(minDate.getFullYear()-60);
    inputDOB.min = getCurrentDate("date",minDate);

    txtMobile.value = "";
    inputLand.value = "";
    txtNIC.value = "";
    inputAddress.value = "";
    formFillPhoto.value = "";
    txtPhotoname.value = "";
    empDescription.value = "";

    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

    // set valid color into selected value feild 
    selectStatus.style.borderBottom = '2px solid green';

    disableButton(true, false);
}

const setStyle = (style)=> {
    txtFullname.style.borderBottom = style;
    selectStatus.style.borderBottom = style;
    selectCivilStatus.style.borderBottom = style;
    selectDesignation.style.borderBottom = style;
    txtFullname.style.borderBottom = style;
    callingName.style.borderBottom = style;
    formFillPhoto.style.borderBottom = style;
    txtPhotoname.style.borderBottom = style;
    empDescription.style.borderBottom = style;
    inputDOB.style.borderBottom = style;
    txtMobile.style.borderBottom = style;
    inputLand.style.borderBottom = style;
    txtNIC.style.borderBottom = style;
    inputAddress.style.borderBottom = style;
    inputEmail4.style.borderBottom = style;
}

// check value bindings
const getErrors = () => {
    let errors = "";
    if (employee.fullname == null) {           
        txtFullname.style.borderBottom = '2px solid red';
        
        errors = errors + "Full name not entered. \n" ;
    }

    if (employee.callingname == null) {         
        callingName.style.borderBottom = '2px solid red';
        
        errors = errors + "Calling name not entered. \n" ;
    }

    if (employee.nic == null) {          
        txtNIC.style.borderBottom = '2px solid red';
        
        errors = errors + "NIC not entered. \n" ;
    }

    if (employee.mobileno == null) {
        txtMobile.style.borderBottom = '2px solid red';
        
        errors = errors + "Mobile not entered. \n" ;
    }

    if (employee.gender == null) {
        lblMale.style.color = 'red';            
        lblFemale.style.color = 'red';
        
        errors = errors + "Gender not selected. \n" ;
        
    }

    if (employee.employeestatus_id == null) {
        selectStatus.style.borderBottom = '2px solid red';
        
        errors = errors + "Status not selected. \n" ;
    }

    return errors;
}

function buttonAddMC(){
    let errors = getErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure add following user" +
            "\n Employee Fullname : " + employee.fullname + 
            "\n Employee Calling name : " + employee.callingname + 
            "\n NIC is : " + employee.nic + 
            "\n Gender is : " + employee.gender + 
            "\n Employee Mobile : " + employee.mobileno +
            "\n Status is : " + employee.employeestatus_id.name;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/employee","POST",employee);
            if(responce == "0"){
                window.alert("Saved Successfully");
                $('#employeeAddModal').modal('hide');
                refreshTable();
                refreshForm();
            }else{
                window.alert("Save not completed. You have following errors. \n" + responce);
            }
        }
    } else{
        alert("You have following errors \n" + errors);

    }
}

// function for refill form with data
function formReFillData(emp, rowind){

    clearTableStyle(tableEmployeeD)
    tableEmployeeD.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#90c9c0";

    employee = getServiceRequest("/employee/getbyid/"+emp.id);
    oldemployee = getServiceRequest("/employee/getbyid?id="+emp.id);

    txtFullname.value = employee.fullname;
    txtNIC.value = employee.nic;
    callingName.value = employee.callingname;
    if (employee.photo != null){
        showImg.src = atob(employee.photo);
    }else {
        showImg.src = "resources/images/noimage.jpg";
    }
    txtPhotoname.value = employee.photoname;

    if (employee.gender == "Female"){
        radioFemale.checked = true;
    } else{
        radioMale.checked = true;
    }

    inputDOB.value = employee.dob;
    txtMobile.value = employee.mobileno;

    if (employee.landno != undefined)
        inputLand.value = employee.landno;

    inputEmail4.value = employee.email;

    inputAddress.value = employee.address;

    if (employee.description != undefined)
        empDescription.value = employee.description;

    setStyle('2px solid green');

    fillSelectFeild(selectCivilStatus, "Select Civil Status",civilstatus, "name", employee.civilstatus_id.name);
    fillSelectFeild(selectDesignation, "Select Designation",designations, "name", employee.designation_id.name);
    fillSelectFeild(selectStatus, "Select Status",statuses, "name", employee.employeestatus_id.name, false);

     // show add model
     $('#employeeAddModal').modal('show');

    if (employee.description == undefined)
        empDescription.style.borderBottom = '2px solid #d1d3e2';

    if (employee.landno == undefined)
        inputLand.style.borderBottom = '2px solid #d1d3e2';

    disableButton(false,true)

}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(employee != null && oldemployee != null){
        if(employee.designation_id.id != oldemployee.designation_id.id){
            updates = updates + "Designation is changed. " + oldemployee.designation_id.name + " into " + employee.designation_id.name;
        }
        if(employee.civilstatus_id.id != oldemployee.civilstatus_id.id){
            updates = updates + "Civil Status is changed. " + oldemployee.civilstatus_id.name + " into " + employee.civilstatus_id.name;
        }
        if(employee.nic != oldemployee.nic){
            updates = updates + "NIC is changed. " + oldemployee.nic + " into " + employee.nic;
        }
        if(employee.fullname != oldemployee.fullname){
            updates = updates + "Fullname is changed. " + oldemployee.fullname + " into " + employee.fullname;
        }
        if(employee.callingname != oldemployee.callingname){
            updates = updates + "Callingname is changed. " + oldemployee.callingname + " into " + employee.callingname;
        }
        if(employee.mobileno != oldemployee.mobileno){
            updates = updates + "Mobile number is changed. " + oldemployee.mobileno + " into " + employee.mobileno;
        }
        if(employee.landno != oldemployee.landno){
            updates = updates + "Land number is changed. " + oldemployee.landno + " into " + employee.landno;
        }
        if(employee.address != oldemployee.address){
            updates = updates + "address is changed. " + oldemployee.address + " into " + employee.address;
        }
        if(employee.description != oldemployee.description){
            updates = updates + "Employee description is changed. " + oldemployee.description + " into " + employee.description;
        }
        if(employee.photo != oldemployee.photo){
            updates = updates + "Employee photo is changed. \n";
        }
        if(employee.employeestatus_id.id != oldemployee.employeestatus_id.id){
            updates = updates + "Employee status is changed. \n";
        }
        if(employee.gender != oldemployee.gender){
            updates = updates + "Gender is changed. \n";
        }
    }

    return updates;
}

// Employee update function
function buttonUpdateMC(){
    let errors = getErrors();
    if(errors == ""){
        let updates = getUpdate();

        if(updates != ""){

            let userConfirmation = window.confirm("Are you sure to update following changes? \n" + updates);

            if (userConfirmation){
                let responce = getHttpBodyResponce("/employee","PUT",employee);
                if(responce == "0"){
                    window.alert("Updated Successfully !");
                    $('#employeeAddModal').modal('hide');
                    refreshTable();
                    refreshForm();
                }else {
                    window.alert("Update not successful ! You have server error. \n" + responce);
                }
            }
        }else{
            window.alert("Nothing Updated !");
        }
    }else{
        window.alert("You have following errors. \n" + errors);
    }
 }

// delete function
function deleteEmployee(emp, rowind){
    console.log("Delete");
    console.log(emp);
    console.log(rowind);
    let deletemsg = 'Are you sure to delete following employee? \n' +
            '\n Employee Reg No : ' + emp.number +
            '\n Employee Full Name : ' + emp.fullname;
    let response = window.confirm(deletemsg);

    if(response){
        let deleteServerResponce;
        //to call developed mapping --> $.ajax....
        $.ajax("employee", {
            async: false,
            type: "DELETE", //method
            data: JSON.stringify(emp), //data pass format convert to json string
            contentType: "application/json",
            success: function (resData, resStatus, resOb) {
                deleteServerResponce = resData;
            },
            error: function (errResOb, errStatus, errMsg) {
                deleteServerResponce = errMsg;
            }
        });

        if(deleteServerResponce == "0"){
            alert("Deleted Successfully !");
            refreshTable();
        }else {
            alert("You have error \n" + deleteServerResponce);
        }
        // employees.splice(rowind,1);
    }

}

// view function
function viewEmployee(emp, rowind){

    let employeeprint = getServiceRequest("employee/getbyid/"+emp.id);

    tdPEmpRegNo.innerHTML = employeeprint.number;
    tdPEmpFullName.innerHTML = employeeprint.fullname;
    tdPEmpNIC.innerHTML = employeeprint.nic;
    tdPEmpDesignation.innerHTML = employeeprint.designation_id.name;
    if(employeeprint.photo == null){
        tdPEmpImg.src = showImg.value;
    }else tdPEmpImg.src = atob(employeeprint.photo);

    // show print model
    $('#modelViewEmployee').modal('show');

}

const printEmployeeRow = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<script src='resources/jquery/jquery.js'></script>" +
        '<h2>Employee Details</h2>' 
        + tablePrintEmployee.outerHTML
        );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
        newWindow.print();
    },1000
    );
}

// custom nic validator (generate gender and dob)
function nicValidator(){
    let nicpattern = new RegExp('^(([0-9]{9}[VvXx])|([0-9]{12}))$');

    if(txtNIC.value != ""){
        if(nicpattern.test(txtNIC.value)){

            if(txtNIC.value.length == 10){
                empnic = "19" + txtNIC.value.substring(0,5) + "0" + txtNIC.value.substring(5,9);
            }else{
                empnic = txtNIC.value;
            }

            let empBirthYear = empnic.substring(0,4);
            let empNoofBirthdays = empnic.substring(4,7);

            if(empNoofBirthdays > 500){
                radioFemale.checked = true;
                empNoofBirthdays = empNoofBirthdays - 500;
                // value binding
                employee.gender = "Female";
            }else{
                radioMale.checked = true;
                // value binding
                employee.gender = "Male";
            }
            // console.log(empNoofBirthdays);
            let empdob = new Date(empBirthYear);
            // console.log(empdob);
            empdob.setDate(empdob.getDate() -1 + parseInt(empNoofBirthdays));
            // console.log(empdob);
            inputDOB.value = getCurrentDate('date', empdob);

            // value binding
            employee.nic = txtNIC.value;
            employee.dob = inputDOB.value;

            if(oldemployee != null && employee.nic != oldemployee.nic){
                txtNIC.style.borderBottom = '2px solid orange';
                inputDOB.style.borderBottom = '2px solid orange';
            }else{
                txtNIC.style.borderBottom = '2px solid green';
                inputDOB.style.borderBottom = '2px solid green';
            }

        }else{
            employee.nic = null;
            txtNIC.style.borderBottom = '2px solid red';
        }

    }else{
        employee.nic = null;
        txtNIC.style.borderBottom = '2px solid red';
    }
}

const disableButton = (buttonAdd, buttonUpdate) =>{
    if (buttonAdd && userPrivilege.ins){
        buttonEmployeeAdd.disabled = false;
        $("#buttonEmployeeAdd").css("cursor", "pointer");
    }else {
        buttonEmployeeAdd.disabled = true;
        $("#buttonEmployeeAdd").css("cursor", "not-allowed");
    }

    if (buttonUpdate && userPrivilege.upd){
        buttonEmployeeUpdate.disabled = false;
        $("#buttonEmployeeUpdate").css("cursor", "pointer");

    }else {
        buttonEmployeeUpdate.disabled = true;
        $("#buttonEmployeeUpdate").css("cursor", "not-allowed");
    }
}

function btnClearPhoto(){
    if (employee.photo != null){
        let userResponce = window.confirm("Are you sure to clear the photo ?")

        if(userResponce){
            employee.photo = null;
            employee.photoname = null;
            showImg.src = "resources/images/noimage.jpg";
            formFillPhoto.value = "";
            formFillPhoto.style.borderBottom = "1px solid #ced4da";
            txtPhotoname.value = "";
            txtPhotoname.style.borderBottom = "1px solid #ced4da";
        }
    }else {
        employee.photo = null;
        employee.photoname = null;
        showImg.src = "resources/images/noimage.jpg";
        formFillPhoto.value = "";
        formFillPhoto.style.borderBottom = "1px solid #ced4da";
        txtPhotoname.value = "";
        txtPhotoname.style.borderBottom = "1px solid #ced4da";
    }
}