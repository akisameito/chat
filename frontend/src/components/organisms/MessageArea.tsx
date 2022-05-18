import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Message from "components/molecules/message/Message";

type Props = {
    messageList: {
        /** テキスト */
        text: string,
        unixtime: number,
        isYou: boolean,
    }[]
}
const ChatMessageList = ({ messageList }: Props) => {
    const rtn = messageList.map(({ text, unixtime, isYou }) => {
        return (
            <Message
                key={unixtime}
                sx={{ [isYou ? "marginLeft" : "marginRight"]: 5 }}
                side={isYou ? "right" : "left"}
                unixtime={unixtime}
            >
                {text}
            </Message>
        );
    });
    return <>{rtn}</>;
}

const MessageArea = ({ messageList }: Props) => {
    return (
        <Box sx={{ height: "100%", overflowY: "auto", backgroundColor: "background.default" }} p={1}>
            <Stack spacing={2}>
                <ChatMessageList messageList={messageList} />
            </Stack>
        </Box>
    )
}
export default MessageArea;