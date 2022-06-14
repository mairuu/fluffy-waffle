import { ActionIcon, createStyles } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { format } from 'date-fns';
import Link from 'next/link';
import type { Activity } from '~/domain/models';
import { popActivityUseCase } from '~/domain/use-cases';
import { ProjectThumbnail } from '../shared/project-thumbnail';

type IDKProps = {
  activity: Activity;
};

const useStyles = createStyles({
  root: {
    display: 'flex',
    color: 'currentcolor',
    textDecoration: 'none',
    gap: 16,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 4,
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    willChange: 'background-color',
    '&:active': {
      backgroundColor: 'rgb(255, 255, 255, 0.1)',
    },
  },
  badges: { minWidth: 92, display: 'flex', flexFlow: 'column wrap', gap: 8 },
  media: { flex: '0 0 max(76px, 10%)' },
  caption: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    fontSize: 14,
  },
  title: {
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    fontWeight: 600,
  },
  desc: {
    lineHeight: 2,
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    paddingRight: 16,
    zIndex: 2,
  },
});

export const ActivityCard = ({ activity }: IDKProps) => {
  const { classes } = useStyles();
  return (
    <Link href={`/p/${activity.id}`}>
      <a className={classes.root}>
        <div className={classes.overlay} />
        <div className={classes.media}>
          <ProjectThumbnail src={activity.thumbnailUrl} />
        </div>
        {/* {badges && (
          <div className={classes.badges}>
            {badges.map((e, i) => (
              <Badge key={i} color={e.color} size="sm" variant="filled">
                {e.label}
              </Badge>
            ))}
          </div>
        )} */}
        <div className={classes.caption}>
          <span className={classes.title}> {activity.title} </span>
          <span className={classes.desc}>
            Ch. {activity.chapterNo} - {formatDate(activity.readAt)}
          </span>
        </div>
        <div className={classes.actions}>
          <ActionIcon<'button'>
            size="xl"
            onClick={(e) => {
              e.preventDefault();
              popActivityUseCase(activity.id);
            }}
          >
            <IconTrash />
          </ActionIcon>
        </div>
      </a>
    </Link>
  );
};

function formatDate(io: number) {
  return format(io, 'K:mm a');
}
