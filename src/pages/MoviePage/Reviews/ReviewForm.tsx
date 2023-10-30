import { useState } from "react";
import { createReview } from "../../../services/http.service";
import { Button, Rating } from "@mui/material";

export default function ReviewForm({ film_id }) {
  const [form, setForm] = useState({ title: "", message: "", rating: 0 });

  async function submitModal(event: any) {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const res = await createReview(token, { ...form, film_id: film_id });
    if (!res) return
    window.location.reload()
  }

  function handleChange(e: any) {
    setForm((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  return (
    <form className="grid gap-4" onSubmit={submitModal}>
      <Rating name="rating" size="large" value={form.rating} onChange={handleChange} max={10} precision={0.5} />
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
      <Button variant="contained" className="w-full md:w-[300px]" onClick={submitModal}>
        Опубликовать отзыв
      </Button>
    </form>
  );
}
