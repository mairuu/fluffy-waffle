import { useMemo } from 'react';
import { Container, Divider } from '@mantine/core';
import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/esm/locale';

import { ImageCard } from '~/ui/shared/project-card';
import { Gallery } from '~/ui/shared/project-gallery';
import { useBrowsePresentator } from './browse-presentator';
import type { ProjectType } from '~/core/types';

export type BrowseViewProps = {
  projectType: ProjectType;
};

export const BrowseView = (props: BrowseViewProps) => {
  const { projectType } = props;
  const { projects } = useBrowsePresentator(projectType);

  const { arrival, latest, random } = useMemo(
    () => ({
      arrival: projects?.arrival.map(mapCard) || [],
      random: projects?.random.map(mapCard) || [],
      latest: projects?.latest.map(mapCard) || [],
    }),
    [projects]
  );

  return (
    <Container>
      <Gallery>
        <Gallery.Header title={`arrival ${projectType}`} subtitle="ผลงานมาใหม่" />
        <Gallery.Content fixedRow={1}>{arrival}</Gallery.Content>
      </Gallery>

      <Divider my={32} />

      <Gallery>
        <Gallery.Header title={`random ${projectType}`} subtitle="สุ่มผลงาน" />
        <Gallery.Content fixedRow={1}>{random}</Gallery.Content>
      </Gallery>

      <Divider my={32} />

      <Gallery>
        <Gallery.Header title={`latest ${projectType}`} subtitle="ผลงานอัพเดตล่าสุด" />
        <Gallery.Content fixedRow={3}>{latest}</Gallery.Content>
      </Gallery>

      <Divider my={32} />
    </Container>
  );
};

export default BrowseView;

function mapCard(e: any) {
  return (
    <ImageCard
      key={e.id}
      title={e.title}
      author={e.provider}
      image={e.thumbnailUrl}
      link={`/p/${e.id}`}
      date={formatDate(e.date)}
    />
  );
}

const formatRelativeLocale: Record<string, string> = {
  lastWeek: 'dd/MM/yy',
  yesterday: "'Yesterday'",
  today: "'Today'",
  tomorrow: "'Tomorrow'",
  nextWeek: "'Next' eeee",
  other: 'dd/MM/yy',
};

const locale: Locale = {
  ...enUS,
  formatRelative: (token) => formatRelativeLocale[token],
};

function formatDate(date: string) {
  return date ? formatRelative(new Date(date), new Date(), { locale }) : '~';
}
