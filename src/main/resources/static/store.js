window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Product");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Call table refresh function
    refreshTable();
    // Call form refresh function
   refreshForm();
}

// Fill data into table
const refreshTable = () => {

    stores = new Array()

    stores = getServiceRequest("/store/findall");

    displayProp = ['product_id.code','product_id.name','size_id.name','totalqty','availableqty','storestatus_id.name'];
    displayDt = ['object','object','object','text','text','object'];
    
    fillDataIntoTable(tblStore, stores, displayProp, displayDt, formReFillData, deleteProduct, viewProduct,false,userPrivilege);

    for (let index in stores){

        // tblStore.children[1].children[index].children[7].children[0].style.display = "none";
        // tblStore.children[1].children[index].children[7].children[1].style.display = "none";
        // tblStore.children[1].children[index].children[7].children[2].style.display = "none";
    }

    $('#tblStore').DataTable();

    clearTableStyle(tblStore);
}

// function getDesimalPoint(ob);

// Refresh Form function for set element into default state
const refreshForm = () => {
    //Need to create new object for collect field value
    product = new Object();
    oldproduct = null;

    product.productsizeList = new Array();

    //Create Arrays for fill drop down box select elements
    categories = getServiceRequest("/category/list");//create mapping list for fill all select elements
    statuses = getServiceRequest("/productstatus/list");

    // fillSelectFeild(feildid,displaymessage,datalist,displayproperty);
    fillSelectFeild2(selectCategory, "Select Category",categories, "code","name");
    fillSelectFeild(selectStatus, "Select Status",statuses, "name", "Available", false);

    product.productstatus_id = JSON.parse(selectStatus.value);
    // product.category_id = JSON.parse(selectCategory.value);
    // product.proCode = JSON.parse(proCode.value);

    // text feild need to set empty
    txtName.value = "";
    txtSellPrice.value = "";
    txtPurchasePrice.value = "";
    txtDiscount.value = 0.00;
    txtProfit.value = "";
    proDescription.value = "";
    formFillPhoto.value = "";
    selectCategory.value = "";

    // set all UI elements into default style
    setStyle('1px solid #858796')

    // set valid color into selected value field
    selectStatus.style.borderBottom = '2px solid green';

    refreshInnerFormTable();

    // disableButton(true, false);
}

const refreshInnerFormTable = () => {
    // inner Form
    productSize = new Object();
    oldproductSize = null;

    productsizeList = getServiceRequest("size/list");
    fillSelectFeild(selSize, "Select Size",productsizeList, "name", "");

    // clear input fields
    selSize.value = "";
    txtWeight.value = "";
    txtRop.value = "";

    selSize.style.borderBottom = '2px solid #d1d3e2';
    txtWeight.style.borderBottom = '2px solid #d1d3e2';
    txtRop.style.borderBottom = '2px solid #d1d3e2';

    displayProp = ['size_id.name','weight','rop'];
    displayDt = ['object','text','text'];

    fillDataIntoTable(tblInner, product.productsizeList, displayProp, displayDt,
        reFillInnerForm, deleteInnerRow, viewInnerRow,true,userPrivilege);

    clearTableStyle(tblInner);

    for (let index in product.productsizeList){
        // tblInner.children[1].children[index].children[6].children[0].style.display = "none";
        tblInner.children[1].children[index].children[4].children[2].style.display = "none";
    }
/**
    divSizes.innerHTML = "";

    for(let index in sizes){
        divsizes = document.createElement('div');
        divsizes.classList.add('form-check');
        inputCheckBox = document.createElement('input');
        inputCheckBox.type = "checkbox";
        inputCheckBox.value = index;
        inputCheckBox.classList.add('form-check-input');
        inputCheckBox.onchange = function(){
            if(this.checked){
                console.log("checked");
                console.log(this.value);
                product.productsizeList.push(sizes[this.value]);
            }else{
                console.log("unchecked");
                let uncheckedRole = sizes[this.value];

                for (let index in product.productsizeList){
                    if (product.productsizeList[index]['id'] == uncheckedRole.id){
                        product.productsizeList.splice(index,1);
                        break;
                    }
                }
            }
        }

        if(product.productsizeList.length != 0){
            let extIndex = product.productsizeList.map(e => e.name).indexOf(sizes[index]['name']);
            console.log(extIndex);
        }

        inputLable = document.createElement('lable');
        inputLable.innerHTML = sizes[index]['name'];
        inputLable.classList.add('form-check-label');
        inputLable.classList.add('fw-bold');

        divsizes.appendChild(inputCheckBox);
        divsizes.appendChild(inputLable);
        divSizes.appendChild(divsizes);
    }
 **/
}

