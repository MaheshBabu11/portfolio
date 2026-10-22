import { Button } from '~/components/button';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import technicalSkillIcons from '~/assets/technical-skill-icons.svg';
import {
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
  ProjectSectionHeading,
  ProjectSectionText,
} from '~/layouts/project';
import { baseMeta } from '~/utils/meta';
import styles from './homelab.module.css';

const services = [
  {
    name: 'Paperless-ngx',
    category: 'DOCUMENTS',
    description: 'Document management',
    icon: 'paperless-ngx',
  },
  {
    name: 'Portainer',
    category: 'CONTAINERS',
    description: 'Container management',
    icon: 'portainer',
  },
  {
    name: 'Immich',
    category: 'PHOTOS',
    description: 'Photo and video library',
    icon: 'immich',
  },
  {
    name: 'Vaultwarden',
    category: 'SECURITY',
    description: 'Password management',
    icon: 'vaultwarden',
  },
  {
    name: 'Homarr',
    category: 'DASHBOARD',
    description: 'Homelab dashboard',
    icon: 'homarr',
  },
];

export const meta = () =>
  baseMeta({
    title: 'Homelab',
    description:
      'An overview of my self-hosted services and the monitoring behind my private homelab dashboard.',
  });

export default function HomelabOverview() {
  return (
    <>
      <ProjectContainer className={styles.homelab}>
        <ProjectHeader
          title="Homelab"
          description="A small collection of self-hosted services, with private monitoring for service availability and system health."
        />
        <ProjectSection padding="none">
          <ProjectSectionContent className={styles.overviewContent}>
            <section className={styles.overviewIntro}>
              <div className={styles.overviewCopy}>
                <Text secondary size="s">
                  PERSONAL INFRASTRUCTURE / PRIVATE OBSERVABILITY
                </Text>
                <ProjectSectionText>
                  I run a small collection of self-hosted services for documents,
                  photos, container management, and password management. This page
                  is the public map; live status and host telemetry stay behind
                  sign-in.
                </ProjectSectionText>
                <Button secondary icon="chevron-right" href="/homelab/dashboard">
                  Open private dashboard
                </Button>
              </div>
              <aside className={styles.overviewSnapshot} aria-label="Homelab overview">
                <div className={styles.snapshotHeader}>
                  <span>MONITORING SUMMARY</span>
                  <span className={styles.privateBadge}>PRIVATE DATA</span>
                </div>
                <div className={styles.snapshotMetrics}>
                  <div>
                    <span>Services</span>
                    <strong>{String(services.length).padStart(2, '0')}</strong>
                  </div>
                  <div>
                    <span>Refresh</span>
                    <strong>30s</strong>
                  </div>
                </div>
                <p>Live health and system metrics require sign-in.</p>
              </aside>
            </section>

            <section className={styles.overviewSection} aria-labelledby="homelab-services">
              <div className={styles.overviewSectionHeader}>
                <Text secondary size="s">
                  01 / Services
                </Text>
                <ProjectSectionHeading id="homelab-services">
                  What I run
                </ProjectSectionHeading>
              </div>
              <ul className={styles.overviewServices}>
                {services.map(({ name, category, description, icon }, index) => (
                  <li className={styles.overviewService} key={name}>
                    <div className={styles.serviceCardHeader}>
                      <img
                        className={styles.serviceLogo}
                        src={`https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons@master/svg/${icon}.svg`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                        onError={event => {
                          event.currentTarget.hidden = true;
                        }}
                      />
                      <div className={styles.serviceMeta}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <span>{category}</span>
                      </div>
                    </div>
                    <Heading level={4} as="h3">
                      {name}
                    </Heading>
                    <Text secondary as="p">
                      {description}
                    </Text>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.overviewSection} aria-labelledby="homelab-architecture">
              <div className={styles.overviewSectionHeader}>
                <Text secondary size="s">
                  02 / Network path
                </Text>
                <ProjectSectionHeading id="homelab-architecture">
                  From the internet to the homelab
                </ProjectSectionHeading>
              </div>
              <figure className={styles.networkDiagram}>
                <div className={styles.networkPath}>
                  <div className={`${styles.pathNode} ${styles.internetNode}`}>
                    <span className={styles.pathEyebrow}>PUBLIC REQUEST</span>
                    <svg
                      className={styles.internetGlyph}
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <circle cx="24" cy="24" r="17" />
                      <path d="M7 24h34M24 7c5 5 7 10.5 7 17s-2 12-7 17c-5-5-7-10.5-7-17s2-12 7-17Z" />
                    </svg>
                    <strong>Internet visitor</strong>
                    <Text secondary as="p">
                      Connects over HTTPS
                    </Text>
                  </div>

                  <div className={styles.pathConnector} aria-hidden="true">
                    <span>→</span>
                    <small>HTTPS</small>
                  </div>

                  <div className={`${styles.pathNode} ${styles.cloudflareNode}`}>
                    <span className={styles.pathEyebrow}>EDGE / DNS</span>
                    <svg className={styles.cloudflareLogo} aria-hidden="true">
                      <use href={`${technicalSkillIcons}#cloudflareIcon`} />
                    </svg>
                    <strong>Cloudflare</strong>
                    <Text secondary as="p">
                      Receives and routes the request
                    </Text>
                  </div>

                  <div className={styles.pathConnector} aria-hidden="true">
                    <span>→</span>
                    <small>ROUTED</small>
                  </div>

                  <div className={styles.tunnelBridge}>
                    <div className={styles.tunnelRail} aria-hidden="true">
                      <span>↔</span>
                    </div>
                    <div className={styles.tunnelCopy}>
                      <strong>Cloudflare Tunnel</strong>
                      <small>Established outbound connection</small>
                    </div>
                  </div>

                  <div className={styles.privateConnector} aria-hidden="true">
                    <span>↓</span>
                    <small>PRIVATE ORIGIN</small>
                  </div>

                  <section
                    className={styles.privateZone}
                    aria-label="Private homelab network"
                  >
                    <header className={styles.privateZoneHeader}>
                      <span>PRIVATE NETWORK</span>
                      <strong>Homelab</strong>
                    </header>
                    <div className={styles.originConnector}>
                      <svg
                        className={styles.originGlyph}
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <rect x="8" y="9" width="32" height="12" rx="2" />
                        <rect x="8" y="27" width="32" height="12" rx="2" />
                        <path d="M14 15h.1M14 33h.1M20 15h14M20 33h14" />
                      </svg>
                      <div>
                        <span>ORIGIN CONNECTOR</span>
                        <strong>Tunnel connector</strong>
                      </div>
                    </div>
                    <div className={styles.routeBranch} aria-hidden="true">
                      <span>↓</span>
                      <small>CONFIGURED ROUTES</small>
                    </div>
                    <ul className={styles.originServices}>
                      {services.map(({ name, icon }) => (
                        <li key={name}>
                          <img
                            src={`https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons@master/svg/${icon}.svg`}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                            onError={event => {
                              event.currentTarget.hidden = true;
                            }}
                          />
                          <span>{name}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
                <div className={styles.tunnelCallout}>
                  <span aria-hidden="true">↔</span>
                  <div>
                    <strong>The connector initiates the tunnel</strong>
                    <Text secondary as="p">
                      It opens the outbound connection to Cloudflare; incoming
                      requests then travel through that established connection to
                      the configured services.
                    </Text>
                  </div>
                </div>
                <figcaption className={styles.architectureCaption}>
                  Conceptual routing only. Hostnames, tunnel IDs, ports, and access
                  rules are intentionally omitted.
                </figcaption>
              </figure>
            </section>

            <section className={styles.overviewSection} aria-labelledby="homelab-monitoring">
              <div className={styles.overviewSectionHeader}>
                <Text secondary size="s">
                  03 / Monitoring
                </Text>
                <ProjectSectionHeading id="homelab-monitoring">
                  How monitoring is organized
                </ProjectSectionHeading>
              </div>
              <div className={styles.monitoringDiagram}>
                <div className={styles.monitoringFlow}>
                  <div className={styles.monitoringNode}>
                    <span>SIGNAL 01 / AVAILABILITY</span>
                    <strong>HTTP checks</strong>
                    <Text secondary as="p">
                      Periodic checks for the services listed above
                    </Text>
                  </div>
                  <span className={styles.flowArrow} aria-hidden="true">
                    <span>→</span>
                    <small>SERVER-SIDE</small>
                  </span>
                  <div className={styles.monitoringNode}>
                    <span>PRIVATE VIEW</span>
                    <strong>Private dashboard</strong>
                    <Text secondary as="p">
                      Service state is available after sign-in
                    </Text>
                  </div>
                </div>
                <div className={styles.monitoringFlow}>
                  <div className={styles.monitoringNode}>
                    <span>SIGNAL 02 / SYSTEM</span>
                    <strong>Dashdot</strong>
                    <Text secondary as="p">
                      CPU, memory, storage, and network metrics
                    </Text>
                  </div>
                  <span className={styles.flowArrow} aria-hidden="true">
                    <span>→</span>
                    <small>SERVER-SIDE</small>
                  </span>
                  <div className={styles.monitoringNode}>
                    <span>PRIVATE VIEW</span>
                    <strong>Private dashboard</strong>
                    <Text secondary as="p">
                      System telemetry is available after sign-in
                    </Text>
                  </div>
                </div>
              </div>
            </section>
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
}
