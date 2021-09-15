import Message from 'components/atoms/message/Message';
import { MessageInterface } from 'pages/chat/interfaceList'

interface PropsInterface {
    messages: MessageInterface[];
}

function MessageArea(props: PropsInterface) {
    return (
        <div className="MessageArea">
            {props.messages.map((message: MessageInterface, index: number) =>
                <Message text={message.text} date={message.date} key={index} />
            )}
        </div>
    );
}

export default MessageArea;