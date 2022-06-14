import { createStyles } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { FixedRowGrid, FixedRowList } from './list';

export type GalleryProps = React.HTMLAttributes<HTMLDivElement>;

export type GalleryHeaderProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
  to?: string;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: never;
};

export type GalleryContentProps = {
  gap?: number;
  layout?: 'list' | 'grid';
  fixedRow?: number;
  children?: React.ReactElement[];
};

interface GalleryComponent extends React.FC<GalleryProps> {
  Header: React.FC<GalleryHeaderProps>;
  Content: React.FC<GalleryContentProps>;
}

export const Gallery: GalleryComponent = (props) => {
  return <div {...props} />;
};

const useStyles = createStyles({
  header: { marginBottom: 16 },

  header__title__container: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    marginBottom: 4,
  },
  header__title: {
    margin: '0 auto 0 0',
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: 600,
  },
  header__title__icon: { display: 'inline-flex' },
  header__title__menu: { display: 'inline-flex' },

  header__subtitle: { fontSize: 14, fontWeight: 100 },

  clickable: {
    cursor: 'pointer',
  },
});

Gallery.Header = function Header(props) {
  const { className, title, icon, subtitle, to, ...rest } = props;
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.header, className)} {...rest}>
      <div
        className={cx(
          classes.header__title__container,
          Boolean(to) && classes.clickable
        )}
      >
        {icon && <span className={classes.header__title__icon}>{icon}</span>}
        <h3 className={classes.header__title}>{title}</h3>
        {to && (
          <span className={classes.header__title__menu}>
            {/* <IconChevronRight /> */}
          </span>
        )}
      </div>
      <div className={classes.header__subtitle}>{subtitle}</div>
    </div>
  );
};

const placeHolder = (
  <div
    style={{
      paddingTop: '150%',
    }}
  />
);

Gallery.Content = function Content(props) {
  const { gap = 10, layout = 'grid', fixedRow, children } = props;
  const minItemWidth = useMediaQuery('(min-width: 480px)') ? 196 : 138;

  if (fixedRow === undefined)
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            layout === 'grid'
              ? `repeat(auto-fill, minmax(${minItemWidth}px, 1fr)`
              : '1fr',
          gap,
        }}
      >
        {children}
      </div>
    );

  if (layout === 'grid')
    return (
      <FixedRowGrid
        gap={gap}
        rows={fixedRow}
        minItemWidth={minItemWidth}
        placeHolder={placeHolder}
      >
        {children}
      </FixedRowGrid>
    );

  return <FixedRowList rows={fixedRow}>{children}</FixedRowList>;
};
