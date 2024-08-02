window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=OrderPayment");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Call table refresh function
    refreshTable();
    // Call form refresh function
   refreshForm();
}

// Fill data into table
const refreshTable = () => {

    orders = new Array()
    orders = getServiceRequest("/order/paymentbyorderstatus");

    displayProp = ['code','added_datetime','totalamount','ordertype_id.name','orderstatus_id.name'];
    displayDt = ['text',getDateByDateAndTime,'text','object','object'];

    fillDataIntoTable(tableOrder, orders, displayProp, displayDt, formAddPayments, deleteOrder, viewDeliver,true,userPrivilege);

    for (let index in orders){
        if (orders[index].orderstatus_id.name == "Deleted"){
            tableOrder.children[1].children[index].children[5].children[0].style.color = "red";
        }

        tableOrder.children[1].children[index].children[6].children[1].style.display = "none" ;
        tableOrder.children[1].children[index].children[6].children[2].style.display = "none" ;

        tableOrder.children[1].children[index].children[6].children[0].innerHTML = "" ;
        tableOrder.children[1].children[index].children[6].children[0].innerHTML = "<button class='btn btn-sm' style='color: #008B8B; border-color: #008B8B;border-radius: 5px; margin-top: -12px'><i class=\"fas fa-money-check\"></i> Pay</button>" ;
    }

    $('#tableOrder').DataTable();

    clearTableStyle(tableOrder);
}
// function getDesimalPoint(ob);

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect feild value
    orderpayment = new Object();
    oldOrderpayment = null;

    //Create Arrays for fill drop down box select elements
    // orders = getServiceRequest("/order/findall");//create mapping list for fill all select elements
    // invoices = getServiceRequest("/invoice/findall");
    paystatus = getServiceRequest("/paymentstatus/list");
    paymethods = getServiceRequest("/paymentmethod/orderpayment");
    orderstatuses = getServiceRequest("/orderstatus/list");
    ordertypes = getServiceRequest("/ordertype/list");

    // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    fillSelectFeild(selPaymentStatus, "Select Payment Status",paystatus, "name", "No Paid", false);
    fillSelectFeild(selPayMethod, "Select Payment Method",paymethods, "name", "Cash", false);

    orderpayment.paymentstatus_id = JSON.parse(selPaymentStatus.value);
    selPaymentStatus.disabled = true;
    orderpayment.paymentmethod_id = JSON.parse(selPayMethod.value);

    // text field need to set empty
    txtPaid.value = "";
    txtBalance.value = "";

    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

    // set valid color into selected value field
    selPaymentStatus.style.borderBottom = '2px solid green';
    selPayMethod.style.borderBottom = '2px solid green';

    // disableButton(true, true);
}

function getDateByDateAndTime(ob) {
    return ob.added_datetime.split("T")[0]; //2023-04-21
    
    // return new Date(ob.added_datetime.split("T")[0]).getFullYear(); //year

    // return new Date(ob.added_datetime.split("T")[0]).getDate(); // date - range 1-31

    // let monthName = ["Jan","Feb","March","April","May","June","July","Aug","Sep","Oct","Nov","Dec"]
    // return monthName[new Date(ob.added_datetime.split("T")[0]).getMonth()]; //month - array [0-11]


    // let weekDayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    // return weekDayName[new Date(ob.added_datetime.split("T")[0]).getDay()]; //weekday
}

const setStyle = (style)=> {
    txtTotal.style.borderBottom = style;
    selInvoice.style.borderBottom = style;
    txtDiscount.style.borderBottom = style;
    txtNet.style.borderBottom = style;
    txtShipCost.style.borderBottom = style;
    // txtPaid.style.borderBottom = style;
    // txtBalance.style.borderBottom = style;
}

// check value bindings
const getErrors = () => {
    let errors = "";

    if (orderpayment.paidamount == null) {
        txtPaid.style.borderBottom = '2px solid red';

        errors = errors + "Paid amount not entered. \n" ;
    }

    if (orderpayment.paymentmethod_id == null) {
        selPayMethod.style.borderBottom = '2px solid red';
        
        errors = errors + "Payment method not selected. \n" ;
    }

    if (orderpayment.paymentstatus_id == null) {
        selectStatus.style.borderBottom = '2px solid red';

        errors = errors + "Payment status not selected. \n" ;
    }

    return errors;
}

