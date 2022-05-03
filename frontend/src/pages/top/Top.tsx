import { Link } from "react-router-dom";
import { Button } from '@mui/material';

function Top() {
    return (
        <>
            <h1>ホーム</h1>
            <Button
                variant="contained"
                component={Link}
                to="app"
                color="tertiary"
            >
                app
            </Button>
            <Button
                variant="contained"
                component={Link}
                to="chat"
            >
                チャット開始
            </Button>
        </>
    );
}

export default Top;