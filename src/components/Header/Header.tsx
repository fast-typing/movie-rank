import React, { useContext, useState } from "react";
import MovieIcon from "@mui/icons-material/Movie";
import { Box, Drawer, IconButton, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DragHandleRoundedIcon from "@mui/icons-material/DragHandleRounded";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import {
  closeInputStyleC,
  openInputStyleC,
  sideBarStyleC,
} from "../../App.constants";
import "./Header.css";
import AuthModal from "../AuthModal/AuthModal";
import { AuthContext } from "../../context/AuthProvider";
import { UserContext } from "../../context/UserProvider";

interface Modal {
  isOpen: boolean;
  type: "Вход" | "Регистрация";
}

export default function Header() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { isAuth, setAuth } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Modal>({ isOpen: false, type: "Вход" });
  const [inputOpen, setInputOpen] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);

  const openInputStyle = openInputStyleC;
  const closeInputStyle = closeInputStyleC;
  const sideBarStyle = sideBarStyleC;

  function findBySearch(event: any, isMobile: boolean) {
    event.preventDefault();
    if (!search.length) return;
    setInputOpen(false);
    routeTo(`/search?title=${encodeURI(search)}`)
    setSearch("");
    if (isMobile) {
      setOpenSideBar(false)
    }
  }

  function closeInput(): void {
    if (search.length) return;
    setInputOpen(false);
  }

  function openModal(type: "Вход" | "Регистрация") {
    setModal({ type: type, isOpen: true });
  }

  function closeModal() {
    setModal({ ...modal, isOpen: false });
  };

  function logout() {
    setAuth(false)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')
    window.location.reload()
  }

  function routeTo(path: string, isMobile?: boolean) {
    navigate(path)
    if (isMobile) {
      setOpenSideBar(false)
    }
  }

  const nav = (isMobile: boolean): JSX.Element => {
    const buttonClass = isMobile ? "w-full" : "";
    const inputStyle = isMobile
      ? { width: "100%" }
      : inputOpen
        ? openInputStyle
        : closeInputStyle;

    return (
      <form
        className={isMobile ? "grid gap-6 mb-6" : "flex gap-2"}
        onSubmit={(e) => findBySearch(e, isMobile)}
      >
        <span
          className="pseudo-input"
          onMouseEnter={() => setInputOpen(true)}
          onMouseLeave={closeInput}
        >
          <span className="material-symbols-outlined" onClick={(e) => findBySearch(e, isMobile)}>
            search
          </span>
          <input
            value={search}
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            onBlur={closeInput}
            placeholder="Найти..."
            style={inputStyle}
          />
          {isMobile ? (
            <IconButton onClick={() => setOpenSideBar(false)}>
              {" "}
              <CloseRoundedIcon />{" "}
            </IconButton>
          ) : (
            ""
          )}
        </span>
        <Button onClick={() => routeTo('', isMobile)} variant="contained" className={buttonClass}>
          Главная
        </Button>
        {isAuth ? (
          <>
            <Button onClick={() => routeTo('profile', isMobile)} variant="contained" className={buttonClass}>
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
            <Button
              onClick={() => openModal("Регистрация")}
              variant="contained"
            >
              Регистрация
            </Button>
          </div>
        )}
      </form>
    );
  };

  return (
    <div className="header-container">
      <header className="m-auto flex items-center justify-between py-6">
        <Link to={``}>
          <div className="flex items-center gap-2">
            <MovieIcon fontSize="large" />
            <h2>movieRank</h2>
          </div>
        </Link>
        <div className="hidden lg:flex gap-2">{nav(false)}</div>
        <div className="block lg:hidden">
          <IconButton color="primary" onClick={() => setOpenSideBar(true)}>
            <DragHandleRoundedIcon />
          </IconButton>
          <div className={openSideBar ? "absolute top-[86px] inset-x-0 bottom-0 z-50" : "hidden"}>
            <Box sx={sideBarStyle}>{nav(true)}</Box>
          </div>
        </div>
      </header>

      <AuthModal type={modal.type} open={modal.isOpen} onClose={closeModal} />
    </div>
  );
}
