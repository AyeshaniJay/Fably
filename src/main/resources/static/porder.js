window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Porder");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Call table refresh function
    refreshTable();
    // Call form refresh function
    refreshForm();
}

// Fill data into table
const refreshTable = () => {

    porders = new Array()
    porders = getServiceRequest("/purchaseorder/findall");

    // porders = getServiceRequest("/purchaseorder/findall");

    displayProp = ['code','product','added_datetime','requiredate','porderstatus_id.name'];
    displayDt = ['text',getProductsName,getDateByDateAndTime,splitDateByDateAndTime,'object'];
    
    fillDataIntoTable(tablePorder, porders, displayProp, displayDt, formReFillData, deleteEmployee, viewPOrder,true,userPrivilege);

    clearTableStyle(tablePorder);

    for (let index in porders){
        if (porders[index].porderstatus_id.name == "Deleted"){
            tablePorder.children[1].children[index].children[5].children[0].style.color = "red";

            tablePorder.children[1].children[index].children[6].children[1].disabled = true ;
            tablePorder.children[1].children[index].children[6].children[1].style.pointerEvents = "all" ;
            tablePorder.children[1].children[index].children[6].children[1].style.cursor = "not-allowed" ;
        }
    }

    $('#tablePorder').DataTable();

    clearTableStyle(tablePorder);
}

function getProductsName(ob){

    let porderProductList = getServiceRequest("/product/listbyporder/"+ob.id);
    let oderProductName = "";
    for (let index in porderProductList){
        if (porderProductList.length-1 == index)
            oderProductName = oderProductName + porderProductList[index].name;
        else oderProductName = oderProductName + porderProductList[index].name + ", ";
    }
    return oderProductName;
}

function getProductsCount(ob){

    let porderProductList = getServiceRequest("/product/listbyporder/"+ob.id);
    return porderProductList.length;
}

function getDateByDateAndTime(ob) {
    return ob.added_datetime.split("T")[0];
}

function splitDateByDateAndTime(ob) {
    if (ob.requiredate != null){
        return ob.requiredate.split("T")[0];
    }else {
        return "-";
    }
}

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect field value
    porder = new Object();
    oldPorder = null;

    porder.porderProductList = new Array();

    //Create Arrays for fill drop down box select elements
    suppliers = getServiceRequest("/supplier/active");//create mapping list for fill all select elements
    porderstatuses = getServiceRequest("/porderstatus/list");//create mapping list for fill all select elements

    // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    fillSelectFeild(selSupplier, "Select Supplier",suppliers, "name");
    fillSelectFeild(selStatus, "Select Status",porderstatuses, "name", "Ordered", false);

    porder.porderstatus_id = JSON.parse(selStatus.value); //binding auto selected values

    // text field need to set empty
    dteRequireDate.value = "";
    txtTotal.value = "";
    txtTotal.disabled = true;

    let minFromCurrentDate = new Date();
    minFromCurrentDate.setDate(minFromCurrentDate.getDate()+2);

    // dteRequireDate.min = "2013-06-01";
    dteRequireDate.min = minFromCurrentDate.getFullYear() + getMonthDate(minFromCurrentDate);

    let maxFromCurrentDate = new Date();
    maxFromCurrentDate.setDate(maxFromCurrentDate.getDate()+16);

    // dteRequireDate.max = "2013-06-15";
    dteRequireDate.max = maxFromCurrentDate.getFullYear() + getMonthDate(maxFromCurrentDate);

    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

    // set valid color into selected value field
    selStatus.style.borderBottom = '2px solid green';

    disableButton(true, false);
    refreshInnerFormTable();
}

