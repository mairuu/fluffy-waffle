import { useEffect, useMemo } from 'react';
import { useResizeObserver } from '@mantine/hooks';

export type FixedRowGridProps = {
  onLack?: () => void;
  children?: React.ReactElement[];
  placeHolder?: React.ReactElement;
  gap?: number;
  rows?: number;
  minItemWidth: number;
};

export const FixedRowGrid: React.FC<FixedRowGridProps> = (props) => {
  const { onLack, children = [], placeHolder, gap = 0, rows = 1, minItemWidth } = props;

  const [ref, rect] = useResizeObserver();
  const itemPerRow = Math.floor((rect.width + gap) / (minItemWidth + gap));

  useEffect(() => {
    if (onLack && itemPerRow * rows > children.length) onLack();
  }, [children, itemPerRow, onLack, rows]);

  const content = useMemo(
    () =>
      Array.from(Array(rows), (_, i) => {
        let items = children.slice(i * itemPerRow, i * itemPerRow + itemPerRow);
        items =
          placeHolder && items.length === 0
            ? ((<div style={{ visibility: 'hidden' }}>{placeHolder}</div>) as any)
            : items;

        return (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateRows: 'var(--template-rows)',
              gap: 'var(--gap)',
              gridTemplateColumns: 'var(--template-colums)',
            }}
          >
            {items}
          </div>
        );
      }),
    [children, itemPerRow, placeHolder, rows]
  );

  return (
    <div
      ref={ref}
      style={{
        // @ts-ignore
        ['--gap']: `${gap}px`,
        ['--template-rows']: 'auto 0',
        ['--template-colums']: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr)`,
      }}
    >
      {content}
    </div>
  );
};

export default FixedRowGrid;
