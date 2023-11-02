export default function CommentBlock({ comment }) {

    return (
        <div className="grid gap-2 p-4 rounded w-full" style={{ backgroundColor: "#424242" }}>
            {comment.message}
        </div>
    )
} 