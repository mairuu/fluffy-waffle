import { useEffect, useMemo, useState } from 'react';

import { getActivitiesUseCase } from '~/domain/use-cases';
import { Resource } from '~/core/utils';
import type { Activity } from '~/domain/models';

export const useHistoryPresentator = () => {
  const [resouce, setResouce] = useState<Resource<Activity[] | undefined> | undefined>(
    undefined
  );

  useEffect(() => {
    const sub = getActivitiesUseCase().subscribe(setResouce);
    return () => sub.unsubscribe();
  }, []);

  const grouped = useMemo(() => {
    const grouped: [Date, Activity[]][] = [];
    const data = resouce?.data;

    if (!data) return undefined;

    data.forEach((d) => {
      const now = new Date(d.readAt);
      if (grouped[grouped.length - 1]?.[0].getDate() !== now.getDate()) {
        grouped.push([now, [d]]);
      } else {
        grouped[grouped.length - 1][1].push(d);
      }
    });

    return grouped;
  }, [resouce?.data]);

  return {
    grouped,
    isLoading: Resource.isLoading(resouce),
  };
};
