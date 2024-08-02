package lk.fably.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportInvoice {

    private String date;
    private String invoicecount;
    private String totalamount;
}
