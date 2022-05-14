import { Typography } from '@mui/material';
/**
 * 時刻取得
 * @param unixtime UNIX時間
 * @returns H:mm
 */
const getTime = (unixtime: Props["unixtime"]) => {
    const date = new Date(unixtime * 1000);
    const min = (`00${date.getMinutes()}`).slice(-2);
    return `${date.getHours()}:${min}`;
}

type Props = {
    /** 送信時刻 */
    unixtime: number,
    /** 左右 */
    side?: 'left' | 'right',
}
const Time = ({ unixtime }: Props) => {
    return (
        <Typography variant="caption" m={0.5} /*sx={{ minWidth:"2.5em", textAlign: "right" }}*/>{getTime(unixtime)}</Typography>
    );
}
export default Time;