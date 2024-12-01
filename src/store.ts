import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Tenant {
    id: number;
    name: string;
    address: string;
}
export interface User {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    tenant?:Tenant;
}

interface AuthState{
    user: User | null;
    setUser: (user:User) => void;
    logout: ()=> void;
}

export const userAuthStore = create<AuthState>()(
    devtools((set) => ({
        user: null,
        setUser: (user) => set({user: user}),
        logout: ()=>set({user:null})
    })
    )
)