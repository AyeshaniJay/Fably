function getHttpBodyResponce(url, method, data){

    let serverResponce;

    $.ajax(url, {
        async: false,
        data: JSON.stringify(data),
        contentType: "application/json",
        type: method,
        success : function (srData, srStatus, srOb) {
            serverResponce = srData;
        },
        errors : function (erOb, erStatus, errMsg) {
            serverResponce = errMsg;
        }
    });

    return serverResponce;
}

function getServiceRequest(url) {

    let responseData;

    $.ajax(url, {
        async:false,
        dataType:'json',
        success: function (repData, resStatus, repOb){
            responseData = repData;
        },
        error : function(reEob, errStatus, errMsg){
            responseData = reEob;
        }
    })

    return responseData;
}

// Common function for vali the text fields
const textFieldValidator = (feildid,pattern,object,property,oldobject) =>{

    let ob = window[object];
    let oldob = window[oldobject];

    if(feildid.value != ""){
        const namepattern = new RegExp(pattern);

        if(namepattern.test(feildid.value)){
            ob[property] = feildid.value;

            if(oldob != null && ob[property] != oldob[property]){
                feildid.style.borderBottom = '2px solid orange'; // update
            }else{
                feildid.style.borderBottom = '2px solid green'; // valid
            }
        }else{
            ob[property] = null;

            feildid.style.borderBottom = '2px solid red';
        }
    }else{
        ob[property] = null;

        if(feildid.required){
            feildid.style.borderBottom = '2px solid red';
        }else{
            feildid.style.borderBottom = '2px solid rgb(118, 118, 118)';
        }
    }
}

// Common function for clear table styles
const clearTableStyle = (tableid) =>{
    for(let index = 0; index < tableid.children[1].children.length; index++){
        // tableEmployeeD.children[1].children[index].removeAttribute("style");
    }
}

// Common function for get current date
const getCurrentDate = (format, givenDate) =>{
    // set Auto load value
    let today;

    if(givenDate != ""){
        today = new Date(givenDate);
    }else{
        today = new Date();
    }

    let month = today.getMonth() +1; //return 0-11
    let date = today.getDate(); //return 1-31

    if(month < 10) month = "0"+ month;
    if(date < 10) date = "0"+ date;
    
    // assignDate.value = "2022-08-23"
    let currentDate = today.getFullYear() + "-" + month + "-" + date;
    let currentMonth = today.getFullYear() + "-" + month;
    let currentYear = today.getFullYear();

    if(format == "date") return currentDate;
    if(format == "month") return currentMonth;
    if(format == "year") return currentYear;
}

// Common validator for radio field
const radiofeildValidator = (feildid,pattern,object,property,oldobject,lbl1id,lbl2id) =>{
    let ob = window[object];
    let oldob = window[oldobject];
    
    if (feildid.checked){
        ob[property] = feildid.value;

        if(oldob != null && ob[property] != oldob[property]){
            // update
            lbl1id.style.color = 'orange';
            lbl2id.style.color = 'orange';
        }else{
            // valid
            lbl1id.style.color = 'green';
            lbl2id.style.color = 'green';
        }
        
    }else{
        ob[property] = null;
        lbl1id.style.color = 'red';
        lbl2id.style.color = 'red';
    }
}

// Common validator for radio field include label 3
const radiofeildLabel3Validator = (feildid,pattern,object,property,oldobject,lbl1id,lbl2id,lbl3id) =>{
    let ob = window[object];
    let oldob = window[oldobject];

    if (feildid.checked){
        ob[property] = feildid.value;

        if(oldob != null && ob[property] != oldob[property]){
            // update
            lbl1id.style.color = 'orange';
            lbl2id.style.color = 'orange';
            lbl3id.style.color = 'orange';
        }else{
            // valid
            lbl1id.style.color = 'green';
            lbl2id.style.color = 'green';
            lbl3id.style.color = 'green';
        }

    }else{
        ob[property] = null;
        lbl1id.style.color = 'red';
        lbl2id.style.color = 'red';
        lbl3id.style.color = 'red';
    }
}

