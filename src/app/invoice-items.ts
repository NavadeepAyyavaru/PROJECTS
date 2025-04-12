export interface InvoiceItems {
    idInvoiceItems: number;
    itemId: number | null;
    itemName: string | null; 
    servicesName: string | null;
    unitPrice: number;
    qty: number;
    isGoods: number;
    servicesId: number | null;
    description: string;
    idGstTax: string;
    lineTotal: number;
    isDiscountPercentage: number;
    discountValue: number;
    invoiceId: number | null;
}
