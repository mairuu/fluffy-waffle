import React, { useState } from 'react';
import { createStyles } from '@mantine/core';

import type { ImageProps } from 'next/image';
import Image from 'next/image';

enum State {
  Loading,
  Error,
  Idle,
}

const useStyles = createStyles({
  wrapper: {
    aspectRatio: 'var(--neko-thumbnail-aspect-ratio, 2 / 3)',
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    objectFit: 'cover',
    objectPosition: 'top',
    height: 'auto',
  },
});

export const ProjectThumbnail: React.FC<ImageProps> = ({
  className,
  src,
  style,
  ...rest
}) => {
  const [state, setState] = useState(State.Loading);
  const { classes, cx } = useStyles();

  return (
    <div className={classes.wrapper} style={style}>
      {src && (
        <Image
          alt=""
          layout="fill"
          {...rest}
          unoptimized
          className={cx(classes.image, className)}
          referrerPolicy="no-referrer"
          src={state === State.Error ? '/assets/no_image.jpg' : src}
          onLoad={() => state !== State.Error && setState(State.Idle)}
          onError={() => state !== State.Error && setState(State.Error)}
        />
      )}
    </div>
  );
};
