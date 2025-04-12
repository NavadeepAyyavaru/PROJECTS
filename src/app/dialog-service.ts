export interface DialogService {
  type?: string;
  id:number;
  serviceId: number;
  isGoods?:boolean;
  serviceName: string;
  qty: number;
  unitPrice: number;
  gstTax:number;
  discountValue:number;
  invoiceId:number;
}