// update inner size form
function reFillInnerForm(innerob, innerrow){

    selectedInnerRow = innerrow;

    productSize = JSON.parse(JSON.stringify(innerob));
    oldproductSize = JSON.parse(JSON.stringify(innerob));

    productsizeList = getServiceRequest("/size/list");
    fillSelectFeild(selSize, "Select Size", productsizeList , productSize.size_id.name, "");

    // clear input fields
    selSize.value = "";
    txtWeight.value = "";
    txtRop.value = "";

    selSize.style.borderBottom = '2px solidgreen';
    txtWeight.style.borderBottom = '2px solid green';
    txtRop.style.borderBottom = '2px solid green';
}

//remove size in inner table
function deleteInnerRow(innerob , innerrowindex){
    let deletemsg = 'Are you sure to delete following product size ? \n' +
        '\n Product Size : ' + productSize.size_id.name +
    '\n Weight : ' + productSize.weight +
    '\n ROP : ' + productSize.rop;

    let response = window.confirm(deletemsg);

    if(response){
        product.productsizeList.splice(innerrowindex,1);
        window.alert("Removed Successfully !");
        refreshInnerFormTable();
    }
}

function viewInnerRow(){}

const setStyle = (style)=> {
    txtName.style.borderBottom = style;
    txtSellPrice.style.borderBottom = style;
    txtPurchasePrice.style.borderBottom = style;
    txtDiscount.style.borderBottom = style;
    txtProfit.style.borderBottom = style;
    formFillPhoto.style.borderBottom = style;
    selectCategory.style.borderBottom = style;
    selectStatus.style.borderBottom = style;
    proDescription.style.borderBottom = style;
}

// check value bindings
const getErrors = () => {
    let errors = "";
    if (product.name == null) {
        txtName.style.borderBottom = '2px solid red';

        errors = errors + "Name not entered. \n" ;
    }

    if (product.productsizeList == null) {
        divSizes.style.borderBottom = '2px solid red';

        errors = errors + "Sizes not selected. \n" ;
    }

    if (product.sellprice == null) {
        txtSellPrice.style.borderBottom = '2px solid red';

        errors = errors + "Sell price not entered. \n" ;
    }

    if (product.purchaseprice == null) {
        txtPurchasePrice.style.borderBottom = '2px solid red';

        errors = errors + "Purchase price not entered. \n" ;
    }

    if (product.profit == null) {
        txtProfit.style.borderBottom = '2px solid red';

        errors = errors + "Profit not entered. \n" ;
    }

    if (product.category_id == null) {
        selectCategory.style.borderBottom = '2px solid red';

        errors = errors + "Category not selected. \n" ;
    }

    if (product.productstatus_id == null) {
        selectStatus.style.borderBottom = '2px solid red';

        errors = errors + "Status not selected. \n" ;
    }

    return errors;
}

