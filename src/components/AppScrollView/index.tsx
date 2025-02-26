import React, { PropsWithChildren, ReactNode } from 'react';
import styles from './styles';

type AppScrollViewProps = PropsWithChildren<{
  children?: ReactNode;
  horizontal?: boolean;
  showIndicator?: boolean;
}> &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
const AppScrollView: React.FC<AppScrollViewProps> = ({
  children,
  horizontal,
  showIndicator = true,
  ...props
}) => {
  return (
    <div
      {...props}
      style={Object.assign(
        {},
        !showIndicator && styles.hideScrollIndicator,
        styles.container,
        props.style,
        horizontal ? styles.scrollHorizontal : styles.scrollVertical,
      )}>
      {children}
    </div>
  );
};

export default AppScrollView;
