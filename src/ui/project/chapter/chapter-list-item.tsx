import { createStyles, keyframes } from '@mantine/core';
import { format, formatDistance, isSameMonth } from 'date-fns';
import Link from 'next/link';
import type { LinkProps } from 'next/link';

import type { ChapterInfo } from '~/domain/models';

const actionEnter = keyframes({
  from: {
    transform: 'rotate(-90deg)',
    opacity: 0,
    animationTimingFunction: 'ease-out',
  },
});

const actionLeave = keyframes({
  from: {
    transform: 'rotate(0deg)',
    opacity: 1,
    animationTimingFunction: 'ease-out',
  },
});

const useStyle = createStyles((theme) => {
  return {
    root: {
      display: 'flex',
      lineHeight: 1.5,
      textDecoration: 'none',
      color: 'currentcolor',
      alignItems: 'center',
      gap: theme.spacing.lg,
      padding: '6px 14px',
    },

    read: {
      color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[6],
    },

    disabled: {
      pointerEvents: 'none',
    },

    chapter: {
      flex: '1 1 0',
    },

    chapter__name: {
      display: '-webkit-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      fontSize: theme.fontSizes.sm,
      fontWeight: 600,
    },

    chapter__desc: {
      fontSize: theme.fontSizes.xs,
    },

    chapter__no: {
      fontSize: theme.fontSizes.md,
      display: 'inline-flex',
      width: '32px',
      height: '32px',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },

    icon: {
      flex: '0 0 auto',
    },

    action: {
      transformBox: 'fill-box',
      transformOrigin: '50% 50%',
      opacity: 0,
      transform: 'rotate(90deg)',
    },

    actionOn: {
      opacity: 1,
      transform: 'none',
      animation: `${actionEnter} 200ms`,
    },

    actionOff: {
      animation: `${actionLeave} 200ms`,
    },
  };
});

export type ChapterListItemProps = {
  to?: string;
  disabled?: boolean;
  chapter: ChapterInfo;
} & Omit<LinkProps, 'href'>;

export function ChapterListItem({
  to,
  chapter,
  disabled,
  ...rest
}: ChapterListItemProps) {
  const { classes, cx } = useStyle();

  const { no, name, readAt } = chapter;
  const desc = `${getDate(chapter.createDate)} · ${chapter.provider}`;

  //   function activeOn(s: State) {
  //     return state === s ? classes.actionOn : classes.actionOff;
  //   }

  //   const actions = state !== State.Uninitialized && (
  //     <ActionIcon<'button'>
  //       onClick={(e) => {
  //         e.preventDefault();
  //       }}
  //     >
  //       <svg viewBox="0 0 28 28" fill="currentColor" width={28} height={28}>
  //         <path
  //           className={cx(classes.action, activeOn(State.NotStored))}
  //           d="M21 13V20H7V13H5V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H21C21.5304 22 22.0391 21.7893 22.4142 21.4142C22.7893 21.0391 23 20.5304 23 20V13H21ZM15 13.67L17.59 11.09L19 12.5L14 17.5L9 12.5L10.41 11.09L13 13.67V4H15V13.67Z"
  //         />
  //         <path
  //           className={cx(classes.action, activeOn(State.Fetching))}
  //           d="M14 4C12.0222 4 10.0888 4.58649 8.4443 5.6853C6.79981 6.78412 5.51809 8.3459 4.76121 10.1732C4.00433 12.0004 3.8063 14.0111 4.19215 15.9509C4.578 17.8907 5.53041 19.6725 6.92894 21.0711C8.32746 22.4696 10.1093 23.422 12.0491 23.8079C13.9889 24.1937 15.9996 23.9957 17.8268 23.2388C19.6541 22.4819 21.2159 21.2002 22.3147 19.5557C23.4135 17.9112 24 15.9778 24 14C24 11.3478 22.9464 8.8043 21.0711 6.92893C19.1957 5.05357 16.6522 4 14 4ZM19 17.59L17.59 19L14 15.41L10.41 19L9 17.59L12.59 14L9 10.41L10.41 9L14 12.59L17.59 9L19 10.41L15.41 14L19 17.59Z"
  //         />
  //         <path
  //           className={cx(classes.action, activeOn(State.Stored))}
  //           d="M8 21C8 21.5304 8.21071 22.0391 8.58579 22.4142C8.96086 22.7893 9.46957 23 10 23H18C18.5304 23 19.0391 22.7893 19.4142 22.4142C19.7893 22.0391 20 21.5304 20 21V9H8V21ZM21 6H17.5L16.5 5H11.5L10.5 6H7V8H21V6Z"
  //         />
  //         <path
  //           className={cx(classes.action, activeOn(State.Failed))}
  //           d="M13 17H15V19H13V17ZM13 9H15V15H13V9ZM14 4.00001C12.0222 4.00001 10.0888 4.58649 8.4443 5.68531C6.79981 6.78412 5.51809 8.34591 4.76121 10.1732C4.00433 12.0004 3.8063 14.0111 4.19215 15.9509C4.578 17.8907 5.53041 19.6725 6.92894 21.0711C8.32746 22.4696 10.1093 23.422 12.0491 23.8079C13.9889 24.1937 15.9996 23.9957 17.8268 23.2388C19.6541 22.4819 21.2159 21.2002 22.3147 19.5557C23.4135 17.9112 24 15.9778 24 14C24 12.6859 23.741 11.3848 23.2378 10.1709C22.7347 8.95695 21.9972 7.85412 21.0675 6.9254C20.1379 5.99668 19.0343 5.2603 17.8199 4.75834C16.6055 4.25638 15.3041 3.99869 13.99 4.00001H14ZM14 22C12.4178 22 10.871 21.5308 9.55544 20.6518C8.23985 19.7727 7.21447 18.5233 6.60897 17.0615C6.00347 15.5997 5.84504 13.9911 6.15372 12.4393C6.4624 10.8874 7.22433 9.46197 8.34315 8.34315C9.46197 7.22433 10.8874 6.4624 12.4393 6.15372C13.9911 5.84504 15.5997 6.00347 17.0615 6.60897C18.5233 7.21447 19.7727 8.23985 20.6518 9.55544C21.5308 10.871 22 12.4178 22 14C22 16.1217 21.1572 18.1566 19.6569 19.6569C18.1566 21.1572 16.1217 22 14 22Z"
  //         />
  //       </svg>
  //     </ActionIcon>
  //   );

  return (
    <Link href={to ?? '.'} shallow>
      <a {...rest} className={cx(classes.root, disabled && classes.disabled)}>
        <span className={classes.chapter__no}>{no}</span>
        <div className={classes.chapter}>
          <span className={cx(classes.chapter__name, readAt !== -1 && classes.read)}>
            {name}
          </span>
          <span className={classes.chapter__desc}>{desc}</span>
        </div>
        <span className={classes.icon}>
          {
            // actions
          }
        </span>
      </a>
    </Link>
  );
}

function getDate(_: number) {
  const now = new Date();
  const date = new Date(_);

  if (isSameMonth(date, now)) return formatDistance(date, now, { addSuffix: true });
  return format(date, 'dd/MM/yyyy');
}
