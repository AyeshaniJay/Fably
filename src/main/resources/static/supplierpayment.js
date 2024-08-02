window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=SupplierPayment");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Call table refresh function
    refreshTable();
    // Call form refresh function
   refreshForm();
}

// Fill data into table
const refreshTable = () => {

    supplierPayments = new Array()
    supplierPayments = getServiceRequest("/supplierpayment/findall");

    displayProp = ['code','grndetail_id.porder_id.code','added_datetime','supplier_id.name','paymentstatus_id.name'];
    displayDt = ['text','object',getDateByDateAndTime,'object','object'];

    fillDataIntoTable(tblSupplierPayment, supplierPayments, displayProp, displayDt, formAddPayments, deleteOrder, viewDeliver,true,userPrivilege);

    for (let index in supplierPayments){

        tblSupplierPayment.children[1].children[index].children[6].children[0].style.display = "none" ;
        tblSupplierPayment.children[1].children[index].children[6].children[1].style.display = "none" ;

        // tblSupplierPayment.children[1].children[index].children[6].children[0].innerHTML = "" ;
        // tblSupplierPayment.children[1].children[index].children[6].children[0].innerHTML = "<button class='btn btn-sm' style='color: #008B8B; border-color: #008B8B;border-radius: 5px; margin-top: -12px'><i class=\"fas fa-money-check\"></i> Pay</button>" ;
    }

    $('#tblSupplierPayment').DataTable();

    clearTableStyle(tblSupplierPayment);
}
// function getDesimalPoint(ob);

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect feild value
    supplierPayment = new Object();
    oldSupplierPayment = null;

    //Create Arrays for fill drop down box select elements
    suppliers = getServiceRequest("/supplier/list");
    if(selSupplier.value != ""){
        getGrnBySupplier();
        getSupBank();
    }else{
        grns = getServiceRequest("/grn/list");
        fillSelectFeild(selGRN, "Select GRN", grns, "code", "");
        selGRN.disabled = true;

        banks = getServiceRequest("/supplierbankdetail/list");
        fillSelectFeild2(selBank, "Select Bank Account", banks, "bankname", "accountnumber","");
        selBank.disabled = true;
    }
    paymethods = getServiceRequest("/paymentmethod/list");

    // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    fillSelectFeild(selSupplier, "Select Supplier",suppliers, "name", "", false);
    fillSelectFeild(selPayMethod, "Select Payment Method",paymethods, "name", "Cash", false);

    supplierPayment.paymentmethod_id = JSON.parse(selPayMethod.value); //binding auto selected values

    // text field need to set empty
    txtTotal.value = "";
    // txtDiscount.value = "";
    txtPaid.value = "";
    txtBalance.value = "";
    txtSupplierName.value = "";
    txtMobile.value = "";
    txtEmail.value = "";
    txtChequeNo.value = "";
    dteChequeDate.value = "";
    dteDepositDateTime.value = "";

    txtChequeNo.disabled=true;
    dteChequeDate.disabled=true;
    dteDepositDateTime.disabled=true;

    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

    // set valid color into selected value field
    selPayMethod.style.borderBottom = '2px solid green';

    disableButton(true, false);
}

function getDateByDateAndTime(ob) {
    return ob.added_datetime.split("T")[0];
}

