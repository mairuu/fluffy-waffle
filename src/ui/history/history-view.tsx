import { Container } from '@mantine/core';
import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/esm/locale';

import { Gallery } from '~/ui/shared/project-gallery';
import { ScreenState } from '~/ui/shared/screen-state';
import { ActivityCard } from './activity-card';
import { useHistoryPresentator } from './history-presentator';

const HistoryView = () => {
  const { grouped, isLoading } = useHistoryPresentator();

  if (isLoading || !grouped) return null;

  if (grouped.length === 0)
    return (
      <ScreenState
        expression="(-ω-、)"
        message="Oh, it seems like you haven't read anything..."
      />
    );

  return (
    <Container sx={{ display: 'flex', flexFlow: 'column', gap: 16 }}>
      {grouped.map(([date, items]) => (
        <Gallery key={date.toLocaleDateString('en-US')}>
          <Gallery.Header title={formatDate(date)} />
          <Gallery.Content layout="list">
            {items.map((e) => (
              <ActivityCard key={e.id} activity={e} />
            ))}
          </Gallery.Content>
        </Gallery>
      ))}
    </Container>
  );
};

const formatRelativeLocale: Record<string, string> = {
  lastWeek: 'dd/MM/yyyy',
  yesterday: "'Yesterday'",
  today: "'Today'",
  tomorrow: "'Tomorrow'",
  nextWeek: "'Next' eeee",
  other: 'dd/MM/yyyy',
};

const locale: Locale = {
  ...enUS,
  formatRelative: (token) => formatRelativeLocale[token],
};

function formatDate(date: Date) {
  return formatRelative(date, new Date(), { locale });
}

export default HistoryView;
