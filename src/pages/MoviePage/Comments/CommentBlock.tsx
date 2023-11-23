import { Link } from "react-router-dom";
import LeaveCommentToParent from "../../../components/LeaveCommentToParent";
import { Comment } from "../../../interfaces/Interfaces";
import { IconButton } from "@mui/material";
import { deleteComment } from "../../../services/http.service";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

interface Props {
  comment: Comment;
  marginLeft: number;
}

export default function CommentBlock(props: Props) {
  const isAdmin = localStorage.getItem("is_admin");

  const getDate = (): string => {
    return new Date(props.comment.created_at).toLocaleString();
  };

  async function deleteCurrentComment() {
    const res = await deleteComment(props.comment.id);
    if (res.message !== "Delete successful") return;
    window.location.reload();
  }

  return (
    <div className="grid gap-2 p-4 rounded w-full" style={{ backgroundColor: "#424242", marginLeft: props.marginLeft }}>
      <div className="text-stone-400 flex justify-between">
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
        {isAdmin ? (
          <IconButton color="primary" onClick={deleteCurrentComment}>
            <DeleteRoundedIcon />
          </IconButton>
        ) : null}
      </div>
      <p>{props.comment.message}</p>
      {/* <LeaveCommentToParent type={"comment"} parent_id={props.comment.id} movie_id={props.comment.film_id} /> */}
    </div>
  );
}
