import { tv } from 'tailwind-variants';

const root = tv({
  base: 'p-0 rounded-3xl',
});

const item = tv({
  base: 'cursor-pointer flex w-full flex-row items-center p-4 gap-3 disabled:opacity-50 disabled:cursor-default',
});

const itemPrefix = tv({
  base: 'flex items-center justify-center text-foreground',
});

const itemContent = tv({
  base: 'flex-1',
});

const itemTitle = tv({
  base: 'text-base text-foreground text-left font-medium block',
});

const itemDescription = tv({
  base: 'text-sm text-muted text-left block',
});

export const listGroupClassNames = {
  root,
  item,
  itemPrefix,
  itemContent,
  itemTitle,
  itemDescription,
};

export default listGroupClassNames;