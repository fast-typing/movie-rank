import { IconButton } from "@mui/material";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownRoundedIcon from "@mui/icons-material/ThumbDownRounded";
import SentimentNeutralRoundedIcon from "@mui/icons-material/SentimentNeutralRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentVeryDissatisfiedRoundedIcon from "@mui/icons-material/SentimentVeryDissatisfiedRounded";
import { Review } from "../interfaces/Interfaces";

interface Props {
  review: Review;
}

export default function ReviewBlock(props: Props) {
  const pairIconAttitude = {
    positive: <SentimentSatisfiedAltRoundedIcon style={{ color: "rgb(101 163 13)" }} />,
    neutral: <SentimentNeutralRoundedIcon />,
    negative: <SentimentVeryDissatisfiedRoundedIcon style={{ color: "#d32f2f" }} />,
  };

  return (
    <div className="grid gap-2 p-4 rounded w-full" style={{ backgroundColor: "#212121" }}>
      <div className="flex items-center gap-2">
        {pairIconAttitude[props.review.attitude]}
        <h3 className="text-xl">{props.review.title}</h3>
      </div>
        <span className="text-stone-400">{props.review.username}</span>
      <p>{props.review.message}</p>
      <div className="flex gap-2 items-center">
        <span>+ 12</span>
        <IconButton>
          <ThumbUpRoundedIcon />
        </IconButton>
        <IconButton>
          <ThumbDownRoundedIcon />
        </IconButton>
      </div>
      <input className="w-full md:w-[235px]" type="text" placeholder="Оставить комментарий..." />
    </div>
  );
}
