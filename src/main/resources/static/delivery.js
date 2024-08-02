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
    orders = getServiceRequest("/order/byorderstatus");

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
        tableOrder.children[1].children[index].children[6].children[0].innerHTML = "<button class='btn btn-sm' style='color: #008B8B; border-color: #008B8B;border-radius: 5px; margin-top: -12px'><i class=\"fas fa-bicycle\"></i> Deliver</button>" ;
    }

    $('#tableOrder').DataTable();

    clearTableStyle(tableOrder);
}
// function getDesimalPoint(ob);

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect field value
    orderpayment = new Object();
    oldOrderpayment = null;

    //Create Arrays for fill drop down box select elements
    orders = getServiceRequest("/order/findall");//create mapping list for fill all select elements
    invoices = getServiceRequest("/invoice/findall");
    paymethods = getServiceRequest("/paymentmethod/list");
    orderstatuses = getServiceRequest("/orderstatus/list");
    ordertypes = getServiceRequest("/ordertype/list");

    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

}

function getDateByDateAndTime(ob) {
    return ob.added_datetime.split("T")[0];
}

const setStyle = (style)=> {
    // txtPaid.style.borderBottom = style;
    // txtBalance.style.borderBottom = style;
}

// check value bindings
const getErrors = () => {
}

// function for refill form with data
function formAddPayments(ord, rowind){

    clearTableStyle(tableOrder)
    tableOrder.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#90c9c0";

    order = getServiceRequest("/order/getbyid/"+ord.id);


    // show add model
    $('#paymentAddModal').modal('show');
}


// function for get update msg
const getUpdate = () => {}

// update function
function buttonUpdateMC(){
    let responce = getHttpBodyResponce("/delivery","PUT",order);
    if(responce == "0"){
        window.alert("Order status updated successfully as Delivered !");
        $('#paymentAddModal').modal('hide');
        refreshTable();
        refreshForm();
    }else {
        window.alert("Update not successful. You have server error !\n" + responce);
    }
 }

// delete function
function deleteOrder(ord, rowind){}

// view function
function viewDeliver(ord, rowind){}