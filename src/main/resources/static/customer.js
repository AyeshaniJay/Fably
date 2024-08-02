window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Customer");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Call table refresh function
    refreshTable();
    // Call form refresh function
   refreshForm();
}

// Fill data into table
const refreshTable = () => {

    customers = new Array()

    customers = getServiceRequest("/customer/findall");

    displayProp = ['code','firstname','mobile','email','customerstatus_id.name'];
    displayDt = ['text','text','text','text','object'];
    
    fillDataIntoTable(tableCustomerD, customers, displayProp, displayDt,
        formReFillData, deleteCustomer, viewCustomer,true,userPrivilege);

    for (let index in customers){
        if (customers[index].customerstatus_id.name == "Deleted"){
            tableCustomerD.children[1].children[index].children[5].children[0].style.color = "red";

            tableCustomerD.children[1].children[index].children[6].children[1].disabled = true ;
            tableCustomerD.children[1].children[index].children[6].children[1].style.pointerEvents = "all" ;
            tableCustomerD.children[1].children[index].children[6].children[1].style.cursor = "not-allowed" ;
        }
    }

    $('#tableCustomerD').DataTable();

    clearTableStyle(tableCustomerD);
}

// function getDesimalPoint(ob);

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect feild value
    customer = new Object();
    oldcustomer = null;

    //Create Arrays for fill drop down box select elements
    statuses = getServiceRequest("/customerstatus/list");//create mapping list for fill all select elements

    // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    fillSelectFeild(selectStatus, "Select Status",statuses, "name", "Active", false);

    customer.customerstatus_id = JSON.parse(selectStatus.value);
    selectStatus.disabled = true;

    // assignDate.value = getCurrentDate("date", "");

    // text feild need to set empty
    txtName.value = "";
    inputEmail4.value = "";
    txtMobile.value = "";
    inputAddress.value = "";
    cusDescription.value = "";
    radioMale.checked = false;
    radioFemale.checked = false;
    lblMale.style.color = "#858796";
    lblFemale.style.color = "#858796";


    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

    // set valid color into selected value feild 
    selectStatus.style.borderBottom = '2px solid green';

    disableButton(true, false);
}

const setStyle = (style)=> {
    txtName.style.borderBottom = style;
    selectStatus.style.borderBottom = style;
    cusDescription.style.borderBottom = style;
    txtMobile.style.borderBottom = style;
    inputAddress.style.borderBottom = style;
    inputEmail4.style.borderBottom = style;
}

// check value bindings
const getCustomerErrors = () => {
    let errors = "";
    if (customer.firstname == null) {
        txtName.style.borderBottom = '2px solid red';
        
        errors = errors + "Name not entered. \n" ;

    }
    if (customer.mobile == null) {
        txtMobile.style.borderBottom = '2px solid red';
        
        errors = errors + "Mobile not entered. \n" ;
    }
    if (customer.email == null) {
        inputEmail4.style.borderBottom = '2px solid red';

        errors = errors + "Email not entered. \n" ;
    }
    if (customer.address == null) {
        inputAddress.style.borderBottom = '2px solid red';

        errors = errors + "Address not entered. \n" ;
    }
    if (customer.customerstatus_id == null) {
        selectStatus.style.borderBottom = '2px solid red';
        
        errors = errors + "Status not selected. \n" ;
        
    }

    return errors;
}

// function for add data into tabl{
//     console.log("mobileno");
//     // return "abc";
//
//     let items = [{},{}];
//     return ob.id;
// }e
function buttonAddMC(){
    let errors = getCustomerErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure to add following customer ?" +
            "\n Customer Name : " + customer.firstname +
            "\n Mobile : " + customer.mobile +
            "\n Email : " + customer.email +
            "\n Status : " + customer.customerstatus_id.name;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/customer","POST",customer);
            if(responce == "0"){
                window.alert("Saved Successfully !");
                $('#customerAddModal').modal('hide');
                // clearTableStyle(tableCustomerD)
                // tableCustomerD.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";
                refreshTable();
                refreshForm();
            }else{
                window.alert("Save not completed. You have following errors ! \n" + responce);
            }
        }
    } else{
        alert("You have following errors ! \n" + errors);

    }
} 

