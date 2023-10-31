import React, { useEffect, useState } from "react";
import { Button, Pagination, Stack } from "@mui/material";
import ReviewForm from "./ReviewForm";
import ReviewBlock from "../../../components/ReviewBlock";

export default function Reviews({ film_id, reviews }) {
  const [edit, setEdit] = useState<boolean>(false);
  const [page, setPage] = useState({ current: 1, max: 1, content: null });

  useEffect(() => {
    const jsxReviews = reviews.map((review) => <ReviewBlock review={review} />);
    setPage({ ...page, max: Math.ceil(jsxReviews.length / 3), content: jsxReviews.slice(0, 3) });
  }, []);

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const content = reviews?.slice((value - 1) * 3, value * 3);
    const jsxReviews = content.map((review) => <ReviewBlock review={review} />);
    setPage({ ...page, current: value, content: jsxReviews });
  };

  return (
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
  );
}
