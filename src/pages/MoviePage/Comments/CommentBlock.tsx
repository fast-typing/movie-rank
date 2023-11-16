import { Link } from "react-router-dom";
import LeaveCommentToParent from "../../../components/LeaveCommentToParent";
import { Comment } from "../../../interfaces/Interfaces";

interface Props {
  comment: Comment;
  marginLeft: number;
}

export default function CommentBlock(props: Props) {
  const getDate = (): string => {
    return new Date(props.comment.created_at).toLocaleString();
  };

  return (
    <div className="grid gap-2 p-4 rounded w-full" style={{ backgroundColor: "#424242", marginLeft: props.marginLeft }}>
      <span className="text-stone-400">
        {props.comment.user_id === "0" ? (
          <p>
            {props.comment.username} — {getDate()}
          </p>
        ) : (
          <div className="flex gap-1">
            <Link className="underline" to={"/profile/" + props.comment.username}>
              {props.comment.username}
            </Link>{" "}
            <p>— {getDate()}</p>
          </div>
        )}
      </span>
      <p>{props.comment.message}</p>
      {/* <LeaveCommentToParent type={"comment"} parent_id={props.comment.id} movie_id={props.comment.film_id} /> */}
    </div>
  );
}