const refreshInnerFormTable = () => {
    // inner Form
    porderProduct = new Object();
    oldPorderProduct = null;

    if(selSupplier.value != ""){
        getProductsBySupplier();
    }else{
        products = getServiceRequest("/product/list");
        fillSelectFeild2(selProduct, "Select Product",products, "code", "name","");
        selProduct.disabled = true;
    }

    if (selProduct.value != ""){
        getSizesByProduct();
    }else {
        sizeList = getServiceRequest("/size/list");
        fillSelectFeild(selSize, "Select Size", sizeList , "name", "");
        selSize.disabled = true;
    }

    // text field need to set empty
    txtUnitPrice.value = "";
    txtUnitPrice.disabled = true;
    txtQty.value = "";
    txtLineTotal.value = "";
    txtLineTotal.disabled = true;

    selSize.value = "";

    selProduct.style.borderBottom = '2px solid #d1d3e2';
    selSize.style.borderBottom = '2px solid #d1d3e2';
    txtUnitPrice.style.borderBottom = '2px solid #d1d3e2';
    txtQty.style.borderBottom = '2px solid #d1d3e2';
    txtLineTotal.style.borderBottom = '2px solid #d1d3e2';

    // inner Table

    let totalAmount = 0.00;
    let discountAmount = 0.00;

    let displayProp = ['product_id.name','size_id.name','unitprice','qty','linetotal'];
    let displayDt = ['object','object','text','text','text'];

    let innerLoggedUserPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Porder");

    fillDataIntoTable(tablePorderProduct, porder.porderProductList, displayProp, displayDt, innerFormReFill, innerRowDelete, innerRowView,true,innerLoggedUserPrivilege);

    for (let index in porder.porderProductList){
        // tablePorderProduct.children[1].children[index].children[6].children[0].style.display = "none";
        tablePorderProduct.children[1].children[index].children[6].children[2].style.display = "none";

        totalAmount = parseFloat(totalAmount) + parseFloat(porder.porderProductList[index].linetotal)
    }

    if (totalAmount != 0){
        txtTotal.value = parseFloat(totalAmount).toFixed(2);
        porder.totalamount = txtTotal.value;

        if (oldPorder != null && porder.totalamount != oldPorder.totalamount){
            txtTotal.style.borderBottom = "2px solid orange";
        }else {
            txtTotal.style.borderBottom = "2px solid green";
        }
    }
}

const selProductChange = () => {
    txtUnitPrice.value = parseFloat(JSON.parse(selProduct.value).purchaseprice).toFixed(2);
    porderProduct.unitprice = parseFloat(txtUnitPrice.value).toFixed(2);
    txtUnitPrice.style.borderBottom = '2px solid green';
}

const btnInnerAddMC = () => {
    let nextProduct = false;

    for (let index in porder.porderProductList){
        if (porder.porderProductList[index].product_id.name == porderProduct.product_id.name && porder.porderProductList[index].size_id.name == porderProduct.size_id.name){
            nextProduct = true;
            break;
        }
    }

    if (!nextProduct){
        let confirmMsg = "Are you sure add following purchase order product details ?" +
            "\n Product Name : " + porderProduct.product_id.name +
            "\n Size : " + porderProduct.size_id.name +
            "\n Unit Price : " + porderProduct.unitprice +
            "\n Quantity : " + porderProduct.qty +
            "\n Line Total : " + porderProduct.linetotal;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            porder.porderProductList.push(porderProduct);
            window.alert("Saved Successfully !");
            refreshInnerFormTable();
        }
    }else {
        window.alert("Selected product already added !")
    }

}

// function for update inner form data into inner table
function btnInnerUpdMC(){
    if (porderProduct.qty != oldPorderProduct.qty){
        let userConfirmation = window.confirm("Are you sure to update following Purchase order item? \n" +
            "Product Name : " + porderProduct.product_id.name +
            " \nQuantity : " + porderProduct.qty );

        if (userConfirmation){
            grn.grnProductList[parseInt(selectedInnerRow)-1] = porderProduct;
            window.alert("Inner row updated successfully !");
            refreshInnerFormTable();
        }
    }else {
        window.alert("Nothing Updated !");
    }
}

const innerFormReFill = (innerob, innerrow) => {
    selectedInnerRow = innerrow;

    porderProduct = JSON.parse(JSON.stringify(innerob));
    oldPorderProduct = JSON.parse(JSON.stringify(innerob));

    porderProductList = getServiceRequest("/product/list");
    fillSelectFeild2(selOrderProduct, "Select Ordered Product",porderProductList,"code","name", porderProduct.product_id.code, porderProduct.product_id.name);
    selOrderProduct.disabled = true;
    selOrderProduct.style.borderBottom = "1px solid green";

    sizeList = getServiceRequest("/size/list");
    fillSelectFeild(selSize, "Select Size", sizeList , "name",porderProduct.size_id.name);
    selSize.disabled = true;
    selSize.style.borderBottom = "1px solid green";

    orderQty.value = porderProduct.orderqty;
    orderQty.style.borderBottom = "1px solid green";
    orderQty.disabled = true;
    txtUnitPrice.value = porderProduct.unitprice;
    txtUnitPrice.style.borderBottom = "1px solid green";
    txtUnitPrice.disabled = true;
    txtPQty.value = porderProduct.qty;
    txtPQty.style.borderBottom = "1px solid green";
    txtLTotal.value = porderProduct.linetotal;
    txtLTotal.style.borderBottom = "1px solid green";
    txtLTotal.disabled = true;
}
const innerRowDelete = () => {}