function btnAddMC(){
    let errors = getErrors();
    if (errors == ""){
        console.log(orderpayment.paymentstatus_id.name)
        let confirmMsg = "Are you sure to add following payment ?" +
            "\n Order : " + orderpayment.corder_id.code +
            "\n Paid Total : LKR " + parseFloat(orderpayment.corder_id.netamount).toFixed(2) +
            "\n Payment Method : " + orderpayment.paymentmethod_id.name +
            "\n Status : " + orderpayment.paymentstatus_id.name;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/payment","POST",orderpayment);
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

    clearTableStyle(tableOrder)
    tableOrder.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#90c9c0";

    order = getServiceRequest("/order/getbyid/"+ord.id);
    oldOrder = getServiceRequest("/order/getbyid/"+ord.id);

     orderpayment.corder_id = order;
     orderpayment.totalamount = order.netamount;

    txtTotal.value = order.totalamount;
    txtDiscount.value = order.discount;
    txtNet.value = order.netamount;
    txtShipCost.value = order.shippingcost;
    txtOrder.value = order.code;
    txtOrderType.value = order.ordertype_id.name;
    txtOrderStatus.value = order.orderstatus_id.name;

    setStyle('1px solid #d1d3e2')

    // show add model
    $('#paymentAddModal').modal('show');

    let orderStatus = txtOrderStatus.value;

    if(orderStatus == "Ordered"){
        selInvoice.disabled = true;
    }else {
        invoice = getServiceRequest("/invoice/getbyorder/"+ ord.id);
        selInvoice.value = invoice.code;
        selInvoice.style.borderBottom = 'green';
    }

    // if (order.paidamount == undefined)
    //     txtPaid.style.borderBottom = '2px solid #d1d3e2';
    //
    // if (order.balancedamount == undefined)
    //     txtBalance.style.borderBottom = '2px solid #d1d3e2';
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
                $('#paymentAddModal').modal('hide');
                refreshTable();
                refreshForm();
            }
        }else{
            window.alert("Nothing updated ! \n");
        }
    }else{
        window.alert("You have following errors. \n" + errors);
    }
}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(orderpayment != null && oldOrderpayment != null){
        if(orderpayment.corder_id.code != oldOrderpayment.corder_id.code){
            updates = updates + "Order is changed. " + oldOrderpayment.corder_id.code + " into " + orderpayment.corder_id.code + "\n";
        }
        if(orderpayment.paymentmethod_id.name != oldOrderpayment.paymentmethod_id.name){
            updates = updates + "Payment Method is changed. " + oldOrderpayment.paymentmethod_id.name + " into " + orderpayment.paymentmethod_id.name + "\n";
        }
        if(orderpayment.paymentstatus_id.name != oldOrderpayment.paymentstatus_id.name){
            updates = updates + "Payment status is changed. " + oldOrderpayment.paymentstatus_id.name + " into " + orderpayment.paymentstatus_id.name + "\n";
        }
        if(orderpayment.totalamount != oldOrderpayment.totalamount){
            updates = updates + "Total Amount is changed. " + oldOrderpayment.totalamount + " into " + orderpayment.totalamount + "\n";
        }
        if(orderpayment.paidamount != oldOrderpayment.paidamount){
            updates = updates + "Paid Amount is changed. " + oldOrderpayment.paidamount + " into " + orderpayment.paidamount + "\n";
        }
        if(orderpayment.balancedamount != oldOrderpayment.balancedamount){
            updates = updates + "Balance Amount is changed. " + oldOrderpayment.balancedamount + " into " + orderpayment.balancedamount + "\n";
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
                let responce = getHttpBodyResponce("/payment","PUT",orderpayment);
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
function viewDeliver(ord, rowind){}

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

    let totalAmount = parseFloat(txtNet.value);
    let paidAmount = parseFloat(txtPaid.value);

    if (paidAmount >= totalAmount){

        orderpayment.paidamount = txtPaid.value;
        txtBalance.value = (paidAmount - totalAmount).toFixed(2);
        orderpayment.balancedamount = txtBalance.value;

        btnSubmit.disabled=false;
        txtPaid.style.borderBottom = "2px solid green";
        txtBalance.style.borderBottom = "2px solid green";
    }else {
        txtPaid.style.borderBottom = "2px solid red";
        btnSubmit.disabled=true;
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
        txtPaid.value = parseFloat(txtNet.value);
        orderpayment.paidamount = txtPaid.value;

        let netAmount = parseFloat(txtNet.value);
        let paidAmount = parseFloat(txtPaid.value);
        txtBalance.value = (paidAmount - netAmount).toFixed(2);
        orderpayment.balanceamount = txtBalance.value;

        btnSubmit.disabled=false;

        txtPaid.style.borderBottom = "2px solid green";
        txtBalance.style.borderBottom = "2px solid green";
    }
}