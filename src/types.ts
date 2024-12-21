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

export interface Product {
    _id: number;
    name: string;
    description: string; 
    image: string;
    categoy: Category;
    status: boolean;
    isPublish: boolean;
    createdAt: string;
}

export type CreateProductData = Product & {
    image: {
        file: File
    }
}