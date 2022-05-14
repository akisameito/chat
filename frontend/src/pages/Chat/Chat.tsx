import MessageArea from 'components/organisms/MessageArea';
import AppBar from 'components/organisms/AppBar';
import ChatBar from 'components/organisms/ChatBar';
import Grid from '@mui/material/Grid';
// カスタムフック 
import { useChat } from "hooks/useChat";

const Chat = () => {
    const {
        messageList,
        startChat,
        sendMessage,
    } = useChat();

    return (
        <>
            <Grid container direction="column" sx={{ height: "100vh", minHeight: "100vh" }} /*sx={{width:"100vw",height:"100vh"}}*/>
                <Grid item xs={1}><AppBar /></Grid>
                <Grid item xs sx={{ height: "60px" }}><MessageArea messageList={messageList} /></Grid>
                <Grid item xs={1}><ChatBar startChat={startChat} sendMessage={sendMessage} /></Grid>
            </Grid>
        </>
    );
}
export default Chat;