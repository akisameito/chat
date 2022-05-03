import { PaletteOptions } from '@mui/material/styles/createPalette'
// パレットの新しい色について TypeScript に通知
declare module '@mui/material/styles' {
    interface PaletteOptions {
        tertiary?: PaletteOptions['secondary'];
    }
    interface Palette {
        tertiary: Palette['secondary'];
    }
}
// Button の color props を更新
declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        tertiary: true;
    }
}