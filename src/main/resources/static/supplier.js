window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Supplier");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Call table refresh function
    refreshTable();
    // Call form refresh function
   refreshForm();
}

// Fill data into table
const refreshTable = () => {

    suppliers = new Array()

    suppliers = getServiceRequest("/supplier/findall");

    displayProp = ['code','name','mobile1','supplierstatus_id.name'];
    displayDt = ['text','text','text','object'];
    
    fillDataIntoTable(tblSupplier, suppliers, displayProp, displayDt,
        formReFillData, deleteSupplier, viewSupplier,true,userPrivilege);

    for (let index in suppliers){
        if (suppliers[index].supplierstatus_id.name == "Deleted"){
            tblSupplier.children[1].children[index].children[4].children[0].style.color = "red";
            // tblSupplier.children[1].children[index].children[4].children[0].style.textAlign = "center";

            tblSupplier.children[1].children[index].children[5].children[1].disabled = true ;
            tblSupplier.children[1].children[index].children[5].children[1].style.pointerEvents = "all" ;
            tblSupplier.children[1].children[index].children[5].children[1].style.cursor = "not-allowed" ;
        }
    }

    $('#tblSupplier').DataTable();

    clearTableStyle(tblSupplier);
}

// Refresh Form function for set element into default state
const refreshForm = () => {

    //Need to create new object for collect field value
    supplier = new Object();
    oldSupplier = null;

    supplier.supplierbankdetailList = new Array();

    //Create Arrays for fill drop down box select elements
    statuses = getServiceRequest("/supplierstatus/list");//create mapping list for fill all select elements
    fillSelectFeild(selectStatus, "Select Supplier Status",statuses, "name", "Active"); // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);

    supplier.supplierstatus_id = JSON.parse(selectStatus.value);
    selectStatus.style.borderBottom = '2px solid green'; // set valid color into selected value field
    // selectStatus.disabled=true;

    // text field need to set empty
    txtName.value = "";
    txtEmail.value = "";
    txtAddress.value = "";
    txtMobile1.value = "";
    txtMobile2.value = "";
    txtBRNumber.value = "";

    // set all UI elements into default style
    setStyle('1px solid #d1d3e2')

    supplier.productList = new Array();

    allProductList = getServiceRequest("/product/list");
    fillSelectFeild(selProduct, "",allProductList, "name", "");

    fillSelectFeild(selSelectedProduct, "",supplier.productList, "name", "");

    // disableButton(true, false);
    refreshInnerFormTable();
}

function refreshInnerFormTable(){

    bankDetail = new Object();
    oldBankDetail = null;

    // text field need to set empty
    txtBankname.value = "";
    txtBranch.value = "";
    txtAccountname.value = "";
    txtAccountnumber.value = "";
    txtBankname.style.borderBottom = '1px solid #d1d3e2';
    txtBranch.style.borderBottom = '1px solid #d1d3e2';
    txtAccountname.style.borderBottom = '1px solid #d1d3e2';
    txtAccountnumber.style.borderBottom = '1px solid #d1d3e2';

    // inner Table

    let displayProp = ['bankname','branch','accountname','accountnumber'];
    let displayDt = ['text','text','text','text'];

    let innerLoggedUserPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Supplier");

    fillDataIntoTable(tblInner, supplier.supplierbankdetailList, displayProp, displayDt, innerFormReFill, innerRowDelete, innerRowView,true,innerLoggedUserPrivilege);

    for (let index in supplier.supplierbankdetailList){
        tblInner.children[1].children[index].children[5].children[0].style.display = "none";
        tblInner.children[1].children[index].children[5].children[2].style.display = "none";
    }
}

const btnInnerAddMC = () => {
    let nextProduct = false;

    for (let index in supplier.supplierbankdetailList){
        if (supplier.supplierbankdetailList[index].accountnumber == bankDetail.accountnumber){
            nextProduct = true;
            break;
        }
    }

    if (!nextProduct){
        let confirmMsg = "Are you sure to add following bank detail ?" +
            "\n Bank Name : " + bankDetail.bankname +
            "\n Branch : " + bankDetail.branch +
            "\n Account Name : " + bankDetail.accountname +
            "\n Account No : " + bankDetail.accountnumber;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            supplier.supplierbankdetailList.push(bankDetail);
            window.alert("Saved Successfully !");
            refreshInnerFormTable();
        }
    }else {
        window.alert("Selected bank detail already added !")
    }

}

