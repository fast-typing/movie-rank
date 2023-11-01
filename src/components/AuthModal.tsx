import { useContext, useState } from "react";
import { Backdrop, Button, Fade, Modal } from "@mui/material";
import { getUserIP, login, registration } from "../services/http.service";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Registration } from "../interfaces/Interfaces";
import { AuthContext } from "../context/AuthProvider";

interface Props {
  open: boolean;
  type: "Вход" | "Регистрация";
  onClose: () => void;
}

export default function AuthModal(props: Props) {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "", email: "" });

  async function loginInAccount() {
    const res = await login({ username: form.username, password: form.password });
    const token = res[0]?.access_token;
    const user_id = res[1]?.user_id;
    if (!token?.length || !user_id?.length) return;
    const IP = await getUserIP();
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("ip", JSON.stringify(IP));
    window.location.reload();
    setAuth(true);
  }

  function close() {
    props.onClose();
    setForm({ username: "", password: "", email: "" });
  }

  function handleChange(e: any) {
    setForm((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function submit(event: any) {
    console.log(1)
    event.preventDefault();
    if (form.username.length < 3 || form.password.length < 3) return;
    if (props.type === "Вход") {
      loginInAccount();
    } else {
      const res = await registration(form);
      if (!(res as Registration)?.id) return;
      loginInAccount();
    }
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
        <form className="modalContent w-[350px]" onSubmit={(e) => submit(e)}>
          <div className="flex justify-between">
            <h2>{props.type}</h2>
            <CloseRoundedIcon className="cursor-pointer" onClick={close} />
          </div>
          <input name="username" placeholder="Логин" onChange={handleChange} value={form.username} />
          {props.type === "Регистрация" ? (
            <input name="email" placeholder="Почта" onChange={handleChange} value={form.email} />
          ) : (
            ""
          )}
          <input type="password" name="password" placeholder="Пароль" onChange={handleChange} value={form.password} />
          <Button type="submit" variant="contained">
            Отправить
          </Button>
        </form>
      </Fade>
    </Modal>
  );
}
