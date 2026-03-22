import React, { useEffect, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';
import { usePrefersReducedMotion } from '@hooks';

const LottieIcon = React.forwardRef(
  ({ animationData, size, loop, playOnHover, className }, ref) => {
    const containerRef = useRef(null);
    const animRef = useRef(null);
    const framesRef = useRef({ start: 0, end: 0 });
    const pendingPlayRef = useRef(false);
    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
      let isMounted = true;

      const mount = async () => {
        if (!containerRef.current) {
          return;
        }

        // Avoid SSR issues.
        if (typeof window === 'undefined') {
          return;
        }

        const lottie = (await import('lottie-web')).default;
        if (!isMounted || !containerRef.current) {
          return;
        }

        const anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay: false,
          animationData,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet',
          },
        });

        animRef.current = anim;

        const startFrame = Number.isFinite(animationData?.ip) ? animationData.ip : 0;
        const endFrame = Number.isFinite(animationData?.op)
          ? Math.max(animationData.op - 1, startFrame)
          : startFrame;

        framesRef.current = { start: startFrame, end: endFrame };

        // Default to a visible resting state.
        anim.goToAndStop(endFrame, true);

        anim.addEventListener('complete', () => {
          if (animRef.current) {
            animRef.current.goToAndStop(endFrame, true);
          }
        });

        if (pendingPlayRef.current) {
          pendingPlayRef.current = false;
          anim.stop();
          anim.playSegments([startFrame, endFrame], true);
        }
      };

      mount();

      return () => {
        isMounted = false;
        if (animRef.current) {
          animRef.current.destroy();
          animRef.current = null;
        }
      };
    }, [animationData, loop]);

    const play = () => {
      if (prefersReducedMotion) {
        return;
      }
      if (!animRef.current) {
        pendingPlayRef.current = true;
        return;
      }

      const { start, end } = framesRef.current;
      animRef.current.stop();
      animRef.current.playSegments([start, end], true);
    };

    useImperativeHandle(ref, () => ({ play }), [prefersReducedMotion]);

    return (
      <span
        className={className}
        onPointerEnter={playOnHover ? play : undefined}
        onFocus={playOnHover ? play : undefined}
        aria-hidden="true"
        style={{ width: size, height: size, display: 'inline-block' }}
        ref={containerRef}
      />
    );
  },
);

LottieIcon.propTypes = {
  animationData: PropTypes.object.isRequired,
  size: PropTypes.number,
  loop: PropTypes.bool,
  playOnHover: PropTypes.bool,
  className: PropTypes.string,
};

LottieIcon.defaultProps = {
  size: 22,
  loop: false,
  playOnHover: true,
  className: undefined,
};

export default LottieIcon;
