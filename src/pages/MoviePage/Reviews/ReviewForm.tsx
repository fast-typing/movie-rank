import { useState } from "react";
import { createReview } from "../../../services/http.service";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { REVIEW_RATING_OPTIONS } from "../../../App.constants";

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
    setForm((prev) => { return { ...prev, [e.target.name]: e.target.value }; });
  }

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: "positive" | "neutral" | "negative",
  ) => {
    setAttitude(newAlignment);
  };

  const toggleButtons = REVIEW_RATING_OPTIONS.map(el =>
    <ToggleButton value={el.value}>
      <div className="flex gap-2">
        {el.icon} <span className="hidden sm:block">{el.text}</span>
      </div>
    </ToggleButton>
  )

  return (
    <form className="grid gap-4" onSubmit={submitModal}>
      <div className="flex items-center gap-4">
        Выберите оценку
        <ToggleButtonGroup value={attitude} exclusive onChange={handleAlignment} >
          {toggleButtons}
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
      <Button variant="contained" disabled={!form.title.length || !form.message.length || !attitude} className="w-full md:w-fit" onClick={submitModal}>
        Опубликовать рецензию
      </Button>
    </form>
  );
}
