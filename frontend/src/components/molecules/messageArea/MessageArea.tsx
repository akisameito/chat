import Message from 'components/atoms/message/Message';
import { memo } from 'react'
import { MessageInterface } from 'pages/chat/interfaceList'

interface PropsInterface {
    messages: MessageInterface[];
}

const MessageArea = memo((props: PropsInterface) => {
    return (
        <></>
        // <div className="MessageArea">
        //     {props.messages.map((message: MessageInterface, index: number) =>
        //         <Message text={message.text} datetime={message.datetime} key={index} />
        //     )}
        // </div>
    );
});
export default MessageArea;