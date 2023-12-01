import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import { getUserData } from "../../services/http.service";
import { useParams } from "react-router-dom";
import Ad from "../../components/Ad";
import UserMovies from "./UserMovies/UserMovies";

export default function Profile() {
  const [user, setUser] = useState({ data: null, loading: true });
  const { username } = useParams();

  useEffect(() => {
    const init = async () => {
      if (username) {
        const resUser = await getUserData(null, username);
        document.title = `Профиль ${resUser.username}`;
        setUser({ data: resUser, loading: false });
      } else {
        const token = localStorage.getItem("token");
        if (!token) return;
        const resUser = await getUserData(token);
        setUser({ data: resUser, loading: false });
      }
    };

    init();
  }, []);

  return user.loading ? (
    <div>
      <Skeleton variant="rounded" className="w-full mb-6" height={43} />
      <Skeleton variant="rounded" className="w-full" height={280} />
    </div>
  ) : (
    <div>
      <h1 className="mb-6">{user.data.username} <span className="opacity-30">{window.location.href.includes('/me') ? '(вы)' : null}</span></h1>
      <UserMovies user={user} />
      <br />
      <Ad width='100%' height='130px'></Ad>
    </div>
  );
}
