import { Footer } from '@mantine/core';
import { useNavStyles, useReaderNavHidden } from '../hooks';

export const _Footer = ({ children }: { children: React.ReactNode }) => {
  const hidden = useReaderNavHidden();
  const { classes } = useNavStyles(hidden);

  return (
    <Footer height={50} className={classes.root}>
      {children}
    </Footer>
  );
};
