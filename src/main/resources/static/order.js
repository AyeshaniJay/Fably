window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Order");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    /*$('.js-example-basic-single').select2({
        theme:'bootstrap4'
        // if select2 in a model
    //  dropdownParent:$('#spnselProduct')
    });*/

    // Call table refresh function
    refreshTable();

    // Call form refresh function
    refreshForm();
}

// Fill data into table
const refreshTable = () => {

    orders = new Array()
    orders = getServiceRequest("/order/findall");

    displayProp = ['code','added_datetime','orderstatus_id.name'];
    displayDt = ['text',getDateByDateAndTime,'object'];
    
    fillDataIntoTable(tableOrder, orders, displayProp, displayDt, formReFillData, deleteOrder, viewOrder,true,userPrivilege);

    for (let index in orders){
        if (orders[index].orderstatus_id.name == "Deleted"){
            tableOrder.children[1].children[index].children[3].children[0].style.color = "red";

            tableOrder.children[1].children[index].children[4].children[0].disabled = true ;
            tableOrder.children[1].children[index].children[4].children[0].style.pointerEvents = "all" ;
            tableOrder.children[1].children[index].children[4].children[0].style.cursor = "not-allowed" ;

            tableOrder.children[1].children[index].children[4].children[1].disabled = true ;
            tableOrder.children[1].children[index].children[4].children[1].style.pointerEvents = "all" ;
            tableOrder.children[1].children[index].children[4].children[1].style.cursor = "not-allowed" ;
        }
        if (orders[index].orderstatus_id.name == "Ordered - PaidOnline" || orders[index].orderstatus_id.name == "Invoice Created - PaidOnline" || orders[index].orderstatus_id.name == "Invoice Created - COD" || orders[index].orderstatus_id.name == "Delivered"){

            tableOrder.children[1].children[index].children[4].children[0].disabled = true ;
            tableOrder.children[1].children[index].children[4].children[0].style.pointerEvents = "all" ;
            tableOrder.children[1].children[index].children[4].children[0].style.cursor = "not-allowed" ;

            tableOrder.children[1].children[index].children[4].children[1].disabled = true ;
            tableOrder.children[1].children[index].children[4].children[1].style.pointerEvents = "all" ;
            tableOrder.children[1].children[index].children[4].children[1].style.cursor = "not-allowed" ;
        }
    }

    $('#tableOrder').DataTable();

    clearTableStyle(tableOrder);
}

function getDateByDateAndTime(ob) {
        return ob.added_datetime.split("T")[0];
}

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect field value
    order = new Object();
    oldorder = null;

    order.productorderList =new Array();

    //Create Arrays for fill drop down box select elements
    customers = getServiceRequest("/customer/findall");//create mapping list for fill all select elements
    statuses = getServiceRequest("/orderstatus/listfororder");
    categories = getServiceRequest("/category/list");
    products = getServiceRequest("/product/list");
    customerStatuses = getServiceRequest("/customerstatus/list");//create mapping list for fill all select elements
    ordertypes = getServiceRequest("/ordertype/list");

    // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    fillSelectFeild(selectStatus, "Select Status",statuses, "name", "", false);
    fillSelectFeild2(selCategory, "Select Category",categories, "code","name","",false);
    fillSelectFeild2(selectCustomer, "Select Customer",customers, "code", "firstname","",false);
    fillSelectFeild(selCustomerStatus, "Select Status",customerStatuses, "name", "Active", false);
    fillSelectFeild(selOrderType, "Select Order Type",ordertypes, "name", "Online", false);

    order.customerstatus_id = JSON.parse(selCustomerStatus.value);
    order.ordertype_id = JSON.parse(selOrderType.value);

    // text field need to set empty
    txtMobile.value = "";
    txtAddress.value = "";
    txtPostalCode.value = "";
    txtOrderMobile.value = "";
    txtShipAddress.value = "";
    txtName.value = "";
    txtNewMobile.value = "";
    txtEmail.value = "";
    radioMale.checked = false;
    radioFemale.checked = false;
    lblMale.style.color = "#858796";
    lblFemale.style.color = "#858796";
    txtNewAddress.value = "";
    txtTotal.value = 0.00;
    txtDiscount.value = 0.00;
    txtNet.value = 0.00;
    order.discount = txtDiscount.value;

    chkDistrict.checked = true;
    order.shippingdistrict = true;

    getShippingCost();

    // txtNet.value = (parseFloat(txtTotal.value) + parseFloat(txtShipCost.value)).toFixed(2);

    // set all UI elements into default style
    setStyle('2px solid #d1d3e2')

    // set valid color into selected value field
    selCustomerStatus.style.borderBottom = '2px solid green';
    selOrderType.style.borderBottom = '2px solid green';
    refreshCustomerForm();
    refreshProductInnerFormTable();

    disableButton(true, false);
}