// Common function to bind date field value
const dateFeildValidator = (feildid,pattern,object,property,oldobject) =>{
    let ob = window[object];
    let oldob = window[oldobject];
    if (feildid.value != ""){
        ob[property] = feildid.value;

        if(oldob != null && ob[property] != oldob[property]){
            feildid.style.borderBottom = '2px solid orange'; // update
        }else{
            feildid.style.borderBottom = '2px solid green'; // valid
        }
        
    }else{

        ob[property] = null;
        if(feildid.required){
            feildid.style.borderBottom = '2px solid red';
        }else{
            feildid.style.borderBottom = '2px solid rgb(118, 118, 118)';
        }
    }
}

const checkboxValidator = (feildid,pattern,object,property,oldobject,setTrueValue,setFalseValue,labelid,trueLabelDisplayText, falseLabelDisplayText) => {
    let ob = window[object];
    let oldob = window[oldobject];

    if(feildid.checked){
        ob[property] = setTrueValue;
        labelid.innerText = trueLabelDisplayText;
    }else{
        ob[property] = setFalseValue;
        labelid.innerText = falseLabelDisplayText;
    }
}

// Common validator for select field
const selectValidator = (feildid,pattern,object,property,oldobject) =>{
    let ob = window[object];
    let oldob = window[oldobject];
    if (feildid.value != ""){
        ob[property] = JSON.parse(feildid.value);
        if(oldob != null && ob[property]['id'] != oldob[property]['id']){
            // update
            feildid.style.borderBottom = '2px solid orange';
        }else{
            // valid
            feildid.style.borderBottom = '2px solid green';
        }

    }else{

        ob[property] = null;
        if(feildid.required){
            feildid.style.borderBottom = '2px solid red';
        }else{
            feildid.style.borderBottom = '2px solid rgb(118, 118, 118)';
        }
    }
}

// Common validator function to get value from photo field
const photoFieldValidator = (field,pattern,object,property,oldobject,fieldPhotoname,propertyPhotoname) =>{
    let ob = window[object];
    let oldob = window[oldobject];

    console.log(field.value);
    console.log(field.files[0].name);

    let fileReader = new FileReader();
    fileReader.onload = ex =>{
        if (fieldPhotoname != undefined){
            showImg.src = fileReader.result;
        }

        if (fieldPhotoname != undefined){
            fieldPhotoname.value = field.files[0].name;
            ob[propertyPhotoname] = field.files[0].name;
        }

        ob[property] = btoa(fileReader.result);

        if (oldob != null && ob[property] != oldob[property]){
            if (fieldPhotoname != undefined)
                fieldPhotoname.style.borderBottom ="2px solid orange";
        }else {
            if (fieldPhotoname != undefined)
                fieldPhotoname.style.borderBottom ="2px solid green";
        }

        return;
    }
    fileReader.readAsDataURL(field.files[0]);
}

// Common function to fill one data into select element
const fillSelectFeild = (feildid, displayMessage, dataList, displayProperty, selectedavalue, visibility=false) => {
    feildid.innerHTML = "";
    if (displayMessage != ""){
        optionPlaceholder = document.createElement('option');
        optionPlaceholder.value = "";
        optionPlaceholder.selected = true;
        optionPlaceholder.disabled = true;
        optionPlaceholder.innerText = displayMessage;
        feildid.appendChild(optionPlaceholder);
    }

    for (index in dataList){
        optionValues = document.createElement('option');
        optionValues.value = JSON.stringify(dataList[index]);
        // optionValues.innerText = dataList[index][displayProperty];
        optionValues.innerText = getDataFromObject(dataList[index],displayProperty);
        if(getDataFromObject(dataList[index],displayProperty) == selectedavalue){
            optionValues.selected = true;
            feildid.style.borderBottom = "2px solid green";
        }
        feildid.appendChild(optionValues);
    }

    if(visibility)
        feildid.disabled = true;
    else
        feildid.disabled = false;

}

