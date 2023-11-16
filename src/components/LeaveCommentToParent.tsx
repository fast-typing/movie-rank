import { Button } from "@mui/material";
import { useState } from "react";
import { createComment } from "../services/http.service";

interface Props {
    type: "review" | "comment"
    parent_id: number
    movie_id: number
}

export default function LeaveCommentToParent(props: Props) {
    const [open, setOpen] = useState(false)
    const [comment, setComment] = useState('')

    function toggleForm() {
        setOpen(!open)
    }

    async function submitComment() {
        const token = localStorage.getItem('token')
        const body: any = { message: comment, film_id: props.movie_id }
        if (props.type == 'comment') {
            body.parent_comment_id = props.parent_id
        } else {
            body.parent_review_id = props.parent_id
        }
        const res = await createComment(token, body)
    }

    return (
        open
            ? (
                <form onSubmit={submitComment}>
                    <textarea onChange={(e) => setComment(e.target.value)} className="w-full h-[150px]" placeholder="Ваш комментарий" />
                    <div className="flex gap-2">
                        <Button variant="contained" disabled={!comment.length} onClick={submitComment}>Оставить комментарий</Button>
                        <Button variant="contained" onClick={toggleForm}>Отмена</Button>
                    </div>
                </form>
            )
            : <Button className="w-fit" variant="text" onClick={toggleForm}>Ответить</Button>
    )
}