// Refresh Form function for set customer element into default state
const refreshCustomerForm = () => {

    //Need to create new object for collect feild value
    customer = new Object();
    oldcustomer = null;

    //Create Arrays for fill drop down box select elements
    customerstatuses = getServiceRequest("/customerstatus/list");//create mapping list for fill all select elements

    // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    fillSelectFeild(selCustomerStatus, "Select Status",customerstatuses, "name", "Active", false);

    customer.customerstatus_id = JSON.parse(selCustomerStatus.value);

    // assignDate.value = getCurrentDate("date", "");

    // text feild need to set empty
    txtName.value = "";
    txtEmail.value = "";
    txtMobile.value = "";
    txtNewMobile.value = "";
    txtAddress.value = "";
    txtNewAddress.value = "";
    radioMale.checked = false;
    radioFemale.checked = false;
    lblMale.style.color = "#858796";
    lblFemale.style.color = "#858796";

    // set all customer UI elements into default style
    setStyle('1px solid #d1d3e2')

    // set valid color into selected value feild
    selCustomerStatus.style.borderBottom = '2px solid green';

    // disableButton(true, true);
}

const refreshProductInnerFormTable = () => {
    // inner Form
    productOrder = new Object();
    oldProductOrder = null;

    if(selCategory.value != ""){
        getProductsByCategory();
    }else{
        productCategoryList = getServiceRequest("/product/list");
        fillSelectFeild2(selProduct, "Select Product",productCategoryList, "code", "name","");
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
    selProduct.value = "";
    txtUnitPrice.value = "";
    txtUnitPrice.disabled = true;
    txtQty.value = "";
    txtWeight.value = "";
    txtLTotal.value = "";
    txtLTotal.disabled = true;

    selProduct.style.borderBottom = '2px solid #d1d3e2';
    selSize.style.borderBottom = '2px solid #d1d3e2';
    txtUnitPrice.style.borderBottom = '2px solid #d1d3e2';
    txtWeight.style.borderBottom = '2px solid #d1d3e2';
    txtQty.style.borderBottom = '2px solid #d1d3e2';
    txtLTotal.style.borderBottom = '2px solid #d1d3e2';

    // inner Table

    let totalAmount = 0.00;
    let shippingCost = 300.00;
    let netAmount = 0.00;
    let cartItems = null;

    let displayProp = ['product_id.name','size_id.name','unitprice','qty','linetotal','weight'];
    let displayDt = ['object','object','text','text','text','text'];

    let innerLoggedUserPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Order");

    fillDataIntoTable(tblInner, order.productorderList, displayProp, displayDt, innerFormReFill, innerRowDelete, innerRowView,true,innerLoggedUserPrivilege);

    for (let index in order.productorderList){
        // tblInner.children[1].children[index].children[7].children[0].style.display = "none";
        tblInner.children[1].children[index].children[7].children[2].style.display = "none";

        totalAmount = parseFloat(totalAmount) + parseFloat(order.productorderList[index].linetotal);
        netAmount = totalAmount;
    }

    if (totalAmount != 0){
        txtTotal.value = (parseFloat(totalAmount).toFixed(2));
        order.totalamount = txtTotal.value;
        //
        discountCalculator();

    }
}

function discountCalculator() {
    let totalAmountAfterDiscount = (parseFloat(txtTotal.value) - (parseFloat(txtTotal.value) * parseFloat(txtDiscount.value)/100)).toFixed(2);
    order.totalAmountAfterDiscount = totalAmountAfterDiscount;

    txtNet.value = (parseFloat(order.totalAmountAfterDiscount) + parseFloat(txtShipCost.value)).toFixed(2);
    order.netamount = txtNet.value;

}

function getProductDetail(ob){
    return ob.product_id.name;
}

function getSizeDetail(ob){
    return ob.size_id.name;
}

const innerFormReFill = (innerob, innerrow) => {

    console.log(innerrow)
    selectedInnerRow = innerrow;

    // inner Form
    productOrder = JSON.parse(JSON.stringify(innerob));
    oldProductOrder = JSON.parse(JSON.stringify(innerob));

    productCategoryList = getServiceRequest("/product/list");
    fillSelectFeild2(selProduct, "Select Product",productCategoryList,"code","name",productOrder.product_id.code, productOrder.product_id.name);
    selProduct.disabled = true;

    sizeList = getServiceRequest("/size/list");
    fillSelectFeild(selSize, "Select Size", sizeList ,"name",productOrder.size_id.name);
    selSize.disabled = true;

    // text field value binding
    txtUnitPrice.value = productOrder.unitprice;
    txtUnitPrice.disabled = true;
    txtQty.value = productOrder.qty;
    txtWeight.value = productOrder.weight;
    txtWeight.disabled = true;
    txtLTotal.value = productOrder.linetotal;
    txtLTotal.disabled = true;

    // txtQtyValidator();

    // txtLTotal.value = (parseFloat(txtQty.value) * parseFloat(txtUnitPrice.value)).toFixed(2);
    // txtWeight.value = (parseFloat(txtQty.value) * parseFloat(txtWeight.value)).toFixed(2);
    // productOrder.unitprice = parseFloat(txtUnitPrice.value).toFixed(2);
    // productOrder.weight = parseFloat(txtWeight.value).toFixed(2);

    // selCategory.style.borderBottom = '2px solid green';
    selProduct.style.borderBottom = '2px solid green';
    selSize.style.borderBottom = '2px solid green';
    txtUnitPrice.style.borderBottom = '2px solid green';
    txtWeight.style.borderBottom = '2px solid green';
    txtQty.style.borderBottom = '2px solid green';
    txtLTotal.style.borderBottom = '2px solid green';

    disableButton(false, true);
}

const innerRowDelete = (innerob , innerrowindex) => {
    let deletemsg = 'Are you sure to delete following order product ? \n' +
        '\n Product Code : ' + innerob.product_id.code +
        '\n Product Name : ' + innerob.product_id.name;

    let response = window.confirm(deletemsg);

    if(response){
        order.productorderList.splice(innerrowindex-1,1);
        window.alert("Removed Successfully !");

        refreshProductInnerFormTable();
    }
}

const innerRowView = () => {}

const setStyle = (style)=> {
    selectCustomer.style.borderBottom = style;
    selectStatus.style.borderBottom = style;
    selCategory.style.borderBottom = style;
    selOrderType.style.borderBottom = style;
    selProduct.style.borderBottom = style;
    selSize.style.borderBottom = style;
    txtName.style.borderBottom = style;
    txtOrderMobile.style.borderBottom = style;
    txtPostalCode.style.borderBottom = style;
    txtShipAddress.style.borderBottom = style;
    txtNewMobile.style.borderBottom = style;
    txtEmail.style.borderBottom = style;
    selCustomerStatus.style.borderBottom = style;
    txtNewAddress.style.borderBottom = style;
    txtTotal.style.borderBottom = style;
    txtDiscount.style.borderBottom = style;
    txtNet.style.borderBottom = style;
}

// check value bindings
const getErrors = () => {
    let errors = "";

    if (order.customer_id == null) {
        selectCustomer.style.borderBottom = '2px solid red';

        errors = errors + "Customer not selected. \n" ;

    }

    if (order.mobile == null) {
        txtOrderMobile.style.borderBottom = '2px solid red';

        errors = errors + "Mobile 2 not entered. \n" ;

    }

    if (order.shippingaddress == null) {
        txtShipAddress.style.borderBottom = '2px solid red';

        errors = errors + "Mobile 2 not entered. \n" ;

    }

    if (order.totalamount == null) {
        txtTotal.style.borderBottom = '2px solid red';

        errors = errors + "Total price not entered. \n" ;

    }

    if (order.orderstatus_id == null) {
        selectStatus.style.borderBottom = '2px solid red';

        errors = errors + "Status not selected... \n" ;

    } else {

    }

    if (order.ordertype_id == null) {
        selOrderType.style.borderBottom = '2px solid red';

        errors = errors + "Order type not selected... \n" ;

    } else {

    }

    if (order.productorderList.length == 0) {
        selProduct.style.borderBottom = '2px solid red';

        errors = errors + "Product not selected... \n" ;

    } else {

    }

    return errors;
}

function btnAddMC(){
    if (txtShipAddress.value == ""){
        txtShipAddress.value = txtAddress.value;
        order.shippingaddress = txtShipAddress.value;
    }
    let errors = getErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure to add following Order\n" +
            "\n Customer : " + order.customer_id.code + " - " + order.customer_id.firstname +
            // "\n Products : " + order.productorderList.product_id.name + " - " + order.productorderList.size_id.name +
            "\n Total Amount : " + order.totalamount +
            "\n Order status : " + order.orderstatus_id.name;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/order","POST",order);
            if(responce == "0"){
                window.alert("Order saved successfully !");
                $('#orderAddModal').modal('hide');
                refreshTable();
                refreshForm();
            }else{
                window.alert("Order save not completed. You have following errors ! \n" + responce);
            }
        }
    } else{
        alert("You have following errors !\n" + errors);

    }
} 

