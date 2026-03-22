import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { navLinks, socialMedia } from '@config';
import { usePrefersReducedMotion } from '@hooks';
import LottieIcon from './lottieIcon';
import { Icon } from '@components/icons';

import homeAnim from '../images/icons/home.json';
import aboutAnim from '../images/icons/about.json';
import experienceAnim from '../images/icons/experience.json';
import workAnim from '../images/icons/work.json';
import contactAnim from '../images/icons/contact.json';
import githubAnim from '../images/icons/github.json';
import linkedinAnim from '../images/icons/linkedin.json';

const StyledNavShell = styled.nav`
  position: fixed;
  z-index: 20;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--lightest-slate);

  @media (max-width: 1080px) {
    left: 14px;
  }

  @media (max-width: 768px) {
    left: 50%;
    top: auto;
    bottom: 16px;
    transform: translateX(-50%);
  }
`;

const StyledDock = styled.div`
  ${({ theme }) => theme.mixins.glass};
  ${({ theme }) => theme.mixins.boxShadow};
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border-radius: 22px;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    width: min(92vw, 520px);
    border-radius: 999px;
    padding: 10px 12px;
  }
`;

const StyledCluster = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 8px;
  }
`;

const StyledDivider = styled.div`
  width: 44px;
  height: 1px;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 999px;

  @media (max-width: 768px) {
    width: 1px;
    height: 36px;
  }
