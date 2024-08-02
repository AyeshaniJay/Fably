window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=GRN");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Call table refresh function
    refreshTable();
    // Call form refresh function
   refreshForm();
}

// Fill data into table
const refreshTable = () => {

    grns = new Array()

    grns = getServiceRequest("/grn/findall");

    displayProp = ['code','receiveddate','totalamount','grndetailstatus_id.name'];
    displayDt = ['text',splitReceivedDate,getTotalAmount,'object'];
    
    fillDataIntoTable(tblGrn, grns, displayProp, displayDt, formReFillData, deleteCustomer, viewCustomer,true,userPrivilege);

    for (let index in grns){
        if (grns[index].grndetailstatus_id.name == "Deleted"){
            tblGrn.children[1].children[index].children[4].children[0].style.color = "red";

            tblGrn.children[1].children[index].children[5].children[1].disabled = true ;
            tblGrn.children[1].children[index].children[5].children[1].style.pointerEvents = "all" ;
            tblGrn.children[1].children[index].children[5].children[1].style.cursor = "not-allowed" ;
        }

        // tblGrn.children[1].children[index].children[7].children[1].style.display = "none" ;
        // tblGrn.children[1].children[index].children[7].children[2].style.display = "none" ;
    }

    $('#tblGrn').DataTable();

    clearTableStyle(tblGrn);
}

// function getDesimalPoint(ob);

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect field value
    grn = new Object();
    oldGrn = null;

    grn.grnProductList = new Array();

    //Create Arrays for fill drop down box select elements
    porders = getServiceRequest("/purchaseorder/withoutgrn");
    grnstatuses = getServiceRequest("/grndetailstatus/list");

    // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    fillSelectFeild(selPorder, "Select Purchase Order",porders, "code", "", false);
    fillSelectFeild(selStatus, "Select GRN Status",grnstatuses, "name", "Pending", false);

    selStatus.disabled = true;

    grn.grndetailstatus_id = JSON.parse(selStatus.value); //binding auto selected values

    // text field need to set empty
    dteReceivedDate.value = "";
    txtTotal.value = "";
    txtTotal.disabled = true;

    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

    // set valid color into selected value field
    selStatus.style.borderBottom = '2px solid green';

    disableButton(true, false);
    refreshInnerFormTable();
}

const refreshInnerFormTable = () => {
    // inner Form
    grnProduct = new Object();
    oldGrnProduct = null;

    if(selPorder.value != ""){
        getProductsByPorder();
    }else{
        products = getServiceRequest("/product/list");
        fillSelectFeild2(selOrderProduct, "Select Product",products, "code", "name","");
        selOrderProduct.disabled = true;
    }

    if (selOrderProduct.value != ""){
        getSizesByProduct();
    }else {
        sizeList = getServiceRequest("/size/list");
        fillSelectFeild(selSize, "Select Size", sizeList , "name", "");
        selSize.disabled = true;
    }

    // text field need to set empty
    txtUnitPrice.value = "";
    txtUnitPrice.disabled = true;
    txtOrderQty.value = "";
    txtOrderQty.disabled = true;
    txtQty.value = "";
    txtLineTotal.value = "";
    txtLineTotal.disabled = true;

    selSize.value = "";

    selOrderProduct.style.borderBottom = '2px solid #d1d3e2';
    selSize.style.borderBottom = '2px solid #d1d3e2';
    txtUnitPrice.style.borderBottom = '2px solid #d1d3e2';
    txtOrderQty.style.borderBottom = '2px solid #d1d3e2';
    txtQty.style.borderBottom = '2px solid #d1d3e2';
    txtLineTotal.style.borderBottom = '2px solid #d1d3e2';

    // inner Table

    let totalAmount = 0.00;

    let displayProp = ['product_id.name','size_id.name','unitprice','qty','linetotal'];
    let displayDt = ['object','object','text','text','text'];

    let innerLoggedUserPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=GRN");

    fillDataIntoTable(tblGrnProduct, grn.grnProductList, displayProp, displayDt, innerFormReFill, innerRowDelete, innerRowView,true,innerLoggedUserPrivilege);

    for (let index in grn.grnProductList){
        // tblGrnProduct.children[1].children[index].children[6].children[0].style.display = "none";
        tblGrnProduct.children[1].children[index].children[6].children[2].style.display = "none";

        totalAmount = parseFloat(totalAmount) + parseFloat(grn.grnProductList[index].linetotal)
    }

    if (totalAmount != 0){
        txtTotal.value = parseFloat(totalAmount).toFixed(2);
        grn.totalamount = txtTotal.value;

        if (oldGrn != null && grn.totalamount != oldGrn.totalamount){
            txtTotal.style.borderBottom = "2px solid orange";
        }else {
            txtTotal.style.borderBottom = "2px solid green";
        }
    }
}

