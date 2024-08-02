window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=InvoiceCreate");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Call form refresh function
   refreshForm();

   let url = window.location.search;
   if (url != ""){
       let invoiceId = new URLSearchParams(url).get("id");
       formReFillData(invoiceId);
   }
}

// Fill data into table
// const refreshTable = () => {
//
//     invoices = new Array()
//
//     invoices = getServiceRequest("/invoice/findall");
//
//     displayProp = ['code','ordercode','totalamount','netamount','added_datetime','corder_id.orderstatus_id.name'];
//     displayDt = ['text',getOrderCode,getTotalAmount,getNetAmount,getDateByDateAndTime,'object'];
//
//     fillDataIntoTable(tblInvoice, invoices, displayProp, displayDt, formReFillData, deleteSupplier, viewInvoice,true,userPrivilege);
// }

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect field value
    invoice = new Object();
    oldInvoice = null;

    invoice.invoiceProductList = new Array();

    selectOrder.disabled = false;

    //Create Arrays for fill drop down box select elements
    orders = getServiceRequest("/order/forinvoice");//create mapping list for fill all select elements
    fillSelectFeild(selectOrder, "Select Order",orders, "code"); // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);

    courierservices = getServiceRequest("/courier/list");
    fillSelectFeild(selCourier, "Select Courier Service",courierservices, "name");

    statuses = getServiceRequest("/invoicestatus/list");
    fillSelectFeild(selStatus, "Select Status",statuses, "name", "Active", false);

    // orderStatus = getServiceRequest("/orderstatus/list");
    // fillSelectFeild(selOrderStatus, "Select Status",orderStatus, "name", "", false);
    // selOrderStatus.disabled = true;

    invoice.invoicestatus_id = JSON.parse(selStatus.value); //binding auto selected values
    // invoice.paymentmethod_id = JSON.parse(selPayMethod.value);
    // selPayMethod.style.borderBottom = "2px solid green";
    // selPayMethod.disabled=false;
    selStatus.style.borderBottom = "2px solid green";
    selStatus.disabled=false;

    // text field need to set empty
    txtDate.value = "";
    txtMobile.value = "";
    txtEmail.value = "";
    txtShippingAdd.value = "";
    txtUnitPrice.value = "";
    orderQty.value = "";
    txtLTotal.value = "";
    txtNoOfItems.value = "";
    invoiceDescription.value = "";
    txtTotal.value = "";
    txtDiscount.value = "";
    txtNet.value = "";
    orderQty.value = "";
    selCourier.value = "";
    selOrderProduct.value = "";
    selSize.value = "";

    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

    refreshInnerFormTable();
    btnInnerAddMC.disabled = true;
    btnInnerUpdMC.disabled = true;

    disableButton(true,false);
    // getInvoiceNet();
}

const refreshInnerFormTable = () =>{

    invoiceOrderProduct = new Object();
    oldInvoiceOrderProduct = null;

    if(selectOrder.value != ""){
        getProductsByOrder();
    }else{
        orderProductList = getServiceRequest("/product/list");
        fillSelectFeild2(selOrderProduct, "Select Product",orderProductList, "code", "name");
        selOrderProduct.disabled = true;
    }
    if (selOrderProduct.value != ""){
        getSizesByProduct();
    }else {
        sizeList = getServiceRequest("/size/list");
        fillSelectFeild(selSize, "Select Size", sizeList , "name", "");
        selSize.disabled = true;
    }

    // clear input fields
    orderQty.value = "";
    orderQty.disabled = true;
    txtUnitPrice.value = "";
    txtUnitPrice.disabled = true;
    txtLTotal.value = "";
    txtLTotal.disabled = true;

    setStyle('1px solid #d1d3e2')

    //fill data into inner table
    let totalAmount = 0.00;

    displayProp = ['product','size','unitprice','orderqty','linetotal'];
    displayDt = [getProductDetail,getSizeDetail,'text','text','text'];

    let innerLoggedUserPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=InvoiceCreate");

    fillDataIntoTable(tblInner, invoice.invoiceProductList, displayProp, displayDt,
        reFillInnerForm, deleteInnerRow, viewInnerRow,true,innerLoggedUserPrivilege);

    for (let index in invoice.invoiceProductList){
        // tblInner.children[1].children[index].children[6].children[0].style.display = "none";
        tblInner.children[1].children[index].children[6].children[2].style.display = "none";

        totalAmount = parseFloat(totalAmount) + parseFloat(invoice.invoiceProductList[index].linetotal)
    }

    if (totalAmount != 0){
        txtTotal.value = parseFloat(totalAmount).toFixed(2);
        invoice.totalamount = txtTotal.value;

        if (oldInvoice != null && invoice.totalamount != oldInvoice.totalamount){
            txtTotal.style.borderBottom = "2px solid orange";
        }else {
            txtTotal.style.borderBottom = "2px solid green";
        }
        getInvoiceNet();
    }


    clearTableStyle(tblInner);

    clearTableStyle(tblInner);
}

