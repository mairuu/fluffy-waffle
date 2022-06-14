import { useState, useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Tabs } from '@mantine/core';
import dynamic from 'next/dynamic';

import { Layout } from '~/ui/layout/layout';
import { projectTypes } from '~/core/types';
import type { NekoPage } from './_app';

const FavoriteView = dynamic(() => import('~/ui/favorite/favorite-view'), {
  ssr: false,
});

const LibraryPage: NekoPage = () => {
  const { index } = useTabIndex();
  return <FavoriteView type={projectTypes[index]} />;
};

const tabIndex$ = new BehaviorSubject<number>(0);

const useTabIndex = () => {
  const [index, setIndex] = useState(tabIndex$.value);

  useEffect(() => {
    const sub = tabIndex$.subscribe(setIndex);
    return () => sub.unsubscribe();
  }, []);

  return { index, setIndex: (index: number) => tabIndex$.next(index) };
};

const ProjectTypeTabs = () => {
  const { index, setIndex } = useTabIndex();

  return (
    <Tabs
      grow
      active={index}
      onTabChange={setIndex}
      styles={{ tabLabel: { textTransform: 'capitalize' } }}
    >
      {projectTypes.map((type) => (
        <Tabs.Tab key={type} label={type} />
      ))}
    </Tabs>
  );
};

LibraryPage.getLayout = (page) => <Layout tabs={<ProjectTypeTabs />}>{page}</Layout>;

export default LibraryPage;
