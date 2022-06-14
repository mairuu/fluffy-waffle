import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Skeleton,
  Divider,
  Text,
  Paper,
  Badge,
  Blockquote,
  Tabs,
  Avatar,
  Group,
} from '@mantine/core';
import { IconUser, IconRocket, IconEye } from '@tabler/icons';
import { format } from 'date-fns';

import { useProjectPresentator } from './project-presentator';
import { ProjectThumbnail } from '../shared/project-thumbnail';
import { ChapterList } from './chapter/chapter-list';

export type ProjectViewProps = {
  projectId: number;
};

export const ProjectView = (props: ProjectViewProps) => {
  const presentator = useProjectPresentator(props.projectId);
  const { project, isError } = presentator;
  const { info, chapters } = project || {};
  const {
    title,
    synopsis,
    author,
    releaseDate,
    views,
    genres,
    contributors,
    medias,
    thumbnailUrl = '',
  } = info || {};
  const loaded = !!project && !isError;

  const Details = (
    <Paper
      shadow="sm"
      sx={(theme) => ({
        borderRadius: 8,
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        display: 'grid',
        gridTemplateColumns: '24px 1fr',
        alignItems: 'center',
        rowGap: 8,
        columnGap: 16,
        padding: 16,
      })}
    >
      <IconUser />
      <span>{loaded ? author : <Skeleton height={12} width="12ch" />}</span>

      <IconRocket />
      <span>
        {loaded ? (
          releaseDate && format(new Date(releaseDate || 0), 'MMM yyyy')
        ) : (
          <Skeleton height={12} width="12ch" />
        )}
      </span>

      <IconEye />
      <span>
        {loaded ? views?.toLocaleString() : <Skeleton height={12} width="12ch" />}
      </span>
    </Paper>
  );

  const Synopsis = (
    <Blockquote sx={{ fontSize: 'clamp(13px, 2vw, 16px)' }}>
      {loaded ? synopsis : <Skeleton height="10ch" />}
    </Blockquote>
  );

  const Genres = (
    <div
      style={{
        display: 'flex',
        gap: 8,
        flexFlow: 'row wrap',
        marginLeft: 64,
      }}
    >
      {genres ? (
        genres.map((e, i) => (
          <Badge key={i} p="md" color="gray" radius="md" variant="filled">
            {e}
          </Badge>
        ))
      ) : (
        <>
          <Skeleton radius="md" width={78} height={34} />
          <Skeleton radius="md" width={78} height={34} />
        </>
      )}
    </div>
  );

  const Contributors = (
    <div
      style={{
        marginLeft: 64,
      }}
    >
      <Text my="md" sx={{ fontSize: 18, fontWeight: 600 }}>
        Contributor
      </Text>

      {loaded ? (
        contributors?.map((e, i) => (
          <Group mt="md" key={i}>
            <Avatar size="lg" src={e.profileUrl} />
            <Text>{e.displayName}</Text>
          </Group>
        ))
      ) : (
        <Group>
          <Skeleton height={56} width={56} />
          <Skeleton height="2ch" width="12ch" />
        </Group>
      )}
    </div>
  );

  const ChapterTab = (
    <Tabs.Tab label="Chapters">
      <ChapterList project={info} chapters={chapters} loaded={loaded} />
    </Tabs.Tab>
  );

  const CoverTab =
    medias && medias.length ? (
      <Tabs.Tab label="Covers">
        <Box
          sx={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          }}
        >
          {medias.map((e, i) => (
            <ProjectThumbnail key={i} src={e} />
          ))}
        </Box>
      </Tabs.Tab>
    ) : undefined;

  return (
    <>
      <Head>{project && <title>{project.info.title}</title>}</Head>
      <div
        style={{
          position: 'relative',
          width: '100%',
          marginTop: 'calc(-16px + -1 * var(--mantine-header-height, 0px))',
          height: 'var(--mantine-header-height, 0px)',
        }}
      >
        <ProjectBanner src={thumbnailUrl} bot="-280px" />
      </div>

      <Container
        size="lg"
        mt={32}
        sx={(theme) => ({
          display: 'grid',
          gap: 32,
          gridTemplateColumns: '1fr',
          position: 'relative',
          [theme.fn.largerThan('md')]: {
            gridTemplateColumns: '220px 1fr',
          },
        })}
      >
        <section style={{ height: 'calc(100% - 241px)' }}>
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'column',
              gap: 16,
              position: 'sticky',
              top: `calc(var(--mantine-header-height, 0px) + 16px)`,
            }}
          >
            <ProjectThumbnail
              key={project?.info.id}
              style={{ borderRadius: 8, maxWidth: 260, margin: '0 auto' }}
              src={thumbnailUrl}
            />

            <Text
              component="h2"
              sx={(theme) => ({
                fontSize: 24,
                lineHeight: 1.25,
                fontWeight: 600,
                padding: '16px 0',
                textAlign: 'center',
                [theme.fn.largerThan('md')]: {
                  display: 'none',
                },
              })}
            >
              {loaded ? title : <Skeleton height={30} m="auto" width="80%" />}
            </Text>

            <div
              style={{
                display: 'grid',
                gap: 16,
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              }}
            >
              <Button onClick={presentator.toggleFavorite}>
                {project?.info.favorite ? 'Remove from libraray' : 'Add to libraray'}
              </Button>
            </div>

            {Details}
          </Box>
        </section>

        <section>
          <Text
            sx={(theme) => ({
              marginTop: 248,
              fontSize: 32,
              lineHeight: 1.25,
              fontWeight: 600,
              padding: '20px 0',
              [theme.fn.smallerThan('md')]: {
                display: 'none',
              },
            })}
          >
            {loaded ? title : <Skeleton height={32} my={4} width="90%" />}
          </Text>

          <Divider />

          {Synopsis}
          {Genres}
          {Contributors}

          <ProjectTabs>
            {ChapterTab}
            {CoverTab}
          </ProjectTabs>
        </section>
      </Container>
    </>
  );
};

const ProjectBanner: React.FC<{ src: string; bot: string }> = ({ src, bot }) => {
  return (
    <div
      style={{
        inset: `-4px 0px ${bot} 0px`,
        zIndex: 0,
        position: 'absolute',
        backgroundSize: 'cover',
        backgroundImage: `url(${src})`,
        backgroundPosition: '0 30%',
        // backgroundAttachment: 'fixed',
        filter: 'blur(3px) brightness(0.6) grayscale(0.33) contrast(1.15)',
      }}
    />
  );
};

const ProjectTabs: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Tabs
      variant="outline"
      styles={(theme) => {
        const borderColor =
          theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2];
        const bgColor =
          theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white;

        return {
          root: {
            minHeight: `calc(100vh - 16px)`,
            paddingTop: 'calc(var(--mantine-header-height, 0) + 16px)',
            position: 'sticky',
            top: 0,
          },

          body: {
            padding: '16px',
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderStyle: 'none solid solid',
            borderWidth: '0 1px 1px',
            borderRadius: '0 0 4px 4px',
          },
        };
      }}
    >
      {children}
    </Tabs>
  );
};

export default ProjectView;
