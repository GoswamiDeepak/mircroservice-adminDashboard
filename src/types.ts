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