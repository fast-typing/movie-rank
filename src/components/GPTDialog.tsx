import { Button, Fab, LinearProgress, Modal } from "@mui/material";
import { useState } from "react";
import { getAIAdvice } from "../services/http.service";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { TypeAnimation } from 'react-type-animation';

export default function GPTDialog() {
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const [aiAdvice, setAiAdvice] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isAdviceDone, setIsAdviceDone] = useState(false)

    function toggleDialog() {
        setOpen(!open)
    }

    async function submit() {
        setLoading(true)
        setAiAdvice(null)
        setIsAdviceDone(false)
        const resAiAdvice = await getAIAdvice(input)
        setAiAdvice(resAiAdvice.content)
        setLoading(false)
    }

    return (
        <>
            <Fab className="gpt-dialog-button" onClick={toggleDialog} color="primary" size="medium">
                <SmartToyIcon />
            </Fab>
            <Modal open={open} onClose={toggleDialog}>
                <form className="modal-content w-full sm:h-fit sm:w-[600px]" onSubmit={submit}>
                    <p>В этом окне вы можете найти фильм с помощью нейросети</p>
                    <textarea placeholder="Ваш запрос" className="h-[120px]" value={input} onChange={(e) => setInput(e.target.value)} />
                    {
                        loading
                            ? <LinearProgress />
                            : aiAdvice
                                ? <div className="max-h-[200px] overflow-auto"><TypeAnimation sequence={[aiAdvice, 0, () => { setIsAdviceDone(true) }]} speed={70} preRenderFirstString={isAdviceDone} /></div>
                                : null
                    }
                    <Button disabled={!input.length} variant="contained" onClick={submit}>Получить ответ</Button>
                </form>
            </Modal>
        </>
    )
} 