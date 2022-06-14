import { Text } from '@mantine/core';

export type ScreenStateProps = {
  expression: string;
  message: string;
};

export const ScreenState = ({ expression, message }: ScreenStateProps) => {
  return (
    <div
      style={{
        width: '100%',
        height: '80vh',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 300 }}>
        <Text style={{ fontSize: 48, lineHeight: 2.25 }}>{expression}</Text>
        <Text style={{ fontSize: 16 }}>{message}</Text>
      </div>
    </div>
  );
};
