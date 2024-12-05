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

export type Tenant = {
    id: number;
    name: string;
    address: string;
}