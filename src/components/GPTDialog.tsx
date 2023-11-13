import { Button, Fab, Modal } from "@mui/material";
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import { useState } from "react";
import { getAIAdvice } from "../services/http.service";

export default function GPTDialog() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [aiAdvice, setAiAdvice] = useState(null)

    function toggleDialog() {
        setOpen(!open)
    }

    async function submit() {
        const resAiAdvice = await getAIAdvice(input)
        setAiAdvice(resAiAdvice)
    }

    return (
        <>
            <Fab className="gpt-dialog-button" onClick={toggleDialog} color="primary" size="medium">
                <MessageRoundedIcon />
            </Fab>
            <Modal open={open} onClose={toggleDialog}>
                <form className="modal-content w-full sm:h-fit sm:w-fit" onSubmit={submit}>
                    <p>В этом окне вы можете задать любой вопрос ИИ</p>
                    <textarea placeholder="Ваш запрос" className="h-[200px]" value={input} onChange={(e) => setInput(e.target.value)} />
                    {aiAdvice ? <p>{aiAdvice}</p> : null}
                    <Button variant="contained" onClick={submit}>Получить ответ</Button>
                </form>
            </Modal>
        </>
    )
} 