// Common function to fill two data into select element
const fillSelectFeild2 = (feildid, displayMessage, dataList, displayProperty, displayProperty2,selectedValue, visibility=false) => {
    feildid.innerHTML = "";
    optionPlaceholder = document.createElement('option');
    optionPlaceholder.value = "";
    optionPlaceholder.selected = true;
    optionPlaceholder.disabled = true;
    optionPlaceholder.innerText = displayMessage;
    feildid.appendChild(optionPlaceholder);

    for (index in dataList){
        optionValues = document.createElement('option');
        optionValues.value = JSON.stringify(dataList[index]);
        optionValues.innerText = dataList[index][displayProperty] +" - "+ dataList[index][displayProperty2];
        if (selectedValue == dataList[index][displayProperty]){
            optionValues.selected = "selected";
        }
        feildid.appendChild(optionValues); 
    }

    if(visibility)
        feildid.disabled = true;
    else
        feildid.disabled = false;
}

// Common function to fill three data into select element
const fillSelectFeild3 = (feildid, displayMessage, dataList, displayProperty, displayProperty2, displayProperty21, visibility=false) => {
    optionPlaceholder = document.createElement('option');
    optionPlaceholder.value = "";
    optionPlaceholder.selected = true;
    optionPlaceholder.disabled = true;
    optionPlaceholder.innerText = displayMessage;
    feildid.appendChild(optionPlaceholder);

    for (index in dataList){
        optionValues = document.createElement('option');
        optionValues.value = JSON.stringify(dataList[index]);
        // optionValues.innerText = getDataFromList(dataList[index], displayPropertyList)
        optionValues.innerText = dataList[index][displayProperty2][displayProperty21] +" "+ dataList[index][displayProperty];
        feildid.appendChild(optionValues);
    }

    if(visibility)
        feildid.disabled = true;
    else
        feildid.disabled = false;
}

