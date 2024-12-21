import { CreateUserData, Credentials, Tenant } from "../types";
import { api } from "./client";

export const AUTH_SERVICE= '/api/auth';
const CATALOG_SERVICE = '/api/catalog';

//Auth service
export const login = (credentials: Credentials) => api.post(`${AUTH_SERVICE}/auth/login`, credentials)
export const self =() =>api.get(`${AUTH_SERVICE}/auth/self`)
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`)

export const getUsers = (queryString:string) => api.get(`${AUTH_SERVICE}/users?${queryString}`)
export const createUser = (user: CreateUserData) => api.post(`${AUTH_SERVICE}/users`, user)
export const editUser = (user:CreateUserData, id: number) => api.patch(`${AUTH_SERVICE}/users/${id}`, user)

export const getTenants = (queryString: string) => api.get(`${AUTH_SERVICE}/tenants?${queryString}`);
export const createTenant = (tenant: Tenant) => api.post(`${AUTH_SERVICE}/tenants`, tenant)
export const editTenant = (tenant: Tenant, id: number) => api.patch(`${AUTH_SERVICE}/tenants/${id}`, tenant)

//Catalog service
export const getCategories = () => api.get(`${CATALOG_SERVICE}/categories`);
export const getCategory = (id: string) => api.get(`${CATALOG_SERVICE}/categories/${id}`);

export const getProducts = (queryString: string) => api.get(`${CATALOG_SERVICE}/products?${queryString}`);
export const postProduct = (data: FormData) => api.post(`${CATALOG_SERVICE}/products`, data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
export const putProduct = (data: FormData, id: string) => api.put(`${CATALOG_SERVICE}/products/${id}`, data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});