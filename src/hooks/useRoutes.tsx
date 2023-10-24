import { Navigate, Outlet, Route, Router, Routes } from "react-router-dom";
import Main from "../pages/Main/Main";
import MoviePage from "../pages/MoviePage/MoviePage";
import Profile from "../pages/Profile/Profile";
import Search from "../pages/Search/Search";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";

export default function useRoutes() {
    return (
        <div className="main-container">
            <main className="grid gap-16">
                <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/movie/:id" element={<MoviePage />} />

                    <Route element={<PrivateRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Routes>
            </main>
        </div>
    )
}

const PrivateRoute = () => {
    const { isAuth } = useContext(AuthContext);
    return isAuth === true ? <Outlet /> : <Navigate to={"/"} />
}