function splitDateByDateAndTime(ob) {
    if (ob.receiveddate != null){
        return ob.receiveddate.split("T")[0];
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

// function getBalance(ob){
//     if (ob != null){
//         return parseFloat(ob.balancedamount).toFixed(2);
//     }else {
//         return "-";
//     }
// }

const setStyle = (style)=> {
    txtTotal.style.borderBottom = style;
    txtSupplierName.style.borderBottom = style;
    txtMobile.style.borderBottom = style;
    txtEmail.style.borderBottom = style;
    selSupplier.style.borderBottom = style;
    selGRN.style.borderBottom = style;
    txtGrnStatus.style.borderBottom = style;
    selBank.style.borderBottom = style;
    txtBankname.style.borderBottom = style;
    txtBranch.style.borderBottom = style;
    txtAccountname.style.borderBottom = style;
    txtAccountnumber.style.borderBottom = style;
    selPayMethod.style.borderBottom = style;
    txtChequeNo.style.borderBottom = style;
    dteChequeDate.style.borderBottom = style;
    dteDepositDateTime.style.borderBottom = style;
}

// check value bindings
const getErrors = () => {
    let errors = "";

    if (supplierPayment.paymentmethod_id == null) {
        selPayMethod.style.borderBottom = '2px solid red';
        
        errors = errors + "Payment method not selected. \n" ;
    }

    // if (supplierPayment.paymentstatus_id == null) {
    //     selectStatus.style.borderBottom = '2px solid red';
    //
    //     errors = errors + "Payment status not selected. \n" ;
    // }

    return errors;
}

function btnAddMC(){
    let errors = getErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure to add following payment ?" +
            "\n GRN : " + supplierPayment.grndetail_id.code +
            "\n Payment Method : " + supplierPayment.paymentmethod_id.name +
            "\n Total : LKR " + supplierPayment.totalamount;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/supplierpayment","POST",supplierPayment);
            if(responce == "0"){
                window.alert("Saved successfully !");
                $('#paymentAddModal').modal('hide');
                refreshTable();
                refreshForm();
            }else{
                window.alert("Save not completed. You have following errors !\n" + responce);
            }
        }
    } else{
        alert("You have following errors !\n" + errors);

    }
}

// function for refill form with data
function formAddPayments(ord, rowind){

    clearTableStyle(tblSupplierPayment)
    tblSupplierPayment.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    supplierPayment = getServiceRequest("/supplierpayment/getbyid/"+ord.id);
    oldSupplierPayment = getServiceRequest("/supplierpayment/getbyid/"+ord.id);

    // supplierPayment = getServiceRequest("/payment/getbyid/"+ord.id);

    txtTotal.value = supplierPayment.totalamount;
    // txtDiscount.value = supplierPayment.discount;
    txtOrder.value = supplierPayment.code;
    txtOrderType.value = supplierPayment.ordertype_id.name;
    // txtPorderStatus.value = supplierPayment.porderstatus_id.name;

    setStyle('1px solid #d1d3e2')

    // fillSelectFeild(selPorder, "Select Purchase Order",porders, "code", supplierPayment.porder_id.code, false);
    // fillSelectFeild(selPayMethod, "Select Payment Method",paymethods, "name", supplierPayment.paymentmethod_id.name, false);
    fillSelectFeild(selGRN, "Select GRN",grns, "code", supplierPayment.grndetail_id.code, false);
    // fillSelectFeild(selOrderStatus, "Select Order Status",orderstatuses, "name", order.porderstatus_id.name, false);

    // show add model
    $('#paymentAddModal').modal('show');

    // if(txtPorderStatus.value == "Pending"){
    //     selGRN.disabled = true;
    // }else {
    //     grns = getServiceRequest("/grn/getbyporder/"+ ord.id);
    //     selGRN.value = grn.code;
    //     selGRN.style.borderBottom = 'green';
    // }

    // if (order.paidamount == undefined)
    //     txtPaid.style.borderBottom = '2px solid #d1d3e2';
    //
    // if (order.balancedamount == undefined)
    //     txtBalance.style.borderBottom = '2px solid #d1d3e2';

    disableButton(false,true)
}

// function for refill form with data
function changeButtonToPaid(buttonId) {
    var button = document.getElementById(buttonId);
    if (button) {
        button.innerHTML = "Paid";
    }
}

