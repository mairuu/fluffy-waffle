import { Header } from '@mantine/core';

import { useNavStyles, useReaderNavHidden } from '../hooks';

export const _Header = ({ children }: { children: React.ReactNode }) => {
  const hidden = useReaderNavHidden();
  const { classes } = useNavStyles(hidden);

  return (
    <Header height={50} className={classes.root}>
      {children}
    </Header>
  );
};
