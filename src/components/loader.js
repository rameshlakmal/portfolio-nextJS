import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import anime from 'animejs';
import styled from 'styled-components';

const StyledLoader = styled.div`
  ${({ theme }) => theme.mixins.flexCenter};
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark-navy);
  z-index: 99;

  .loader-mark {
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 999px;
    transition: var(--transition);
    opacity: ${props => (props.isMounted ? 1 : 0)};
  }

  .halo {
    position: absolute;
    inset: -14px;
    border-radius: 999px;
    background: radial-gradient(
      circle at center,
      rgba(var(--accent-rgb), 0.2) 0%,
      rgba(var(--accent-rgb), 0.12) 28%,
      rgba(var(--accent-rgb), 0) 62%
    );
    filter: blur(10px);
    animation: halo-breathe 1800ms ease-in-out infinite;
  }

  .ring {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: conic-gradient(
      from 90deg,
      rgba(var(--accent-rgb), 0) 0deg,
      rgba(var(--accent-rgb), 0.95) 40deg,
      rgba(var(--accent-rgb), 0.15) 90deg,
      rgba(var(--accent-rgb), 0) 180deg,
      rgba(var(--accent-rgb), 0) 360deg
    );
    animation: ring-spin 1100ms linear infinite;
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
    mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
  }

  .core {
    position: absolute;
    inset: 10px;
    border-radius: 999px;
    background: var(--glass-bg);
    background-image: var(--glass-sheen);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(var(--glass-blur)) saturate(140%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(140%);
  }

  .spark {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 10px;
    height: 10px;
    border-radius: 999px;
    transform: translate(-50%, -50%);
    background: var(--white);
    box-shadow: 0 0 0 6px rgba(var(--accent-rgb), 0.12), 0 0 22px rgba(var(--accent-rgb), 0.35);
    animation: spark-pulse 1200ms ease-in-out infinite;
  }

  @keyframes ring-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes halo-breathe {
    0%,
    100% {
      transform: scale(0.98);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.04);
      opacity: 1;
    }
  }

  @keyframes spark-pulse {
    0%,
    100% {
      transform: translate(-50%, -50%) scale(0.92);
      opacity: 0.85;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.06);
      opacity: 1;
    }
  }
`;

const Loader = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const animate = () => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader.add({
      targets: '.loader',
      delay: 1200,
      duration: 450,
      easing: 'easeInOutQuart',
      opacity: 0,
      zIndex: -1,
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <StyledLoader className="loader" isMounted={isMounted}>
      <Helmet bodyAttributes={{ class: `hidden` }} />

      <div className="loader-mark" aria-label="Loading">
        <span className="halo" aria-hidden="true" />
        <span className="ring" aria-hidden="true" />
        <span className="core" aria-hidden="true" />
        <span className="spark" aria-hidden="true" />
      </div>
    </StyledLoader>
  );
};

Loader.propTypes = {
  finishLoading: PropTypes.func.isRequired,
};

export default Loader;
