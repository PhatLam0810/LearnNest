import {
  BeautifulMentionsMenuItemProps,
  BeautifulMentionsMenuProps,
} from 'lexical-beautiful-mentions';
import { forwardRef } from 'react';

export const CustomMenu = ({
  loading,
  ...props
}: BeautifulMentionsMenuProps) => {
  return <ul className="custom-mention-menu" {...props} />;
};

export const CustomMenuItem = forwardRef<
  HTMLLIElement,
  BeautifulMentionsMenuItemProps
>(({ selected, item, ...props }, ref) => {
  const isPeople = item?.trigger === '@';
  const { itemValue, userName, ...rest } = props;
  return (
    <li
      className={`item-${isPeople ? 'mention' : 'tag'} ${selected ? 'selected' : ''}`}
      {...rest}
      ref={ref}>
      {isPeople ? (
        <div className="item-avatar">
          {/* <CustomAvatar
            alt="avatar"
            className="user-avatar user-avatar-header"
            src={props?.avatar}
            width={32}
            height={32}
          /> */}
        </div>
      ) : null}
      <div className="item-content">
        <p className="item-name">{props?.name}</p>
        <p className="item-sub">
          {isPeople ? (
            <>@{props?.userName}</>
          ) : (
            <>{props?.count ? <>{props?.count} s</> : `hashtag`}</>
          )}
        </p>
      </div>
    </li>
  );
});

CustomMenuItem.displayName = 'CustomMenuItem';
