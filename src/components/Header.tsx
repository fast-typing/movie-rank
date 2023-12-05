import { useContext, useState } from "react";
import MovieIcon from "@mui/icons-material/Movie";
import { Box, IconButton, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DragHandleRoundedIcon from "@mui/icons-material/DragHandleRounded";
import { AuthContext } from "../context/AuthProvider";
import { UserContext } from "../context/UserProvider";
import { SIDE_BAR_STYLE } from "../App.constants";
import AuthModal from "./AuthModal";
import FastSearch from "./FastSearch/FastSearch";

interface Modal {
  isOpen: boolean;
  type: "Вход" | "Регистрация";
}

export default function Header() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { isAuth, setAuth } = useContext(AuthContext);
  const [modal, setModal] = useState<Modal>({ isOpen: false, type: "Вход" });
  const [openSideBar, setOpenSideBar] = useState(false);

  function toggleSideBar() {
    document.querySelector('html').classList.toggle('overflow-y-block')
    setOpenSideBar(!openSideBar);
  }

  function openModal(type: "Вход" | "Регистрация") {
    setModal({ type: type, isOpen: true });
  }

  function closeModal() {
    setModal({ ...modal, isOpen: false });
  }

  function logout() {
    setAuth(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    localStorage.removeItem("user_id");
    window.location.reload();
  }

  function routeTo(path: string, isMobile?: boolean) {
    navigate(path);
    if (isMobile) {
      toggleSideBar();
    }
  }

  const nav = (isMobile: boolean): JSX.Element => {
    const buttonClass = isMobile ? "w-full" : "";

    return (
      <div className={isMobile ? "grid gap-6 mb-6" : "flex gap-2"}>
        <FastSearch isMobile={isMobile} toggleSideBar={toggleSideBar} />
        <Button onClick={() => routeTo("", isMobile)} variant="contained" className={buttonClass}>
          Главная
        </Button>
        <Button onClick={() => routeTo("search", isMobile)} variant="contained" className={buttonClass}>
          Фильмы
        </Button>
        <Button onClick={() => routeTo("cinema", isMobile)} variant="contained" className={buttonClass}>
          Афиша
        </Button>
        {isAuth ? (
          <>
            <Button onClick={() => routeTo("me", isMobile)} variant="contained" className={buttonClass}>
              Профиль
            </Button>
            <Button variant="contained" onClick={logout} className={buttonClass}>
              Выйти
            </Button>
          </>
        ) : (
          <div className={isMobile ? "grid gap-6" : "flex gap-2"}>
            <Button onClick={() => openModal("Вход")} variant="contained">
              Вход
            </Button>
            <Button onClick={() => openModal("Регистрация")} variant="contained">
              Регистрация
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="header-container">
      <header className="m-auto flex items-center justify-between py-6 z-20 relative">
        <Link to={``}>
          <div className="flex items-center gap-2">
            <MovieIcon fontSize="large" />
            <h2>Movie Rank</h2>
          </div>
        </Link>
        {/* 👇 ПК Версия 👇 */}
        <div className="hidden lg:flex gap-2">{nav(false)}</div>
        {/* ПК Версия */}

        {/* 👇 Мобилка Версия 👇 */}
        <div className="block lg:hidden">
          <IconButton color="primary" onClick={toggleSideBar}>
            <DragHandleRoundedIcon />
          </IconButton>
          {openSideBar ? (
            <div className="top-0 inset-x-0 bottom-0 z-[-1] fixed">
              <Box sx={SIDE_BAR_STYLE}>{nav(true)}</Box>
            </div>
          ) : null}
        </div>
        {/* Мобилка Версия */}
      </header>

      <AuthModal type={modal.type} open={modal.isOpen} onClose={closeModal} />
    </div>
  );
}
