import { useState, useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { Tabs } from '@mantine/core';
import dynamic from 'next/dynamic';

import { projectTypes } from '~/core/types';
import { Layout } from '~/ui/layout/layout';
import type { NekoPage } from '~/pages/_app';

const tabIndex$ = new BehaviorSubject<number>(0);

const useTabIndex = () => {
  const [index, setIndex] = useState(tabIndex$.value);

  useEffect(() => {
    const sub = tabIndex$.subscribe(setIndex);
    return () => sub.unsubscribe();
  }, []);

  return { index, setIndex: (index: number) => tabIndex$.next(index) };
};

const Tabs_ = () => {
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

const BrowseView = dynamic(() => import('~/ui/browse/browse-view'), { ssr: false });

const BrowsePage: NekoPage = () => {
  const { index } = useTabIndex();
  return <BrowseView projectType={projectTypes[index]} />;
};

BrowsePage.getLayout = (page) => <Layout tabs={<Tabs_ />}>{page}</Layout>;

export default BrowsePage;
