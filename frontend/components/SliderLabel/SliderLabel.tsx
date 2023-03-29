import { createStyles, RangeSlider, rem } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  label: {
    top: 0,
    height: rem(28),
    lineHeight: rem(28),
    width: rem(34),
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
    backgroundColor: 'transparent',
  },

  thumb: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    height: rem(28),
    width: rem(34),
    border: 'none',
  },

  dragging: {
    transform: 'translate(-50%, -50%)',
  },
}));

export function SliderLabel() {
  const { classes } = useStyles();
  return <RangeSlider labelAlwaysOn defaultValue={[20, 60]} classNames={classes} />;
}