// function for refill form with data
function formReFillData(cus, rowind){

    clearTableStyle(tableCustomerD)
    tableCustomerD.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    customer = getServiceRequest("/customer/getbyid/"+cus.id);
    oldcustomer = getServiceRequest("/customer/getbyid/"+cus.id);

    txtName.value = customer.firstname;
    txtMobile.value = customer.mobile;
    inputEmail4.value = customer.email;
    inputAddress.value = customer.address;

    if (customer.gender == "Female"){
        radioFemale.checked = true;
    } else {
        radioMale.checked = true;
    }

    if (customer.description != undefined)
        cusDescription.value = customer.description;

    setStyle('2px solid green');

    selectStatus.disabled = false;
    fillSelectFeild(selectStatus, "Select Status",statuses, "name", customer.customerstatus_id.name, false);

     // show add model
     $('#customerAddModal').modal('show');

    if (customer.description == undefined)
        cusDescription.style.borderBottom = '2px solid #d1d3e2';

    disableButton(false, true);
}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(customer != null && oldcustomer != null){
        if(customer.firstname != oldcustomer.firstname){
            updates = updates + "First name is changed. " + oldcustomer.firstname + " into " + customer.firstname + "\n";
        }
        if(customer.mobile != oldcustomer.mobile){
            updates = updates + "Mobile number is changed. " + oldcustomer.mobile + " into " + customer.mobile + "\n";
        }
        if(customer.email != oldcustomer.email){
            updates = updates + "Email address is changed. " + oldcustomer.email + " into " + customer.email + "\n";
        }
        if(customer.address != oldcustomer.address){
            updates = updates + "Address is changed. " + oldcustomer.address + " into " + customer.address + "\n";
        }
        if(customer.description != oldcustomer.description){
            updates = updates + "Description is changed. " + oldcustomer.description + " into " + customer.description + "\n";
        }
        if(customer.customerstatus_id.id != oldcustomer.customerstatus_id.id){
            updates = updates + "Customer status is changed. \n";
        }
        if(customer.gender != oldcustomer.gender){
            updates = updates + "Gender is changed. \n";
        }
    }

    return updates;
}

// update function
function buttonUpdateMC(){
    let errors = getCustomerErrors();
    if(errors == ""){
        let updates = getUpdate();
        if(updates != ""){

            let userConfirmation = window.confirm("Are you sure to update following changes? \n" + updates);

            if (userConfirmation){
                let responce = getHttpBodyResponce("/customer","PUT",customer);
                if(responce == "0"){
                    window.alert("Updated Successfully !");
                    $('#customerAddModal').modal('hide');
                    refreshTable();
                    refreshForm();
                }else {
                    window.alert("Update not successful ! You have server error. \n" + responce);
                }
            }
        }
        else{
            window.alert("Nothing updated ! \n");
        }
    }else{
        window.alert("You have following errors. \n" + errors);
    }
 }

// delete function
function deleteCustomer(cus, rowind){
    console.log("Delete");
    console.log(cus);
    console.log(rowind);
    let deletemsg = 'Are you sure to delete following customer? \n' +
            '\n Customer Code : ' + cus.code +
            '\n Name : ' + cus.firstname;
    let response = window.confirm(deletemsg);

    if(response){
        let deleteServerResponce;
        //to call developed mapping --> $.ajax....
        $.ajax("customer", {
            async: false,
            type: "DELETE", //method
            data: JSON.stringify(cus), //data pass format convert to json string
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
        // customers.splice(rowind,1);
    }

}

// view function
function viewCustomer(cus, rowind){

    let customerprint = getServiceRequest("/customer/getbyid/"+cus.id);

    tdPCusRegNo.innerHTML = customerprint.code;
    tdPCusName.innerHTML = customerprint.firstname;
    tdPCusEmail.innerHTML = customerprint.email;
    tdCusMobile.innerHTML = customerprint.mobile;
    tdCusAddress.innerHTML = customerprint.address;
    tdCusDescription.innerHTML = customerprint.description;
    tdCusGender.innerHTML = customerprint.gender;
    tdCusStatus.innerHTML = customerprint.customerstatus_id.name;

    // show print model
    $('#modelViewCustomer').modal('show');

}

const printCustomerRow = () => {
    let newWindow = window.open();
    let tableHtml = tablePrintCustomer.outerHTML;
    newWindow.document.write(
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<script src='resources/jquery/jquery.js'></script>" +
        "<body style='background-image: url(resources/images/letterhead.png);background-size: cover'>" +
        "<div style='margin: 110px; margin-top: 320px'><h2>Customer Details</h2>"+tableHtml+"</div>" +
        "</body>"
        );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
        newWindow.print();
    },1000
    );
}

const disableButton = (buttonAdd, buttonUpdate) =>{
    if (buttonAdd && userPrivilege.ins){
        buttonCustomerAdd.disabled = false;
        $("#buttonCustomerAdd").css("cursor", "pointer");
    }else {
        buttonCustomerAdd.disabled = true;
        $("#buttonCustomerAdd").css("cursor", "not-allowed");
    }

    if (buttonUpdate && userPrivilege.upd){
        buttonCustomerUpdate.disabled = false;
        $("#buttonCustomerUpdate").css("cursor", "pointer");

    }else {
        buttonCustomerUpdate.disabled = true;
        $("#buttonCustomerUpdate").css("cursor", "not-allowed");
    }
}