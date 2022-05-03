import { Link } from "react-router-dom";

function Top() {
    return (
        <>
            <h1>ホーム</h1>
            <nav>
                <ul>
                    <li><Link to="app">app</Link></li>
                    <li><Link to="chat">チャット開始</Link></li>
                </ul>
            </nav>
        </>
    );
}

export default Top;