// function for refill form with data
function formReFillData(ord, rowind){

    clearTableStyle(tableOrder)
    tableOrder.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    order = getServiceRequest("/order/getbyid/"+ord.id);
    oldorder = getServiceRequest("/order/getbyid/"+ord.id);

    console.log(order)

    // setStyle('2px solid green');

    fillSelectFeild2(selectCustomer, "Select Customer",customers, "code", "firstname", order.customer_id.code, order.customer_id.firstname);
    fillSelectFeild(selectStatus, "Select Status",statuses, "name", order.orderstatus_id.name, false);
    categories = getServiceRequest("/category/list");
    fillSelectFeild2(selCategory, "Select Category",categories, "code","name",categories.code,categories.name);
    fillSelectFeild(selOrderType, "Select Order Type",ordertypes, "name", order.ordertype_id.name, false);

    selectStatus.disabled = true;
    selOrderType.disabled = true;

    selectCustomer.style.borderBottom = "1px solid green";
    txtPostalCode.style.borderBottom = "1px solid green";
    txtOrderMobile.style.borderBottom = "1px solid green";
    selectStatus.style.borderBottom = "1px solid green";
    selProduct.style.borderBottom = "1px solid green";
    selOrderType.style.borderBottom = "1px solid green";
    selCategory.style.borderBottom = "1px solid green";
    txtTotal.style.borderBottom = "1px solid green";
    txtDiscount.style.borderBottom = "1px solid green";
    txtShipCost.style.borderBottom = "1px solid green";
    txtNet.style.borderBottom = "1px solid green";

    // Redirect to Customer Tab and navigate to it
    document.getElementById("myTabs").click();
    window.location.href = "#navCustomer"; //navigate

    // Navigate to and show the "navCustomerTab"
    // document.getElementById("navCustomerTab").classList.add("active");
    // document.getElementById("navCustomer").classList.add("show", "active");

    // Hide other tabs if needed
    // document.getElementById("navProductTab").classList.remove("active");
    // document.getElementById("navProduct").classList.remove("show", "active");
    // document.getElementById("navCartTab").classList.remove("active");
    // document.getElementById("navCart").classList.remove("show", "active");

    refreshProductInnerFormTable();

    if(order.shippingdistrict =="true"){
        chkDistrict.checked = true;
        lblDistrict.innerText = 'Colombo';
        order.shippingcost = 250.00;
    }else{
        chkDistrict.checked = false;
        lblDistrict.innerText = 'Out of Colombo';
        order.shippingcost = 350.00;
    }

    // txtTotal.value = order.totalamount;
    txtDiscount.value = order.discount;
    txtShipCost.value = order.shippingcost;
    txtNet.value = order.netamount;
    txtPostalCode.value = order.postalcode;
    txtOrderMobile.value = order.mobile;

    disableButton(false,true)
}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(order != null && oldorder != null){
        if(order.mobile != oldorder.mobile){
            updates = updates + "Customer mobile is changed. " + oldorder.mobile + " into " + order.mobile;
        }
        if(order.shippingaddress != oldorder.shippingaddress){
            updates = updates + "\n Shipping address is changed. " + oldorder.shippingaddress + " into " + order.shippingaddress;
        }
        if(order.productorderList.length != oldorder.productorderList.length){
            updates = updates + "\n Ordered product changed.";
        }
        if(order.totalamount != oldorder.totalamount){
            updates = updates + "\n Total amount is changed. " + oldorder.totalamount + " into " + order.totalamount;
        }
        if(order.discount != oldorder.discount){
            updates = updates + "\n Discount is changed. " + oldorder.discount + " into " + order.discount;
        }
        if(order.netamount != oldorder.netamount){
            updates = updates + "\n Net amount is changed. " + oldorder.netamount + " into " + order.netamount;
        }
        if(order.orderstatus_id.id != oldorder.orderstatus_id.id){
            updates = updates + "\n Order status is changed. \n";
        }
        if(order.shippingdistrict != oldorder.shippingdistrict){
            updates = updates + "\n Shipping district is changed. \n";
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
                let responce = getHttpBodyResponce("/order","PUT",order);
                if(responce == "0"){
                    window.alert("Updated Successfully !");
                    // $('#orderAddModal').modal('hide');
                    refreshTable();
                    refreshForm();
                }else {
                    window.alert("Update not successful. You have server error !\n" + responce);
                }
            }
        }else{
            window.alert("Nothing updated !\n");
        }
    }else{
        window.alert("You have following errors ! \n" + errors);
    }
 }

