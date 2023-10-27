import React, { useEffect, useState } from "react";
import { Button, Pagination, Rating, Stack } from "@mui/material";
import { createReview, getReviews } from "../../../services/http.service";
import ReviewBlock from "../../../components/ReviewBlock/ReviewBlock";
import ReviewForm from "./ReviewForm";

export default function Reviews({ film_id }) {
    const [edit, setEdit] = useState<boolean>(false);
    const [reviews, setReviews] = useState({ content: null, loading: true });
    const [page, setPage] = useState(1);


    useEffect(() => {
        const init = async () => {
            const resReviews = await getReviews(film_id);
            if (!resReviews) return;

            const jsxReviews = resReviews.map((review) => (
                <ReviewBlock review={review} />
            ));

            setReviews({ loading: false, content: jsxReviews });
        };

        init();
    }, []);

    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        reviews.loading ? null : (
            <div>
                <h2 className="mb-4">Отзывы</h2>
                <Button variant="contained" onClick={() => setEdit(!edit)}>
                    Оставить отзыв
                </Button>
                <div className="grid gap-8">
                    {edit ? <ReviewForm film_id={film_id} /> : null}
                    {reviews.content?.length ? reviews?.content : "Отзывов нема :("}
                </div>
                <Stack spacing={2}>
                    <Pagination count={10} shape="rounded" page={page} onChange={changePage} />
                </Stack>
            </div>)
    )
}