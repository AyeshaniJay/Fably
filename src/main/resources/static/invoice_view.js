window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=InvoiceView");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Call table refresh function
    refreshTable();
}

// Fill data into table
const refreshTable = () => {

    invoices = new Array()

    invoices = getServiceRequest("/invoice/findall");

    displayProp = ['code','ordercode','totalamount','netamount','added_datetime','corder_id.orderstatus_id.name'];
    displayDt = ['text',getOrderCode,getTotalAmount,getNetAmount,getDateByDateAndTime,'object'];
    
    fillDataIntoTable(tblInvoice, invoices, displayProp, displayDt, formReFillData, deleteSupplier, viewInvoice,true,userPrivilege);

    for (let index in invoices){
        tblInvoice.children[1].children[index].children[7].children[1].style.display = "none" ;
        tblInvoice.children[1].children[index].children[7].children[0].style.marginRight = "2pxl" ;
        if (invoices[index].corder_id.orderstatus_id.name == "Invoice Created - PaidOnline" || invoices[index].corder_id.orderstatus_id.name == "Delivered"){

            tblInvoice.children[1].children[index].children[7].children[0].disabled = true ;
            tblInvoice.children[1].children[index].children[7].children[0].style.pointerEvents = "all" ;
            tblInvoice.children[1].children[index].children[7].children[0].style.cursor = "not-allowed" ;
        }
    }

    $('#tblInvoice').DataTable();

    clearTableStyle(tblInvoice);
}

function getOrderCode(ob){
    if (ob.corder_id != null){
        return ob.corder_id.code;
    }else
        return "-";
}

function getNetAmount(ob){
    if (ob != null){
        return parseFloat(ob.netamount).toFixed(2);
    }else {
        return "-";
    }
}

function getTotalAmount(ob) {
    if(ob != null) {
        return parseFloat(ob.totalamount).toFixed(2);
    } else {
        return "-";
    }
}

function getPaidAmount(ob){
    if (ob != null){
        return parseFloat(ob.paidamount).toFixed(2);
    }else {
        return "-";
    }
}

function getBalanceAmount(ob){
    if (ob != null){
        return parseFloat(ob.balanceamount).toFixed(2);
    }else {
        return "-";
    }
}

function getDateByDateAndTime(ob) {
    return ob.added_datetime.split("T")[0] + " " + ob.added_datetime.split("T")[1];
}

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect field value
    invoice = new Object();
    oldInvoice = null;

    //Create Arrays for fill drop down box select elements
    statuses = getServiceRequest("/supplierstatus/list");//create mapping list for fill all select elements
    fillSelectFeild(selectStatus, "Select Supplier Status",statuses, "name", "Active"); // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    invoice.supplierstatus_id = JSON.parse(selectStatus.value);
    selectStatus.style.borderBottom = '2px solid green'; // set valid color into selected value field
    selectStatus.disabled=true;

    // text feild need to set empty
    txtName.value = "";
    txtEmail.value = "";
    txtAddress.value = "";
    txtMobile1.value = "";
    txtMobile2.value = "";
    txtBRNumber.value = "";

    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

    invoice.productList = new Array();

    allProductList = getServiceRequest("/product/listbyorder/");
    fillSelectFeild(selProduct, "",allProductList, "name", "");

    fillSelectFeild(selSelectedProduct, "",invoice.productList, "name", "");

    // disableButton(true, false);
}

const setStyle = (style)=> {
    txtName.style.borderBottom = style;
    txtEmail.style.borderBottom = style;
    txtAddress.style.borderBottom = style;
    txtMobile1.style.borderBottom = style;
    txtMobile2.style.borderBottom = style;
    txtBRNumber.style.borderBottom = style;
    selectStatus.style.borderBottom = style;
}

