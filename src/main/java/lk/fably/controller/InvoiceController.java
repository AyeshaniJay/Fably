package lk.fably.controller;

import lk.fably.dao.*;
import lk.fably.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
public class InvoiceController {

    @Autowired
    private InvoiceDao invoiceDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private InvoicestatusDao invoicestatusDao;

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private OrderstatusDao orderstatusDao;

    @Autowired
    private StoreDao storeDao;

    @Autowired
    private PrivilegeController privilegeController;

    //get invoice form UI
    @GetMapping(value = "/invoicecreate")
    public ModelAndView invoiceCreateUI(){
        ModelAndView formUi = new ModelAndView();
        formUi.setViewName("invoice_create.html");

        return formUi;
    }

    @GetMapping(value = "/invoice/getcount", produces = "application/json")
    public Invoice getInvoiceCount(){
        return invoiceDao.getInvoiceCount();
    }

    //get invoice view UI
    @GetMapping(value = "/invoiceview")
    public ModelAndView invoiceViewUI(){
        ModelAndView viewUi = new ModelAndView();
        viewUi.setViewName("invoice_view.html");

        return viewUi;
    }

    //get mapping for get All invoice details --> [/invoice/findall]
    @GetMapping(value = "/invoice/findall", produces = "application/json")
    public List<Invoice> invoiceFindAll(){
        //need to check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        if (auth instanceof AnonymousAuthenticationToken){
            return null;
        }
        //get logged user authenticaion object
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "InvoiceView");

        if (loggedUser != null && loggedUserPrivilege.get("sel")) {
            return invoiceDao.findAll();
        } else {
            return null;
        }
    }

    //get mapping for get invoice by given path variable id -->(invoice/getbyid/1)
    @GetMapping(value = "/invoice/getbyid/{id}", produces = "application/json") //if return dada-->produces
    public Invoice getInvoiceByPVId(@PathVariable("id") Integer id){
        return invoiceDao.getReferenceById(id);
    }

    //get mapping for get invoice by given path variable id -->(invoice/getbycode/23090001)
    @GetMapping(value = "/invoice/getbycode/{code}", produces = "application/json") //if return dada-->produces
    public Invoice getInvoiceByCode(@PathVariable("code") String code){
        return invoiceDao.getByInvoiceCode(code);
    }

    //get invoice by order id
    @GetMapping(value = "invoice/getbyorder/{id}", produces = "application/json") //if return dada-->produces
    public Invoice getInvoiceByOrder(@PathVariable("id") Integer id){
        return invoiceDao.getByOrder(id);
    }

    //create mapping for add invoice [/invoice]
    @PostMapping(value = "/invoicecreate")
    @Transactional
    public String insertInvoice(@RequestBody Invoice invoice) {
        //check privilege for logged user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "InvoiceCreate");

        if (loggedUser != null && loggedUserPrivilege.get("ins")) {

            try {
                //check inventory availability
//                Boolean inventoryAvailability = true;
//                String inventoryNotAvailabilityProductName = "";
//                for (InvoiceProduct invoiceProduct : invoice.getInvoiceProductList()){
//                    invoiceProduct.setInvoice_id(invoice);
//
//                    PStore pStore = storeDao.getByProductSize(invoiceProduct.getProduct_id().getId(),invoiceProduct.getSize_id().getId());
//
//                    if (pStore != null){
//                        if (pStore.getAvailableqty() < invoiceProduct.getOrderqty() ){
//                            inventoryAvailability = false;
//                            inventoryNotAvailabilityProductName = invoiceProduct.getProduct_id().getName();
//                            break;
//                        }
//                    }else {
//                        return "Product not available in inventory !";
//                    }
//                }
//
//                if (!inventoryAvailability){
//                    return "Invoice insert not completed. " + inventoryNotAvailabilityProductName + " inventory not enough !";
//                }

                //set automatic values
                invoice.setAdded_datetime(LocalDateTime.now());
                invoice.setAddeduser_id(loggedUser);

                invoice.setInvoicestatus_id(invoicestatusDao.getReferenceById(1));

                //set next invoice code by Year & Month
                String lastInvoCode = invoiceDao.lastInvoCode();
                String nextInvoCode = "";
                LocalDate currentDate = LocalDate.now();
                int currentMonth = currentDate.getMonth().getValue();
                String currentYearString = String.valueOf(currentDate.getYear());
                String currentYearStringLastTwoD = currentYearString.substring(2,4);
                String currentMonthString = "";
                if (currentMonth < 10)
                    currentMonthString = "0" + currentMonth;
                if (lastInvoCode != null){
                    //  23 06 0003
                    if (lastInvoCode.substring(0,2).equals(currentYearStringLastTwoD)){
                        if (lastInvoCode.substring(2,4).equals(currentMonthString)){
                            nextInvoCode = currentYearStringLastTwoD + currentMonthString + String.format("%04d",(Integer.valueOf(lastInvoCode.substring(4)) + 1));
                        }else {
                            nextInvoCode = currentYearStringLastTwoD + currentMonthString + "0001";
                        }
                    }else {
                        nextInvoCode = currentYearStringLastTwoD + currentMonthString + "0001";
                    }
                }else {
                    nextInvoCode = currentYearStringLastTwoD + currentMonthString + "0001";
                }

                invoice.setCode(nextInvoCode);

                System.out.println(nextInvoCode);
                //operator
                for (InvoiceProduct invoiceProduct : invoice.getInvoiceProductList()){
                    invoiceProduct.setInvoice_id(invoice);
                }
                //save
                invoiceDao.save(invoice);

                //inventory down
//                for (InvoiceProduct invoiceProduct : invoice.getInvoiceProductList()){
//                    invoiceProduct.setInvoice_id(invoice);
//
//                    PStore pStore = storeDao.getByProductSize(invoiceProduct.getProduct_id().getId(),invoiceProduct.getSize_id().getId());
//                    pStore.setAvailableqty(pStore.getAvailableqty()-invoiceProduct.getQty());
//                    storeDao.save(pStore);
//                }

                //dependency update
                CustomerOrder customerOrder = orderDao.getReferenceById(invoice.getCorder_id().getId());
                customerOrder.setLastupdate_datetime(LocalDateTime.now());
                customerOrder.setLastupdateduser_id(loggedUser);

                if (customerOrder.getOrderstatus_id().getName().equals("Ordered - PaidOnline")){
                    customerOrder.setOrderstatus_id(orderstatusDao.getReferenceById(4));
                }

                if (customerOrder.getOrderstatus_id().getName().equals("Ordered - COD")){
                    customerOrder.setOrderstatus_id(orderstatusDao.getReferenceById(5));
                }

                for (ProductOrder productOrder : customerOrder.getProductorderList()){
                    productOrder.setCorder_id(customerOrder);
                }

                //operator
                orderDao.save(customerOrder);

//                return new ResponseEntity<String>(HttpStatus.OK,invoice);
                return nextInvoCode;

            } catch (Exception ex) {
                return "Invoice insert not completed ! " + ex.getMessage();
            }
        } else {
            return "Invoice insert not completed. You have no access !";
        }
    }

    //create mapping for update invoice
    @PutMapping(value = "/invoicecreate")
    public String updateInvoice(@RequestBody Invoice invoice) {
        //need to check privilege for logged users
        Authentication auth = SecurityContextHolder.getContext().getAuthentication(); //get security authentication instance for logged user
        User loggedUser = userDao.findUserByUsername((auth.getName())); //get logged user by DB user table using authentication instance

        //get privilege object for logged user and given module
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "InvoiceView");

        if (loggedUser != null && loggedUserPrivilege.get("upd")) {

            //need to check existing
            Invoice extInvoice = invoiceDao.getReferenceById(invoice.getId());
            if (extInvoice == null) {
                return "Invoice update not completed. Invoice does not exist !";

            }

            try {
                invoice.setLastupdated_datetime(LocalDateTime.now());
                invoiceDao.save(invoice);
                return "0";
            } catch (Exception ex) {
                return "Invoice Update not completed ! " + ex.getMessage();
            }

            //update auto set values

            //update dependency modules
        } else {
            return "Invoice Update not completed. You have No Privilege !";
        }
    }

    //create mapping for delete Invoice [/invoice]
    @DeleteMapping(value = "/invoicecreate")
    public String deleteInvoice(@RequestBody Invoice invoice) {
        //check privilege
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = userDao.findUserByUsername(auth.getName());
        HashMap<String, Boolean> loggedUserPrivilege = privilegeController.getPrivilegeByUserModule(auth.getName(), "InvoiceView");

        if (loggedUser != null && loggedUserPrivilege.get("del")) {
            //check object existing
            Invoice extInvoice = invoiceDao.getReferenceById(invoice.getId());

            if (extInvoice != null) {
                //use try catch for catch errors given by the db server
                try {
                    //object exist
                    extInvoice.setDeleted_datetime(LocalDateTime.now());
                    extInvoice.setInvoicestatus_id(invoicestatusDao.getReferenceById(4));

                    //invoiceDao.delete(exInvoice);
                    invoiceDao.save(extInvoice);

                    //run correctly
                    return "0";

                } catch (Exception ex) {
                    return "Delete not completed !" + ex.getMessage();
                }
            } else {
                //object not exist
                return "Delete not completed. Invoice not found !";
            }
        } else {
            return "Delete not completed. You have no access !";
        }
    }
}
