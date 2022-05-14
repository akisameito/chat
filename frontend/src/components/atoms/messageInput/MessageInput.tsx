import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

const MessageInput = styled(InputBase)(({ theme, color }) => ({
    '& .MuiInputBase-input': {
        borderRadius: 8,
        position: 'relative',
        backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
        border: '1px solid #ced4da',
        // fontSize: theme.typography.fontSize,
        padding: theme.spacing(1, 2),
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&:focus': {
            boxShadow: `${alpha(theme.palette[color ?? "primary"].dark, 0.25)} 0 0 0 0.2rem`,
            borderColor: theme.palette[color ?? "primary"].light,
        },
    },
}));
export default MessageInput;