import React, { FunctionComponent, ReactNode } from 'react';
import './Button.css';

interface ButtonProps {
  theme?: ButtonThemes;
  children: ReactNode;
}

export enum ButtonThemes {
  GREEN = 'GREEN',
  GREEN_OUTLINE = 'GREEN_OUTLINE',
  GRAY_OUTLINE = 'GRAY_OUTLINE'
}

enum ModifierClassNames {
  GREEN = 'button--green',
  GREEN_OUTLINE = 'button--greenOutline',
  GRAY_OUTLINE = 'button--grayOutline'
}

const Button: FunctionComponent<ButtonProps> = ({ theme = ButtonThemes.GREEN, children }) => (
  <button className={['button', ModifierClassNames[theme]].join(' ')}>{children}</button>
);

export default Button;