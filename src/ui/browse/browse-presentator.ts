import { useEffect, useState } from 'react';

import { Resource } from '~/core/utils';
import { getBrowseProject } from '~/domain/use-cases';
import type { ProjectType } from '~/core/types';
import type { BrowseProject } from '~/domain/models';

export const useBrowsePresentator = (projectType: ProjectType) => {
  const [resource, setResource] = useState<
    Resource<BrowseProject | undefined> | undefined
  >();

  useEffect(() => {
    setResource(new Resource.Loading());

    const sub = getBrowseProject(projectType).subscribe(setResource);
    return () => sub.unsubscribe();
  }, [projectType]);

  return {
    projects: resource?.data,
    isError: Resource.isError(resource),
    isLoading: Resource.isLoading(resource),
  };
};
