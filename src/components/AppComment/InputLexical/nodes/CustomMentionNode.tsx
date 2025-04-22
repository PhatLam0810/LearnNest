import { BeautifulMentionComponentProps } from 'lexical-beautiful-mentions';
import { forwardRef } from 'react';

const CustomMentionComponent = forwardRef<
  HTMLSpanElement,
  BeautifulMentionComponentProps & {
    data: Record<string, any>;
  }
>(({ trigger, value, children, ...other }, ref) => {
  const isPeople = trigger === '@';
  return (
    <span
      className="beautiful-mention-node"
      data-beautiful-mention={`${isPeople ? '@' : '#'}${value}`}>
      {isPeople && `@${other.data?.displayValue || value}`}
      {!isPeople && `#${value}`}
    </span>
  );
});
CustomMentionComponent.displayName = 'CustomMentionComponent';

export default CustomMentionComponent;
