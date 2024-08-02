window.addEventListener('load', ev => {

    userPrivilege = getServiceRequest("/userprivilege/bymodule?modulename=Privilege");
    refreshTable(); //called refreshTable function for refresh table in ui load event
    refreshForm();
});

//function for fill data into table
const refreshTable = () => {

    privileges = new Array();

    privileges = getServiceRequest("/privilege/findall");

    let displayPropertyList = ['role_id.name','module_id.name','sel','ins','upd','del'];
    let dPDTList = ['object','object',getSelectPriv,getInsertPriv,getUpdatePriv,getDeletePriv];

    fillDataIntoTable(tablePrivilege,privileges,displayPropertyList,dPDTList,
        refillForm,deleteRow,viewRow,true,userPrivilege);

    for (let index in privileges){
        if (privileges[index].sel == false && privileges[index].ins == false && privileges[index].del ==false && privileges[index].upd == false){
            tablePrivilege.children[1].children[index].children[3].children[0].style.color = "red";
            tablePrivilege.children[1].children[index].children[4].children[0].style.color = "red";
            tablePrivilege.children[1].children[index].children[5].children[0].style.color = "red";
            tablePrivilege.children[1].children[index].children[6].children[0].style.color = "red";

            tablePrivilege.children[1].children[index].children[7].children[1].disabled = true ;
            tablePrivilege.children[1].children[index].children[7].children[1].style.pointerEvents = "all" ;
            tablePrivilege.children[1].children[index].children[7].children[1].style.cursor = "not-allowed" ;
        }
        tablePrivilege.children[1].children[index].children[7].children[2].style.display = "none" ;
    }

    $('#tablePrivilege').dataTable();
}

//to create a function for refresh form and take the form to the initial state
const refreshForm = () => {

    privilege = new Object();//form eke tyna siyaluma feilds wala values tika me object ekta collect kra gnnwa
    oldPrivilege = null;//to compare with the earlier object

    roles = getServiceRequest("/role/list");
    fillSelectFeild(selectRole, 'Select Role', roles, 'name', '');
    selectRole.style.boderBottom = "2px solid #d1d3e2";

    // getModuleWithoutPrivilege();

    modules = getServiceRequest("/module/list");
    fillSelectFeild(selectModule, 'Select Module', modules, 'name', '');
    selectModule.style.boderBottom = "2px solid #d1d3e2";

    SelectGranted.checked = false;
    SelectNotGranted.innerText = "Select Not Granted";
    // SelectNotGranted.style.color = "black";
    privilege.sel = false;

    InsertGranted.checked = false;
    InsertNotGranted.innerText = "Insert Not Granted";
    // InsertNotGranted.style.color = "black";
    privilege.ins = false;

    UpdateGranted.checked = false;
    UpdateNotGranted.innerText = "Update Not Granted";
    privilege.upd = false;
    // UpdateNotGranted.style.color = "black";

    DeleteGranted.checked = false;
    DeleteNotGranted.innerText = "Delete Not Granted";
    // DeleteNotGranted.style.color = "black";
    privilege.del = false;

    disableButton(true,false)

}

//create function to check available errors in the form
const getErrors = () => {
    let errors = "";

    if (privilege.role_id == null){
        errors = errors + "Role not selected. \n ";
        selectRole.style.boderBottom = "2px solid red";
    }
    if (privilege.module_id == null){
        errors = errors + "Module not selected. \n";
        selectModule.style.boderBottom = "2px solid red";
    }
    return errors;
}
// function for add data into table
const buttonAddMC = () => {
    let errors = getErrors();
    if (errors == ""){
        let addConMsg = "Are you sure to add the following privileges ?\n"
            + "\n Role : " + privilege.role_id.name
            + "\n Module : " + privilege.module_id.name
            + "\n Select : " + getPrivilegeText(privilege.sel , "Granted","Not Granted")
            + "\n Update : " + getPrivilegeText(privilege.upd , "Granted", "Not Granted")
            + "\n Insert : " + getPrivilegeText(privilege.ins , "Granted", "Not Granted")
            + "\n Delete : " + getPrivilegeText(privilege.del ,"Granted", "Not Granted");

        let userResponse = window.confirm(addConMsg);

        if (userResponse){
            let postServerResponse = getHttpBodyResponce("/privilege","POST",privilege);
            if (postServerResponse == "0"){
                alert("Added Successfully !");
                refreshTable();
                refreshForm();
                $('#modelAddPriv').modal("hide");
            }else {
                alert("Save Not Completed ! \n " + postServerResponse)
            }
        }
        else {}

    }
    else{
        alert("Form have the following errors !\n " + errors);
    }
}

//create function for update button
const buttonUpdateMC = () => {
    let errors = getErrors();

    if (errors == ""){
        let updates = getUpdate();
        if ( updates ==""){
            alert("Nothing Updated !");
        }
        else {
            let updateUserConfirm = window.confirm("Are you sure to update following changes ?\n" + updates);
            if (updateUserConfirm){
                let putResponce = getHttpBodyResponce("/privilege","PUT",privilege);
                if(putResponce ==0){
                    alert("Updated Successfully !");
                    refreshTable();
                    refreshForm();
                    $('#modelAddPriv').modal("hide");
                }
                else {
                    alert("Update Not Completed ! \n" + putResponce);
                }
            }
        }

    }
    else {
        alert("Form have the following errors \n " + errors);
    }
}

