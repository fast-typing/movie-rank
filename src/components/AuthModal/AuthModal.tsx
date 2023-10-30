import React, { useContext, useEffect, useState } from "react";
import { Backdrop, Button, Fade, Modal } from "@mui/material";
import { getUserIP, login, registration } from "../../services/http.service";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Registration } from "../../interfaces/Interfaces";
import { AuthContext } from "../../context/AuthProvider";

interface Props {
  open: boolean;
  type: "Вход" | "Регистрация";
  onClose: () => void;
}

export default function AuthModal(props: Props) {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "", email: "", });

  async function submitModal(event: any) {
    event.preventDefault();
    if (form.username.length < 3 || form.password.length < 3) return;
    if (props.type === "Вход") {
      loginC()
    } else {
      const res = await registration(form);
      if (!(res as Registration)?.id) return;
      loginC()
    }
  }

  async function loginC() {
    const res = await login({ username: form.username, password: form.password });
    const token = res[0]?.access_token;
    const user_id = res[1]?.user_id;
    if (!token?.length || !user_id?.length) return;
    const IP = await getUserIP()
    localStorage.setItem('token', token)
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('ip', JSON.stringify(IP))
    window.location.reload()
    setAuth(true)
  }

  function close() {
    props.onClose();
    setForm({ username: "", password: "", email: "" });
  }

  function handleChange(e: any) {
    setForm((prev) => { return { ...prev, [e.target.name]: e.target.value } });
  }

  return (
    <Modal
      open={props.open}
      onClose={close}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={props.open}>
        <form className="modalContent w-[300px]" onSubmit={submitModal}>
          <div className="flex justify-between">
            <h2>{props.type}</h2>
            <CloseRoundedIcon className="cursor-pointer" onClick={close} />
          </div>
          <input name="username" placeholder="Логин" onChange={handleChange} value={form.username}
          />
          {props.type === "Регистрация" ? (
            <input name="email" placeholder="Почта" onChange={handleChange} value={form.email} />
          ) : (
            ""
          )}
          <input name="password" placeholder="Пароль" onChange={handleChange} value={form.password} />
          <Button variant="contained" onClick={submitModal}>
            Отправить
          </Button>
        </form>
      </Fade>
    </Modal>
  );
}
