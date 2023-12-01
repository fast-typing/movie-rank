import { Dispatch, useCallback, useEffect, useState } from "react";
import { AMOUNT_OF_COMMENTS_ON_PAGE } from "../../../App.constants";
import { Button, Pagination, Stack } from "@mui/material";
import CommentBlock from "./CommentBlock";
import { Comment } from "../../../interfaces/Interfaces";
import useWebSocket from "react-use-websocket";

interface Props {
  comments: Comment[];
  film_id: string;
  setComments: Dispatch<any>;
  checkIsAuth: () => boolean;
}

export default function Comments(props: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const [page, setPage] = useState({ current: 1, max: 1, content: [] });
  const [message, setMessage] = useState("");

  const { sendMessage } = useWebSocket(`wss://www.backend.movie-rank.ru/ws/comment/create/${props.film_id}`, {
    onMessage: (e) => {
      const comment = e?.data;
      if (!comment) return;
      props.setComments((prev) => [...prev, JSON.parse(JSON.parse(comment))]);
    },
  });

  useEffect(() => {
    setPage((prev) => {
      return {
        ...prev,
        max: Math.ceil(props.comments.length / AMOUNT_OF_COMMENTS_ON_PAGE),
        content: props.comments.slice(0, AMOUNT_OF_COMMENTS_ON_PAGE),
      };
    });
    if (page.current !== 1) {
      changePage(null, page.current);
    }
  }, [props.comments]);

  const changePage = async (event: React.ChangeEvent<unknown>, value: number) => {
    const content = props.comments?.slice((value - 1) * AMOUNT_OF_COMMENTS_ON_PAGE, value * AMOUNT_OF_COMMENTS_ON_PAGE);
    setPage((prev) => {
      return { ...prev, current: value, content: content };
    });
  };

  async function submitMessage() {
    const token = localStorage.getItem('token')
    const body: any = { film_id: props.film_id, message: message }
    if (token) body.token = token
    sendMessage(JSON.stringify(body));
    setMessage("");
  }

  function openEditForm() {
    setEdit(!edit);
  }

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap mb-8">
        <h1>Комментарии</h1>
        <Button variant="contained" onClick={openEditForm}>
          {edit ? "Закрыть" : "Написать комментарий"}
        </Button>
      </div>
      <div className="grid gap-8 mb-4">
        {edit ? (
          <div className="w-full gap-2 grid">
            <textarea className="w-full" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ваш комментарий" />
            <Button className="h-fit w-fit" disabled={!message.length} onClick={submitMessage} variant="contained">
              Оставить комментарий
            </Button>
          </div>
        ) : null}
        {page.content.length ? page.content.map((comment) => <CommentBlock comment={comment} marginLeft={0} />) : "Комментарии остутсвуют"}
      </div>
      {page.max > 1 ? (
        <Stack spacing={2}>
          <Pagination size="large" count={page.max} shape="rounded" page={page.current} onChange={changePage} />
        </Stack>
      ) : null}
    </div>
  );
}
