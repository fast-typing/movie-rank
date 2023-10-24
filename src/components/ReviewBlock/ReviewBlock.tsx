import React from "react";
import { IconButton, Rating } from "@mui/material";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";

export default function ReviewBlock({ review }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <h3>{review.title}</h3>—<span>{review.username}</span>
      </div>
      <Rating max={10} precision={0.5} defaultValue={review.rating} readOnly />
      <p>{review.message}</p>
      <div className="flex gap-2 items-center">
        <span>+ 12</span>
        <IconButton>
          <ThumbUpRoundedIcon />
        </IconButton>
        <IconButton>
          <ThumbDownRoundedIcon />
        </IconButton>
      </div>
      <input
        className="w-full md:w-[235px]"
        type="text"
        placeholder="Оставить комментарий..."
      />
    </div>
  );
}