function btnAddMC(){
    console.log(product)
    // proCodeByCategory();
    let errors = getErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure to add following Product" +
            "\n Product Name : " + product.name +
            "\n Sell Price : " + product.sellprice +
            "\n Purchase Price : " + product.purchaseprice +
            "\n Product status : " + product.productstatus_id.name;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/product","POST",product);
            if(responce == "0"){
                window.alert("Saved Successfully !");
                $('#productAddModal').modal('hide');
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

// function for add inner form data into inner table
function btnInnerAddMC() {

    let extSize = false;
    if (product.productsizeList.length > 0){
        for (let index in product.productsizeList){
            if (productSize.size_id.id == product.productsizeList[index].size_id.id){
                extSize = true;
                break;
            }
        }
    }
    if (extSize){
        alert("Selected product already insert !");
    } else {
        let userResponce = window.confirm("Are you sure to add following product size ?\n" +
            "Product Size : " + productSize.size_id.name +
            "\nWeight : " + productSize.weight +
            "\nROP : " + productSize.rop
        );
        if (userResponce){
            product.productsizeList.push(productSize);
            alert("Added Successfully !")
            refreshInnerFormTable();
        }
    }
}

// function for refill form with data
function formReFillData(pro, rowind){

    clearTableStyle(tblStore)
    tblStore.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    product = getServiceRequest("/product/getbyid/"+pro.id);
    oldproduct = getServiceRequest("/product/getbyid/"+pro.id);

    sizeList = getServiceRequest("/size/list");

    /**
    divSizes.innerHTML = "";

    for(let index in sizeList){
        divsizes = document.createElement('div');
        divsizes.classList.add('form-check');
        inputCheckBox = document.createElement('input');
        inputCheckBox.type = "checkbox";
        inputCheckBox.value = index;
        inputCheckBox.classList.add('form-check-input');
        inputCheckBox.onchange = function(){

            if(this.checked){
                console.log("checked");
                console.log(this.value);
                product.productsizeList.push(sizeList[this.value]);
            }else{
                console.log("unchecked");
                console.log(this.value);
                product.productsizeList.splice(this.value,1);
            }
        }

        if(product.productsizeList.length != 0){
            let extIndex = product.productsizeList.map(e => e.size).indexOf(sizeList[index]['size']);
            if(extIndex != -1){
                inputCheckBox.checked = true;
            }
        }

        inputLable = document.createElement('lable');
        inputLable.innerHTML = sizeList[index]['size'];
        inputLable.classList.add('form-check-label');
        inputLable.classList.add('fw-bold');

        divsizes.appendChild(inputCheckBox);
        divsizes.appendChild(inputLable);
        divSizes.appendChild(divsizes);
    }
**/
    txtName.value = product.name;
    txtSellPrice.value = product.sellprice;
    txtPurchasePrice.value = product.purchaseprice;
    txtDiscount.value = product.mindiscount;
    txtProfit.value = product.profit;
    // formFillPhoto.value = product.photo;
    proDescription.value = product.description;

    // formFillPhoto.value = "";
    if (product.description != undefined)
        proDescription.value = product.description;

    // assignDate.value = product.added_datetime;

    setStyle('2px solid green');

    fillSelectFeild(selectCategory, "Select Category",categories, "name", product.category_id.name, true);
    fillSelectFeild(selectStatus, "Select Status",statuses, "name", product.productstatus_id.name, false);

     // show add model
     $('#productAddModal').modal('show');

    if (product.description == undefined)
        proDescription.style.borderBottom = '2px solid #d1d3e2';

}

// function for get update msg
const getUpdate = () => {
    let updates = "";

    if(product != null && oldproduct != null){
        if(product.code != oldproduct.code){
            updates = updates + "Name is changed. " + oldproduct.code + " into " + product.code;
        }
        if(product.name != oldproduct.name){
            updates = updates + "Name is changed. " + oldproduct.name + " into " + product.name;
        }
        if(product.sellprice != oldproduct.sellprice){
            updates = updates + "Sell price is changed. " + oldproduct.sellprice + " into " + product.sellprice;
        }
        if(product.purchaseprice != oldproduct.purchaseprice){
            updates = updates + "Purchase price is changed. " + oldproduct.purchaseprice + " into " + product.purchaseprice;
        }
        if(product.photo != oldproduct.photo){
            updates = updates + "Photo is changed. " + oldproduct.photo + " into " + product.photo;
        }
        if(product.category_id.id != oldproduct.category_id.id){
            updates = updates + "Category is changed. \n";
        }
        if(product.productstatus_id.id != oldproduct.productstatus_id.id){
            updates = updates + "Product status is changed. \n";
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
            let responce = getHttpBodyResponce("/product","PUT",product);
            if(responce == "0"){
                window.alert("Updated successfully !");
                $('#productAddModal').modal('hide');
                refreshTable();
                refreshForm();
            }
        }else{
            window.alert("Nothing updated !\n");
        }
    }else{
        window.alert("You have following errors ! \n" + errors);
    }
 }

// function for update inner form data into inner table
function btnInnerUpdMC(){
    if (productSize.qty != oldproductSize.qty){
        let userConfirmation = window.confirm("Are you sure to update following product size ? \n" +
            "Product Size : " + productSize.size_id.name +
            "\nWeight : " + productSize.weight +
            "\nROP : " + productSize.rop );

        if (userConfirmation){
            product.productsizeList[selectedInnerRow] = productSize;
            window.alert("Inner row updated successfully !");
            refreshInnerFormTable();
        }
    }else {
        window.alert("Nothing Updated !");
    }
}

// delete function
function deleteProduct(pro, rowind){
    console.log("Delete");
    console.log(pro);
    console.log(rowind);
    let deletemsg = 'Are you sure to delete following product ? \n' +
            '\n Product Code : ' + pro.code +
            '\n Product Name : ' + pro.name;
    let response = window.confirm(deletemsg);

    if(response){
        let deleteServerResponce;
        //to call developed mapping --> $.ajax....
        $.ajax("product", {
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
            alert("Deleted Successfully !");
            refreshTable();
        }else {
            alert("You have error \n" + deleteServerResponce);
        }
        // products.splice(rowind,1);
    }

}

// view function
function viewProduct(pro, rowind){
    
    let productprint = pro;

    tdProCode.innerHTML = productprint.code;
    tdProName.innerHTML = productprint.name;
    tdProSellprice.innerHTML = productprint.sellprice;
    tdProPurchaseprice.innerHTML = productprint.purchaseprice;
    tdProPhoto.innerHTML = productprint.photo;

    // show print model
    $('#modelviewProduct').modal('show');

}

const printProductRow = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<script src='resources/jquery/jquery.js'></script>" +
        '<h2>Product Details</h2>'
        + tablePrintStore.outerHTML
        );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
        newWindow.print();
    },1000
    );
}

