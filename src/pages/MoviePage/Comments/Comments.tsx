import { useEffect, useState } from "react";
import { AMOUNT_OF_COMMENTS_ON_PAGE } from "../../../App.constants";
import { Button, Pagination, Stack } from "@mui/material";
import CommentBlock from "./CommentBlock";

export default function Comments({ comments }) {
    const [edit, setEdit] = useState<boolean>(false);
    const [page, setPage] = useState({ current: 1, max: 1, content: [] });

    useEffect(() => {
        setPage({ ...page, max: Math.ceil(comments.length / AMOUNT_OF_COMMENTS_ON_PAGE), content: comments.slice(0, AMOUNT_OF_COMMENTS_ON_PAGE) });
    }, []);

    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        const content = comments?.slice((value - 1) * AMOUNT_OF_COMMENTS_ON_PAGE, value * AMOUNT_OF_COMMENTS_ON_PAGE);
        setPage({ ...page, current: value, content: content });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1>Комментарии</h1>
                <Button variant="contained" onClick={() => setEdit(!edit)}>
                    {edit ? "Закрыть" : "Написать комментарий"}
                </Button>
            </div>
            <div className="grid gap-8 mb-4">
                {edit ? <input placeholder="Ваш комментарий"/> : null}
                {page.content.length ? page.content.map(comment => <CommentBlock comment={comment} />) : "Комментарии отсутствуют :("}
            </div>
            {page.max > 1 ? (
                <Stack spacing={2}>
                    <Pagination size="large" count={page.max} shape="rounded" page={page.current} onChange={changePage} />
                </Stack>
            ) : null}
        </div>
    );
}