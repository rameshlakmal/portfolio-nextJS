import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { jobs as jobsData, education, certifications } from '../../data/portfolio';

const StyledJobsSection = styled.section`
  max-width: 700px;

  .view-tabs {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0;
    margin: 10px 0 30px;
  }

  .view-sep {
    display: none;
  }

  .view-tab {
    ${({ theme }) => theme.mixins.flexCenter};
    position: relative;
    height: 38px;
    padding: 0 12px;
    border-radius: 10px;
    background: transparent;
    border: 0;
    color: var(--slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: var(--transition);
  }

  .view-tab:after {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 6px;
    height: 2px;
    border-radius: 999px;
    background: rgba(var(--accent-rgb), 0.95);
    transform: scaleX(0);
    transform-origin: 50% 50%;
    opacity: 0;
    transition: transform 220ms var(--easing), opacity 220ms var(--easing);
  }

  .view-tab.is-active {
    color: var(--white);
  }

  .view-tab.is-active:after {
    transform: scaleX(1);
    opacity: 1;
  }

  .view-tab:hover,
  .view-tab:focus-visible {
    outline: 0;
    color: var(--white);
    box-shadow: none;
  }

  .view-tab:hover:after,
  .view-tab:focus-visible:after {
    transform: scaleX(1);
    opacity: 0.9;
  }

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    width: 100%;
    padding: 0;
    margin-left: 0;
    margin-bottom: 30px;
  }

  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 0;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 0;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: var(--glass-bg);
    background-image: var(--glass-sheen);
    opacity: 0;
    transition: opacity 240ms var(--easing);
    pointer-events: none;
  }

  span {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }
  @media (max-width: 600px) {
    justify-content: flex-start;
    align-items: flex-start;
    min-height: 58px;
    padding: 14px 16px;
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    text-align: left;
    white-space: normal;
    line-height: 1.5;
  }

  &:hover,
  &:focus {
    &:before {
      opacity: 1;
    }
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: var(--border-radius);
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  will-change: transform;
  transition: transform 360ms var(--easing);

  @media (max-width: 600px) {
    display: none;
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    @media (max-width: 480px) {
      font-size: 20px;
    }

    .company {
      color: var(--green);

      @media (max-width: 480px) {
        display: block;
        margin-top: 4px;
      }
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .related-links {
    margin: -12px 0 22px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  .related-links a {
    ${({ theme }) => theme.mixins.inlineLink};
    margin-right: 14px;
    margin-bottom: 8px;
  }
`;

