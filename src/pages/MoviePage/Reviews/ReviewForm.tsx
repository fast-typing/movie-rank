import { useState } from "react";
import { createReview } from "../../../services/http.service";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SentimentNeutralRoundedIcon from '@mui/icons-material/SentimentNeutralRounded';
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';

export default function ReviewForm({ film_id }) {
  const [form, setForm] = useState({ title: "", message: "" });
  const [attitude, setAttitude] = useState<"positive" | "neutral" | "negative">(null);

  async function submitModal(event: any) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const review = { ...form, film_id: film_id, created_at: new Date().toLocaleString(), attitude: attitude }
    const res = await createReview(token, review);
    if (!res?.film_id) return
    window.location.reload()
  }

  function handleChange(e: any) {
    setForm((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }


  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "positive" | "neutral" | "negative",
  ) => {
    setAttitude(newAlignment);
  };

  return (
    <form className="grid gap-4" onSubmit={submitModal}>
      <div className="flex items-center gap-4">
        Выберите оценку
        <ToggleButtonGroup value={attitude} exclusive onChange={handleAlignment} >
          <ToggleButton value="positive">
            <div className="flex gap-2">
              <SentimentSatisfiedAltRoundedIcon />
              <span>Супер круто!</span>
            </div>
          </ToggleButton>
          <ToggleButton value="neutral">
            <div className="flex gap-2">
              <SentimentNeutralRoundedIcon />
              <span>Средне</span>
            </div>
          </ToggleButton>
          <ToggleButton value="negative">
            <div className="flex gap-2">
              <SentimentVeryDissatisfiedRoundedIcon />
              <span>Ужасно...</span>
            </div>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <input
        name="title"
        className="w-full md:w-[40%]"
        placeholder="Заголовок"
        value={form.title}
        onChange={handleChange}
      />
      <textarea
        name="message"
        className="w-full h-[250px]"
        placeholder="Ваш отзыв..."
        value={form.message}
        onChange={handleChange}
      />
      <Button variant="contained" className="w-full md:w-fit" onClick={submitModal}>
        Опубликовать рецензию
      </Button>
    </form>
  );
}