function reFillInnerForm(innerob, innerrow){

    console.log(innerrow)
    selectedInnerRow = innerrow;

    invoiceOrderProduct = JSON.parse(JSON.stringify(innerob));
    oldInvoiceOrderProduct = JSON.parse(JSON.stringify(innerob));

    orderProductList = getServiceRequest("/product/list");
    fillSelectFeild2(selOrderProduct, "Select Product",orderProductList,"code","name", invoiceOrderProduct.product_id.code, invoiceOrderProduct.product_id.name);
    selOrderProduct.disabled = true;
    selOrderProduct.style.borderBottom = "1px solid green";

    sizeList = getServiceRequest("/size/list");
    fillSelectFeild(selSize, "Select Size", sizeList , "name",invoiceOrderProduct.size_id.name);
    selSize.disabled = true;
    selSize.style.borderBottom = "1px solid green";

    orderQty.value = invoiceOrderProduct.orderqty;
    orderQty.style.borderBottom = "1px solid green";
    orderQty.disabled = true;
    txtUnitPrice.value = invoiceOrderProduct.unitprice;
    txtUnitPrice.style.borderBottom = "1px solid green";
    txtUnitPrice.disabled = true;
    orderQty.value = invoiceOrderProduct.orderqty;
    orderQty.style.borderBottom = "1px solid green";
    txtLTotal.value = invoiceOrderProduct.linetotal;
    txtLTotal.style.borderBottom = "1px solid green";
    txtLTotal.disabled = true;
}

//remove product in inner table
function deleteInnerRow(innerob , innerrowindex){
    let deletemsg = 'Are you sure to delete following invoice product ? \n' +
        '\n Product Code : ' + innerob.product_id.code +
        '\n Product Name : ' + innerob.product_id.name;

    let response = window.confirm(deletemsg);

    if(response){
        invoice.invoiceProductList.splice(innerrowindex,1);
        window.alert("Removed Successfully !");
        refreshInnerFormTable();
    }
}

function viewInnerRow(){}

function getProductDetail(ob){
    return ob.product_id.code + " - " + ob.product_id.name;
}

function getSizeDetail(ob){
    return ob.size_id.name;
}

function txtQtyValidator() {
    // let pattern = new RegExp("^[1-9][0-9]{0,5}$")
    if (orderQty.value > 0){
        let unitPrice = JSON.parse(selOrderProduct.value).sellprice
        txtLTotal.value = (parseFloat(orderQty.value) * parseFloat(unitPrice)).toFixed(2);
        txtLTotal.style.borderBottom = "2px solid green";
        orderQty.style.borderBottom = "2px solid green";

        invoiceOrderProduct.unitprice = parseFloat(unitPrice).toFixed(2);
        invoiceOrderProduct.orderqty = orderQty.value;
        invoiceOrderProduct.linetotal = txtLTotal.value;
        if (oldInvoiceOrderProduct == null){
            btnInnerAddMC.disabled = false;
        }else {
            btnInnerUpdMC.disabled = false;
        }

    }else {
        txtLTotal.value = 0.00;
        orderQty.style.borderBottom = "1px solid red";
        txtLTotal.style.borderBottom = "1px solid #d1d3e2";
        btnInnerAddMC.disabled = true;
    }
}