const Jobs = () => {
  const [activeView, setActiveView] = useState('experience');
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);

  const [activeEduTabId, setActiveEduTabId] = useState(0);
  const [eduTabFocus, setEduTabFocus] = useState(null);
  const eduTabs = useRef([]);

  const educationItems = useMemo(
    () => [
      ...education.map(item => ({
        type: 'education',
        label: item.institution,
        title: item.program,
        range: item.range,
        meta: item.institution,
        specialization: item.specialization,
      })),
      ...certifications.map(item => ({
        type: 'certification',
        label: 'ISTQB',
        title: item.title,
        range: item.date,
        meta: item.issuer,
        url: item.url,
      })),
    ],
    [],
  );
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const focusTab = () => {
    if (activeView === 'experience') {
      if (tabs.current[tabFocus]) {
        tabs.current[tabFocus].focus();
        return;
      }
      if (tabFocus >= tabs.current.length) {
        setTabFocus(0);
      }
      if (tabFocus < 0) {
        setTabFocus(tabs.current.length - 1);
      }
      return;
    }

    if (activeView === 'education') {
      if (eduTabs.current[eduTabFocus]) {
        eduTabs.current[eduTabFocus].focus();
        return;
      }
      if (eduTabFocus >= eduTabs.current.length) {
        setEduTabFocus(0);
      }
      if (eduTabFocus < 0) {
        setEduTabFocus(eduTabs.current.length - 1);
      }
    }
  };

  useEffect(() => focusTab(), [tabFocus, eduTabFocus, activeView]);

  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        if (activeView === 'experience') {
          setTabFocus(tabFocus - 1);
        }
        if (activeView === 'education') {
          setEduTabFocus(eduTabFocus - 1);
        }
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        if (activeView === 'experience') {
          setTabFocus(tabFocus + 1);
        }
        if (activeView === 'education') {
          setEduTabFocus(eduTabFocus + 1);
        }
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Experience &amp; Education</h2>

      <div className="view-tabs" role="tablist" aria-label="Experience and education">
        <button
          type="button"
          className={`view-tab ${activeView === 'experience' ? 'is-active' : ''}`}
          onClick={() => setActiveView('experience')}
          role="tab"
          aria-selected={activeView === 'experience'}>
          Experience
        </button>

        <span className="view-sep" aria-hidden="true">
          |
        </span>

        <button
          type="button"
          className={`view-tab ${activeView === 'education' ? 'is-active' : ''}`}
          onClick={() => setActiveView('education')}
          role="tab"
          aria-selected={activeView === 'education'}>
          Education
        </button>
      </div>

      {activeView === 'experience' ? (
        <div className="inner">
          <StyledTabList role="tablist" aria-label="Job tabs" onKeyDown={e => onKeyDown(e)}>
            {jobsData.map(({ company }, i) => (
              <StyledTabButton
                key={i}
                isActive={activeTabId === i}
                onClick={() => setActiveTabId(i)}
                ref={el => (tabs.current[i] = el)}
                id={`tab-${i}`}
                role="tab"
                tabIndex={activeTabId === i ? '0' : '-1'}
                aria-selected={activeTabId === i}
                aria-controls={`panel-${i}`}>
                <span>{company}</span>
              </StyledTabButton>
            ))}
            <StyledHighlight activeTabId={activeTabId} />
          </StyledTabList>

          <StyledTabPanels>
            {jobsData.map(({ title, url, company, range, bullets, relatedLinks }, i) => (
              <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                <StyledTabPanel
                  id={`panel-${i}`}
                  role="tabpanel"
                  tabIndex={activeTabId === i ? '0' : '-1'}
                  aria-labelledby={`tab-${i}`}
                  aria-hidden={activeTabId !== i}
                  hidden={activeTabId !== i}>
                  <h3>
                    <span>{title}</span>
                    <span className="company">
                      &nbsp;@&nbsp;
                      <a href={url} className="inline-link">
                        {company}
                      </a>
                    </span>
                  </h3>

                  <p className="range">{range}</p>

                  {relatedLinks?.length > 0 && (
                    <div className="related-links" aria-label="Related links">
                      {relatedLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          className="inline-link"
                          target="_blank"
                          rel="noreferrer">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}

                  <ul>
                    {bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                </StyledTabPanel>
              </CSSTransition>
            ))}
          </StyledTabPanels>
        </div>
      ) : (
        <div className="inner">
          <StyledTabList role="tablist" aria-label="Education tabs" onKeyDown={e => onKeyDown(e)}>
            {educationItems.map(({ label }, i) => (
              <StyledTabButton
                key={i}
                isActive={activeEduTabId === i}
                onClick={() => setActiveEduTabId(i)}
                ref={el => (eduTabs.current[i] = el)}
                id={`edu-tab-${i}`}
                role="tab"
                tabIndex={activeEduTabId === i ? '0' : '-1'}
                aria-selected={activeEduTabId === i}
                aria-controls={`edu-panel-${i}`}>
                <span>{label}</span>
              </StyledTabButton>
            ))}
            <StyledHighlight activeTabId={activeEduTabId} />
          </StyledTabList>

          <StyledTabPanels>
            {educationItems.map((item, i) => (
              <CSSTransition key={i} in={activeEduTabId === i} timeout={250} classNames="fade">
                <StyledTabPanel
                  id={`edu-panel-${i}`}
                  role="tabpanel"
                  tabIndex={activeEduTabId === i ? '0' : '-1'}
                  aria-labelledby={`edu-tab-${i}`}
                  aria-hidden={activeEduTabId !== i}
                  hidden={activeEduTabId !== i}>
                  <h3>
                    <span>{item.title}</span>
                    {item.meta && (
                      <span className="company">
                        &nbsp;@&nbsp;
                        <span>{item.meta}</span>
                      </span>
                    )}
                  </h3>

                  {item.range && <p className="range">{item.range}</p>}

                  {item.type === 'education' && item.specialization && (
                    <ul>
                      <li>{`Specialization: ${item.specialization}`}</li>
                    </ul>
                  )}

                  {item.type === 'certification' && item.url && (
                    <div className="related-links" aria-label="Certification link">
                      <a href={item.url} className="inline-link" target="_blank" rel="noreferrer">
                        View certificate
                      </a>
                    </div>
                  )}
                </StyledTabPanel>
              </CSSTransition>
            ))}
          </StyledTabPanels>
        </div>
      )}
    </StyledJobsSection>
  );
};

export default Jobs;