// update function
function btnUpdateMC(){
    let errors = getErrors();
    if(errors == ""){
        let updates = getUpdate();
        if(updates != ""){
            let responce = getHttpBodyResponce("/supplierpayment","PUT",supplierPayment);
            if(responce == "0"){
                window.alert("Updated Successfully !");
                $('#paymentAddModal').modal('hide');
                refreshTable();
                refreshForm();
            }
        }else{
            window.alert("Nothing updated ! \n");
        }
    }else{
        window.alert("You have following errors !\n" + errors);
    }
}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(supplierPayment != null && oldSupplierPayment != null){
        if(supplierPayment.porder_id.code != oldSupplierPayment.porder_id.code){
            updates = updates + "Purchase Order is changed. " + oldSupplierPayment.porder_id.code + " into " + supplierPayment.porder_id.code + "\n";
        }
        if(supplierPayment.paymentmethod_id.name != oldSupplierPayment.paymentmethod_id.name){
            updates = updates + "Payment Method is changed. " + oldSupplierPayment.paymentmethod_id.name + " into " + supplierPayment.paymentmethod_id.name + "\n";
        }
        if(supplierPayment.paymentstatus_id.name != oldSupplierPayment.paymentstatus_id.name){
            updates = updates + "Payment status is changed. " + oldSupplierPayment.paymentstatus_id.name + " into " + supplierPayment.paymentstatus_id.name + "\n";
        }
        if(supplierPayment.totalamount != oldSupplierPayment.paymentstatus_id.name){
            updates = updates + "Total Amount is changed. " + oldSupplierPayment.totalamount + " into " + supplierPayment.totalamount + "\n";
        }
        if(supplierPayment.paidamount != oldSupplierPayment.paymentstatus_id.name){
            updates = updates + "Paid Amount is changed. " + oldSupplierPayment.paidamount + " into " + supplierPayment.paidamount + "\n";
        }
        if(supplierPayment.balancedamount != oldSupplierPayment.paymentstatus_id.name){
            updates = updates + "Balance Amount is changed. " + oldSupplierPayment.balancedamount + " into " + supplierPayment.balancedamount + "\n";
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

            let userConfirmation = window.confirm("Are you sure to update following changes ? \n" + updates);

            if (userConfirmation){
                let responce = getHttpBodyResponce("/supplierpayment","PUT",supplierPayment);
                if(responce == "0"){
                    window.alert("Updated Successfully !");
                    $('#paymentAddModal').modal('hide');
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
function deleteOrder(cus, rowind){}

// view function
function viewDeliver(ord, rowind){
    
    let orderDeliver = ord;

    // tdProPhoto.innerHTML = orderDeliver.number;
    // tdProCode.innerHTML = orderDeliver.name;
    // tdProName.innerHTML = orderDeliver.name;
    // tdProSellprice.innerHTML = orderDeliver.name;
    // tdProPurchaseprice.innerHTML = orderDeliver.name;

    // show print model
    $('#modelDeliver').modal('show');

}

const printCustomerRow = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<script src='resources/jquery/jquery.js'></script>" +
        '<h2>order Payment Details</h2>'
        + tblPrintDeliver.outerHTML
        );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
        newWindow.print();
    },1000
    );
}

function getBalanceAmount() {

    let totalAmount = parseFloat(txtTotal.value);
    let paidAmount = parseFloat(txtPaid.value);

    if (paidAmount >= totalAmount){

        supplierPayment.paidamount = txtPaid.value;
        txtBalance.value = (paidAmount - totalAmount).toFixed(2);
        supplierPayment.balancedamount = txtBalance.value;

        btnAdd.disabled=false;
        txtPaid.style.borderBottom = "2px solid green";
        txtBalance.style.borderBottom = "2px solid green";
    }else {
        txtPaid.style.borderBottom = "2px solid red";
        btnAdd.disabled=true;
    }

}

function getOrders() {
    ordersByOderStatus = getServiceRequest("/order/byorderstatus/" + JSON.parse(selOrderStatus.value).id);
    fillSelectFeild(selOrder, "Select Order",ordersByOderStatus, "code", "");
    selOrder.style.borderBottom = "1px solid ced4da";

    selOrder.disabled = false;
}

function getPaidAmountByCard(){
    let payMethod = JSON.parse(selPayMethod.value).name;

    if (payMethod == "Card"){
        txtPaid.value = parseFloat(txtTotal.value);
        supplierPayment.paidamount = txtPaid.value;

        let netAmount = parseFloat(txtTotal.value);
        let paidAmount = parseFloat(txtPaid.value);
        txtBalance.value = (paidAmount - netAmount).toFixed(2);
        supplierPayment.balanceamount = txtBalance.value;

        btnAdd.disabled=false;

        txtPaid.style.borderBottom = "2px solid green";
        txtBalance.style.borderBottom = "2px solid green";
    }
}