// delete function
function deleteOrder(pro, rowind){
    console.log("Delete");
    console.log(pro);
    console.log(rowind);
    let deletemsg = 'Are you sure to delete following order? \n' +
            '\n Product Code : ' + pro.code;
    let response = window.confirm(deletemsg);

    if(response){
        let deleteServerResponce;
        //to call developed mapping --> $.ajax....
        $.ajax("order", {
            async: false,
            type: "DELETE", //method
            data: JSON.stringify(pro), //data pass format convert to json string
            contentType: "application/json",
            success: function (resData, resStatus, resOb) {
                deleteServerResponce = resData;
            },
            error: function (errResOb, errStatus, errMsg) {
                deleteServerResponce = errMsg;
            }
        });

        if(deleteServerResponce == "0"){
            alert("Delete Successfully !");
            refreshTable();
        }else {
            alert("You have error \n" + deleteServerResponce);
        }
        // products.splice(rowind,1);
    }

}

// view function
function viewOrder(ord, rowind){

    let orderPrint = getServiceRequest("/order/getbyid/"+ord.id);

    tdProCode.innerHTML = orderPrint.code;
    tdOrderStatus.innerHTML = orderPrint.orderstatus_id.name;
    // tdProducts.innerHTML = orderPrint.orderstatus_id.name;
    tdOrderTotal.innerHTML = "LKR " + (orderPrint.totalamount).toFixed(2);
    tdOrderDiscount.innerHTML = orderPrint.discount + " %";
    tdShipCost.innerHTML = "LKR " + (orderPrint.shippingcost).toFixed(2);
    tdOrderNet.innerHTML = "LKR " + (orderPrint.netamount).toFixed(2);

    // show print model
    $('#modelviewOrder').modal('show');

}

