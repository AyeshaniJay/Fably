window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Employee");
    // refreshTable();
}

// Fill data into table
const refreshTable = () => {

    employees = new Array()

    employees = getServiceRequest("/invoice/findall");

    displayProp = ['added_datetime','callingname','mobileno','designation_id.name'];
    displayDt = ['text','text','text','object'];
    
    fillDataIntoTable(tblInvoiceReport, employees, displayProp, displayDt,
        formReFillData, deleteEmployee, viewEmployee,false,userPrivilege);

    clearTableStyle(tableEmployee);

    for (let index in employees){
        // if (employees[index].employeestatus_id.name == "Deleted"){
        //     tblInvoiceReport.children[1].children[index].children[5].children[0].style.color = "red";
        //
        // }
        // tblInvoiceReport.children[1].children[index].children[4].children[0].style.display = "none" ;
        // tblInvoiceReport.children[1].children[index].children[4].children[1].style.display = "none" ;
        // tblInvoiceReport.children[1].children[index].children[4].children[2].style.display = "none" ;
    }

    // $('#tableEmployee').DataTable();

    clearTableStyle(tableEmployee);
}

// function for refill form with data
function formReFillData(emp, rowind){}

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
    }

    return updates;
}

// update function
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
}

// view function
function viewEmployee(emp, rowind){
    
    let employeeprint = emp;

    tdPEmpRegNo.innerHTML = employeeprint.number;
    tdPEmpFullName.innerHTML = employeeprint.fullname;
    tdPEmpNIC.innerHTML = employeeprint.nic;
    tdPEmpDesignation.innerHTML = employeeprint.designation_id.name;
    if(employeeprint.photo == null){
        tdPEmpImg.src = showImg.value;
    }else tdPEmpImg.src = employeeprint.photo;

    // show print model
    $('#modelViewEmployee').modal('show');

}

function btnPrintTable(){
    let newWindow = window.open();
    let tableHtml = tblInvoiceReport.outerHTML;
    newWindow.document.write(
        "<head> <link href='resources/vendor/bootstrap/css/bootstrap.min.css' rel='stylesheet'> </head>"+
        "<body style='background-image: url(resources/images/letterhead.png);background-size: cover'><div style='margin: 110px; margin-top: 350px'>"+tableHtml+"</div></body>"
        // "<body><img src='resources/images/letterhead.png' style='width: 100%'><div style='margin: 200px; margin-top: 300px'>"+tableHtml+"</div></body>"
        // "<body><div style='background-image: url(resources/images/letterhead.png);width: 100%'></div><div style='margin: 200px; margin-top: 300px'>"+tableHtml+"</div></body>"
    );

    setTimeout(function () {
        newWindow.print();
    },200);
}

function generateReport(){
    reportInvoice = getServiceRequest("invoicereport/bysdtetype?sdte="+dteStartDte.value+"&edte="+dteEndDte.value+"&type="+selReport.value)

    displayProp = ['date','invoicecount','totalamount'];
    displayDt = ['text','text','text'];

    fillDataIntoTable(tblInvoiceReport, reportInvoice, displayProp, displayDt, formReFillData, deleteEmployee, viewEmployee,false,userPrivilege);

    for (let index in reportInvoice){
        // if (employees[index].employeestatus_id.name == "Deleted"){
        //     tblInvoiceReport.children[1].children[index].children[5].children[0].style.color = "red";
        //
        // }
        // tblInvoiceReport.children[1].children[index].children[4].children[0].style.display = "none" ;
        // tblInvoiceReport.children[1].children[index].children[4].children[1].style.display = "none" ;
    }

}