import React, { useEffect, useState } from "react";
import { Button, Pagination, Rating, Stack } from "@mui/material";
import { createReview, getReviews } from "../../../services/http.service";
import ReviewBlock from "../../../components/ReviewBlock/ReviewBlock";
import ReviewForm from "./ReviewForm";

export default function Reviews({ film_id }) {
  const [edit, setEdit] = useState<boolean>(false);
  const [reviews, setReviews] = useState({ content: null, loading: true });
  const [page, setPage] = useState({ current: 1, max: 1, content: null });

  useEffect(() => {
    const init = async () => {
      const resReviews = await getReviews(film_id);
      if (!resReviews) return;
      const jsxReviews = resReviews.map((review) => <ReviewBlock review={review} />);
      setReviews({ loading: false, content: jsxReviews });
      setPage({ ...page, max: Math.ceil(jsxReviews.length / 3), content: jsxReviews.slice(0, 3) });
    };

    init();
  }, []);

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const content = reviews.content.slice((value - 1) * 3, value * 3);
    setPage({ ...page, current: value, content: content });
  };

  return !reviews.loading ? (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1>Рецензии</h1>
        <Button variant="contained" onClick={() => setEdit(!edit)}>
          {edit ? "Закрыть" : "Создать рецензию"}
        </Button>
      </div>
      <div className="grid gap-8 mb-4">
        {edit ? <ReviewForm film_id={film_id} /> : null}
        {page.content?.length ? page?.content : "Рецензий нема :("}
      </div>
      {page.max > 1 ? (
        <Stack spacing={2}>
          <Pagination size="large" count={page.max} shape="rounded" page={page.current} onChange={changePage} />
        </Stack>
      ) : null}
    </div>
  ) : null;
}
