import { useMantineColorScheme, ActionIcon } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons';

export const ThemeToggler = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon size="lg" onClick={() => toggleColorScheme()} style={{ flexShrink: 0 }}>
      {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
};