const btnInnerAddMC = () => {
    let nextProduct = false;

    for (let index in grn.grnProductList){
        if (grn.grnProductList[index].product_id.name == grnProduct.product_id.name && grn.grnProductList[index].size_id.name == grnProduct.size_id.name){
            nextProduct = true;
            break;
        }
    }

    if (!nextProduct){
        let confirmMsg = "Are you sure to add following GRN item ?" +
            "\n Product Name : " + grnProduct.product_id.name +
            "\n Size : " + grnProduct.size_id.name +
            "\n Unit Price : " + grnProduct.unitprice +
            "\n Quantity : " + grnProduct.qty +
            "\n Line Total : " + grnProduct.linetotal;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            grn.grnProductList.push(grnProduct);
            window.alert("Saved Successfully !");
            refreshInnerFormTable();
        }
    }else {
        window.alert("Selected product already added !")
    }

}

// function for update inner form data into inner table
function btnInnerUpdMC(){
    if (grnProduct.qty != oldGrnProduct.qty){
        let userConfirmation = window.confirm("Are you sure to update following GRN item? \n" +
            "Product Name : " + grnProduct.product_id.name +
            " \nQuantity : " + grnProduct.qty );

        if (userConfirmation){
            grn.grnProductList[parseInt(selectedInnerRow)-1] = grnProduct;
            window.alert("Inner row updated successfully !");
            refreshInnerFormTable();
        }
    }else {
        window.alert("Nothing Updated !");
    }
}

const innerFormReFill = () => {}
const innerRowDelete = () => {}

const innerRowView = () => {}

function splitReceivedDate(ob) {
    return ob.receiveddate.split("T")[0];
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
}

// check value bindings
const getErrors = () => {
    let errors = "";
    if (grn.porder_id == null) {
        selPorder.style.borderBottom = '2px solid red';
        
        errors = errors + "Purchase order not selected. \n" ;
    }

    if (grn.receiveddate == null) {
        dteReceivedDate.style.borderBottom = '2px solid red';

        errors = errors + "Received Date not selected. \n" ;
    }

    if (grn.totalamount == null) {
        txtTotal.style.borderBottom = '2px solid red';

        errors = errors + "Total amount not entered. \n" ;
    }

    return errors;
}

function buttonAddMC(){
    let errors = getErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure add following GRN ?" +
            "\n Order : " + grn.porder_id.code +
            "\n Status : " + grn.totalamount;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/grn","POST",grn);
            if(responce == "0"){
                window.alert("Saved successfully !");
                $('#grnAddModal').modal('hide');
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
function formReFillData(pro, rowind){

    clearTableStyle(tblGrn)
    tblGrn.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    grn = getServiceRequest("/grn/getbyid/"+pro.id);
    oldGrn = getServiceRequest("/grn/getbyid/"+pro.id);

    porders.push(grn.porder_id);
    fillSelectFeild(selPorder, "Select Purchase Order",porders, "code",grn.porder_id.code);
    selPorder.disabled = true;

    fillSelectFeild(selStatus, "Select Status",grnstatuses, "name", grn.grndetailstatus_id.name, false);

    txtTotal.value = grn.totalamount;
    dteReceivedDate.value = grn.receiveddate;

    setStyle('2px solid green');
    refreshInnerFormTable();

    // show add model
    $('#grnAddModal').modal('show');

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
            let responce = getHttpBodyResponce("/payment","PUT",orderpayment);
            if(responce == "0"){
                window.alert("Updated Successfully !");
                $('#grnAddModal').modal('hide');
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

    if(grn != null && oldGrn != null){
        if(grn.grndetailstatus_id.name != oldGrn.grndetailstatus_id.name){
            updates = updates + "GRN status is changed. " + oldGrn.grndetailstatus_id.name + " into " + grn.grndetailstatus_id.name + "\n";
        }
        if(grn.totalamount != oldGrn.totalamount){
            updates = updates + "Total Amount is changed. " + oldGrn.totalamount + " into " + grn.totalamount + "\n";
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
                let responce = getHttpBodyResponce("/grn","PUT",grn);
                if(responce == "0"){
                    window.alert("Updated Successfully !");
                    $('#grnAddModal').modal('hide');
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
    let deletemsg = 'Are you sure to delete following customer ? \n' +
            '\n Customer Reg No : ' + cus.number +
            '\n Customer Name : ' + cus.name;
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
            alert("Delete successfully !");
            refreshTable();
        }else {
            alert("You have error !\n" + deleteServerResponce);
        }
        // customers.splice(rowind,1);
    }
}

// view function
function viewCustomer(cus, rowind){
    
    let customerprint = cus;

    tdPCusRegNo.innerHTML = customerprint.number;
    tdPCusName.innerHTML = customerprint.name;

    // show print model
    $('#modelViewCustomer').modal('show');

}

const printCustomerRow = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<script src='resources/jquery/jquery.js'></script>" +
        "<h2>Order Payment Details</h2>"
        + tablePrintCustomer.outerHTML
        );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
        newWindow.print();
    },1000
    );
}

