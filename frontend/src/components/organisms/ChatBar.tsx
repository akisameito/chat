/**
 * 参考ソース
 * https://mui.com/material-ui/react-app-bar/#PrimarySearchAppBar.tsx
 */
import { useRef } from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import SendMessageInput from 'components/atoms/messageInput/MessageInput';
import { UseChatInterface } from 'hooks/useChat';

type Props = {
    startChat: UseChatInterface["startChat"],
    sendMessage: UseChatInterface["sendMessage"]
}

const ChatBar = ({ startChat, sendMessage }: Props) => {
    /** メッセージ用element */
    const msgEl = useRef<HTMLInputElement>(null);
    const handleSendMessage = () => {
        if (msgEl.current?.value == null) return;
        sendMessage(msgEl.current.value);
        msgEl.current.value = "";
    }

    return (
        <AppBar position="fixed" color="secondary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                {/* 退出ボタン */}
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="exit"
                    sx={{ mr: 2 }}
                >
                    <LogoutIcon sx={{ transform: "scaleX(-1)" }} />
                </IconButton>
                {/* 送信メッセージ */}
                <SendMessageInput multiline maxRows={4} color="secondary" sx={{ flexGrow: 1 }} inputRef={msgEl} />
                {/* 送信ボタン */}
                <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="send"
                    sx={{ pl: 3, pr: 3, height: "100%" }}
                    onClick={handleSendMessage}
                >
                    <SendIcon />
                </IconButton>
            </Toolbar>
            {/* 新規チャット開始 */}
            <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="send"
                sx={{ height: "100%" }}
                onClick={startChat}
            >
                <FiberNewIcon />
            </IconButton>
        </AppBar>
    );
}
export default ChatBar;