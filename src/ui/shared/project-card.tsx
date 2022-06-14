import Link from 'next/link';
import { Text, Group, Center, createStyles } from '@mantine/core';
import { IconClock } from '@tabler/icons';

import { ProjectThumbnail } from '~/ui/shared/project-thumbnail';

const useStyles = createStyles((theme, _params, getRef) => {
  const image = getRef('image');

  return {
    card: {
      position: 'relative',
      aspectRatio: '2 / 3',
      // paddingTop: '150%',
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      boxShadow: theme.shadows.lg,
      overflow: 'hidden',
      borderRadius: theme.radius.md,

      [`&:hover .${image}`]: {
        transform: 'scale(1.03)',
      },
    },

    image: {
      ref: image,
      transition: 'transform 500ms ease',
    },

    overlay: {
      position: 'absolute',
      inset: '20% 0 0',
      backgroundImage:
        'linear-gradient(180deg, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, .8) 95%)',
    },

    content: {
      padding: 10,
      inset: 0,
      height: '100%',
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      zIndex: 1,
    },

    title: {
      color: theme.white,
      marginBottom: 5,
    },

    bodyText: {
      color: theme.colors.dark[1],
      marginLeft: 7,
    },

    author: {
      maxWidth: '50%',
      color: theme.colors.dark[1],
    },
  };
});

type ImageProps = {
  link: string;
  image: string;
  title: string;
  author: string;
  date: string;
};

export const ImageCard = (props: ImageProps) => {
  const { image, title, author, date, link } = props;
  const { classes, theme } = useStyles();

  return (
    <Link href={link} shallow>
      <a className={classes.card}>
        <ProjectThumbnail src={image} />

        <div className={classes.overlay} />

        <div className={classes.content}>
          <div>
            <Text lineClamp={2} size="md" className={classes.title} weight={500}>
              {title}
            </Text>

            <Group position="apart" spacing="xs" noWrap>
              <Text size="sm" className={classes.author} lineClamp={1}>
                {author}
              </Text>

              {date && (
                <Center>
                  <IconClock size={16} color={theme.colors.dark[2]} />
                  <Text size="sm" className={classes.bodyText}>
                    {date}
                  </Text>
                </Center>
              )}
            </Group>
          </div>
        </div>
      </a>
    </Link>
  );
};