function getProductsByPorder(){
    orderProductList = getServiceRequest("/product/listbyporder/" + JSON.parse(selPorder.value).id);
    fillSelectFeild2(selOrderProduct, "Select Ordered Product",orderProductList, "code", "name");
    selOrderProduct.style.borderBottom = "1px solid ced4da";

    selOrderProduct.disabled = false;
    // selSize.disabled = false;
}

function getSizesByProduct(){
    orderProductSizeList = getServiceRequest("/size/listbyporderproduct/" + JSON.parse(selPorder.value).id + "/" + JSON.parse(selOrderProduct.value).id);
    fillSelectFeild(selSize, "Select Size",orderProductSizeList, "name", "");
    selSize.style.borderBottom = "1px solid ced4da";

    selSize.disabled = false;
    // selSize.disabled = false;
}

const selProductChange = () => {
    txtUnitPrice.value = parseFloat(JSON.parse(selOrderProduct.value).purchaseprice).toFixed(2);
    grnProduct.unitprice = parseFloat(txtUnitPrice.value).toFixed(2);
    txtUnitPrice.style.borderBottom = '2px solid green';
}

//get order details by select order
function getPorderDetails(){

    if (selPorder.value != ""){
        let extOrder = getServiceRequest("/purchaseorder/getbyid/" + JSON.parse(selPorder.value).id);

        // txtDate.value = extOrder.added_datetime.split("T")[0];
        // txtShippingAdd.value = extOrder.shippingaddress;
        txtPorderStatus.value = extOrder.porderstatus_id.name;
    }
}

//get supplier details by select porder
function getSuplierByPorder(){
    // let pattern = new RegExp("^[0][7][01245678][0-9]{7}$");

    if (selPorder.value != ""){
        let extSupplier = getServiceRequest("/supplier/byporder/" + JSON.parse(selPorder.value).id);
        txtSupplierName.value = extSupplier.name;
        txtMobile.value = extSupplier.mobile1;
        txtEmail.value = extSupplier.email;
        // txtAddress.value = extSupplier.address;
        // txtDate.value = .address;
    }
}

function txtQtyValidator() {
    if (txtQty.value != 0){

        let regpattern = new RegExp("^[1-9]{1,4}[0-9]{0,5}$");

        if (regpattern.test(txtQty.value)){
            txtLineTotal.value = (parseFloat(txtUnitPrice.value) * parseFloat(txtQty.value)).toFixed(2);
            txtLineTotal.style.borderBottom = "1px solid green";
            grnProduct.linetotal = txtLineTotal.value;
        }else {
            txtQty.style.borderBottom = "1px solid red";
        }

    }else {
        txtQty.style.borderBottom = "1px solid red";
    }
}

function getOrderQty(){
    porderHasProduct = getServiceRequest("/porderproduct/bypops/" + JSON.parse(selPorder.value).id + "/" + JSON.parse(selOrderProduct.value).id + "/" + JSON.parse(selSize.value).id);
    txtUnitPrice.value = porderHasProduct.unitprice;
    txtOrderQty.value = porderHasProduct.qty;

    grnProduct.orderqty = txtOrderQty.value;  //value bind
}

function getNoOfItems(){
    let noOfItems = 0;

    for (let index in grn.grnProductList){

        noOfItems = parseInt(noOfItems) + parseInt(grn.grnProductList[index].qty)
    }

    if (noOfItems != 0){
        txtNoOfItems.value = noOfItems;
        txtNoOfItems.style.borderBottom = "1px solid green";

        grn.noofitem = txtNoOfItems.value;
    }
    // txtNoOfItems.disabled = true;
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