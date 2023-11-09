import { useContext, useState } from "react";
import { Backdrop, Button, Fade, Modal, Slide, Snackbar } from "@mui/material";
import { login, registration } from "../services/http.service";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Registration } from "../interfaces/Interfaces";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  type: "Вход" | "Регистрация";
  onClose: () => void;
}

export default function AuthModal(props: Props) {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: null })
  const [loading, setLoading] = useState(false)

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
    event.preventDefault();
    if (form.username.length < 3 || form.password.length < 3) return;
    setLoading(true)
    if (props.type === "Вход") {
      loginInAccount();
    } else {
      const res = await registration(form);
      if (!(res as Registration)?.id) return;
      loginInAccount();
    }
  }

  async function loginInAccount() {
    const res = await login({ username: form.username, password: form.password });
    const token = res[0]?.access_token;
    const user_id = res[1];
    setLoading(false)
    props.onClose()
    if (!token?.length || !user_id) {
      openSnackbar('Что-то пошло не так...')
      return
    } else {
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      console.log(user_id)
      window.location.reload()
      openSnackbar('Вы супешно вошли в аккаунт')
      setAuth(true);
    }
  }

  function openSnackbar(message: string) {
    setSnackbar({ message: message, open: true })
  }

  return (
    <>
      <Snackbar
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        TransitionComponent={Slide}
        message={snackbar.message}
      />
      <Modal
        open={props.open}
        onClose={close}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={props.open}>
          <form className="modal-content w-[350px]" onSubmit={(e) => submit(e)}>
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
            <Button disabled={loading} type="submit" variant="contained">
              Отправить
            </Button>
          </form>
        </Fade>
      </Modal>
    </>
  );
}
