import clsx from 'clsx';
import { useState } from 'react';

import { GitHubIcon, NpmIcon, MavenIcon, JavaIcon } from '@/components/Icons';
import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
import SectionTitle from '@/components/sections/SectionTitle';
import AppWindow from '@/components/wireframes/AppWindow';
import GitHubWireframe from '@/components/wireframes/GitHub';
import NpmWireframe from '@/components/wireframes/Npm';
import GitHubPackageWireframe from '@/components/wireframes/GithubPackage';
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
    <>
      <Accordion
        title="Ntfy-Java"
        isOpen={openAccordion === 0}
        onClick={() => handleAccordionClick(0)}
        index={1}
        icon={<JavaIcon className={clsx('h-5 w-5')} />}
      >
        <SectionTitle
          title="Ntfy-Java"
          caption="Java"
          description="This is a java client that is used for publishing notifications using NTFY."
          button={{
            title: 'learn more',
            href: 'https://github.com/MaheshBabu11/ntfy-java',
          }}
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
                        title: 'github package - Maven',
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
        title="Ntfy-Java"
        isOpen={openAccordion === 1}
        onClick={() => handleAccordionClick(1)}
        index={2}
        icon={<JavaIcon className={clsx('h-5 w-5')} />}
      >
        <SectionTitle
          title="Ntfy-Java"
          caption="Java"
          description="This is a java client that is used for publishing notifications using NTFY."
          button={{
            title: 'learn more',
            href: 'https://github.com/MaheshBabu11/ntfy-java',
          }}
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
                        title: 'github package - Maven',
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
        title="Ntfy-Java"
        isOpen={openAccordion === 2}
        onClick={() => handleAccordionClick(2)}
        index={3}
        icon={<JavaIcon className={clsx('h-5 w-5')} />}
      >
        <SectionTitle
          title="Ntfy-Java"
          caption="Java"
          description="This is a java client that is used for publishing notifications using NTFY."
          button={{
            title: 'learn more',
            href: 'https://github.com/MaheshBabu11/ntfy-java',
          }}
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
                        title: 'github package - Maven',
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
    </>
  );
}

export default ProjectsContents;
