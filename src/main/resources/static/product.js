window.addEventListener('load',loadUI);

function loadUI(){

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Product");

    //Enable Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    // Call table refresh function
    refreshTable();
    // Call form refresh function
   refreshForm();
   refreshCategoryForm();
}

// Fill data into table
const refreshTable = () => {

    products = new Array()

    products = getServiceRequest("/product/findall");

    displayProp = ['category_id.name','code','name','sellprice','productstatus_id.name'];
    displayDt = ['object','text','text','text','object'];
    
    fillDataIntoTable(tableProduct, products, displayProp, displayDt, formReFillData, deleteProduct, viewProduct,true,userPrivilege);

    for (let index in products){
        if (products[index].productstatus_id.name == "Deleted"){
            tableProduct.children[1].children[index].children[5].children[0].style.color = "red";
            // tableProduct.children[1].children[index].children[4].children[0].style.textAlign = "center";

            tableProduct.children[1].children[index].children[6].children[1].disabled = true ;
            tableProduct.children[1].children[index].children[6].children[1].style.pointerEvents = "all";
            tableProduct.children[1].children[index].children[6].children[1].style.cursor = "not-allowed";
        }
    }

    $('#tableProduct').DataTable();

    clearTableStyle(tableProduct);
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
    setStyle('1px solid #d1d3e2')

    // set valid color into selected value field
    selectStatus.style.borderBottom = '2px solid green';

    refreshInnerFormTable();

    disableButton(true, false);
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

function refreshCategoryForm(){
    category = new Object();
    oldCategory = null;

    // fillSelectFeild2(txtNewCategory, "Select Category",categories, "code","name");

    txtCategoryCode.value = "";
    txtCategoryCode.style.borderBottom = "2px solid #d1d3e2";
    txtCategoryName.value = "";
    txtCategoryName.style.borderBottom = "2px solid #d1d3e2";
}

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

    clearTableStyle(tableProduct)
    tableProduct.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    product = getServiceRequest("/product/getbyid/"+pro.id);
    oldproduct = getServiceRequest("/product/getbyid/"+pro.id);

    sizeList = getServiceRequest("/size/list");

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

    disableButton(false, true);

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

    let productprint = getServiceRequest("product/getbyid/"+pro.id);

    tdProCode.innerHTML = productprint.code;
    tdProName.innerHTML = productprint.name;
    tdProSellprice.innerHTML = productprint.sellprice;
    tdProPurchaseprice.innerHTML = productprint.purchaseprice;
    if(productprint.photo == null){
        tdProPhoto.src = showImg.value;
    }else tdProPhoto.src = atob(productprint.photo);
    // tdProPhoto.innerHTML = productprint.photo;

    // show print model
    $('#modelviewProduct').modal('show');

}

