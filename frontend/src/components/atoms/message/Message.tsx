import './Message.css';
import { MessageInterface } from 'pages/chat/interfaceList'

interface PropsInterface extends MessageInterface {
}

const Message = (props: PropsInterface) => {
    return (
        <div className="Message">
            <span className="text">{props.text}</span> <span className="date">{props.datetime}</span><br />
        </div>
    );
}

export default Message;