function getProductsName(ord, rowind){

    let productorderList =  getServiceRequest("/productorder/byorder/"+ord.id);

    let oderProductName = "";
    for (let index in ord.productorderList){
        if (ord.productorderList.length-1 == index)
            oderProductName = oderProductName + ord.productorderList[index].product_id.name;
        else oderProductName = oderProductName + ord.productorderList[index].product_id.name + ", ";
    }
    return oderProductName;
}

const printOrderRow = () => {
    let newWindow = window.open();
    let tableHtml = tablePrint.outerHTML;
    newWindow.document.write(
        "<head><link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'></head>" +
        "<body style='background-image: url(resources/images/letterhead.png);background-size: cover'>" +
        "<div style='margin: 110px; margin-top: 250px'><h2>Order Details</h2>"+tableHtml+"</div>" +
        "<script src='resources/jquery/jquery.js'></script></body>"
        // "<script src='resources/jquery/jquery.js'></script>" +
        // '<h2>Order Details</h2>'
        // + tablePrint.outerHTML
        );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
        newWindow.print();
    },1000
    );
}

//get Customer details by select Customer
function getCustomerDetails(){

    if (selectCustomer.value != ""){
        let extCustomer = getServiceRequest("/customer/getbyid/" + JSON.parse(selectCustomer.value).id);
        txtMobile.value = extCustomer.mobile;
        txtAddress.value = extCustomer.address;
    }
}