// function for update inner form data into inner table
function btnInnerUpdMC(){
    // if (bankDetail.qty != oldBankDetail.qty){
    //     let userConfirmation = window.confirm("Are you sure to update following bank detail? \n" +
    //         "\n Bank Name : " + bankDetail.bankname +
    //         "\n Branch : " + bankDetail.branch +
    //         "\n Account Name : " + bankDetail.accountname +
    //         "\n Account No : " + bankDetail.accountnumber );
    //
    //     if (userConfirmation){
    //         supplier.supplierbankdetailList[parseInt(selectedInnerRow)-1] = bankDetail;
    //         window.alert("Inner row updated successfully !");
    //         refreshInnerFormTable();
    //     }
    // }else {
    //     window.alert("Nothing Updated !");
    // }
}

const innerFormReFill = (innerob, innerrow) => {
    selectedInnerRow = innerrow;

    bankDetail = JSON.parse(JSON.stringify(innerob));
    oldBankDetail = JSON.parse(JSON.stringify(innerob));

    txtBankname.value = supplierbankdetailList.bankname;
    txtBankname.style.borderBottom = "1px solid green";
    txtBranch.value = supplierbankdetailList.branch;
    txtBranch.style.borderBottom = "1px solid green";
    txtAccountname.value = supplierbankdetailList.accountname;
    txtAccountname.style.borderBottom = "1px solid green";
    txtAccountnumber.value = supplierbankdetailList.accountnumber;
    txtAccountnumber.style.borderBottom = "1px solid green";
}
const innerRowDelete = () => {}

const innerRowView = () => {}

function getSupplyProductName(ob){
    let supplyProductList = getServiceRequest("/product/listbysupplier/"+ob.id)
    let productName = "";
    for (let ind in supplyProductList){
        productName = productName + supplyProductList[ind].name + " ,";
    }
    return productName;
}

function btnAddByAll(){
    for (let index in allProductList){
        supplier.productList.push(allProductList[index]);
    }
    fillSelectFeild(selSelectedProduct, "",supplier.productList, "name", "");

    allProductList = [];
    fillSelectFeild(selProduct, "",allProductList, "name", "");
}

function btnAddByOne(){
    let selectedProduct = JSON.parse(selProduct.value);
    supplier.productList.push(selectedProduct);
    fillSelectFeild(selSelectedProduct, "",supplier.productList, "name", "");

    for (let index in allProductList){
        if (allProductList[index]['name'] == selectedProduct.name){
            allProductList.splice(index,1);
            break;
        }
    }
    fillSelectFeild(selProduct, "",allProductList, "name", "");

}

function btnRemoveByOne(){
    let selectedProduct = JSON.parse(selSelectedProduct.value);
    allProductList.push(selectedProduct);
    fillSelectFeild(selProduct, "",allProductList, "name", "");

    for (let index in supplier.productList){
        if (supplier.productList[index]['name'] == selectedProduct.name){
            supplier.productList.splice(index,1);
            break;
        }
    }
    fillSelectFeild(selSelectedProduct, "",supplier.productList, "name", "");

}

function btnRemoveByAll(){
    for (let index in supplier.productList){
        allProductList.push(supplier.productList[index]);
    }
    fillSelectFeild(selProduct, "",allProductList, "name", "");

    supplier.productList = [];
    fillSelectFeild(selSelectedProduct, "",supplier.productList, "name", "");
}

const setStyle = (style)=> {
    txtName.style.borderBottom = style;
    txtEmail.style.borderBottom = style;
    txtAddress.style.borderBottom = style;
    txtMobile1.style.borderBottom = style;
    txtMobile2.style.borderBottom = style;
    txtBRNumber.style.borderBottom = style;
    // selectStatus.style.borderBottom = style;
}