const printProductRow = () => {
    let newWindow = window.open();
    newWindow.document.write(
        "<link rel='stylesheet' href='resources/bootstrap/css/bootstrap.min.css'>" +
        "<script src='resources/jquery/jquery.js'></script>" +
        '<h2>Product Details</h2>'
        + tablePrintProduct.outerHTML
        );

    // Set time out (anonymous function call after 1000ms and open new window)
    setTimeout(()=>{
        newWindow.print();
    },1000
    );
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

function getProfit() {

    let purchasePrice = parseFloat(txtPurchasePrice.value);
    let profitAmount = 0.00;

    if (purchasePrice < 500)
        profitAmount = 200.00;

    else if (purchasePrice < 1000)
        profitAmount = 300.00;

    else if (purchasePrice < 1500)
        profitAmount = 500.00;

    else if (purchasePrice < 2000)
        profitAmount = 750.00;

    else if (purchasePrice < 2500)
        profitAmount = 1000.00;

    else if (purchasePrice >= 2500)
        profitAmount = 1500.00;

    return profitAmount;
    txtProfit.style.borderBottom = "2px solid green";

}

function getSellPrice() {

    let purchasePrice = parseFloat(txtPurchasePrice.value);

       txtProfit.value = getProfit();

        if (txtDiscount.value == 0){

            txtSellPrice.value = (purchasePrice + parseFloat(txtProfit.value)).toFixed(2);
            product.sellprice = txtSellPrice.value;

            txtSellPrice.style.borderBottom = "2px solid green";
            txtProfit.style.borderBottom = "2px solid green";
        }else {
            discountCalculator();
        }


}

function getSellPriceNew() {

    let purchasePrice = parseFloat(txtPurchasePrice.value);
    // let sellprice = parseFloat(txtSellPrice.value);
    let profit = parseFloat(txtProfit.value);

       // txtProfit.value = getProfit();
       // txtProfit.value = getProfit();

        if (txtDiscount.value == 0){

            txtSellPrice.value = purchasePrice + (purchasePrice * (profit/100));
            product.sellprice = txtSellPrice.value;
            // console.log(txtSellPrice.value)

            txtSellPrice.style.borderBottom = "2px solid green";
            txtProfit.style.borderBottom = "2px solid green";
        }else {
            discountCalculator();
        }


}

function discountCalculator() {
    let purchaseprice = parseFloat(txtPurchasePrice.value);

    let profit = parseFloat(getProfit());//300 -- 180
    let discount =parseFloat(txtDiscount.value);//0 -- 10 --20
    let sellPrice = parseFloat(purchaseprice + profit);//1200 --1080

    let discountedamount = (sellPrice * (discount/100));//120 --360

    let newSellprice = sellPrice - discountedamount;//1080 -- 760
    let newProfit = profit - discountedamount;//180 -- (-180)

    if(newProfit < (profit/2)){
        txtProfit.value = parseFloat(newProfit).toFixed(2);
        product.profit = txtProfit.value;

        txtDiscount.style.borderBottom = "2px solid red";
        txtProfit.style.borderBottom = "2px solid red";

        alert("Can't add the discount profit below 50% !\n" +
            "Because the discount profit can't be less than the half of relevant profit.\n" +
            "If profit LKR 200.00 - Discount profit minimum should be LKR 100.00\n" +
            "If profit LKR 300.00 - Discount profit minimum should be LKR 150.00\n" +
            "If profit LKR 500.00 - Discount profit minimum should be LKR 250.00\n" +
            "If profit LKR 750.00 - Discount profit minimum should be LKR 375.00\n" +
            "If profit LKR 1000.00 - Discount profit minimum should be LKR 500.00\n" +
            "If profit LKR 1500.00 - Discount profit minimum should be LKR 750.00\n");
    }else {
        txtSellPrice.value = parseFloat(newSellprice).toFixed(2);//1080
        product.sellprice = txtSellPrice.value;
        txtProfit.value = parseFloat(newProfit).toFixed(2);//180
        product.profit = txtProfit.value;

        txtSellPrice.style.borderBottom = "2px solid green";
        txtProfit.style.borderBottom = "2px solid green";
    }

}

function discountCalculatorNew() {
    let purchaseprice = parseFloat(txtPurchasePrice.value);
    let sellPrice = parseFloat(txtSellPrice.value);

    let profit = parseFloat(txtProfit.value);
    let discount = parseFloat(txtDiscount.value);

    let discountedamount = (sellPrice * (discount/100));

    let newSellprice = sellPrice - discountedamount;
    let newProfit = profit - discountedamount;

    if(newProfit < (profit/2)){
        txtProfit.value = parseFloat(newProfit).toFixed(2);
        product.profit = txtProfit.value;

        txtDiscount.style.borderBottom = "2px solid red";
        txtProfit.style.borderBottom = "2px solid red";

        alert("Can't add the discount profit below 50% !\n" +
            "Because the discount profit can't be less than the half of relevant profit.\n" +
            "If profit LKR 200.00 - Discount profit minimum should be LKR 100.00\n" +
            "If profit LKR 300.00 - Discount profit minimum should be LKR 150.00\n" +
            "If profit LKR 500.00 - Discount profit minimum should be LKR 250.00\n" +
            "If profit LKR 750.00 - Discount profit minimum should be LKR 375.00\n" +
            "If profit LKR 1000.00 - Discount profit minimum should be LKR 500.00\n" +
            "If profit LKR 1500.00 - Discount profit minimum should be LKR 750.00\n");
    }else {
        txtSellPrice.value = parseFloat(newSellprice).toFixed(2);//1080
        product.sellprice = txtSellPrice.value;
        txtProfit.value = parseFloat(newProfit).toFixed(2);//180
        product.profit = txtProfit.value;

        txtSellPrice.style.borderBottom = "2px solid green";
        txtProfit.style.borderBottom = "2px solid green";
    }

}

function btnAddCategory(){
    let errors = getCategoryErrors();
    if (errors == ""){
        let confirmMsg = "Are you sure to add following Category ?" +
            "\n Category Code : " + category.code +
            "\n Category Name : " + category.name;

        let submitResponce = window.confirm(confirmMsg);

        if(submitResponce){
            //
            let responce = getHttpBodyResponce("/category","POST",category);
            if(responce == "0"){
                categories = getServiceRequest("/category/list");
                fillSelectFeild2(selectCategory, "Select Category",categories, "code","name","category.code","category.name");

                product.category_id = JSON.parse(selectCategory.value) +" - "+ JSON.parse(selectCategory.value);

                window.alert("Saved Successfully !");
                $("#collapseExample").collapse("hide");
                refreshCategoryForm();
            }else{
                window.alert("Save not completed. You have following errors ! \n" + responce);
            }
        }
    } else{
        alert("You have following errors \n" + errors);

    }
}

function getCategoryErrors(){
    let errors = "";

    if (category.code == null) {
        txtCategoryCode.style.borderBottom = '2px solid red';

        errors = errors + "Code not entered. \n" ;
    }

    if (category.name == null) {
        txtCategoryName.style.borderBottom = '2px solid red';

        errors = errors + "Name not entered. \n" ;
    }
    return errors;
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