function txtQtyValidatorOld() {
    // let pattern = new RegExp("^[1-9][0-9]{0,5}$")
    if (txtPQty.value > 0){
        let unitPrice = JSON.parse(selOrderProduct.value).sellprice
        txtLTotal.value = (parseFloat(txtPQty.value) * parseFloat(unitPrice)).toFixed(2);
        txtLTotal.style.borderBottom = "1px solid green";
        txtPQty.style.borderBottom = "1px solid green";

        invoiceOrderProduct.unitprice = parseFloat(unitPrice).toFixed(2);
        invoiceOrderProduct.qty = txtPQty.value;
        invoiceOrderProduct.linetotal = txtLTotal.value;
        if (oldInvoiceOrderProduct == null){
            btnInnerAddMC.disabled = false;
        }else {
            btnInnerUpdMC.disabled = false;
        }

    }else {
        txtLTotal.value = 0.00;
        txtPQty.style.borderBottom = "1px solid red";
        txtLTotal.style.borderBottom = "1px solid #d1d3e2";
        btnInnerAddMC.disabled = true;
    }
}

// function for add inner form data into inner table
function btnInnerAddMC() {

    let extSize = false;
    if (invoice.invoiceProductList.length > 0){
        for (let index in invoice.invoiceProductList){
            if (invoiceOrderProduct.product_id.id == invoice.invoiceProductList[index].product_id.id & invoiceOrderProduct.size_id.id == invoice.invoiceProductList[index].size_id.id){
                extSize = true;
                break;
            }
        }
    }
    if (extSize){
        alert("Selected product already insert !");
    } else {
        let userResponce = window.confirm("Are you sure to add following product ?\n" +
            "Product name : " + invoiceOrderProduct.product_id.name +
            "\nSize : " + invoiceOrderProduct.size_id.name +
            "\nTotal Price : " + invoiceOrderProduct.linetotal
        );
        if (userResponce){
            invoice.invoiceProductList.push(invoiceOrderProduct);
            alert("Added Successfully !")
            refreshInnerFormTable();
        }
    }
}

// function for update inner form data into inner table
function btnInnerUpdMC(){
    if (invoiceOrderProduct.orderqty != oldInvoiceOrderProduct.orderqty){
        let userConfirmation = window.confirm("Are you sure to update following invoice item ? \n" +
        "Product Name : " + invoiceOrderProduct.product_id.name +
        " \nQuantity : " + invoiceOrderProduct.orderqty );

        if (userConfirmation){
            invoice.invoiceProductList[parseInt(selectedInnerRow)-1] = invoiceOrderProduct;
            window.alert("Inner row updated successfully !");
            refreshInnerFormTable();
        }
    }else {
        window.alert("Nothing Updated !");
    }
}

const setStyle = (style)=> {
    // txtDate.style.borderBottom = style;
    // txtMobile.style.borderBottom = style;
    // txtEmail.style.borderBottom = style;
    // txtShippingAdd.style.borderBottom = style;
    txtUnitPrice.style.borderBottom = style;
    orderQty.style.borderBottom = style;
    txtLTotal.style.borderBottom = style;
    invoiceDescription.style.borderBottom = style;
    txtTotal.style.borderBottom = style;
    txtDiscount.style.borderBottom = style;
    txtNet.style.borderBottom = style;
    txtNoOfItems.style.borderBottom = style;
}

// check value bindings
const getErrors = () => {
    let errors = "";
    if (invoice.totalamount == null) {
        txtTotal.style.borderBottom = '2px solid red';
        errors = errors + "Product not selected. \n" ;
    }

    return errors;
}

//
function btnAddMC(){

    let errors = getErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure to add following Invoice ?" +
            "\n Order : " + invoice.corder_id.code +
            "\n No of Items : " + invoice.noofitem +
            "\n Invoice Amount : LKR " + parseFloat(invoice.totalamount).toFixed(2);

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/invoicecreate","POST",invoice);
            let regext = new RegExp("^[0-9]{8}$")
            if(regext.test(responce)){
                window.alert("Invoice Saved Successfully !");

                //open print
                viewInvoice(responce);

                refreshForm();
                window.location.replace("/invoiceview");
            }else{
                window.alert("Save not completed. You have following errors ! \n" + responce);
            }
        }
    } else{
        alert("You have following errors !\n" + errors);

    }
}

