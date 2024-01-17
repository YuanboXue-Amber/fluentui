import * as React from 'react';
import { useBaseAnimationStyles } from './useTimerStyles.styles';

export type TimerProps = {
  running: boolean;
  timeout: number;
  // eslint-disable-next-line @fluentui/consistent-callback-type -- callback should be typed with EventHandler, but we can't break existing callbacks
  onTimeout: () => void;
  as?: 'span';
};

export const Timer = React.forwardRef<HTMLDivElement, TimerProps>((props, ref) => {
  const baseAnimationStyles = useBaseAnimationStyles();
  const { running, timeout, onTimeout } = props;

  const style: React.CSSProperties = {
    animationDuration: `${timeout}ms`,
    animationPlayState: running ? 'running' : 'paused',
  };

  if (timeout < 0) {
    return null;
  }

  return (
    <span
      onAnimationEnd={onTimeout}
      data-timer-status={style.animationPlayState}
      ref={ref}
      style={style}
      className={baseAnimationStyles}
    />
  );
});

Timer.displayName = 'Timer';
