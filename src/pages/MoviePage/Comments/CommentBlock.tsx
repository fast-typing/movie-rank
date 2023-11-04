export default function CommentBlock({ comment }) {
  const getDate = (): string => {
    return new Date(comment.created_at).toLocaleString();
  };

  return (
    <div className="grid gap-2 p-4 rounded w-full" style={{ backgroundColor: "#424242" }}>
      <span className="text-stone-400">
        {comment.username} — {getDate()}
      </span>
      <p>{comment.message}</p>
    </div>
  );
}