function getChequeDetails(){
    let payMethod = JSON.parse(selPayMethod.value).name;

    if (payMethod == "Cheque"){
        txtChequeNo.disabled=false;
        dteChequeDate.disabled=false;
        dteDepositDateTime.disabled=false;
    }
}

//get supplier details by select porder
function getPorderBySuplier(){
    // let pattern = new RegExp("^[0][7][01245678][0-9]{7}$");
    porderlist = getServiceRequest("/purchaseorder/bysupplier/" + JSON.parse(selSupplier.value).id);
    fillSelectFeild(selPorder,'Select Purchase Order',porderlist,'code','');

    selPorder.disabled = false;
    selPorder.style.borderBottom = "1px solid ced4da";
}

function getGrnBySupplier(){
    grnbysupplier= getServiceRequest("/grn/getbysupplier/" + JSON.parse(selSupplier.value).id);
    fillSelectFeild(selGRN, "Select GRN", grnbysupplier, "code", "");

    selGRN.disabled = false;
    selGRN.style.borderBottom = "1px solid ced4da";
}

//get order details by select order
function getSupplierDetails(){

    if (selSupplier.value != ""){
        let extSupplier = getServiceRequest("/supplier/getbyid/" + JSON.parse(selSupplier.value).id);

        // txtDate.value = extSupplier.added_datetime.split("T")[0];
        txtSupplierName.value = extSupplier.name;
        txtMobile.value = extSupplier.mobile1;
        txtEmail.value = extSupplier.email;
    }
}

//get order details by select order
function getGrnDetail(){

    if (selGRN.value != ""){
        let extGrn = getServiceRequest("/grn/getbyid/" + JSON.parse(selGRN.value).id);

        // txtDate.value = extSupplier.added_datetime.split("T")[0];
        txtGrnStatus.value = extGrn.grndetailstatus_id.name;
        txtTotal.value = extGrn.totalamount;

        supplierPayment.totalamount = txtTotal.value;

        // txtMobile.value = extGrn.mobile1;
        // txtEmail.value = extGrn.email;
    }
}

function getSupBank(){
    if (selSupplier.value != ""){
        let extSupplierBank = getServiceRequest("/supplierbankdetail/bysupplier/" + JSON.parse(selSupplier.value).id);
        fillSelectFeild2(selBank,"Select Bank Account",extSupplierBank,"bankname","accountnumber","")

        selBank.disabled = false;
        selBank.style.borderBottom = "1px solid green";
    }
}

function getSupBankDetails(){
    if (selSupplier.value != ""){
        let extSupplierBankDetails = getServiceRequest("/supplierbankdetail/getbyid/" + JSON.parse(selBank.value).id);
        fillSelectFeild2(selBank,"Select Bank Account",extSupplierBankDetails,"bankname","accountnumber","")

        // txtDate.value = extPorder.added_datetime.split("T")[0];
        txtBankname.value = extSupplierBankDetails.bankname;
        txtBranch.value = extSupplierBankDetails.branch;
        txtAccountname.value = extSupplierBankDetails.accountname;
        txtAccountnumber.value = extSupplierBankDetails.accountnumber;
        txtBankname.style.borderBottom = "1px solid green";
        txtBranch.style.borderBottom = "1px solid green";
        txtAccountname.style.borderBottom = "1px solid green";
        txtAccountnumber.style.borderBottom = "1px solid green";
    }
}

function getPorderDetails(){
    if (selPorder.value != ""){
        let extPorder = getServiceRequest("/purchaseorder/getbyid/" + JSON.parse(selPorder.value).id);

        // txtDate.value = extPorder.added_datetime.split("T")[0];
        // txtPorderStatus.value = extPorder.porderstatus_id.name;
        // txtPorderStatus.style.borderBottom = "1px solid green";
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