//function for get select privilege
function getSelectPriv(ob){
    let selectPriv = "<i class='fa fa-times fa-2x' style='color: red'></i>";
    if (ob.sel){
        selectPriv = "<i class='fa fa-check fa-2x' style='color: #008B8B'></i>";
    }
    return selectPriv;
}

function getInsertPriv(ob){
    let InsertPriv = "<i class='fa fa-times fa-2x' style='color: red'></i>";
    if (ob.ins){
        InsertPriv = "<i class='fa fa-check fa-2x' style='color: #008B8B'></i>";
    }
    return InsertPriv;
}

function getUpdatePriv(ob){
    let UpdatePriv = "<i class='fa fa-times fa-2x' style='color: red'></i>";
    if (ob.upd){
        UpdatePriv = "<i class='fa fa-check fa-2x' style='color: #008B8B'></i>";
    }
    return UpdatePriv;
}

function getDeletePriv(ob){
    let DeletePriv = "<i class='fa fa-times fa-2x' style='color: red'></i>";
    if (ob.del){
        DeletePriv = "<i class='fa fa-check fa-2x' style='color: #008B8B'></i>";
    }
    return DeletePriv;
}

const setStyle = (style)=> {
    selectRole.style.borderBottom = style;
    selectModule.style.borderBottom = style;
}

const refillForm = (rowob,rowind) =>{

    // clearTableStyle(tablePrivilege)
    // tablePrivilege.children[1].children[parseInt(rowind)-1].style.backgroundColor = "#70e8da";

    privilege = getServiceRequest("/privilege/getbyid/"+rowob.id);
    oldPrivilege = getServiceRequest("/privilege/getbyid/"+rowob.id);

    setStyle('2px solid green');

    fillSelectFeild(selectRole, "Select Role",roles, "name", privilege.role_id.name, false);
    fillSelectFeild(selectModule, "Select Module",modules, "name", privilege.module_id.name, false);

    if(privilege.sel){
        SelectGranted.checked = true;
        SelectNotGranted.innerText = 'Select Granted';
    }else{
        SelectGranted.checked = false;
        SelectNotGranted.innerText = 'Select Not Granted';
    }

    if(privilege.ins){
        InsertGranted.checked = true;
        InsertNotGranted.innerText = 'Insert Granted';
    }else{
        InsertGranted.checked = false;
        InsertNotGranted.innerText = 'Insert Not Granted';
    }

    if(privilege.upd){
        UpdateGranted.checked = true;
        UpdateNotGranted.innerText = 'Update Granted';
    }else{
        UpdateGranted.checked = false;
        UpdateNotGranted.innerText = 'Update Not Granted';
    }

    if(privilege.del){
        DeleteGranted.checked = true;
        DeleteNotGranted.innerText = 'Delete Granted';
    }else{
        DeleteGranted.checked = false;
        DeleteNotGranted.innerText = 'Delete Not Granted';
    }

    $('#modelAddPriv').modal('show');

    disableButton(false,true)
}

//create function to check available updates in the form
const getUpdate = () => {
    let updates = "";

    if (privilege != null && oldPrivilege != null){
        if (privilege.role_id.name != oldPrivilege.role_id.name){
            updates = updates + "Role is changed. \n";
        }

        if (privilege.module_id.name != oldPrivilege.module_id.name){
            updates = updates + "Module is changed. \n";
        }
        if (privilege.sel != oldPrivilege.sel){
            updates = updates + "Select privilege is changed. \n";
        }
        if (privilege.ins != oldPrivilege.ins){
            updates = updates + "Insert privilege is changed. \n";
        }
        if (privilege.upd != oldPrivilege.upd){
            updates = updates + "Update privilege is changed. \n";
        }
        if (privilege.del != oldPrivilege.del){
            updates = updates + "Delete privilege is changed. \n";
        }
    }
    return updates;
}

//function for get delete confirmation
const deleteRow = (privOb, rowNo) =>{
    let deleteMsg = "Are you sure to delete following privilege ?\n"
        +"\n Role :" + privOb.role_id.name
        +"\n Module : " + privOb.module_id.name
        + "\n Select : " + getPrivilegeText(privilege.sel , "Granted","Not Granted")
        + "\n Update : " + getPrivilegeText(privilege.upd , "Granted", "Not Granted")
        + "\n Insert : " + getPrivilegeText(privilege.ins , "Granted", "Not Granted")
        + "\n Delete : " + getPrivilegeText(privilege.del ,"Granted", "Not Granted");

    let userDeleteResponce = window.confirm(deleteMsg);

    if (userDeleteResponce){
        let deleteSeverResponce = getHttpBodyResponce("/privilege", "DELETE", privOb);

        if(deleteSeverResponce == "0"){
            alert("Delete Completed !");
            refreshTable();
        }else {
            alert("Delete not completed ! \n" + deleteSeverResponce);
        }
    }

}
const viewRow = () =>{}

const getPrivilegeText = (priValue , trueText, falseText) =>{
    if(priValue){
        return trueText;
    }else {
        return falseText;
    }

}

function getModuleWithoutPrivilege(){
    let moduleWithotPrivilege = getServiceRequest("/module/withoutPrivilege/" + JSON.parse(selectRole.value).id);
    fillSelectFeild(selectModule,"Select Module",moduleWithotPrivilege,"name","");
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