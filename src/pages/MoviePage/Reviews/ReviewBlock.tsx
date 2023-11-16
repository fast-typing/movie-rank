import { IconButton, Tooltip } from "@mui/material";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import SentimentNeutralRoundedIcon from "@mui/icons-material/SentimentNeutralRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentVeryDissatisfiedRoundedIcon from "@mui/icons-material/SentimentVeryDissatisfiedRounded";
import { Review } from "../../../interfaces/Interfaces";
import { rateReview } from "../../../services/http.service";
import { useState } from "react";
import { REVIEW_RATING_OPTIONS } from "../../../App.constants";
import { Link } from "react-router-dom";

interface Props {
  review: Review;
  checkIsAuth: () => boolean
}

interface Buttons {
  loading: boolean
  like: "default" | "inherit" | "primary" | "secondary" | "error",
  dislike: "default" | "inherit" | "primary" | "secondary" | "error"
}

export default function ReviewBlock(props: Props) {
  const user_id = localStorage.getItem('user_id')
  const [review, setReview] = useState(props.review)
  const [rating, setRating] = useState(review.liked_by_users.length - review.disliked_by_users.length)
  const [buttons, setButtons] = useState<Buttons>(
    {
      loading: false,
      like: review.liked_by_users.includes(user_id) ? "primary" : "default",
      dislike: review.disliked_by_users.includes(user_id) ? "primary" : "default",
    }
  )

  async function rate(action: "like" | "dislike") {
    if (!props.checkIsAuth()) { return }
    setButtons({ ...buttons, loading: true })
    const resReview = await rateReview(user_id, review.id, action)
    if (!resReview) return
    setReview(resReview)
    setRating(resReview.liked_by_users.length - resReview.disliked_by_users.length)

    if (resReview.liked_by_users.includes(user_id)) {
      setButtons({ dislike: "default", like: "primary", loading: false })
    } else if (resReview.disliked_by_users.includes(user_id)) {
      setButtons({ dislike: "primary", like: "default", loading: false })
    } else {
      setButtons({ dislike: "default", like: "default", loading: false })
    }
  }

  const getDate = (): string => {
    return new Date(review.created_at).toLocaleString()
  }

  const getAttitudeText = (value: "positive" | "neutral" | "negative"): string => {
    return REVIEW_RATING_OPTIONS.find(el => el.value == value).text
  }

  const attitudeIcon = {
    positive: (
      <Tooltip arrow placement="top" title={getAttitudeText('positive')}>
        <SentimentSatisfiedAltRoundedIcon style={{ color: "rgb(101 163 13)" }} />
      </Tooltip>
    ),
    neutral: (
      <Tooltip arrow placement="top" title={getAttitudeText('neutral')}>
        <SentimentNeutralRoundedIcon />
      </Tooltip>
    ),
    negative: (
      <Tooltip arrow placement="top" title={getAttitudeText('negative')}>
        <SentimentVeryDissatisfiedRoundedIcon style={{ color: "#d32f2f" }} />
      </Tooltip>
    ),
  };

  return (
    <div className="grid gap-2 p-4 rounded w-full" style={{ backgroundColor: "var(--black-3)" }}>
      <div className="flex items-center gap-2">
        {attitudeIcon[review.attitude]}
        <h3 className="text-xl">{review.title}</h3>
      </div>
      <span className="text-stone-400"><Link className="underline" to={"/profile/" + review.username}>{review.username}</Link> — {getDate()}</span>
      <p>{review.message}</p>
      <div className="flex gap-2 items-center my-2">
        <IconButton disabled={buttons.loading} onClick={() => rate("like")} color={buttons.like}>
          <ThumbUpRoundedIcon />
        </IconButton>
        <IconButton disabled={buttons.loading} onClick={() => rate("dislike")} color={buttons.dislike}>
          <ThumbDownRoundedIcon />
        </IconButton>
        <span>{(rating > 0 ? '+' : '') + rating.toString()}</span>
      </div>
      {/* <LeaveCommentToParent type={"comment"} parent_id={props.review.id} movie_id={props.review.film_id} /> */}
    </div>
  );
}
