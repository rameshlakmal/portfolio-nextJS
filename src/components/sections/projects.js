import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { projects } from '../../data/portfolio';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
    }

    @media (max-width: 480px) {
      margin-top: 36px;
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }

      .project-thumb img {
        transform: scale(1.06);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.glass};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 0;
    border-radius: var(--border-radius);
    transition: var(--transition);
    overflow: hidden;
  }

  .project-thumb {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: var(--lightest-navy);
    border-bottom: 1px solid var(--glass-border);
  }

  .project-thumb img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    transform: scale(1.02);
    transition: transform 480ms var(--easing);
  }

  .project-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 1.25rem 1.25rem 1.1rem;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 18px;

    .folder {
      color: var(--green);
      svg {
        width: 34px;
        height: 34px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    @media (max-width: 480px) {
      font-size: 20px;
    }

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;
    overflow-wrap: anywhere;
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;
      overflow-wrap: anywhere;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const Projects = () => {
  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const isInternalHref = href => typeof href === 'string' && href.startsWith('/');

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  const projectInner = ({ github, external, title, tech, description, cover }) => {
    const primaryHref = external || github;
    const primaryIsInternal = isInternalHref(primaryHref);
    const externalIsInternal = isInternalHref(external);

    return (
      <div className="project-inner">
        {cover && (
          <div className="project-thumb">
            <img src={cover} alt={`${title} cover`} loading="lazy" />
          </div>
        )}

        <div className="project-content">
          <header>
            <div className="project-top">
              <div className="folder">
                <Icon name="Folder" />
              </div>
              <div className="project-links">
                {github && (
                  <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                    <Icon name="GitHub" />
                  </a>
                )}
                {external &&
                  (externalIsInternal ? (
                    <Link to={external} aria-label="Read Article" className="external">
                      <Icon name="External" />
                    </Link>
                  ) : (
                    <a
                      href={external}
                      aria-label="External Link"
                      className="external"
                      target="_blank"
                      rel="noreferrer">
                      <Icon name="External" />
                    </a>
                  ))}
              </div>
            </div>

            <h3 className="project-title">
              {primaryIsInternal ? (
                <Link to={primaryHref}>{title}</Link>
              ) : (
                <a href={primaryHref} target="_blank" rel="noreferrer">
                  {title}
                </a>
              )}
            </h3>

            <div className="project-description">
              <p>{description}</p>
            </div>
          </header>

          <footer>
            {tech && (
              <ul className="project-tech-list">
                {tech.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </footer>
        </div>
      </div>
    );
  };

  return (
    <StyledProjectsSection id="projects">
      <h2 ref={revealTitle}>Other Noteworthy Projects</h2>

      <Link className="inline-link archive-link" to="/archive" ref={revealArchiveLink}>
        view all selected work
      </Link>

      <ul className="projects-grid">
        {prefersReducedMotion ? (
          <>
            {projectsToShow.map((project, i) => (
              <StyledProject key={i}>{projectInner(project)}</StyledProject>
            ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {projectsToShow.map((project, i) => (
              <CSSTransition
                key={i}
                classNames="fadeup"
                timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                exit={false}>
                <StyledProject
                  key={i}
                  ref={el => (revealProjects.current[i] = el)}
                  style={{
                    transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                  }}>
                  {projectInner(project)}
                </StyledProject>
              </CSSTransition>
            ))}
          </TransitionGroup>
        )}
      </ul>

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>
    </StyledProjectsSection>
  );
};

export default Projects;
