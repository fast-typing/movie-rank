import { IconButton, Slide, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    open: boolean
    onClose: () => void
    message: string
}

export default function Toast(props: Props) {
    return (
        <Snackbar
            open={props.open}
            onClose={props.onClose}
            TransitionComponent={Slide}
            message={props.message}
            action={
                <IconButton
                    size="small"
                    color="inherit"
                    onClick={props.onClose}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        />
    )
}