//function for add customer
function btnCustomerAddMC(){
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
                window.alert("Customer saved successfully !");
                // refreshTable();
                refreshCustomerForm();
                refreshForm();
            }else{
                window.alert("Customer save not completed. You have following errors ! \n" + responce);
            }
        }
    } else{
        alert("You have following errors !\n" + errors);

    }
}

// check value bindings for customer
const getCustomerErrors = () => {
    let errors = "";
    if (customer.firstname == null) {
        txtName.style.borderBottom = '2px solid red';

        errors = errors + "Name not entered. \n" ;
    }
    if (customer.mobile == null) {
        txtNewMobile.style.borderBottom = '2px solid red';

        errors = errors + "Mobile number not entered. \n" ;
    }
    if (customer.email == null) {
        txtEmail.style.borderBottom = '2px solid red';

        errors = errors + "Email not entered. \n" ;
    }
    if (customer.address == null) {
        txtNewAddress.style.borderBottom = '2px solid red';

        errors = errors + "Address not entered. \n" ;
    }
    if (customer.gender == null) {
        lblMale.style.color = 'red';
        lblFemale.style.color = 'red';

        errors = errors + "Gender not selected. \n" ;
    }
    if (customer.customerstatus_id == null) {
        selCustomerStatus.style.borderBottom = '2px solid red';

        errors = errors + "Status not selected. \n" ;
    }
    return errors;
}

function getProductsByCategory(){
    productCategoryList = getServiceRequest("/product/listbycategory/" + JSON.parse(selCategory.value).id);
    fillSelectFeild2(selProduct, "Select Product",productCategoryList, "code", "name");
    selProduct.style.borderBottom = "1px solid ced4da";

    selProduct.disabled = false;
    // selSize.disabled = false;
}

function getWeightRopBySize(){
    sizeWeightRop = getServiceRequest("/productsize/detailbysize/" + JSON.parse(selProduct.value).id + "/" + JSON.parse(selSize.value).id);

    txtWeight.value = parseFloat(sizeWeightRop.weight).toFixed(2);
    // txtRop.value = sizeWeightRop.rop;

    txtWeight.style.borderBottom = "1px solid green";
}

function getSizesByProduct(){
    productsizeList = getServiceRequest("/size/byproduct/" + JSON.parse(selProduct.value).id);
    fillSelectFeild(selSize, "Select Size",productsizeList, "name", "");
    selSize.style.borderBottom = "1px solid ced4da";

    // productsizeList.size_id = selSize.value;

    selSize.disabled = false;
}

function getProductOrderDetails(){
    orderHasProduct = getServiceRequest("/productorder/bycops/" + JSON.parse(selCategory.value).id + "/" + JSON.parse(selProduct.value).id + "/" + JSON.parse(selSize.value).id);
    txtUnitPrice.value = (orderHasProduct.unitprice).toFixed(2);
    // orderQty.value = orderHasProduct.qty;

    // productOrder.orderqty = orderQty.value;  //value bind
}

function getUnitPrice(){
    productUnitprice = getServiceRequest("/product/getpdetailbyid/" + JSON.parse(selProduct.value).id);
    txtUnitPrice.value = (productUnitprice.sellprice).toFixed(2);
    // orderQty.value = productUnitprice.qty;

    txtUnitPrice.style.borderBottom = "2px solid green";
    // productOrder.orderqty = orderQty.value;  //value bind
}

function txtQtyValidator() {
    if (txtQty.value > 0){
        sizeWeightRop = getServiceRequest("/productsize/detailbysize/" + JSON.parse(selProduct.value).id + "/" + JSON.parse(selSize.value).id);

        let unitPrice = JSON.parse(selProduct.value).sellprice
        let unitWeight = sizeWeightRop.weight

        txtLTotal.value = (parseFloat(txtQty.value) * parseFloat(unitPrice)).toFixed(2);

        txtWeight.value = (parseFloat(unitWeight) * parseFloat(txtQty.value)).toFixed(2);

        txtLTotal.style.borderBottom = "2px solid green";
        txtWeight.style.borderBottom = "2px solid green";

        productOrder.unitprice = parseFloat(unitPrice).toFixed(2);
        productOrder.weight = parseFloat(txtWeight.value).toFixed(2);

        productOrder.qty = txtQty.value;
        productOrder.linetotal = txtLTotal.value;

        btnInnerAddMC.disabled = false;
    }else {
        txtLTotal.value = 0.00;
        txtWeight.value = 0.00;

        txtQty.style.borderBottom = "2px solid red";
        txtLTotal.style.borderBottom = "2px solid #d1d3e2";
        txtWeight.style.borderBottom = "2px solid #d1d3e2";
        btnInnerAddMC.disabled = true;
    }
}

