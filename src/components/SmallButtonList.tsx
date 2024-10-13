import React, { FC, ReactElement } from 'react';
import { SmallButtonProps } from './SmallButton';

export type SmallButtonListProps = {
  /** A list of buttons */
  children?: ReactElement<SmallButtonProps>[] | ReactElement<SmallButtonProps>;
  /** Button style variant */
  variant?: 'floating';
};

/**
 * A list of buttons
 */
export const SmallButtonList: FC<SmallButtonListProps> = ({ children, variant = '' }) => {
  return (
    <div className={`mml-btnlist ${variant === 'floating' ? ' mml-btnlist--floating' : 'mml-btnlist--grounded'}`}>
      {children}
    </div>
  );
};
