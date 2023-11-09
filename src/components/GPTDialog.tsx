import { Button, Fab, Modal } from "@mui/material";
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import { useState } from "react";

export default function GPTDialog() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')

    function toggleDialog() {
        setOpen(!open)
    }

    return (
        <>
            <Fab className="gpt-dialog-button" onClick={toggleDialog} color="primary" size="medium">
                <MessageRoundedIcon />
            </Fab>
            <Modal open={open} onClose={toggleDialog}>
                <form className="modal-content w-full sm:h-fit sm:w-fit">
                    <p>В этом окне вы можете задать любой вопрос ИИ</p>
                    <textarea placeholder="Ваш запрос" className="h-[200px]" value={input} onChange={(e) => setInput(e.target.value)} />
                    <Button variant="contained">Получить ответ</Button>
                </form>
            </Modal>
        </>
    )
} 