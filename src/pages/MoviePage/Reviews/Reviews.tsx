import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Pagination, Stack } from "@mui/material";
import ReviewForm from "./ReviewForm";
import ReviewBlock from "./ReviewBlock";
import { AMOUNT_OF_REVIEWS_ON_PAGE } from "../../../App.constants";
import { getReviews } from "../../../services/http.service";

export default function Reviews({ film_id, propReviews }) {
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState(propReviews)
  // const [page, setPage] = useState({ current: 1, max: 1, content: [] });

  // useEffect(() => {
  //   setPage({ ...page, max: Math.ceil(reviews.length / AMOUNT_OF_REVIEWS_ON_PAGE), content: reviews.slice(0, AMOUNT_OF_REVIEWS_ON_PAGE) });
  // }, []);

  // const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
  //   const content = reviews?.slice((value - 1) * AMOUNT_OF_REVIEWS_ON_PAGE, value * AMOUNT_OF_REVIEWS_ON_PAGE);
  //   setPage({ ...page, current: value, content: content });
  // };

  async function loadMore() {
    setLoading(true)
    const moreReviews = await getReviews(film_id, 3, reviews.length)
    setReviews([...reviews, ...moreReviews])
    setLoading(false)
  }

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
        {reviews.length ? reviews.map(review => <ReviewBlock review={review} />) : "Рецензий нема :("}
        {loading ? <div className="text-center"><CircularProgress /></div> : reviews.length % 3 == 0 && reviews.length !== 0 ? <Button variant="contained" onClick={loadMore}>Показать еще</Button> : null}
      </div>
      {/* {page.max > 1 ? (
        <Stack spacing={2}>
          <Pagination size="large" count={page.max} shape="rounded" page={page.current} onChange={changePage} />
        </Stack>
      ) : null} */}
    </div>
  );
}
