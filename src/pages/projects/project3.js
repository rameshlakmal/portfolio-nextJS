import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Layout } from '@components';

import cover from '../../images/project3/cover.png';
import jmeterDownload from '../../images/project3/jmeterdownload.png';
import influxDownload from '../../images/project3/InfluxDownload.png';
import influxPort from '../../images/project3/influxportnumber.png';
import initialUser from '../../images/project3/inital user.png';
import grafanaDownload from '../../images/project3/grafanadownload.png';
import grafanaQuery from '../../images/project3/grafanaquery.png';

const StyledMain = styled.main`
  max-width: 1000px;

  li {
    margin-bottom: 10px;
  }

  .back {
    margin-bottom: 24px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--light-slate);
  }

  .back a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  header {
    margin-bottom: 22px;
  }

  h1 {
    margin: 0 0 12px;
    font-size: clamp(30px, 4.4vw, 48px);
    line-height: 1.1;
  }

  .lede {
    margin: 0;
    max-width: 72ch;
    color: var(--light-slate);
    font-size: var(--fz-lg);
    line-height: 1.7;
  }

  .hero {
    ${({ theme }) => theme.mixins.glass};
    ${({ theme }) => theme.mixins.boxShadow};
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid var(--glass-border);
    margin: 28px 0 18px;
  }

  .hero img {
    display: block;
    width: 100%;
    height: auto;
  }

  .top-actions {
    display: flex;
    justify-content: center;
    margin: 12px 0 26px;
  }

  .jump {
    ${({ theme }) => theme.mixins.button};
  }

  .meta {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
    margin: 0 0 18px;
  }

  .card {
    ${({ theme }) => theme.mixins.glass};
    border: 1px solid var(--glass-border);
    border-radius: 14px;
    padding: 18px 18px 16px;
  }

  .card h2 {
    margin: 0 0 10px;
    font-size: 18px;
    color: var(--lightest-slate);
  }

  .card ul {
    margin: 0;
    padding-left: 18px;
  }

  .card a {
    ${({ theme }) => theme.mixins.inlineLink};
  }

  .card p {
    margin-top: 12px;
  }

  article {
    margin-top: 10px;
    color: var(--slate);
    line-height: 1.75;
  }

  article h1 {
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: clamp(28px, 3.6vw, 40px);
  }

  article h2 {
    margin-top: 42px;
    margin-bottom: 10px;
    font-size: 26px;
  }

  article h3 {
    margin-top: 18px;
    margin-bottom: 8px;
    font-size: 20px;
  }

  article hr {
    margin: 26px 0;
  }

  .img {
    ${({ theme }) => theme.mixins.boxShadow};
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    margin: 18px 0;
  }

  .img img {
    display: block;
    width: 100%;
    height: auto;
  }

  blockquote {
    ${({ theme }) => theme.mixins.glass};
    border-left: 2px solid var(--green);
    border-radius: 12px;
    padding: 14px 16px;
    margin: 18px 0;
  }

  blockquote p {
    margin: 0;
    font-style: normal;
    font-size: var(--fz-lg);
    color: var(--light-slate);
  }

  .video {
    ${({ theme }) => theme.mixins.boxShadow};
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    margin: 18px 0;
    background: var(--dark-navy);
  }

  .video-inner {
    position: relative;
    padding-top: 56.25%;
  }

  .video iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }

  .center {
    text-align: center;
  }
`;

