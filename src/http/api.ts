import { CreateUserData, Credentials, Tenant } from "../types";
import { api } from "./client";

//Auth service
export const login = (credentials: Credentials) => api.post('/auth/login', credentials)
export const self =() =>api.get('/auth/self')
export const logout = () => api.post('/auth/logout')
export const getUsers = (queryString:string) => api.get(`/users?${queryString}`)
export const createUser = (user: CreateUserData) => api.post('/users', user)
export const editUser = (user:CreateUserData, id: number) => api.patch(`/users/${id}`, user)
export const getTenants = () => api.get('/tenants');
export const createTenant = (tenant: Tenant) => api.post('/tenants', tenant)