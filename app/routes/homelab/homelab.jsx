import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import {
  ProjectContainer,
  ProjectHeader,
  ProjectSection,
  ProjectSectionContent,
} from '~/layouts/project';
import config from '~/config.json';
import { baseMeta } from '~/utils/meta';
import styles from './homelab.module.css';

const refreshInterval = 30_000;

export const meta = () =>
  baseMeta({
    title: 'Homelab',
    description: 'Live CPU, memory, storage, and network metrics from my homelab.',
    pageUrl: `${config.url}/homelab`,
  });

const formatBytes = bytes => {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(0)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};

const formatPercent = value =>
  Number.isFinite(value) ? `${Math.max(0, Math.min(100, value)).toFixed(0)}%` : '—';

const formatRate = bytesPerSecond => {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond < 0) return '—';
  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  let value = bytesPerSecond;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 100 ? 0 : 1)} ${units[unitIndex]}`;
};

const formatUptime = seconds => {
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return [days && `${days}d`, hours && `${hours}h`, `${minutes}m`]
    .filter(Boolean)
    .join(' ');
};

const Sparkline = ({ values }) => {
  if (!values.length) return null;
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 100 : (index / (values.length - 1)) * 100;
      const y = 36 - (Math.max(0, Math.min(100, value)) / 100) * 32;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className={styles.sparkline} viewBox="0 0 100 40" aria-hidden="true">
      <polyline points={points} />
    </svg>
  );
};

const UsageBar = ({ label, used, total }) => {
  const percent = total > 0 && used !== null ? (used / total) * 100 : null;
  const displayedPercent = Number.isFinite(percent)
    ? Math.max(0, Math.min(100, percent))
    : null;

  return (
    <div className={styles.usage}>
      <div className={styles.usageHeader}>
        <span>{label}</span>
        <span>
          {formatBytes(used)} / {formatBytes(total)}
        </span>
      </div>
      <div
        className={styles.usageTrack}
        role="progressbar"
        aria-label={`${label} used`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={displayedPercent === null ? undefined : Math.round(displayedPercent)}
        aria-valuetext={`${formatBytes(used)} of ${formatBytes(total)}`}
      >
        <span style={{ width: `${displayedPercent ?? 0}%` }} />
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, detail, children }) => (
  <article className={styles.metricCard}>
    <span className={styles.metricLabel}>{label}</span>
    <strong className={styles.metricValue}>{value}</strong>
    <span className={styles.metricDetail}>{detail}</span>
    {children}
  </article>
);

export const Homelab = () => {
  const initialResult = useLoaderData();
  const fetcher = useFetcher();
  const servicesFetcher = useFetcher();
  const actionData = useActionData();
  const navigation = useNavigation();
  const fetcherRef = useRef(fetcher);
  const servicesFetcherRef = useRef(servicesFetcher);
  const lastGoodData = useRef(
    initialResult.authenticated && initialResult.metrics.status === 'connected'
      ? initialResult.metrics.data
      : null
  );
  const [history, setHistory] = useState([]);
  fetcherRef.current = fetcher;
  servicesFetcherRef.current = servicesFetcher;

  const result = fetcher.data ?? initialResult.metrics ?? {
    status: 'error',
    message: initialResult.error,
  };
  const services = servicesFetcher.data?.services ?? initialResult.services ?? [];
  const data =
    result.status === 'connected' ? result.data : lastGoodData.current;
  const isSubmitting = navigation.state === 'submitting';
  const cpuPercent = data?.cpu.averageLoad;
  const ramPercent =
    data?.ram.totalBytes > 0 && data.ram.usedBytes !== null
      ? (data.ram.usedBytes / data.ram.totalBytes) * 100
      : null;

  useEffect(() => {
    if (fetcher.data?.status === 'connected') {
      lastGoodData.current = fetcher.data.data;
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (!data) return;

    setHistory(previous => [
      ...previous.slice(-23),
      { cpu: data.cpu.averageLoad, ram: ramPercent },
    ]);
  }, [data, ramPercent]);

  useEffect(() => {
    if (!initialResult.authenticated) return undefined;

    const timer = window.setInterval(() => {
      if (fetcherRef.current.state === 'idle') {
        fetcherRef.current.load('/api/homelab');
      }
    }, refreshInterval);

    return () => window.clearInterval(timer);
  }, [initialResult.authenticated]);

  useEffect(() => {
    if (!initialResult.authenticated) return undefined;

    const timer = window.setInterval(() => {
      if (servicesFetcherRef.current.state === 'idle') {
        servicesFetcherRef.current.load('/api/service-status');
      }
    }, 30_000);

    return () => window.clearInterval(timer);
  }, [initialResult.authenticated]);

  if (!initialResult.authenticated) {
    return (
      <>
        <ProjectContainer className={styles.homelab}>
          <ProjectHeader
            title="Homelab"
            description="Sign in to view private homelab metrics and service status."
          />
          <ProjectSection padding="none">
            <ProjectSectionContent className={styles.loginContent}>
              <Form method="post" className={styles.loginForm}>
                <Heading level={3}>Password required</Heading>
                {initialResult.error ? (
                  <Text as="p" role="alert">
                    {initialResult.error}
                  </Text>
                ) : (
                  <>
                    <label className={styles.passwordLabel} htmlFor="homelab-password">
                      Password
                    </label>
                    <input
                      className={styles.passwordInput}
                      id="homelab-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      maxLength={1024}
                    />
                    {actionData?.error && (
                      <Text as="p" role="alert">
                        {actionData.error}
                      </Text>
                    )}
                    <button
                      className={styles.passwordSubmit}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Signing in…' : 'Sign in'}
                    </button>
                  </>
                )}
              </Form>
            </ProjectSectionContent>
          </ProjectSection>
        </ProjectContainer>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ProjectContainer className={styles.homelab}>
        <ProjectHeader
          title="Homelab"
          description="Live system telemetry from my Dashdot dashboard."
        />
        <ProjectSection padding="none">
          <ProjectSectionContent width="full" className={styles.content}>
            <div className={styles.liveHeader}>
              <div className={styles.liveStatus}>
                <span
                  className={styles.statusDot}
                  data-connected={result.status === 'connected'}
                  aria-hidden="true"
                />
                <Text as="p" role="status">
                  {result.status === 'connected'
                    ? fetcher.state === 'loading'
                      ? 'Live · refreshing'
                      : 'Live · updates every 30 seconds'
                    : data
                      ? 'Connection lost · showing previous data'
                      : 'Waiting for Dashdot'}
                </Text>
              </div>
              <a
                className={styles.dashdotLink}
                href="https://dashdot.maheshbabu11.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Dashdot <span aria-hidden="true">↗</span>
              </a>
            </div>
            <section className={styles.section} aria-labelledby="service-status-title">
              <div className={styles.sectionHeader}>
                <Heading level={3} id="service-status-title">
                  Services
                </Heading>
              </div>
              <ul className={styles.serviceGrid} aria-label="Homelab service status">
                {services.map(service => (
                  <li
                    className={styles.serviceCard}
                    data-state={service.state}
                    key={service.name}
                  >
                    <a
                      className={styles.serviceLink}
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${service.name}; status: ${service.state}`}
                      title={`${service.name} · ${service.state}`}
                    >
                      <span className={styles.serviceIcon} aria-hidden="true">
                        <img
                          src={`https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons@master/svg/${service.icon}.svg`}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          onError={event => {
                            event.currentTarget.hidden = true;
                          }}
                        />
                        <span
                          className={styles.serviceIndicator}
                          data-state={service.state}
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
            {data ? (
              <>
                {result.status === 'error' && (
                  <p className={styles.staleNotice} role="status">
                    {result.message}
                  </p>
                )}
                <div className={styles.metrics} aria-label="Live system metrics">
                  <MetricCard
                    label="CPU load"
                    value={formatPercent(cpuPercent)}
                    detail={`${data.cpu.cores ?? '—'} cores · ${data.cpu.threads ?? '—'} threads${
                      data.cpu.maximumTemperature !== null
                        ? ` · ${data.cpu.maximumTemperature}°C`
                        : ''
                    }`}
                  >
                    <Sparkline
                      values={history.map(sample => sample.cpu).filter(Number.isFinite)}
                    />
                  </MetricCard>
                  <MetricCard
                    label="Memory"
                    value={formatPercent(ramPercent)}
                    detail={`${formatBytes(data.ram.usedBytes)} of ${formatBytes(
                      data.ram.totalBytes
                    )}`}
                  >
                    <Sparkline
                      values={history.map(sample => sample.ram).filter(Number.isFinite)}
                    />
                  </MetricCard>
                  <MetricCard
                    label="Network"
                    value={formatRate(data.network.downloadBytesPerSecond)}
                    detail={`Down · ↑ ${formatRate(data.network.uploadBytesPerSecond)}`}
                  >
                    <span className={styles.metricFootnote}>
                      {data.network.type || 'Network'} traffic
                    </span>
                  </MetricCard>
                  <MetricCard
                    label="Uptime"
                    value={formatUptime(data.os.uptimeSeconds)}
                    detail={`${data.os.distro} ${data.os.release}`.trim()}
                  >
                    <span className={styles.metricFootnote}>
                      Dashdot {data.os.dashdotVersion}
                    </span>
                  </MetricCard>
                </div>
                <section className={styles.section} aria-labelledby="hardware-title">
                  <div className={styles.sectionHeader}>
                    <Heading level={3} id="hardware-title">
                      Hardware
                    </Heading>
                    <Text secondary as="p">
                      {data.cpu.brand} {data.cpu.model}
                    </Text>
                  </div>
                  <div className={styles.hardwareGrid}>
                    <div className={styles.hardwareCard}>
                      <span className={styles.hardwareLabel}>Processor</span>
                      <strong>{data.cpu.model}</strong>
                      <span>
                        {data.cpu.cores ?? '—'} cores · {data.cpu.threads ?? '—'} threads
                        {data.cpu.frequencyGHz ? ` · ${data.cpu.frequencyGHz} GHz` : ''}
                      </span>
                    </div>
                    <div className={styles.hardwareCard}>
                      <span className={styles.hardwareLabel}>Memory</span>
                      <strong>{formatBytes(data.ram.totalBytes)}</strong>
                      <span>Installed system memory</span>
                    </div>
                    <div className={styles.hardwareCard}>
                      <span className={styles.hardwareLabel}>Operating system</span>
                      <strong>{data.os.distro}</strong>
                      <span>{data.os.release}</span>
                    </div>
                  </div>
                </section>
                <section className={styles.section} aria-labelledby="storage-title">
                  <div className={styles.sectionHeader}>
                    <Heading level={3} id="storage-title">
                      Storage
                    </Heading>
                    <Text secondary as="p">
                      Used space by device
                    </Text>
                  </div>
                  {data.storage.length ? (
                    <div className={styles.storageGrid}>
                      {data.storage.map((disk, index) => (
                        <div className={styles.storageCard} key={`${disk.name}-${index}`}>
                          <div className={styles.storageTitle}>
                            <strong>{disk.name}</strong>
                            {disk.type && <span>{disk.type}</span>}
                          </div>
                          <UsageBar
                            label={`Drive ${index + 1}`}
                            used={disk.usedBytes}
                            total={disk.totalBytes}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <Text as="p">No storage devices were reported by Dashdot.</Text>
                    </div>
                  )}
                </section>
              </>
            ) : (
              <div className={styles.message} role="status">
                <Heading level={4}>Dashdot data unavailable</Heading>
                <Text as="p">
                  {result.message ||
                    'Waiting for a response from Dashdot. This page will retry automatically.'}
                </Text>
              </div>
            )}
          </ProjectSectionContent>
        </ProjectSection>
      </ProjectContainer>
      <Footer />
    </>
  );
};