//function for add inner form data into inner table
function btnInnerAddMC() {

    let extSize = false;
    if (order.productorderList.length > 0){
        for (let index in order.productorderList){
            if (productOrder.product_id.id == order.productorderList[index].product_id.id & productOrder.size_id.id == order.productorderList[index].size_id.id){
                extSize = true;
                break;
            }
        }
    }
    if (extSize){
        alert("Selected product already insert !");
    }else {
        let userResponce = window.confirm("Are you sure to add following product ?\n" +
            "\nProduct name :" + productOrder.product_id.name +
            "\nSize :" + productOrder.size_id.name +
            "\nUnit Price :" + productOrder.unitprice +
            "\nQuantity :" + productOrder.qty +
            "\nLine Total :" + productOrder.linetotal
        );
        if (userResponce){
            order.productorderList.push(productOrder);
            alert("Added successfully !")
            refreshProductInnerFormTable();
        }
    }
}

// function for update inner form data into inner table
function btnInnerUpdMC(){
    if (productOrder.qty != oldProductOrder.qty){
        let userConfirmation = window.confirm("Are you sure to update following product ? \n" +
            "Product Name : " + productOrder.product_id.name +
            "Size :" + productOrder.size_id.name +
            " \nQuantity : " + productOrder.qty +
            " \nLine Total : " + productOrder.linetotal +
            " \nWeight : " + productOrder.weight
        );

        if (userConfirmation){
            order.productorderList[parseInt(selectedInnerRow)-1] = productOrder;
            window.alert("Inner row updated successfully !");
            refreshProductInnerFormTable();
        }
    }else {
        window.alert("Nothing Updated !");
    }
}

function nextTab() {
    var currentTab = $('.nav-link.active');
    var nextTab = currentTab.parent().next().find('a');

    if (nextTab.length > 0) {
        nextTab.tab('show');
    }
}

function prevTab() {
    var currentTab = $('.nav-link.active');
    var nextTab = currentTab.parent().prev().find('a');

    if (nextTab.length > 0) {
        nextTab.tab('show');
    }
}

function clearOldCustomer(){
    selectCustomer.value = "";
    txtMobile.value = "";
    txtAddress.value = "";
}

// Function to handle checkout button click
function checkout() {
// Add your logic for checkout here
alert('Checkout button clicked !');
}

// const disableButton = (buttonAdd, buttonUpdate) =>{
//     if (buttonAdd && userPrivilege.ins){
//         btnAddTab1.disabled = false;
//         $("#btnAddTab1").css("cursor", "pointer");
//     }else {
//         btnAddTab1.disabled = true;
//         $("#btnAddTab1").css("cursor", "not-allowed");
//     }
//
//     if (buttonUpdate && userPrivilege.upd){
//         btnUpdateTab1.disabled = false;
//         $("#btnUpdateTab1").css("cursor", "pointer");
//
//     }else {
//         btnUpdateTab1.disabled = true;
//         $("#btnUpdateTab1").css("cursor", "not-allowed");
//     }
// }

function getNetAmount(){
    txtNet.value = (parseFloat(txtTotal.value) + parseFloat(txtShipCost.value)).toFixed(2);

    order.netamount = txtNet.value;
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

function getShippingCost(){
    if(chkDistrict.checked){
        order.shippingcost = 250.00;
        txtShipCost.value = order.shippingcost;

    }else{
        order.shippingcost = 350.00;
        txtShipCost.value = order.shippingcost;
    }

    discountCalculator();
}

const disableButton = (buttonAdd, buttonUpdate) =>{
    if (buttonAdd && userPrivilege.ins){
        btnAddTab3.disabled = false;
        $("#btnAddTab3").css("cursor", "pointer");
    }else {
        btnAddTab3.disabled = true;
        $("#btnAddTab3").css("cursor", "not-allowed");
    }

    if (buttonUpdate && userPrivilege.upd){
        btnUpdateTab3.disabled = false;
        $("#btnUpdateTab3").css("cursor", "pointer");

    }else {
        btnUpdateTab3.disabled = true;
        $("#btnUpdateTab3").css("cursor", "not-allowed");
    }
}
