import { useEffect, useState } from "react";
import { AMOUNT_OF_COMMENTS_ON_PAGE } from "../../../App.constants";
import { Button, Pagination, Stack } from "@mui/material";
import CommentBlock from "./CommentBlock";
import { createComment } from "../../../services/http.service";
import { Comment } from "../../../interfaces/Interfaces";

interface Props {
    comments: Comment[]
    film_id: string
}

export default function Comments(props: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const [page, setPage] = useState({ current: 1, max: 1, content: [] });
  const [comment, setComment] = useState("");

  useEffect(() => {
    setPage({
      ...page,
      max: Math.ceil(props.comments.length / AMOUNT_OF_COMMENTS_ON_PAGE),
      content: props.comments.slice(0, AMOUNT_OF_COMMENTS_ON_PAGE),
    });
  }, []);

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const content = props.comments?.slice((value - 1) * AMOUNT_OF_COMMENTS_ON_PAGE, value * AMOUNT_OF_COMMENTS_ON_PAGE);
    setPage({ ...page, current: value, content: content });
  };

  async function submitComment() {
    const token = localStorage.getItem("token");
    const res = await createComment(token, { message: comment, film_id: props.film_id});
    if (!res.film_id) return
    window.location.reload()
  }

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap mb-8">
        <h1>Комментарии</h1>
        <Button variant="contained" onClick={() => setEdit(!edit)}>
          {edit ? "Закрыть" : "Написать комментарий"}
        </Button>
      </div>
      <div className="grid gap-8 mb-4">
        {edit ? (
          <div className="w-full gap-2 grid">
            <textarea
              className="w-full"
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ваш комментарий"
            />
            <Button className="h-fit w-fit" disabled={!comment.length} onClick={submitComment} variant="contained">
              Оставить комментарий
            </Button>
          </div>
        ) : null}
        {page.content.length
          ? page.content.map((comment) => <CommentBlock comment={comment} />)
          : "Комментарии отсутствуют :("}
      </div>
      {page.max > 1 ? (
        <Stack spacing={2}>
          <Pagination size="large" count={page.max} shape="rounded" page={page.current} onChange={changePage} />
        </Stack>
      ) : null}
    </div>
  );
}
