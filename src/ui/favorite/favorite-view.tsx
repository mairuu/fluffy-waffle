import { Container } from '@mantine/core';

import { ImageCard } from '~/ui/shared/project-card';
import { Gallery } from '~/ui/shared/project-gallery';
import { ScreenState } from '~/ui/shared/screen-state';
import { useFavoritePresentator } from './favorite-presentator';
import type { ProjectType } from '~/core/types';

export type LibraryViewProps = {
  type: ProjectType;
};

export const LibrarayView = (props: LibraryViewProps) => {
  const { type } = props;
  const { favorites, isLoading } = useFavoritePresentator(type);

  if (isLoading || !favorites) return null;

  if (favorites.length === 0)
    return (
      <ScreenState expression="( *´°`)" message="Oh crap, you've got nothing..." />
    );

  return (
    <Container>
      <Gallery>
        <Gallery.Header />
        <Gallery.Content>
          {favorites?.map((e) => (
            <ImageCard
              key={e.id}
              author=""
              date=""
              image={e.thumbnailUrl}
              link={`/p/${e.id}`}
              title={e.title}
            />
          ))}
        </Gallery.Content>
      </Gallery>
    </Container>
  );
};

export default LibrarayView;
