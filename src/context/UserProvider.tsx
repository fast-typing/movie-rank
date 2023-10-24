import { createContext, useEffect, useState } from "react";
import { User } from "../interfaces/Interfaces";
import { getUserData } from "../services/http.service";

type UserContextType = {
    user: User | null; // флаг, показывающий, аутентифицирован ли пользователь
    setUser: (user: User) => void; // функция для изменения значения isAuth
};

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

export const UserProvider = ({ children }: { children: JSX.Element }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token')
            if (!token?.length) return
            const resUser = await getUserData(token)
            if (!resUser) return
            setUser(resUser)
        }

        init()
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};