// function for refill form with data
function formReFillData(invoiceId, rowind){

    invoice = getServiceRequest("/invoice/getbyid/"+invoiceId);
    oldInvoice = getServiceRequest("/invoice/getbyid/"+invoiceId);

    // order = getServiceRequest("/order/getbyid/"+invoiceId);
    // courier = getServiceRequest("/courier/getbyid/"+invoiceId);
    orders.push(invoice.corder_id);
    //Create Arrays for re fill drop down box select elements
    fillSelectFeild(selectOrder, "Select Order",orders, "code",invoice.corder_id.code);
    selectOrder.disabled = true;
    fillSelectFeild(selCourier, "Select Courier Service",courierservices, "name",invoice.courier_id.name);
    fillSelectFeild(selStatus, "Select Status",statuses, "name", invoice.invoicestatus_id.name, false);
    // fillSelectFeild(selOrderStatus, "Select Order Status",orderstatuses, "name", order.orderstatus_id.name, false);


    selStatus.style.borderBottom = "2px solid green";
    selStatus.disabled=false;

    txtNoOfItems.value = invoice.noofitem;
    invoiceDescription.value = invoice.description;
    txtTotal.value = invoice.totalamount;
    txtDiscount.value = invoice.discount;
    txtNet.value = invoice.netamount;

    setStyle('2px solid green');

    refreshInnerFormTable();

    disableButton(false,true);
    // getInvoiceNet();
}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(invoice != null && oldInvoice != null){

        // if(invoice.address != oldInvoice.address){
        //     updates = updates + "Address is changed. " + oldInvoice.address + " into " + invoice.address + "\n";
        // }
        if(invoice.invoicestatus_id.id != oldInvoice.invoicestatus_id.id){
            updates = updates + "Invoice status is changed. \n";
        }
        if(invoice.invoiceProductList.length != oldInvoice.invoiceProductList.length){
            updates = updates + "Invoice Product is changed. \n";
        }else {
            let extUpd = false;
            for (let i=0; i<invoice.invoiceProductList.length; i++){
                for (let l=0; l<oldInvoice.invoiceProductList.length; l++){
                    if (invoice.invoiceProductList[i].product_id.code == oldInvoice.invoiceProductList[l].product_id.code){
                        if (invoice.invoiceProductList[i]['id'] != oldInvoice.invoiceProductList[l]['id']){
                            // extProduct = parseInt(extProduct) +1;
                            extUpd = true;
                            break;
                        }
                    }
                }
            }
            if (extProduct){
                updates = updates + "Invoice Product is changed. \n";
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

            let userConfirmation = window.confirm("Are you sure to update following changes? \n" + updates);

            if (userConfirmation){
                let responce = getHttpBodyResponce("/invoicecreate","PUT",invoice);
                if(responce == "0"){
                    window.alert("Updated Successfully !");

                    refreshForm();
                    window.location.replace("/invoiceview");
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
function deleteSupplier(ob, rowind) {
    console.log("Delete");
    console.log(ob);
    console.log(rowind);
    let deletemsg = 'Are you sure to delete following supplier? \n' +
            '\n Supplier Code : ' + ob.code +
            '\n Supplier Name : ' + ob.name +
            '\n Supplier Email : ' + ob.email;
    let response = window.confirm(deletemsg);

    if(response){
        let deleteServerResponce;
        //to call developed mapping --> $.ajax....
        $.ajax("supplier", {
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
function viewInvoice(invoCode, rowind){

    let invoicePrint = getServiceRequest("/invoice/getbycode/"+invoCode);

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
    displayProp = ['product_id.name','size_id.name','unitprice','orderqty','linetotal'];
    displayDt = ['object','object','text','text','text'];

    fillDataIntoTable(tblPrintInnerProduct, invoicePrint.invoiceProductList,displayProp,displayDt, reFill, deleterow, view,false,userPrivilege);

    let newWindow = window.open();
    newWindow.document.write("<head> <link href='resources/vendor/bootstrap/css/bootstrap.min.css' rel='stylesheet'> </head>" +
        "                     <body style='background-image: url(resources/images/letterhead.png);background-size: cover'>" +
        "                       <div style='margin: 110px; margin-top: 350px'>" +
                                     printDiv.outerHTML +
        "                       <script>printDiv.removeAttribute('style')</script></div> " +
        "                     </body>");

    setTimeout(function () {
        newWindow.print();
        // newWindow.close();
    },200)

    // show print model
    // $('#modelviewInvoice').modal('show');

}

function reFill(){}
function deleterow(){}
function view(){}

const printSupplierRow = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<script src='resources/jquery/jquery.js'></script>" +
        '<h2>Supplier Details</h2>'
        + tablePrintSupplier.outerHTML
        );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
        newWindow.print();
    },1000
    );
}

function getProductsByOrder(){
    orderProductList = getServiceRequest("/product/listbyorder/" + JSON.parse(selectOrder.value).id);
    fillSelectFeild2(selOrderProduct, "Select Product",orderProductList, "code", "name");
    selOrderProduct.style.borderBottom = "1px solid ced4da";

    selOrderProduct.disabled = false;
    // selSize.disabled = false;
}

function getSizesByProduct(){
    orderProductList.productSizeList = getServiceRequest("/size/listbyorderproduct/" + JSON.parse(selectOrder.value).id+"/" + JSON.parse(selOrderProduct.value).id);
    fillSelectFeild(selSize, "Select Size",orderProductList.productSizeList, "name", "");
    selSize.style.borderBottom = "1px solid ced4da";

    selSize.disabled = false;
}

function getOrderQtyLineTotal(){
    orderHasProduct = getServiceRequest("/productorder/bycops/" + JSON.parse(selectOrder.value).id + "/" + JSON.parse(selOrderProduct.value).id + "/" + JSON.parse(selSize.value).id);
    txtUnitPrice.value = orderHasProduct.unitprice;
    orderQty.value = orderHasProduct.qty;
    txtLTotal.value = orderHasProduct.linetotal;

    invoiceOrderProduct.orderqty = orderQty.value;  //value bind
    invoiceOrderProduct.linetotal = txtLTotal.value;  //value bind
}

function clearQtyLTotalUPrice(){
    orderQty.value = "";
    txtUnitPrice.value = "";
    txtLTotal.value = "";
    txtLTotal.style.borderBottom = "1px solid #d1d3e2";
    btnInnerAddMC.disabled = true;

    invoiceOrderProduct.unitprice = null;
    invoiceOrderProduct.qty = null;
    invoiceOrderProduct.linetotal = null;
}

//get customer details by select order
function getCustomerByOrder(){
    // let pattern = new RegExp("^[0][7][01245678][0-9]{7}$");

    if (selectOrder.value != ""){
        let extCustomer = getServiceRequest("/customer/byorder/" + JSON.parse(selectOrder.value).id);
        txtMobile.value = extCustomer.mobile;
        txtEmail.value = extCustomer.email;
        // txtShippingAdd.value = extCustomer.address;
        // txtDate.value = .address;
    }
}

//get order status by select order
function getOrderStatus(){

    orderStatus = getServiceRequest("/orderstatus/byorderid/" + JSON.parse(selectOrder.value).id);
    fillSelectFeild(selOrderStatus, "Select Order Status",orderStatus, "name", "");
    selOrderStatus.style.borderBottom = "1px solid green";

    selOrderStatus.disabled = false;
    // selSize.disabled = false;
}

//get order details by select order
function getOrderDetails(){

    if (selectOrder.value != ""){
        let extOrder = getServiceRequest("/order/getbyid/" + JSON.parse(selectOrder.value).id);

        txtDate.value = extOrder.added_datetime.split("T")[0];
        txtShippingAdd.value = extOrder.shippingaddress;
        txtOrderTotal.value = parseFloat(extOrder.totalamount).toFixed(2);
        txtShipCost.value = parseFloat(extOrder.shippingcost).toFixed(2);
        txtDiscount.value = extOrder.discount;
        txtNet.value = parseFloat(extOrder.netamount).toFixed(2);
        txtOrderStatus.value = extOrder.orderstatus_id.name;
    }
}

function getBalanceAmount() {

    let netAmount = parseFloat(txtNet.value);
    let paidAmount = parseFloat(txtPaid.value);

    if (paidAmount >= netAmount){

        invoice.paidamount = txtPaid.value;
        txtBalance.value = (paidAmount - netAmount).toFixed(2);
        invoice.balanceamount = txtBalance.value;

        btnSubmit.disabled=false;
        txtPaid.style.borderBottom = "2px solid green";
        txtBalance.style.borderBottom = "2px solid green";
    }else {
        txtPaid.style.borderBottom = "2px solid red";
        btnSubmit.disabled=true;
    }

}

function getPaidAmountByCard(){
    let payMethod = JSON.parse(selPayMethod.value).name;

    if (payMethod == "Card"){
        txtPaid.value = parseFloat(txtNet.value);
        invoice.paidamount = txtPaid.value;

        let netAmount = parseFloat(txtNet.value);
        let paidAmount = parseFloat(txtPaid.value);
        txtBalance.value = (paidAmount - netAmount).toFixed(2);
        invoice.balanceamount = txtBalance.value;

        btnSubmit.disabled=false;

        txtPaid.style.borderBottom = "2px solid green";
        txtBalance.style.borderBottom = "2px solid green";
    }
}

function getNoOfItems(){
    let noOfItems = 0;

    for (let index in invoice.invoiceProductList){

        noOfItems = parseInt(noOfItems) + parseInt(invoice.invoiceProductList[index].orderqty)
    }

    if (noOfItems != 0){
        txtNoOfItems.value = noOfItems;
        txtNoOfItems.style.borderBottom = "1px solid green";

        invoice.noofitem = txtNoOfItems.value;
    }
    // txtNoOfItems.disabled = true;
}

function updOderStatus(){

    let extOrder = getServiceRequest("/order/getbyid/" + JSON.parse(selectOrder.value).id);
    txtOrderStatus.value = extOrder.orderstatus_id.name;

    if (txtOrderStatus.value = "Ordered - PaidOnline"){
        txtOrderStatus.value = "Invoice Created - PaidOnline";
        txtOrderStatus.value = JSON.parse(extOrder.orderstatus_id.name);

    }else (txtOrderStatus.value = "Ordered - COD")
        txtOrderStatus.value = "Invoice Created - COD";
        txtOrderStatus.value = JSON.parse(extOrder.orderstatus_id.name);

    console.log(txtOrderStatus.value);
}

const disableButton = (buttonAdd, buttonUpdate) =>{
    if (buttonAdd && userPrivilege.ins){
        btnSubmit.disabled = false;
        $("#btnSubmit").css("cursor", "pointer");
    }else {
        btnSubmit.disabled = true;
        $("#btnSubmit").css("cursor", "not-allowed");
    }

    if (buttonUpdate && userPrivilege.upd){
        btnUpdate.disabled = false;
        $("#btnUpdate").css("cursor", "pointer");

    }else {
        btnUpdate.disabled = true;
        $("#btnUpdate").css("cursor", "not-allowed");
    }
}

function getNetbyDiscount(){

    if (txtTotal.value != 0.00){

        discountCalculator();

        txtTotal.style.borderBottom = "1px solid green";
        txtNet.style.borderBottom = "1px solid green";

        order.totalamount = txtTotal.value;
        order.shippingcost = txtShipCost.value;
        order.discount = txtDiscount.value;
        order.netamount = txtNet.value;
    }
}

function getInvoiceNet(){
    let extOrder = getServiceRequest("/order/getbyid/" + JSON.parse(selectOrder.value).id);

    if (extOrder.totalamount != invoice.totalamount){
        btnSubmit.disabled=true;
    }else {
        txtNet.value = extOrder.netamount;
        invoice.netamount = txtNet.value;
        btnSubmit.disabled=false;
    }
}