// check value bindings
const getErrors = () => {
    let errors = "";
    if (invoice.name == null) {
        txtName.style.borderBottom = '2px solid red';

        errors = errors + "Name not enter... \n" ;

    } else {

    }

    if (invoice.email == null) {
        txtEmail.style.borderBottom = '2px solid red';

        errors = errors + "Email not enter... \n" ;

    } else {

    }

    if (invoice.mobile1 == null) {
        txtMobile1.style.borderBottom = '2px solid red';

        errors = errors + "Contact number not enter... \n" ;

    } else {

    }

    if (invoice.address == null) {
        txtAddress.style.borderBottom = '2px solid red';

        errors = errors + "Address not selected... \n" ;

    } else {

    }

    if (invoice.supplierstatus_id == null) {
        selectStatus.style.borderBottom = '2px solid red';

        errors = errors + "Supplier status not selected... \n" ;

    } else {

    }

    return errors;
}

function btnAddMC(){
    console.log(supplier)
    let errors = getErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure to add following Supplier" +
            "\n Supplier Name : " + supplier.name +
            "\n Supplier status : " + supplier.email +
            "\n Supplier status : " + supplier.supplierstatus_id.name;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/supplier","POST",supplier);
            if(responce == "0"){
                window.alert("Saved Successfully");
                $('#supplierAddModal').modal('hide');
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
function formReFillData(rowob, rowind){

    // Redirect to Invoice Create page
    window.location.replace("/invoicecreate?id="+rowob.id); //navigate

    /**
    clearTableStyle(tblInvoice)
    // tblInvoice.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    invoice = getServiceRequest("/invoice/getbyid/"+rowob.id);
    oldInvoice = getServiceRequest("/invoice/getbyid/"+rowob.id);

    fillSelectFeild(selSelectedProduct, "",supplier.productList, "name", "");

    allProductList = getServiceRequest("/product/listbyorder/"+rowob.id);
    fillSelectFeild(selProduct, "",allProductList, "name", "");

    fillSelectFeild(selectStatus, "Select Status",statuses, "name", invoice.supplierstatus_id.name);

    selectStatus.disabled = false;

    txtName.value = invoice.name;
    txtEmail.value = invoice.email;
    txtAddress.value = invoice.address;
    txtMobile1.value = invoice.mobile1;
    txtMobile2.value = invoice.mobile2;
    txtBRNumber.value = invoice.brnumber;

    setStyle('2px solid green');
    **/

}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(invoice != null && oldInvoice != null){
        if(invoice.name != oldInvoice.name){
            updates = updates + "Name is changed. " + oldInvoice.name + " into " + invoice.name + "\n";
        }
        if(invoice.email != oldInvoice.email){
            updates = updates + "Email is changed. " + oldInvoice.email + " into " + invoice.email + "\n";
        }
        if(invoice.mobile1 != oldInvoice.mobile1){
            updates = updates + "Contact Number is changed. " + oldInvoice.mobile1 + " into " + invoice.mobile1 + "\n";
        }
        if(invoice.mobile2 != oldInvoice.mobile2){
            updates = updates + "Contact Number 2 is changed. " + oldInvoice.mobile2 + " into " + invoice.mobile2 + "\n";
        }
        if(invoice.brnumber != oldInvoice.brnumber){
            updates = updates + "BR Number is changed. " + oldInvoice.brnumber + " into " + invoice.brnumber + "\n";
        }
        if(invoice.address != oldInvoice.address){
            updates = updates + "Address is changed. " + oldInvoice.address + " into " + invoice.address + "\n";
        }
        if(invoice.supplierstatus_id.id != oldInvoice.supplierstatus_id.id){
            updates = updates + "Supplier status is changed. \n";
        }
        if(supplier.productList.length != oldInvoice.productList.length){
            updates = updates + "Supply Products changed. \n";
        }else {
            let extProduct = 0;
            for (let i=0; i<invoice.productList.length; i++){
                for (let l=0; l<oldInvoice.productList.length; l++){
                    if (invoice.productList[i]['id'] == oldInvoice.productList[l]['id']){
                        extProduct = parseInt(extProduct) +1;
                    }
                }
            }
            if (extProduct != invoice.productList.length){
                updates = updates + "Supply Products changed. \n";
            }
        }
    }

    return updates;
}

// update function
function btnUpdateMC(){
    let errors = getErrors();
    if(errors == ""){
        let updates = getUpdate();
        if(updates != ""){

            let userConfirmation = window.confirm("Are you sure to update following changes ? \n" + updates);

            if (userConfirmation){
                let responce = getHttpBodyResponce("/invoice","PUT",invoice);
                if(responce == "0"){
                    window.alert("Updated Successfully !");
                    $('#supplierAddModal').modal('hide');
                    refreshTable();
                    refreshForm();
                }else {
                    window.alert("Update not successful ! You have server error. \n" + responce);
                }
            }
        }else{
            window.alert("Nothing updated ! \n");
        }
    }else{
        window.alert("You have following errors. \n" + errors);
    }
 }

// delete function
function deleteSupplier(ob, rowind){
    console.log("Delete");
    console.log(ob);
    console.log(rowind);
    let deletemsg = 'Are you sure to delete following invoice? \n' +
            '\n Supplier Code : ' + ob.code +
            '\n Supplier Name : ' + ob.name +
            '\n Supplier Email : ' + ob.email;
    let response = window.confirm(deletemsg);

    if(response){
        let deleteServerResponce;
        //to call developed mapping --> $.ajax....
        $.ajax("invoice", {
            async: false,
            type: "DELETE", //method
            data: JSON.stringify(ob), //data pass format convert to json string
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
            alert("You have following error. \n" + deleteServerResponce);
        }
        // suppliers.splice(rowind,1);
    }

}

// view function
function viewInvoice(invo, rowind){

    let invoicePrint = getServiceRequest("/invoice/getbyid/"+invo.id);

    txtPName.innerText = invoicePrint.corder_id.customer_id.firstname;
    txtPDate.innerText = invoicePrint.added_datetime.split("T")[0] +" "+ invoicePrint.added_datetime.split("T")[1];
    txtPMobile.innerText = invoicePrint.corder_id.customer_id.mobile;
    txtPUser.innerText = invoicePrint.addeduser_id.username;
    txtPInvoice.innerText = invoicePrint.code;
    txtPItemCount.innerText = invoicePrint.noofitem;
    txtPTotal.innerText = parseFloat(invoicePrint.totalamount).toFixed(2);
    txtPNote.innerText = invoicePrint.description;
    txtPDiscount.innerText = invoicePrint.discount;
    txtPNet.innerText = parseFloat(invoicePrint.netamount).toFixed(2);
    // txtPPaid.innerText = parseFloat(invoicePrint.paidamount).toFixed(2);
    // txtPBalance.innerText = parseFloat(invoicePrint.balanceamount).toFixed(2);

    //fill data into inner table
    displayProp = ['product_id.name','size_id.name','unitprice','qty','linetotal'];
    displayDt = ['object','object','text','text','text'];

    fillDataIntoTable(tblPrintInnerProduct, invoicePrint.invoiceProductList,displayProp,displayDt, reFill, deleterow, view,false,userPrivilege);

 //   printtable = printDiv.;
    newWindow = window.open();
    newWindow.document.write("<link href='resources/vendor/bootstrap/css/bootstrap.min.css' rel='stylesheet'>" +
        "<body style='background-image: url(resources/images/letterhead.png);background-size: cover'>" +
        "<div class='row' style='margin: 110px; margin-top: 350px'>" +
                                     printDiv.outerHTML +
        "<script>printDiv.removeAttribute('style')</script> </div>" +
        "</body>");
    
    setTimeout(function () {
       // newWindow.print();
        // newWindow.close();
    },700)

    // show print model
    // $('#modelviewInvoice').modal('show');

}

function reFill(){}
function deleterow(){}
function view(){}

const printInvoiceRow = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<script src='resources/jquery/jquery.js'></script>" +
        '<h2>Invoice Details</h2>'
        + tblInvoice.outerHTML
        );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
        newWindow.print();
    },1000
    );
}