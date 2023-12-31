import { useContext, useState } from "react";
import { Backdrop, Button, Fade, Modal } from "@mui/material";
import { login, registration } from "../services/http.service";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AuthContext } from "../context/AuthProvider";
import Toast from "./Toast";

interface Props {
  open: boolean;
  type: "Вход" | "Регистрация";
  onClose: () => void;
}

export default function AuthModal(props: Props) {
  const { setAuth } = useContext(AuthContext);
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: null });
  const [loading, setLoading] = useState(false);

  function close() {
    props.onClose();
    setForm({ username: "", password: "", email: "" });
    setLoading(false);
  }

  function handleChange(e: any) {
    setForm((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  async function submit(event: any) {
    event.preventDefault();
    if (form.username.length < 3 || form.password.length < 3) return;

    if (props.type === "Вход") {
      setLoading(true);
      loginInAccount();
    } else {
      if (!validateEmail(form.email)) {
        openSnackbar("Введите корректный email");
        return
      }
      setLoading(true);
      const res = await registration(form);
      if (res.detail === "User already exists") {
        openSnackbar("Пользователь с таким ником или почтой уже существует");
        setLoading(false);
      } else if (res.id) {
        loginInAccount();
      }
    }
  }

  async function loginInAccount() {
    const res = await login({ username: form.username, password: form.password });
    const token = res[0]?.access_token;
    const user_id = res[1];
    const is_admin = res[2];
    setLoading(false);
    if (!token?.length || !user_id) {
      openSnackbar("Что-то пошло не так...");
    } else {
      close()
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("is_admin", String(is_admin));
      window.location.reload();
      setAuth(true);
    }
  }

  function openSnackbar(message: string) {
    setSnackbar({ message: message, open: true });
  }

  return (
    <>
      <Toast open={snackbar.open} onClose={() => setSnackbar({ ...snackbar, open: false })} message={snackbar.message} />
      <Modal open={props.open} onClose={close} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
        <Fade in={props.open}>
          <form className="modal-content w-[350px]" onSubmit={(e) => submit(e)}>
            <div className="flex justify-between">
              <h2>{props.type}</h2>
              <CloseRoundedIcon className="cursor-pointer" onClick={close} />
            </div>
            <input name="username" placeholder="Логин" onChange={handleChange} value={form.username} />
            {props.type === "Регистрация" ? <input name="email" placeholder="Почта" onChange={handleChange} value={form.email} /> : ""}
            <input type="password" name="password" placeholder="Пароль" onChange={handleChange} value={form.password} />
            <Button disabled={loading} type="submit" variant="contained">
              Отправить
            </Button>
          </form>
        </Fade>
      </Modal>
    </>
  );
}
