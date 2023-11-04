import React, { useEffect, useState } from "react";
import { Button, Pagination, Stack } from "@mui/material";
import ReviewForm from "./ReviewForm";
import ReviewBlock from "./ReviewBlock";
import { AMOUNT_OF_REVIEWS_ON_PAGE } from "../../../App.constants";

export default function Reviews({ film_id, reviews }) {
  const [edit, setEdit] = useState<boolean>(false);
  const [page, setPage] = useState({ current: 1, max: 1, content: [] });

  useEffect(() => {
    setPage({ ...page, max: Math.ceil(reviews.length / AMOUNT_OF_REVIEWS_ON_PAGE), content: reviews.slice(0, AMOUNT_OF_REVIEWS_ON_PAGE) });
  }, []);

  const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
    const content = reviews?.slice((value - 1) * AMOUNT_OF_REVIEWS_ON_PAGE, value * AMOUNT_OF_REVIEWS_ON_PAGE);
    setPage({ ...page, current: value, content: content });
  };

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap mb-8">
        <h1>Рецензии</h1>
        <Button variant="contained" onClick={() => setEdit(!edit)}>
          {edit ? "Закрыть" : "Создать рецензию"}
        </Button>
      </div>
      <div className="grid gap-8 mb-4">
        {edit ? <ReviewForm film_id={film_id} /> : null}
        {page.content.length ? page.content.map(review => <ReviewBlock review={review} />) : "Рецензий нема :("}
      </div>
      {page.max > 1 ? (
        <Stack spacing={2}>
          <Pagination size="large" count={page.max} shape="rounded" page={page.current} onChange={changePage} />
        </Stack>
      ) : null}
    </div>
  );
}
