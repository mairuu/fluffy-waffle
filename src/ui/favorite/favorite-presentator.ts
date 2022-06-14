import { useState, useEffect } from 'react';

import { Resource } from '~/core/utils';
import { getFavoritesUseCase } from '~/domain/use-cases';
import type { ProjectType } from '~/core/types';
import type { FavoriteProject } from '~/domain/models';

export const useFavoritePresentator = (type: ProjectType) => {
  const [resouce, setResouce] = useState<Resource<FavoriteProject[]> | undefined>(
    undefined
  );

  const { data: favorites } = resouce || {};

  useEffect(() => {
    const sub = getFavoritesUseCase(type).subscribe(setResouce);
    return () => sub.unsubscribe();
  }, [type]);

  return {
    favorites,
    isError: Resource.isError(resouce),
    isLoading: Resource.isLoading(resouce),
  };
};