// check value bindings
const getErrors = () => {
    let errors = "";
    if (supplier.name == null) {
        txtName.style.borderBottom = '2px solid red';

        errors = errors + "Name not enter. \n" ;

    } else {

    }

    if (supplier.email == null) {
        txtEmail.style.borderBottom = '2px solid red';

        errors = errors + "Email not enter... \n" ;

    } else {

    }

    if (supplier.mobile1 == null) {
        txtMobile1.style.borderBottom = '2px solid red';

        errors = errors + "Contact number not enter... \n" ;

    } else {

    }

    if (supplier.address == null) {
        txtAddress.style.borderBottom = '2px solid red';

        errors = errors + "Address not selected... \n" ;

    } else {

    }

    if (supplier.supplierstatus_id == null) {
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

    clearTableStyle(tblSupplier)
    // tblSupplier.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    supplier = getServiceRequest("/supplier/getbyid/"+rowob.id);
    oldSupplier = getServiceRequest("/supplier/getbyid/"+rowob.id);

    fillSelectFeild(selSelectedProduct, "",supplier.productList, "name", "");

    allProductList = getServiceRequest("/product/listbysupplierhavenot/"+rowob.id);
    fillSelectFeild(selProduct, "",allProductList, "name", "");

    fillSelectFeild(selectStatus, "Select Status",statuses, "name", supplier.supplierstatus_id.name);


    selectStatus.disabled = false;

    txtName.value = supplier.name;
    txtEmail.value = supplier.email;
    txtAddress.value = supplier.address;
    txtMobile1.value = supplier.mobile1;
    txtMobile2.value = supplier.mobile2;
    txtBRNumber.value = supplier.brnumber;

    setStyle('2px solid green');

     // show add model
     $('#supplierAddModal').modal('show');

    refreshInnerFormTable();

}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(supplier != null && oldSupplier != null){
        if(supplier.name != oldSupplier.name){
            updates = updates + "Name is changed. " + oldSupplier.name + " into " + supplier.name + "\n";
        }
        if(supplier.email != oldSupplier.email){
            updates = updates + "Email is changed. " + oldSupplier.email + " into " + supplier.email + "\n";
        }
        if(supplier.mobile1 != oldSupplier.mobile1){
            updates = updates + "Contact Number is changed. " + oldSupplier.mobile1 + " into " + supplier.mobile1 + "\n";
        }
        if(supplier.mobile2 != oldSupplier.mobile2){
            updates = updates + "Contact Number 2 is changed. " + oldSupplier.mobile2 + " into " + supplier.mobile2 + "\n";
        }
        if(supplier.brnumber != oldSupplier.brnumber){
            updates = updates + "BR Number is changed. " + oldSupplier.brnumber + " into " + supplier.brnumber + "\n";
        }
        if(supplier.address != oldSupplier.address){
            updates = updates + "Address is changed. " + oldSupplier.address + " into " + supplier.address + "\n";
        }
        if(supplier.supplierstatus_id.id != oldSupplier.supplierstatus_id.id){
            updates = updates + "Supplier status is changed. \n";
        }
        if(supplier.productList.length != oldSupplier.productList.length){
            updates = updates + "Supply Products changed. \n";
        }else {
            let extProduct = 0;
            for (let i=0; i<supplier.productList.length; i++){
                for (let l=0; l<oldSupplier.productList.length; l++){
                    if (supplier.productList[i]['id'] == oldSupplier.productList[l]['id']){
                        extProduct = parseInt(extProduct) +1;
                    }
                }
            }
            if (extProduct != supplier.productList.length){
                updates = updates + "Supply Products changed. \n";
            }
        }
        if(supplier.supplierbankdetailList.length != oldSupplier.supplierbankdetailList.length){
            updates = updates + "Supplier bank detail is changed. \n";
        }else {
            let extUpd = false;
            for (let i=0; i<supplier.supplierbankdetailList.length; i++){
                for (let l=0; l<oldSupplier.supplierbankdetailList.length; l++){
                    if (supplier.supplierbankdetailList[i].accountnumber == oldSupplier.supplierbankdetailList[l].accountnumber){
                        if (supplier.supplierbankdetailList[i]['id'] != oldSupplier.supplierbankdetailList[l]['id']){
                            // extProduct = parseInt(extProduct) +1;
                            extUpd = true;
                            break;
                        }
                    }
                }
            }
            if (extUpd){
                updates = updates + "Supplier bank detail is changed. \n";
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
                let responce = getHttpBodyResponce("/supplier","PUT",supplier);
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
function viewSupplier(pro, rowind){
    
    let supplierprint = pro;

    tdSupCode.innerHTML = supplierprint.code;
    tdSupName.innerHTML = supplierprint.name;
    // tdProPhoto.innerHTML = supplierprint.photo;

    // show print model
    $('#modelviewSupplier').modal('show');

}

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