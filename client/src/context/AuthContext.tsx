import {  createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../types";
import api from "../configs/api";
import toast from "react-hot-toast";

interface AuthContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void
    user: IUser | null;
    setUser: (user: IUser | null) => void;
    login: (user: { email: string; password: string }) => Promise<void>
    signUp: (user: { name: string; email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => { },
    user: null,
    setUser: () => { },
    login: async () => { },
    signUp: async() => { },
    logout: async () => { },
    
})

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
    const [user, setUser] = useState<IUser | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    const signUp = async ({ name, email, password }: {name:string, email:string, password: string}) => {
        try {
            const { data } =await  api.post('/api/auth/register', { name, email, password })
            console.log({data})
            if (data.user) {
                setUser(data.user as IUser)
                setIsLoggedIn(true)
            }
            toast.success(data.message)
        }
        catch (err:any) {
            toast.error(err?.response?.data?.message || err?.message || 'Sign up failed')
                console.log(err)
        }
    }
    const login = async ({  email, password }: { email:string, password: string}) => {
        try {
            const { data } = await api.post('/api/auth/login', { email, password })
            console.log({data})
            if (data.user) {

                setUser(data.user as IUser)
                setIsLoggedIn(true)
            }
            toast.success(data.message)
        }
        catch (err:any) {
            toast.error(err?.response?.data?.message || err?.message || 'Login failed')
                console.log(err)
        }
    }

    const logout = async () => {
        try {
            const { data } =  await api.post('/api/auth/logout')
            setUser(null)
            setIsLoggedIn(false)
            toast.success(data.message)
        }
        catch (err) {
                console.log(err)
        } 
    }


    const fetchUser = async () => {
        try {
            const  {data}  =await api.post('/api/auth/verify')
            if (data.user) {
                setUser(data.user as IUser);
                setIsLoggedIn(true);
            }
        }
        catch (err) {
            console.log
            console.log({err})
        } 
    }

    useEffect(() => {
        (async () => {
            await fetchUser()
        })()
    },[])


    const value = {
        user, setUser, isLoggedIn, setIsLoggedIn, login, signUp, logout
    }
    return (
        <AuthContext.Provider value={ value}>
            {children }
      </AuthContext.Provider>
    )

} 

export const UseAuth = () => useContext(AuthContext)