const Project3ArticlePage = ({ location }) => (
  <Layout location={location}>
    <Helmet>
      <title>Performance Monitoring Using JMeter + InfluxDB + Grafana</title>
      <meta
        name="description"
        content="How to set up JMeter, InfluxDB, and Grafana locally for real-time performance monitoring."
      />
    </Helmet>

    <StyledMain>
      <div className="back">
        <a href="/">Back to home</a>
      </div>

      <header>
        <h1>Performance Monitoring Using JMeter + InfluxDB + Grafana</h1>
        <p className="lede">
          A simple local setup to stream JMeter metrics into InfluxDB and visualize results in
          Grafana dashboards.
        </p>
      </header>

      <div className="hero">
        <img src={cover} alt="Performance monitoring cover" loading="eager" />
      </div>

      <div className="top-actions">
        <a className="jump" href="#article">
          See more
        </a>
      </div>

      <div className="meta">
        <div className="card">
          <h2>Project information</h2>
          <ul>
            <li>
              <strong>Tech Stack</strong>: JMeter | InfluxDB | Grafana
            </li>
            <li>
              <strong>LinkedIn Article</strong>:{' '}
              <a
                href="https://www.linkedin.com/pulse/copy-how-set-up-jmeter-influxdb-grafana-locally-ramesh-lakmal-b9wsc/"
                target="_blank"
                rel="noreferrer">
                Performance Monitoring Using JMeter + InfluxDB + Grafana
              </a>
            </li>
          </ul>
        </div>

        <div className="card">
          <h2>Overview</h2>
          <p>
            This article walks through a simple local setup for real-time performance monitoring:
            JMeter streams test metrics into InfluxDB, and Grafana visualizes the data in dashboards
            so you can spot trends and issues faster.
          </p>

          <p>What you will set up:</p>
          <ul>
            <li>Configuring JMeter to send test data to InfluxDB using a Backend Listener</li>
            <li>Setting up InfluxDB to store performance test metrics</li>
            <li>Connecting Grafana to InfluxDB and creating dashboards to display the data</li>
          </ul>

          <p>
            It is a foundational setup that you can extend and customize based on your testing
            needs.
          </p>
        </div>
      </div>

      <article>
        <div id="article" />

        <h1>
          <b>How to Set Up JMeter, InfluxDB, and Grafana Locally for Performance Monitoring</b>
        </h1>

        <h2>Introduction</h2>
        <p>
          When it comes to performance testing, it is not just about running the tests. It is also
          about understanding the results. That is where data visualization helps. Instead of
          working through raw numbers, dashboards help you view test results in real time and spot
          trends or issues quickly.
        </p>
        <p>
          In this article, you will take JMeter performance test results and display them in a
          Grafana dashboard. To do that, InfluxDB is used as the database for storing test data, and
          Grafana is used to build interactive visualizations.
        </p>
        <p>
          Whether you are new to performance testing or you want better reporting, these steps will
          help you set everything up locally. By the end, you will have a working setup to monitor
          and analyze your results.
        </p>

        <hr />

        <h2>1. Prerequisites</h2>
        <p>
          Before we start, make sure you have downloaded JMeter and you have a sample JMeter test
          script ready.
        </p>

        <h3>1.1 JMeter installation and create a test script</h3>
        <ul>
          <li>
            <a
              href="https://jmeter.apache.org/download_jmeter.cgi"
              target="_blank"
              rel="noreferrer">
              Download
            </a>{' '}
            JMeter and extract it to a location of your choice.
          </li>
        </ul>

        <div className="img">
          <img src={jmeterDownload} className="img-fluid" alt="JMeter download" loading="lazy" />
        </div>

        <ul>
          <li>Create a sample JMeter test script.</li>
        </ul>

        <p>
          <a
            href="https://github.com/rameshlakmal/Jmeter-githubActions-influxdb-grafana"
            target="_blank"
            rel="noreferrer">
            This GitHub repository
          </a>{' '}
          contains sample test scripts for creating an employee in the{' '}
          <a
            href="https://opensource-demo.orangehrmlive.com/web/index.php/auth/login"
            target="_blank"
            rel="noreferrer">
            OrangeHRM demo website
          </a>
          .
        </p>

        <hr />

        <h1>2. Setting up the environment</h1>

        <h2>2.1 Installing InfluxDB</h2>
        <ul>
          <li>
            Go to the{' '}
            <a href="https://www.influxdata.com/downloads/" target="_blank" rel="noreferrer">
              InfluxDB download page
            </a>
            .
          </li>
          <li>Select the version and platform you want to download.</li>
          <li>
            Copy the installation command and execute it using PowerShell. It will download InfluxDB
            and install it in <i>"C:\Program Files\InfluxData\influxdb\"</i>.
          </li>
        </ul>

        <div className="img">
          <img src={influxDownload} className="img-fluid" alt="InfluxDB download" loading="lazy" />
        </div>

        <p>
          Or you can{' '}
          <a
            href="https://docs.influxdata.com/influxdb/v2/install/?t=Windows+Powershell#set-up-influxdb"
            target="_blank"
            rel="noreferrer">
            download separately
          </a>{' '}
          and extract it to <i>"C:\Program Files\InfluxData\"</i>.
        </p>

        <ul>
          <li>
            Go to the location where InfluxDB is extracted and run the executable using Command
            Prompt. Once it starts, it will display the port numbers for local access.
          </li>
        </ul>

        <div className="img">
          <img src={influxPort} className="img-fluid" alt="InfluxDB port numbers" loading="lazy" />
        </div>

        <ul>
          <li>
            Open your browser and navigate to{' '}
            <a href="http://localhost:8086" target="_blank" rel="noreferrer">
              http://localhost:8086
            </a>
            .
          </li>
          <li>
            If this is your first time opening the InfluxDB web interface, it will prompt you to
            create an initial user. After setup, an API token is generated (or you can create your
            own later). Store it securely for future use.
          </li>
        </ul>

        <div className="img">
          <img src={initialUser} className="img-fluid" alt="InfluxDB initial user" loading="lazy" />
        </div>

        <ul>
          <li>
            After clicking Continue, you will be redirected to the final step. Click Quick Start to
            open the InfluxDB dashboard.
          </li>
        </ul>

        <div className="video" aria-label="InfluxDB quick start video">
          <div className="video-inner">
            <iframe
              src="https://player.vimeo.com/video/1040492567?badge=0&autopause=0&player_id=0&app_id=58479&portrait=0&title=1&byline=0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              loading="lazy"
              title="InfluxDB quick start"
            />
          </div>
        </div>

        <hr />

        <h2>2.2 Installing Grafana</h2>
        <ul>
          <li>
            Navigate to the{' '}
            <a
              href="https://grafana.com/grafana/download?platform=windows"
              target="_blank"
              rel="noreferrer">
              Grafana Download page
            </a>
            .
          </li>
          <li>Select the platform you want to download.</li>
          <li>Download the Grafana installer and install it.</li>
        </ul>

        <div className="img">
          <img src={grafanaDownload} className="img-fluid" alt="Grafana download" loading="lazy" />
        </div>

        <ul>
          <li>After installation, Grafana will run as a service.</li>
          <li>
            Open your browser and navigate to{' '}
            <a href="http://localhost:3000" target="_blank" rel="noreferrer">
              http://localhost:3000
            </a>
            .
          </li>
          <li>Enter "admin" for both username and password.</li>
          <li>Click Login to navigate to the home page.</li>
        </ul>

        <div className="video" aria-label="Grafana login video">
          <div className="video-inner">
            <iframe
              src="https://player.vimeo.com/video/1040498278?badge=0&autopause=0&player_id=0&app_id=58479&portrait=0&title=1&byline=0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              loading="lazy"
              title="Grafana login"
            />
          </div>
        </div>

        <hr />

        <h1>3. Configuring JMeter to Send Data to InfluxDB</h1>
        <ul>
          <li>Open JMeter with a sample test script, or create a new test script.</li>
        </ul>

        <blockquote>
          <p>
            Tip: If you are creating a new test script, use the BlazeMeter Auto Correlation
            Recording Plugin. It can identify dynamic values and handle them automatically.
          </p>
        </blockquote>

        <ul>
          <li>Add a Backend Listener to the Thread Group and configure it.</li>
        </ul>

        <ol>
          <li>
            Change Backend Listener implementation to the third option in the list:{' '}
            <i>"org.apache.jmeter.visualizers.backend.influxdb.InfluxdbBackendListenerClient"</i>.
          </li>
          <li>
            Update influxdbUrl to the InfluxDB Write API (POST{' '}
            <a href="http://localhost:8086/api/v2/write" target="_blank" rel="noreferrer">
              http://localhost:8086/api/v2/write
            </a>
            ).
          </li>
          <li>
            Provide the organization name and bucket name created during the InfluxDB setup as query
            parameters:{' '}
            <a
              href="http://localhost:8086/api/v2/write?org=[organization_name]&bucket=[bucket_name]"
              target="_blank"
              rel="noreferrer">
              http://localhost:8086/api/v2/write?org=[organization_name]&bucket=[bucket_name]
            </a>
            .
          </li>
          <li>
            Example:{' '}
            <a
              href="http://localhost:8086/api/v2/write?org=JIG&bucket=jmeter"
              target="_blank"
              rel="noreferrer">
              http://localhost:8086/api/v2/write?org=JIG&bucket=jmeter
            </a>
            .
          </li>
          <li>Add your API token as an additional parameter (from the InfluxDB initial setup).</li>
          <li>Click Add at the bottom of the Backend Listener to create a new field.</li>
          <li>
            In the new field, enter <i>influxdbToken</i> as the name (case-sensitive).
          </li>
          <li>Set the value to your API token and save.</li>
          <li>
            You can optionally change the application name and test title, but it is not mandatory.
          </li>
          <li>Run your test.</li>
        </ol>

        <div className="video" aria-label="JMeter backend listener setup video">
          <div className="video-inner">
            <iframe
              src="https://player.vimeo.com/video/1040504941?badge=0&autopause=0&player_id=0&app_id=58479&portrait=0&title=1&byline=0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              loading="lazy"
              title="JMeter backend listener"
            />
          </div>
        </div>

        <ul>
          <li>Go to InfluxDB and navigate to Data Explorer.</li>
          <li>Select your bucket.</li>
          <li>
            Select jmeter under the measurement filter. If you changed the default measurement name
            in the Backend Listener, the updated name will appear here.
          </li>
          <li>The next field will show all the data being sent from JMeter to InfluxDB.</li>
          <li>
            Select the data you want to display and submit. InfluxDB will present the selected data
            as a graph.
          </li>
        </ul>

        <div className="video" aria-label="InfluxDB data explorer video">
          <div className="video-inner">
            <iframe
              src="https://player.vimeo.com/video/1040507025?badge=0&autopause=0&player_id=0&app_id=58479&portrait=0&title=1&byline=0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              loading="lazy"
              title="InfluxDB data explorer"
            />
          </div>
        </div>

        <blockquote>
          <p>
            What is happening here is: when you add a Backend Listener in JMeter and configure it
            with the InfluxDB API and token, JMeter sends performance metrics to InfluxDB during the
            test. InfluxDB stores this data, and you can later visualize it in tools like Grafana.
          </p>
        </blockquote>

        <hr />

        <h1>4. Setting Up Grafana to Visualize JMeter Data</h1>

        <h2>4.1 Connecting Grafana to InfluxDB</h2>
        <ul>
          <li>Navigate to Grafana.</li>
          <li>Go to Connections -&gt; Data Sources and click Add New Data Source.</li>
          <li>Select InfluxDB as the data source.</li>
          <li>Select query language as Flux.</li>
        </ul>

        <blockquote>
          <p>
            Flux is a data scripting and query language by InfluxData for InfluxDB 2.x. It is
            designed for time series data analysis and uses a functional approach with powerful
            operators and functions.
          </p>
        </blockquote>

        <ul>
          <li>
            Set the HTTP URL to the InfluxDB address (usually http://localhost:8086). If you are
            using Docker, use the container IP. For secured URLs, enable Basic Auth and provide the
            username and password.
          </li>
          <li>Under InfluxDB Details, provide your organization name, bucket name, and token.</li>
          <li>Click Save. If the connection is successful, a success message will appear.</li>
        </ul>

        <div className="video" aria-label="Grafana data source setup video">
          <div className="video-inner">
            <iframe
              src="https://player.vimeo.com/video/1040509508?badge=0&autopause=0&player_id=0&app_id=58479&portrait=0&title=1&byline=0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              loading="lazy"
              title="Grafana data source"
            />
          </div>
        </div>

        <p>
          After successfully connecting InfluxDB to Grafana, you can visualize the data stored in
          InfluxDB.
        </p>

        <hr />

        <h2>4.2 Create Custom Dashboards</h2>
        <ul>
          <li>Navigate to Explore.</li>
          <li>Select your data source from the dropdown at the top of the screen.</li>
          <li>
            Click Sample Query and select Simple Query. This shows a basic Flux query that retrieves
            data from a specific measurement and field within the last hour from the selected
            bucket.
          </li>
        </ul>

        <div className="img">
          <img src={grafanaQuery} className="img-fluid" alt="Grafana sample query" loading="lazy" />
        </div>

        <ul>
          <li>
            Update the bucket name and measurement name (it should be jmeter if it was not modified
            in the JMeter Backend Listener), then select the field or fields you want to retrieve.
          </li>
          <li>
            After updating the query, run your test plan and then run the query. The selected field
            data will be displayed as a real-time graph.
          </li>
        </ul>

        <div className="video" aria-label="Grafana explore graph video">
          <div className="video-inner">
            <iframe
              src="https://player.vimeo.com/video/1040705234?badge=0&autopause=0&player_id=0&app_id=58479&portrait=0&title=1&byline=0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              loading="lazy"
              title="Grafana explore graph"
            />
          </div>
        </div>

        <ul>
          <li>
            Save this graph to a dashboard by clicking Add to Dashboard. You can view saved
            dashboards on the dashboard screen and add more graphs to the same dashboard.
          </li>
        </ul>

        <div className="video" aria-label="Add to dashboard video">
          <div className="video-inner">
            <iframe
              src="https://player.vimeo.com/video/1040706011?badge=0&autopause=0&player_id=0&app_id=58479&portrait=0&title=1&byline=0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              loading="lazy"
              title="Add to dashboard"
            />
          </div>
        </div>

        <hr />

        <h2>4.3 Create Dashboards Using Dashboard Templates</h2>
        <ul>
          <li>
            Navigate to{' '}
            <a href="https://grafana.com/grafana/dashboards/" target="_blank" rel="noreferrer">
              Grafana Dashboards
            </a>
            .
          </li>
          <li>Select a dashboard to display JMeter performance metrics.</li>
          <li>
            Copy the dashboard ID or download the JSON file. You can import the dashboard using
            either option.
          </li>
          <li>Navigate back to Grafana.</li>
          <li>Go to Dashboards and click Import.</li>
          <li>Provide the dashboard ID or upload the JSON file, then click Load.</li>
          <li>
            Update the dashboard name and folder path (if applicable), select the data source, and
            click Import.
          </li>
        </ul>

        <div className="video" aria-label="Import dashboard video">
          <div className="video-inner">
            <iframe
              src="https://player.vimeo.com/video/1040708154?badge=0&autopause=0&player_id=0&app_id=58479&portrait=0&title=1&byline=0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              loading="lazy"
              title="Import dashboard"
            />
          </div>
        </div>

        <hr />

        <h1>5. Summary</h1>
        <p>
          This article covered the basics of setting up a pipeline to visualize performance test
          data using JMeter, InfluxDB, and Grafana. While this is a foundational setup, it opens the
          door to useful insights by turning raw performance metrics into visual, actionable data.
        </p>
        <p>
          Feel free to explore further by tweaking queries, adding more complex graphs, and
          customizing dashboards. Experimenting with Flux queries can help you create dashboards
          that match your needs.
        </p>
        <p>
          In the next article, we can take this further with more advanced configurations. This is
          just the beginning. Stay curious and keep experimenting.
        </p>

        <hr />

        <h1>6. Reference</h1>
        <ul>
          <li>
            <a
              href="https://grafana.com/grafana/dashboards/?search=jmeter"
              target="_blank"
              rel="noreferrer">
              https://grafana.com/grafana/dashboards/?search=jmeter
            </a>
          </li>
          <li>
            <a
              href="https://grafana.com/docs/grafana/latest/getting-started/get-started-grafana-influxdb/"
              target="_blank"
              rel="noreferrer">
              https://grafana.com/docs/grafana/latest/getting-started/get-started-grafana-influxdb/
            </a>
          </li>
          <li>
            <a
              href="https://jmeter.apache.org/usermanual/realtime-results.html"
              target="_blank"
              rel="noreferrer">
              https://jmeter.apache.org/usermanual/realtime-results.html
            </a>
          </li>
          <li>
            <a
              href="https://docs.influxdata.com/flux/v0/get-started/"
              target="_blank"
              rel="noreferrer">
              https://docs.influxdata.com/flux/v0/get-started/
            </a>
          </li>
        </ul>

        <h2 className="center">Happy testing!</h2>
      </article>
    </StyledMain>
  </Layout>
);

export default Project3ArticlePage;