const innerRowView = () => {}

const setStyle = (style)=> {
    selSupplier.style.borderBottom = style;
    selStatus.style.borderBottom = style;
    dteRequireDate.style.borderBottom = style;
    txtTotal.style.borderBottom = style;
}

// check value bindings
const chkErrors = () => {
    let errors = "";

    if (porder.supplier_id == null) {
        selSupplier.style.borderBottom = '2px solid red';
        errors = errors + "Supplier not selected. \n" ;

    }
    if (porder.requiredate == null) {
        dteRequireDate.style.borderBottom = '2px solid red';
        errors = errors + "Required date not entered. \n" ;

    }
    if (porder.totalamount == null) {
        txtTotal.style.borderBottom = '2px solid red';
        errors = errors + "Total amount not entered. \n" ;
        
    }
    if (porder.porderProductList.length == 0) {
        // txtMobile.style.borderBottom = '2px solid red';
        errors = errors + "Product not selected. \n" ;
        
    }
    if (porder.porderstatus_id == null) {
        selStatus.style.borderBottom = '2px solid red';
        errors = errors + "Purchase order status not selected. \n" ;

    }
    return errors;
}

function buttonAddMC(){
    console.log(porder)
    let errors = chkErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure add following purchase order detail?" +
            "\n Supplier : " + porder.supplier_id.name +
            "\n Require Date : " + porder.requiredate +
            "\n Total Amount : " + porder.totalamount;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/purchaseorder","POST",porder);
            if(responce == "0"){
                window.alert("Saved Successfully !");
                refreshTable();
                refreshForm();
                $('#porderAddModal').modal('hide');
            }else{
                window.alert("Save not completed. You have following errors. \n" + responce);
            }
        }
    } else{
        alert("You have following errors \n" + errors);

    }
}

function btnClearMC(){
    refreshForm();
}

// function for refill form with data
function formReFillData(por, rowind){

    clearTableStyle(tablePorder)
    tablePorder.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    porder = getServiceRequest("/purchaseorder/getbyid/"+por.id);
    oldPorder = getServiceRequest("/purchaseorder/getbyid/"+por.id);

    fillSelectFeild(selSupplier, "Select Supplier",suppliers, "name", porder.supplier_id.name);
    fillSelectFeild(selStatus, "Select Status",porderstatuses, "name", porder.porderstatus_id.name, false);

    // selSupplier.value = porder.supplier
    dteRequireDate.value = porder.requiredate
    txtTotal.value = porder.totalamount;

    setStyle('2px solid green');

    refreshInnerFormTable();

     // show add model
     $('#porderAddModal').modal('show');

     disableButton(false,true)

}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(porder != null && oldPorder != null){
        if(porder.designation_id.id != oldPorder.designation_id.id){
            updates = updates + "Designation is changed. " + oldPorder.designation_id.name + " into " + employee.designation_id.name;
        }
        if(porder.civilstatus_id.id != oldPorder.civilstatus_id.id){
            updates = updates + "Civil Status is changed. " + oldPorder.civilstatus_id.name + " into " + employee.civilstatus_id.name;
        }
        if(porder.nic != oldPorder.nic){
            updates = updates + "NIC is changed. " + oldPorder.nic + " into " + employee.nic;
        }
        if(porder.fullname != oldPorder.fullname){
            updates = updates + "Fullname is changed. " + oldPorder.fullname + " into " + employee.fullname;
        }
        if(porder.callingname != oldPorder.callingname){
            updates = updates + "Callingname is changed. " + oldPorder.callingname + " into " + employee.callingname;
        }
        if(porder.mobileno != oldPorder.mobileno){
            updates = updates + "Mobile number is changed. " + oldPorder.mobileno + " into " + employee.mobileno;
        }
        if(porder.landno != oldPorder.landno){
            updates = updates + "Land number is changed. " + oldemployee.landno + " into " + employee.landno;
        }
        if(porder.address != oldemployee.address){
            updates = updates + "address is changed. " + oldemployee.address + " into " + employee.address;
        }
        if(porder.description != oldemployee.description){
            updates = updates + "Employee description is changed. " + oldemployee.description + " into " + employee.description;
        }
        if(porder.photo != oldemployee.photo){
            updates = updates + "Employee photo is changed. \n";
        }
        if(porder.employeestatus_id.id != oldemployee.employeestatus_id.id){
            updates = updates + "Employee status is changed. \n";
        }
    }

    return updates;
}

