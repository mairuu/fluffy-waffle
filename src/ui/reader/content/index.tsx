import { Loader } from '@mantine/core';

import { isRetrieved, useReaderContext } from '../reader-context';
import { ImageReader } from './image-reader';
import { TextReader } from './text-reader';

const Loading = () => (
  <div style={{ display: 'grid', placeItems: 'center', paddingTop: 80 }}>
    <Loader variant="bars" />
  </div>
);

export const ReaderContent = () => {
  const ctx = useReaderContext();
  if (!ctx.content || !isRetrieved(ctx)) return <Loading />;

  const Reader = ctx.content.contentType === 'image' ? ImageReader : TextReader;

  return (
    <div onClick={() => ctx.navHidden$.next(!ctx.navHidden$.value)}>
      <Reader />
    </div>
  );
};