function getProfit() {

    let purchasePrice = parseFloat(txtPurchasePrice.value);
    let sellPrice = parseFloat(txtSellPrice.value);

    if (sellPrice >= purchasePrice){

        if (txtDiscount.value == 0 ){
            product.sellprice = txtSellPrice.value;
            txtProfit.value = (sellPrice - purchasePrice).toFixed(2);
            product.profit = txtProfit.value;

            txtSellPrice.style.borderBottom = "2px solid green";
            txtProfit.style.borderBottom = "2px solid green";
        }else {
            discountCalculator();
        }
    }else {
        txtSellPrice.style.borderBottom = "2px solid red";
        window.alert("Sell Price can't be less than the Purchase Price !")
    }

}

function btnClearPhoto(){
    if (product.photo != null){
        let userResponce = window.confirm("Are you sure to clear the photo ?")

        if(userResponce){
            product.photo = null;
            product.photoname = null;
            showImg.src = "resources/images/sampleproduct.png";
            formFillPhoto.value = "";
            formFillPhoto.style.borderBottom = "1px solid #ced4da";
            txtPhotoname.value = "";
            txtPhotoname.style.borderBottom = "1px solid #ced4da";
        }
    }else {
        product.photo = null;
        product.photoname = null;
        showImg.src = "resources/images/sampleproduct.png";
        formFillPhoto.value = "";
        formFillPhoto.style.borderBottom = "1px solid #ced4da";
        txtPhotoname.value = "";
        txtPhotoname.style.borderBottom = "1px solid #ced4da";
    }
}

function discountCalculator() {
    let sellPriceAfterDiscount = (parseFloat(txtSellPrice.value) - (parseFloat(txtSellPrice.value) * parseFloat(txtDiscount.value)/100)).toFixed(2);
    product.sellPriceAfterDiscount = sellPriceAfterDiscount;

    txtProfit.value = parseFloat(product.sellPriceAfterDiscount).toFixed(2);
    product.profit = txtProfit.value;
}