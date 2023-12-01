import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import ReviewForm from "./ReviewForm";
import ReviewBlock from "./ReviewBlock";
import { getReviews } from "../../../services/http.service";
import { Review } from "../../../interfaces/Interfaces";

interface Props {
  film_id: string;
  propReviews: Review[];
  checkIsAuth: () => boolean;
}

export default function Reviews(props: Props) {
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState(props.propReviews);
  const [isAllReviewsLoaded, setIsAllReviewsLoaded] = useState(false);

  async function loadMore() {
    setLoading(true);
    const moreReviews = await getReviews(props.film_id, 3, reviews.length);
    if (moreReviews.length === 0) {
      setIsAllReviewsLoaded(true);
    }
    setReviews([...reviews, ...moreReviews]);
    setLoading(false);
  }

  function openEditForm() {
    if (props.checkIsAuth()) {
      setEdit(!edit);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap mb-8 gap-2">
        <h1>Рецензии</h1>
        <Button variant="contained" onClick={openEditForm}>
          {edit ? "Закрыть" : "Создать рецензию"}
        </Button>
      </div>
      <div className="grid gap-8 mb-4">
        {edit ? <ReviewForm film_id={props.film_id} /> : null}
        {reviews.length
          ? reviews.map((review) => <ReviewBlock key={review.id} checkIsAuth={props.checkIsAuth} review={review} />)
          : "Рецензий отсутствуют"}
        {loading ? (
          <div className="text-center">
            <CircularProgress />
          </div>
        ) : reviews.length % 3 === 0 && reviews.length !== 0 && !isAllReviewsLoaded ? (
          <Button variant="contained" onClick={loadMore}>
            Показать еще
          </Button>
        ) : null}
      </div>
    </div>
  );
}
