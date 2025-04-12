export interface DialogItems  {
  idInvoiceItems: number,
  isGoods: boolean,
  itemId: number,
  itemName: string,
  itemUnits: string,
  hsnSacCode: string,
  description: string,
  qty: number,
  unitPrice: number,
  isDiscountPercentage: number,
  discountValue: number,
  idGstTax: number,
  lineTotal: number,
  invoiceId: number
}
