import { useMemo } from 'react';

export type FixedRowListProps = {
  gap?: number;
  rows?: number;
  children?: React.ReactElement[];
};

export const FixedRowList: React.FC<FixedRowListProps> = (props) => {
  const { children, rows = 1, gap = 0 } = props;
  const content = useMemo(() => (children || []).slice(0, rows), [children, rows]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, 1fr) 0`,
        gap,
      }}
    >
      {content}
    </div>
  );
};
