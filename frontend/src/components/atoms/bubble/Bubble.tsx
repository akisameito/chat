import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

interface BubbleProps {
    side: 'left' | 'right';
}
const StyledBubble = styled("div", {
    name: 'Bubble',
    slot: 'Root',
})<BubbleProps>(({ theme, side }) => ({
    position: "relative", // 三角の位置を固定するために設定
    display: "inline-block",
    textAlign: "left", // テキストの揃え
    // fontSize: theme.typography.fontSize,
    padding: theme.spacing(1, 2), // 編集前:8px 15px
    borderRadius: theme.spacing(2), // 編集前:15px
    [side === "right" ? "marginRight": "marginLeft"] : theme.spacing(2),// 編集前:10px 20px 20px
    backgroundColor: side === "right" ? theme.palette.primary.main : "#f0f0f0",
    color: side === "right" ? theme.palette.primary.contrastText : theme.palette.text.primary,
    '&:after': { // 吹き出しのしっぽ
        content: "''",
        border: `${theme.spacing(2)} solid transparent`, // 編集前:14px
        position: "absolute",
        top: 0,
        borderTopColor: side === "right" ? theme.palette.primary.main : "#f0f0f0",
        [side]: theme.spacing(-1) // 左右の向き // 編集前:10px
    },
    // '&:hover': { // 参考用に残している
    //     backgroundColor: theme.palette.primary.main,
    //     opacity: [0.9, 0.8, 0.7],
    // },
}));

type Props = {
    /** 左右 */
    side: 'left' | 'right',
    /** 子要素 */
    children: ReactNode
}
const Bubble = ({ side, children }: Props) => {
    return (
        <StyledBubble side={side}>
            {children}
        </StyledBubble>
    );
}
export default Bubble;