import clsx from 'clsx';
import { useState } from 'react';

import {
  GitHubIcon,
  JavaIcon,
  MavenIcon,
  NextJsIcon,
  NpmIcon,
  TailwindCssIcon,
} from '@/components/Icons';
import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
import SectionTitle from '@/components/sections/SectionTitle';
import AppWindow from '@/components/wireframes/AppWindow';
import GitHubWireframe from '@/components/wireframes/GitHub';
import GitHubPackageWireframe from '@/components/wireframes/GithubPackage';
import NpmWireframe from '@/components/wireframes/Npm';

import Accordion from './Accordian';

function generateDependency(
  groupId: string,
  artifactId: string,
  version: string
): string {
  return `
    <dependency>
      <groupId>${groupId}</groupId>
      <artifactId>${artifactId}</artifactId>
      <version>${version}</version>
    </dependency>
  `;
}

function ProjectsContents() {
  const [currentState, setCurrentState] = useState<'npm' | 'github' | 'maven'>(
    'github'
  );
  const [openAccordion, setOpenAccordion] = useState(0);

  const handleAccordionClick = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="content-wrapper">
      <Accordion
        title="Ntfy-Java"
        isOpen={openAccordion === 0}
        onClick={() => handleAccordionClick(0)}
        index={1}
        icons={[
          <JavaIcon
            className={clsx(
              'h-5 w-5 transition duration-200 hover:text-[#cf0202]'
            )}
          />,
          <MavenIcon
            className={clsx(
              'h-6 w-6 transition duration-200 hover:text-[#961754]'
            )}
          />,
        ]}
        progress={60}
      >
        <SectionTitle
          title="Ntfy-Java"
          caption="Java"
          description="Java library for publishing/receiving messages from a ntfy server.
          ntfy (pronounce: notify) is a simple HTTP-based pub-sub notification service.
          ntfy-java is a Java wrapper for this service. The workflow is to replicate the GET/POST calls to ntfy-based servers and provide a neat way to create a client/streaming service to send/receive notifications."
          buttons={[
            {
              title: 'learn more',
              href: 'https://github.com/MaheshBabu11/ntfy-java',
            },
          ]}
        />
        <SectionContent>
          <div className={clsx('flex', 'lg:gap-12')}>
            <div
              className={clsx('hidden flex-1 flex-col gap-3 pt-8', 'lg:flex')}
            >
              <div className={clsx('flex flex-col gap-3')}>
                <SectionButton
                  title="Available on GitHub"
                  icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
                  description="Access powerful and flexible package on GitHub with MIT license."
                  active={currentState === 'github'}
                  onClick={() => setCurrentState('github')}
                />
                <SectionButton
                  title="Maven package"
                  icon={<MavenIcon className={clsx('my-2 h-16 w-16')} />}
                  description="Install and use the package with ease from github maven artifactory."
                  active={currentState === 'maven'}
                  onClick={() => setCurrentState('maven')}
                />
              </div>
            </div>
            <div className={clsx('w-full', 'lg:w-auto')}>
              <div className={clsx('-mt-[41px]')}>
                <div className={clsx('w-full', 'lg:h-[400px] lg:w-[600px]')}>
                  <AppWindow
                    type="browser"
                    browserTabs={[
                      {
                        icon: <GitHubIcon className="h-4 w-4" />,
                        title: 'MaheshBabu11/ntfy-java - GitHub',
                        isActive: currentState === 'github',
                      },
                      {
                        icon: <MavenIcon className="h-4 w-4" />,
                        title: 'com.github.maheshbabu11.ntfy.java',
                        isActive: currentState === 'maven',
                      },
                    ]}
                  >
                    {currentState === 'github' && (
                      <GitHubWireframe
                        author="MaheshBabu11"
                        license="Apache-2.0 license"
                        repository="ntfy-java"
                        description="This is a java client that is used for publishing notifications using NTFY."
                      />
                    )}
                    {currentState === 'maven' && (
                      <GitHubPackageWireframe
                        packageName="com.github.maheshbabu11.ntfy.java"
                        version="1.0.0 SNAPSHOT"
                        dependency={generateDependency(
                          'com.github.maheshbabu11',
                          'ntfy.java',
                          '1.0.0-SNAPSHOT'
                        )}
                      />
                    )}
                  </AppWindow>
                </div>
              </div>
            </div>
          </div>
        </SectionContent>
      </Accordion>
      <Accordion
        title="Excel2DataMap"
        isOpen={openAccordion === 1}
        onClick={() => handleAccordionClick(1)}
        index={2}
        icons={[
          <JavaIcon
            className={clsx(
              'h-5 w-5 transition duration-200 hover:text-[#cf0202]'
            )}
          />,
          <MavenIcon
            className={clsx(
              'h-6 w-6 transition duration-200 hover:text-[#961754]'
            )}
          />,
        ]}
        progress={100}
      >
        <SectionTitle
          title="Excel2DataMap"
          caption="Java"
          description="This is a java package that is used to convert Excel files from various formats like .xls,xls,csv to datamaps so that they can be directly used to insert data into database tables."
          buttons={[
            {
              title: 'learn more',
              href: 'https://github.com/MaheshBabu11/Excel2DataMap',
            },
          ]}
        />
        <SectionContent>
          <div className={clsx('flex', 'lg:gap-12')}>
            <div
              className={clsx('hidden flex-1 flex-col gap-3 pt-8', 'lg:flex')}
            >
              <div className={clsx('flex flex-col gap-3')}>
                <SectionButton
                  title="Available on GitHub"
                  icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
                  description="Access powerful and flexible package on GitHub with MIT license."
                  active={currentState === 'github'}
                  onClick={() => setCurrentState('github')}
                />
                <SectionButton
                  title="Maven package"
                  icon={<MavenIcon className={clsx('my-2 h-16 w-16')} />}
                  description="Install and use the package with ease from github maven artifactory."
                  active={currentState === 'maven'}
                  onClick={() => setCurrentState('maven')}
                />
              </div>
            </div>
            <div className={clsx('w-full', 'lg:w-auto')}>
              <div className={clsx('-mt-[41px]')}>
                <div className={clsx('w-full', 'lg:h-[400px] lg:w-[600px]')}>
                  <AppWindow
                    type="browser"
                    browserTabs={[
                      {
                        icon: <GitHubIcon className="h-4 w-4" />,
                        title: 'MaheshBabu11/Excel2DataMap - GitHub',
                        isActive: currentState === 'github',
                      },
                      {
                        icon: <MavenIcon className="h-4 w-4" />,
                        title: 'com.github.maheshbabu11.excel2datamap',
                        isActive: currentState === 'maven',
                      },
                    ]}
                  >
                    {currentState === 'github' && (
                      <GitHubWireframe
                        author="MaheshBabu11"
                        license="Apache-2.0 license"
                        repository="Excel2DataMap"
                        description="This is a java package for converting excel files to datamaps."
                      />
                    )}
                    {currentState === 'maven' && (
                      <GitHubPackageWireframe
                        packageName="com.github.maheshbabu11.excel2datamap"
                        version="1.0.0 SNAPSHOT"
                        dependency={generateDependency(
                          'com.github.maheshbabu11',
                          'excel2datamap',
                          '1.0.0-SNAPSHOT'
                        )}
                      />
                    )}
                  </AppWindow>
                </div>
              </div>
            </div>
          </div>
        </SectionContent>
      </Accordion>
      <Accordion
        title="Code-Coffee-Repeat"
        isOpen={openAccordion === 2}
        onClick={() => handleAccordionClick(2)}
        index={3}
        icons={[
          <NextJsIcon
            className={clsx(
              'h-5 w-5 transition duration-200 hover:text-[#000000] dark:hover:text-[#FFFFFF]'
            )}
          />,
          <TailwindCssIcon
            className={clsx(
              'h-5 w-5 transition duration-200 hover:text-[#06B6D4]'
            )}
          />,
        ]}
        progress={100}
      >
        <SectionTitle
          title="Code-Coffee-Repeat"
          caption="Next JS"
          description="This is a Next.js, Tailwind CSS blog about java, spring boot, programming, web development and everything else.It is based on Next App directory with React Server Component and uses Contentlayer to manage markdown content."
          buttons={[
            {
              title: 'learn more',
              href: 'https://github.com/MaheshBabu11/personal-blog',
            },
            {
              title: 'Live Demo',
              href: 'https://blog.maheshbabu11.dev/',
            },
          ]}
        />
        <SectionContent>
          <div className={clsx('flex', 'lg:gap-12')}>
            <div
              className={clsx('hidden flex-1 flex-col gap-3 pt-8', 'lg:flex')}
            >
              <div className={clsx('flex flex-col gap-3')}>
                <SectionButton
                  title="Available on GitHub"
                  icon={<GitHubIcon className={clsx('my-2 h-16 w-16')} />}
                  description="Access powerful and flexible package on GitHub with MIT license."
                  active={currentState === 'github'}
                  onClick={() => setCurrentState('github')}
                />
              </div>
            </div>
            <div className={clsx('w-full', 'lg:w-auto')}>
              <div className={clsx('-mt-[41px]')}>
                <div className={clsx('w-full', 'lg:h-[400px] lg:w-[600px]')}>
                  <AppWindow
                    type="browser"
                    browserTabs={[
                      {
                        icon: <GitHubIcon className="h-4 w-4" />,
                        title: 'MaheshBabu11/personal-blog - GitHub',
                        isActive: currentState === 'github',
                      },
                    ]}
                  >
                    {currentState === 'github' && (
                      <GitHubWireframe
                        author="MaheshBabu11"
                        license="Apache-2.0 license"
                        repository="personal-blog"
                        description="This is my tech blog that where I write about java, spring boot, programming, web development and everything else."
                      />
                    )}
                  </AppWindow>
                </div>
              </div>
            </div>
          </div>
        </SectionContent>
      </Accordion>
    </div>
  );
}

export default ProjectsContents;