// Common Function for fill data into table
const fillDataIntoTable = (tableid, dataList, propertyList, dataTypeList, modifyFunction, deleteFunction, viewFunction,
                           buttonVisibility, userPrivilage) => {

        tbody = tableid.children[1];
        tbody.innerHTML = ""; //refill

    for(let index = 0; index < dataList.length; index++) {
        tr = document.createElement("tr");

        td1 = document.createElement("td");
        td1.innerHTML = index + 1;
        tr.appendChild(td1);

        // for(pro in propertyList){
        //     // Create td element
        //     td = document.createElement("td");
        //     let data = dataList[index][propertyList[pro]];
        //     // console.log(dataTypeList[pro]);
        //
        //     if(dataTypeList[pro] == "text"){
        //         if(data == null){
        //             td.innerText = "-";
        //         }else td.innerText = data;
        //     } else if(dataTypeList[pro] == "yearbydate"){
        //         if(data == null){
        //             td.innerText = "-";
        //         }else td.innerText = new Date(data).getFullYear();
        //     } else if(dataTypeList[pro] == "image"){
        //         // create img node
        //         img = document.createElement("img");
        //         // img.width = '100px';
        //         // img.height = '100px';
        //         if(data == null){
        //             img.src = 'resources/images/sort_asc.png';
        //         }else{
        //         img.src = data;
        //         }
        //         td.appendChild(img);
        //     }else if(dataTypeList[pro] == "object"){
        //         td.innerText = getDataFromObject(dataList[index],propertyList[pro]);
        //     }else{
        //         td.innerHTML = dataTypeList[pro](dataList[index]);
        //     }
        //
        //     tr.appendChild(td);
        //
        // }

        for (let i = 0; i < propertyList.length; i++) {

            td2 = document.createElement("td");
            let cellData = dataList[index][propertyList[i]];

            if(dataTypeList[i] == "text"){
                if(cellData == null) td2.innerHTML = "-"; else td2.innerHTML = cellData;
            }else if(dataTypeList[i] == "yearbydate"){
                if(cellData == null) td2.innerHTML = "-"; else{
                    let date = new Date(cellData);
                    td2.innerHTML = date.getFullYear();
                }
            }else if (dataTypeList[i] == "imagepath") {
                let image = document.createElement('img');
                image.style.width = "50px";
                image.style.height = "50px";
                if(cellData == null) image.src = "resources/images/sort_asc.png"; else image.src = cellData;
                td2.appendChild(image);
            } else if(dataTypeList[i] == "imagearray"){
                let image = document.createElement('img');
                image.style.width = "50px";
                image.style.height = "50px";
                if(cellData == null) image.src = "resources/images/noimage.png"; else image.src = atob(cellData);
                td2.appendChild(image);
            }else if(dataTypeList[i] == "object"){
                let para = document.createElement('p');
                para.innerText = getDataFromObject(dataList[index],propertyList[i])
                td2.appendChild(para);
            }else{
                td2.innerHTML =  dataTypeList[i](dataList[index]);
            }

            //  td2.innerHTML =

            tr.appendChild(td2);
        }


        // Create td for add modify buttons
        tdB = document.createElement("td");
        // Create buttons
        btnEdit = document.createElement("button"); //
        btnEdit.style.pointerEvents="all"; // add pointer even add for button
        btnEdit.classList.add('btn');
        btnEdit.innerHTML = "<i class='fas fa-edit'></i>";
        btnEdit.onclick = function(){
            // alert("edit");
            let rowno = this.parentNode.parentNode.firstChild.innerText;
            modifyFunction(dataList[parseInt(rowno)-1]  , rowno);
        }

        btnDelete = document.createElement("button");
        btnDelete.style.pointerEvents="all"; // add pointer even add for button
        btnDelete.classList.add('btn');
        btnDelete.classList.add('ms-1');
        btnDelete.classList.add('me-1');
        btnDelete.innerHTML = "<i class='fas fa-trash'></i>";
        btnDelete.onclick = function(){
            // alert("delete");
            let rowno = this.parentNode.parentNode.firstChild.innerText;
            deleteFunction(dataList[parseInt(rowno)-1] , rowno);
        }

        btnView = document.createElement("button");
        btnView.style.pointerEvents="all"; // add pointer even add for button
        btnView.classList.add('btn');
        btnView.innerHTML = "<i class='fas fa-eye'></i>";
        // btnView.classList.add('btn-info');
        btnView.onclick = function(){
            // alert("View");
            let rowno = this.parentNode.parentNode.firstChild.innerText;
            viewFunction(dataList[parseInt(rowno)-1]  , rowno);
        }

        // tdB.appendChild(btnEdit);
        // tdB.appendChild(btnDelete);
        // tdB.appendChild(btnView);

        //check button visibility
        if (buttonVisibility) {

            //check user privilege for update
            if (userPrivilage != null){
                if (userPrivilage.upd) {
                    btnEdit.style.cursor = "pointer";
                    btnEdit.disabled = false;
                } else {
                    btnEdit.style.cursor = "not-allowed";
                    btnEdit.disabled = true;
                }
                //check user privilege for delete
                if (userPrivilage.del) {
                    btnDelete.style.cursor = "pointer";
                    btnDelete.disabled = false;
                } else {
                    btnDelete.style.cursor = "not-allowed";
                    btnDelete.disabled = true;
                }
            }

            tdB.appendChild(btnEdit);
            tdB.appendChild(btnDelete);
            tdB.appendChild(btnView);
            tr.appendChild(tdB);
        }
        tbody.appendChild(tr);
    }

}

// Common Function to Get data from object using given property path
const getDataFromObject = (obj,propertypath) =>{
    // console.log(obj,propertypath);
    let get = (modal,path) =>{
        let paths = path.split('.');
        // console.log(paths);
        // console.log(paths[1]);
        // console.log(modal[paths[0]]);

        if(paths.length > 1 && typeof modal[paths[0]] === "object"){
            return get(modal[paths[0]] , paths.splice(1).join('.'));
        }else{
            return modal[paths[0]];
        }
    }

    let date = get(obj,propertypath);
    return date;
}

// Common Function to Get Month and Date
const getMonthDate = (dateob) => {

    let month = dateob.getMonth() +1 ; //array [0-11]
    if (month < 10) month = "0" + month;

    let date = dateob.getDate() ;
    if (date < 10) date = "0" + date;

    return "-" + month + "-" + date;
}
