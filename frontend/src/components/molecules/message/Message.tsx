import { ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material/styles'
import Box from '@mui/material/Box';
import Bubble from "components/atoms/bubble/Bubble";
import Time from "components/atoms/time/Time";

type Props = {
    /** 左右 */
    side: 'left' | 'right'
    /** unix時刻 */
    unixtime: number
    /** 子要素 */
    children: ReactNode
    sx?: SxProps<Theme>
}
// 
const Message = ({ side, unixtime, children, sx }: Props) => {
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: side === "right" ? "row-reverse" : "row", alignItems: "flex-end", ...sx }}>
                <Bubble side={side}>{children}</Bubble><Time unixtime={unixtime} />
            </Box>
        </>
    )
}
export default Message;