`;

const StyledItem = styled.a`
  ${({ theme }) => theme.mixins.flexCenter};
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  color: var(--lightest-slate);
  background: transparent;
  border: 1px solid transparent;
  transition: var(--transition);

  @keyframes dock-icon-pop {
    0% {
      transform: translateZ(0) scale(1);
    }
    40% {
      transform: translateZ(0) scale(1.18) rotate(-6deg);
    }
    100% {
      transform: translateZ(0) scale(1.06);
    }
  }

  .icon {
    width: 22px;
    height: 22px;
    transform-origin: 50% 50%;
    transition: transform 240ms var(--easing), filter 240ms var(--easing);
    will-change: transform;
  }

  /* Force monochrome Lottie SVGs to follow currentColor */
  .icon svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }
  .icon svg * {
    pointer-events: none;
  }
  .icon svg [stroke] {
    stroke: currentColor;
  }
  .icon svg [fill]:not([fill='none']) {
    fill: currentColor;
  }

  &:hover,
  &:focus-visible {
    outline: 0;
    color: var(--white);
    border-color: rgba(var(--accent-rgb), 0.35);
    background: rgba(var(--accent-rgb), 0.1);
    transform: translateY(-1px);

    .icon {
      filter: drop-shadow(0 0 12px rgba(var(--accent-rgb), 0.22));
    }
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover .icon,
    &:focus-visible .icon {
      animation: dock-icon-pop 420ms var(--easing) both;
    }
  }

  &[data-tip]:after {
    content: attr(data-tip);
    position: absolute;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    padding: 8px 10px;
    border-radius: 12px;
    background: var(--glass-bg-strong);
    background-image: var(--glass-sheen);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(var(--glass-blur)) saturate(140%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(140%);
    color: var(--lightest-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.02em;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 140ms var(--easing), transform 140ms var(--easing);
  }

  &[data-tip]:before {
    content: '';
    position: absolute;
    left: calc(100% + 6px);
    top: 50%;
    width: 8px;
    height: 8px;
    transform: translateY(-50%) rotate(45deg);
    background: var(--glass-bg-strong);
    border-left: 1px solid var(--glass-border);
    border-bottom: 1px solid var(--glass-border);
    opacity: 0;
    pointer-events: none;
    transition: opacity 140ms var(--easing);
  }

  &:hover:after,
  &:focus-visible:after {
    opacity: 1;
    transform: translateY(-50%) translateX(2px);
  }

  &:hover:before,
  &:focus-visible:before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    &[data-tip]:after {
      left: 50%;
      top: auto;
      bottom: calc(100% + 10px);
      transform: translateX(-50%) translateY(0);
    }

    &[data-tip]:before {
      left: 50%;
      top: auto;
      bottom: calc(100% + 6px);
      transform: translateX(-50%) rotate(45deg);
      border-left: 0;
      border-bottom: 0;
      border-right: 1px solid var(--glass-border);
      border-top: 1px solid var(--glass-border);
    }

    &:hover:after,
    &:focus-visible:after {
      transform: translateX(-50%) translateY(-2px);
    }
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    border-radius: 999px;
  }
`;

const pickSectionIcon = label => {
  switch (label) {
    case 'About':
      return aboutAnim;
    case 'Experience':
      return experienceAnim;
    case 'Work':
      return workAnim;
    case 'Contact':
      return contactAnim;
    default:
      return homeAnim;
  }
};

const getTip = (name, kind) => {
  if (kind === 'section') {
    switch (name) {
      case 'About':
        return 'About';
      case 'Experience':
        return 'Experience & Education';
      case 'Work':
        return 'Projects';
      case 'Contact':
        return 'Contact';
      default:
        return 'Back to top';
    }
  }

  if (kind === 'social') {
    if (name === 'GitHub') {
      return 'GitHub (opens in new tab)';
    }
    if (name === 'Linkedin') {
      return 'LinkedIn (opens in new tab)';
    }
    return `${name} (opens in new tab)`;
  }

  return name;
};

const pickSocialIcon = name => {
  if (name === 'GitHub') {
    return githubAnim;
  }
  if (name === 'Linkedin') {
    return linkedinAnim;
  }
  return null;
};

const AnimatedDockItem = ({ href, ariaLabel, tip, animationData, target, rel }) => {
  const iconRef = useRef(null);

  return (
    <StyledItem
      href={href}
      aria-label={ariaLabel}
      data-tip={tip}
      target={target}
      rel={rel}
      onMouseEnter={() => iconRef.current?.play?.()}
      onFocus={() => iconRef.current?.play?.()}>
      <LottieIcon
        ref={iconRef}
        className="icon"
        animationData={animationData}
        playOnHover={false}
      />
    </StyledItem>
  );
};

AnimatedDockItem.propTypes = {
  href: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  tip: PropTypes.string,
  animationData: PropTypes.object.isRequired,
  target: PropTypes.string,
  rel: PropTypes.string,
};

AnimatedDockItem.defaultProps = {
  tip: undefined,
  target: undefined,
  rel: undefined,
};

const StaticDockItem = ({ href, ariaLabel, tip, children, target, rel }) => (
  <StyledItem href={href} aria-label={ariaLabel} data-tip={tip} target={target} rel={rel}>
    {children}
  </StyledItem>
);

StaticDockItem.propTypes = {
  href: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  tip: PropTypes.string,
  children: PropTypes.node.isRequired,
  target: PropTypes.string,
  rel: PropTypes.string,
};

StaticDockItem.defaultProps = {
  tip: undefined,
  target: undefined,
  rel: undefined,
};

const Nav = ({ isHome }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Layout auto-fixes external links after load; keep rel minimal here.
  const externalRel = prefersReducedMotion ? undefined : 'noreferrer';

  return (
    <StyledNavShell aria-label="Site">
      <StyledDock>
        <StyledCluster aria-label="Sections">
          <AnimatedDockItem
            href={isHome ? '#content' : '/#content'}
            ariaLabel="Home"
            tip={getTip('Home', 'section')}
            animationData={homeAnim}
          />

          {navLinks &&
            navLinks.map(({ url, name }, i) => (
              <AnimatedDockItem
                key={i}
                href={url}
                ariaLabel={name}
                tip={getTip(name, 'section')}
                animationData={pickSectionIcon(name)}
              />
            ))}
        </StyledCluster>

        <StyledDivider role="presentation" />

        <StyledCluster aria-label="Links">
          {socialMedia &&
            socialMedia.map(({ url, name }, i) => {
              const anim = pickSocialIcon(name);
              return anim ? (
                <AnimatedDockItem
                  key={i}
                  href={url}
                  ariaLabel={name}
                  tip={getTip(name, 'social')}
                  target="_blank"
                  rel={externalRel}
                  animationData={anim}
                />
              ) : (
                <StaticDockItem
                  key={i}
                  href={url}
                  ariaLabel={name}
                  tip={getTip(name, 'social')}
                  target="_blank"
                  rel={externalRel}>
                  <span className="icon">
                    <Icon name={name} />
                  </span>
                </StaticDockItem>
              );
            })}
        </StyledCluster>
      </StyledDock>
    </StyledNavShell>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
};

export default Nav;
