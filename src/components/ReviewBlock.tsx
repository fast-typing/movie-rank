import { IconButton } from "@mui/material";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import SentimentNeutralRoundedIcon from "@mui/icons-material/SentimentNeutralRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentVeryDissatisfiedRoundedIcon from "@mui/icons-material/SentimentVeryDissatisfiedRounded";
import { Review } from "../interfaces/Interfaces";
import { rateReview } from "../services/http.service";
import { useState } from "react";

interface Props {
  review: Review;
}

interface ButtonsStyle {
  like: "default" | "inherit" | "primary" | "secondary" | "error"
  dislike: "default" | "inherit" | "primary" | "secondary" | "error"
}

export default function ReviewBlock(props: Props) {
  const user_id = localStorage.getItem('user_id')
  const [review, setReview] = useState(props.review)
  const [rating, setRating] = useState(review.liked_by_users.length - review.disliked_by_users.length)
  const [buttonsStyle, setButtonsStyle] = useState<ButtonsStyle>(
    {
      like: review.liked_by_users.includes(user_id) ? "primary" : "default",
      dislike: review.disliked_by_users.includes(user_id) ? "primary" : "default",
    }
  )

  async function rate(action: "like" | "dislike") {
    const res = await rateReview(user_id, review.id, action)
    if (typeof res !== "number") return
    setRating(res)
    if (action == 'like') {
      if (review.liked_by_users.includes(user_id)) {
        setButtonsStyle({ like: 'default', dislike: 'default' })
        const newArr = review.liked_by_users.filter(el => el !== user_id)
        setReview({ ...review, liked_by_users: newArr })
      } else {
        setButtonsStyle({ like: 'primary', dislike: 'default' })
        setReview({ ...review, liked_by_users: [...review.liked_by_users, user_id] })
      }
    } else {
      if (review.disliked_by_users.includes(user_id)) {
        setButtonsStyle({ like: 'default', dislike: 'default' })
        const newArr = review.disliked_by_users.filter(el => el !== user_id)
        setReview({ ...review, disliked_by_users: newArr })
      } else {
        setButtonsStyle({ like: 'default', dislike: 'primary' })
        setReview({ ...review, disliked_by_users: [...review.disliked_by_users, user_id] })
      }
    }
  }

  const pairIconAttitude = {
    positive: <SentimentSatisfiedAltRoundedIcon style={{ color: "rgb(101 163 13)" }} />,
    neutral: <SentimentNeutralRoundedIcon />,
    negative: <SentimentVeryDissatisfiedRoundedIcon style={{ color: "#d32f2f" }} />,
  };

  const getDate = (): string => {
    return new Date(review.created_at).toLocaleString()
  }

  return (
    <div className="grid gap-2 p-4 rounded w-full" style={{ backgroundColor: "#424242" }}>
      <div className="flex items-center gap-2">
        {pairIconAttitude[review.attitude]}
        <h3 className="text-xl">{review.title}</h3>
      </div>
      <span className="text-stone-400">{review.username} — {getDate()}</span>
      <p>{review.message}</p>
      <div className="flex gap-2 items-center my-2">
        <IconButton onClick={() => rate("like")} color={buttonsStyle.like}>
          <ThumbUpRoundedIcon />
        </IconButton>
        <IconButton onClick={() => rate("dislike")} color={buttonsStyle.dislike}>
          <ThumbDownRoundedIcon />
        </IconButton>
        <span>{(rating > 0 ? '+' : '') + rating.toString()}</span>
      </div>
      <input className="w-full md:w-[235px]" type="text" placeholder="Оставить комментарий..." />
    </div>
  );
}
