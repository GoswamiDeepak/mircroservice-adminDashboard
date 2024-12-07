export type Credentials = {
    email: string;
    password: string
}

export type User = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
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
    id?: number;
    name: string;
    address: string;
}

export type FieldData = {
    name: string[];
    value?: string;
}