// update function
function buttonUpdateMC(){
    let errors = chkErrors();
    if(errors == ""){
        let updates = getUpdate();
        if(updates != ""){

            let userConfirmation = window.confirm("Are you sure to update following changes? \n" + updates);

            if (userConfirmation){
                let responce = getHttpBodyResponce("/employee","PUT",employee);
                if(responce == "0"){
                    window.alert("Updated Successfully !");
                    $('#porderAddModal').modal('hide');
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
function deleteEmployee(ob, rowind){
    let deletemsg = 'Are you sure to delete following purchase order? \n' +
            '\n Purchase order code : ' + ob.code;
    let response = window.confirm(deletemsg);

    if(response){
        let deleteServerResponce;
        //to call developed mapping --> $.ajax....
        $.ajax("purchaseorder", {
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
            alert("You have error \n" + deleteServerResponce);
        }
        // employees.splice(rowind,1);
    }

}

// view function
function viewPOrder(ord, rowind){

    let orderPrint = getServiceRequest("/purchaseorder/getbyid/"+ord.id);

    tdCode.innerHTML = orderPrint.code;
    tdSupplier.innerHTML = orderPrint.supplier_id.name;
    tdProducts.innerHTML = orderPrint.porderProductList;
    tdOrderTotal.innerHTML = "LKR " + (orderPrint.totalamount).toFixed(2);
    tdAddedDate.innerHTML = orderPrint.added_datetime;
    tdRequiredDate.innerHTML = orderPrint.requiredate;
    tdProductStatus.innerHTML = orderPrint.porderstatus_id.name;
    tdAddedUser.innerHTML = orderPrint.addeduser_id.username;

    // show print model
    $('#modelviewOrder').modal('show');

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

function txtQtyValidator() {
    if (txtQty.value != 0){


        let regpattern = new RegExp("^[1-9]{1,4}[0-9]{0,5}$");

        if (regpattern.test(txtQty.value)){
            txtLineTotal.value = (parseFloat(txtUnitPrice.value) * parseFloat(txtQty.value)).toFixed(2);
            txtLineTotal.style.borderBottom = "1px solid green";
            porderProduct.linetotal = txtLineTotal.value;
        }else {
            txtQty.style.borderBottom = "1px solid red";
        }

    }else {
        txtQty.style.borderBottom = "1px solid red";
    }
}

/**
function getProductsByCategory(){
    productCategoryList = getServiceRequest("/product/listbycategory/" + JSON.parse(selCategory.value).id);
    fillSelectFeild2(selProduct, "Select Product",productCategoryList, "code", "name");
    selProduct.style.borderBottom = "1px solid ced4da";

    selProduct.disabled = false;
    // selSize.disabled = false;
}
**/

function getProductsBySupplier(){
    supplierList = getServiceRequest("/product/listbysupplier/" + JSON.parse(selSupplier.value).id);
    fillSelectFeild2(selProduct, "Select Product",supplierList, "code", "name");
    selProduct.style.borderBottom = "1px solid ced4da";

    selProduct.disabled = false;
    // selSize.disabled = false;
}

function getSizesByProduct(){
    products.productSizeList = getServiceRequest("/size/byproduct/" + JSON.parse(selProduct.value).id);
    fillSelectFeild(selSize, "Select Size",products.productSizeList, "name", "");
    selSize.style.borderBottom = "1px solid ced4da";

    selSize.disabled = false;
}