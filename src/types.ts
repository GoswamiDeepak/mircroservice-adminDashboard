/* eslint-disable no-unused-vars */
export type Credentials = {
    email: string;
    password: string
}

export type User = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    tenant: Tenant | null
    createdAt: string;
}

export type CreateUserData = {
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    tenant: number;
}

export type Tenant = {
    id: number;
    name: string;
    address: string;
}


export type FieldData = {
    name: string[];
    value?: string;
}

export interface PriceConfiguaration {
    [key: string]: {
        priceType: "base" | "aditional";
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    _id: string;
    name: string;
    priceConfiguration: PriceConfiguaration;
    attributes: Attribute[];
}

export interface ProductAtrribute {
    name: string;
    value: string | boolean;
}
export interface Product {    
    _id: number | string;
    name: string;
    description: string; 
    image: string;
    category: Category | string;
    status: boolean;
    tenant: Tenant;
    isPublish: boolean;
    createdAt: string;
    attributes: ProductAtrribute[];
    priceConfiguration: PriceConfiguaration;
}

export type CreateProductData = Product & {
    image: {
        file: File
    }
}

export interface Topping {
    _id: string;
    name: string;
    price: number;
    image: string;
  }

export interface CartItem extends Pick<Product, "_id" | "name" | "priceConfiguration" | "image"> {
    chosenConfiguration: {
      priceConfiguration: {
        [key: string]: string;
      };
      selectedToppings: Topping[];
    };
    qty: number;
  }
  
  export enum PaymentMode {
    CARD = "card",
    CASH = "cash",
}
export enum OrderStatus {
    RECEIVED = "received",
    CONFIRMED = "confirmed",
    PREPARED = "prepared",
    // READY_FOR_DELIVERY = "ready_for_delivery",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
}
export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
}

export interface Order {
    _id: string;
    cart: CartItem[];
    customerId: User;
    total: number;     
    discount: number;
    taxes: number;
    deliveryCharges: number;
    address: string;
    tenantId: string;
    comment?: string;
    paymentMode: PaymentMode;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentId?: string;
}