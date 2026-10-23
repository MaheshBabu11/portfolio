export const initialQuest = {
  stage: 'boot',
  diagnosisAttempts: 0,
};

const line = (text, kind = 'output', href) => ({ text, kind, href });

export function executeQuestCommand(rawCommand, quest) {
  const [command = '', ...args] = rawCommand.trim().split(/\s+/);
  const normalizedCommand = command.toLowerCase();
  const argument = args.join(' ').toLowerCase();
  const output = [];
  let nextQuest = quest;
  let enterArcade = false;

  switch (normalizedCommand) {
    case 'help':
      output.push(
        line('Available commands', 'success'),
        line('help                 Show commands and examples'),
        line('whoami / about       Meet the developer and the mission'),
        line('skills / projects    Explore technologies and real projects'),
        line('contact              Open the portfolio contact page'),
        line('status               Check simulated service health'),
        line('scan → inspect       Discover and investigate the incident'),
        line('diagnose <answer>    Name the likely cause (try: diagnose pool)'),
        line('remediate <action>   Choose a safe next step (try: remediate leak)'),
        line('deploy               Complete the mission when ready'),
        line('sudo coffee          Unlock the secret arcade'),
        line('clear / restart      Clear output or restart the quest'),
        line('exit                 Leave the terminal and keep this visit’s progress'),
        line('All system data is simulated. No shell commands are executed.')
      );
      break;
    case 'whoami':
      output.push(
        line('Mahesh Babu · Software Developer', 'success'),
        line('Backend-focused engineer building Java and Spring Boot applications.')
      );
      break;
    case 'about':
      output.push(
        line('MISSION 001: THE PRODUCTION INCIDENT', 'success'),
        line(
          'Production is experiencing intermittent failures. The API gateway is returning errors, the database connection pool is under pressure, and the deployment pipeline is waiting. Investigate the system, identify the problem, and restore service.'
        ),
        line('This is a local, simulated incident—not a real system or deployment.')
      );
      break;
    case 'skills':
      output.push(
        line('Engineering toolkit', 'success'),
        line('Java · Spring Boot · REST APIs · SQL · PostgreSQL'),
        line('Hibernate / JPA · Docker · Kafka · backend application development')
      );
      break;
    case 'projects':
      output.push(
        line('Selected work', 'success'),
        line('HTTP Client Plus — IntelliJ IDEA HTTP client', 'output', 'https://plugins.jetbrains.com/plugin/28340-http-client-plus'),
        line('NTFY Java — Java notification library', 'output', 'https://github.com/MaheshBabu11/ntfy-java'),
        line('Excel2DataMap — Java data-mapping library', 'output', 'https://github.com/MaheshBabu11/Excel2DataMap'),
        line('ASCII Art Generator — image-to-ASCII web app', 'output', 'https://ascii-art-generator.maheshbabu11.dev/'),
        line('Browse every project in the portfolio.', 'output', '/#project-1')
      );
      break;
    case 'contact':
      output.push(
        line('Let’s talk about thoughtful software.', 'success'),
        line('Open the portfolio contact page.', 'output', '/contact')
      );
      break;
    case 'status':
      output.push(
        line('SIMULATED SYSTEM STATUS', 'success'),
        line(`api-gateway   ${quest.stage === 'complete' ? 'HEALTHY' : quest.stage === 'boot' ? 'UNKNOWN — run scan' : 'DEGRADED — elevated 5xx responses'}`),
        line(`auth-service  ${quest.stage === 'complete' ? 'HEALTHY' : quest.stage === 'boot' ? 'UNKNOWN — run scan' : 'HEALTHY'}`),
        line(`database      ${quest.stage === 'complete' ? 'HEALTHY' : quest.stage === 'boot' ? 'UNKNOWN — run scan' : 'UNDER PRESSURE — pool waiters detected'}`),
        line('Telemetry is fictional and generated locally.')
      );
      break;
    case 'scan':
      if (quest.stage === 'boot') {
        nextQuest = { ...quest, stage: 'scanned' };
        output.push(
          line('SERVICE DISCOVERY COMPLETE', 'success'),
          line('api-gateway   DEGRADED · intermittent HTTP 503 responses'),
          line('auth-service  HEALTHY · Spring Boot · p95 84 ms'),
          line('database      UNDER PRESSURE · PostgreSQL pool waiters detected'),
          line('The gateway and database symptoms may be related. Continue with inspect.')
        );
      } else {
        output.push(line('Services already discovered. Use status to review the current simulation.', 'hint'));
      }
      break;
    case 'inspect':
      if (quest.stage === 'scanned') {
        nextQuest = { ...quest, stage: 'inspected' };
        output.push(
          line('INCIDENT LOG · api-gateway → database', 'success'),
          line('ERROR: Connection pool exhausted. Requests waiting for available connections.', 'error'),
          line('What is the most likely reason requests are stalling?', 'hint'),
          line('Choose a diagnosis: connection pool pressure, a UI rendering issue, or a DNS failure.')
        );
      } else if (quest.stage === 'boot') {
        output.push(line('No service inventory yet. Run scan first.', 'hint'));
      } else {
        output.push(line('Incident log reviewed. Continue with the diagnosis or remediation step.', 'hint'));
      }
      break;
    case 'diagnose':
      if (quest.stage !== 'inspected') {
        output.push(line('Inspect the incident log first to unlock the diagnosis.', 'hint'));
      } else if (/pool|connection|database|exhaust/i.test(argument)) {
        nextQuest = { ...quest, stage: 'diagnosed' };
        output.push(
          line('DIAGNOSIS ACCEPTED', 'success'),
          line('Database connection exhaustion can leave API requests waiting for a free connection.'),
          line('Now choose a measured remediation; increasing pool size blindly can shift load or hide a leak.')
        );
      } else {
        const attempts = quest.diagnosisAttempts + 1;
        nextQuest = { ...quest, diagnosisAttempts: attempts };
        output.push(
          line('That does not explain the log: requests are explicitly waiting for database connections.', 'error'),
          line(attempts >= 2 ? 'Hint: follow the connection lifecycle and check whether connections are returned.' : 'Hint: focus on the database connection pool.', 'hint')
        );
      }
      break;
    case 'remediate':
      if (quest.stage !== 'diagnosed') {
        output.push(line('Identify the likely cause with diagnose <answer> before choosing a remediation.', 'hint'));
      } else if (/leak|connection|usage|query|slow|duration/i.test(argument)) {
        nextQuest = { ...quest, stage: 'ready' };
        output.push(
          line('REMEDIATION PLAN VALIDATED', 'success'),
          line('Review connection acquisition/release paths for leaks, inspect query duration, and compare pool usage with demand.'),
          line('Tune pool limits only after measuring database capacity and workload.'),
          line('All mission checks passed. Run deploy to finish the simulated incident.')
        );
      } else {
        output.push(
          line('That action does not address the evidence yet.', 'error'),
          line('Try auditing connection leaks, query duration, or measured pool usage. Avoid blind pool-size increases.', 'hint')
        );
      }
      break;
    case 'deploy':
      if (quest.stage === 'ready') {
        nextQuest = { ...quest, stage: 'deploying' };
        output.push(line('Deployment plan accepted. Applying the simulated recovery…', 'success'));
      } else if (quest.stage === 'complete' || quest.stage === 'deploying') {
        output.push(line('The simulated deployment is already complete or in progress.', 'hint'));
      } else {
        output.push(line('Deployment is locked. Complete scan → inspect → diagnose → remediate first.', 'hint'));
      }
      break;
    case 'sudo':
      if (argument === 'coffee') {
        enterArcade = true;
        output.push(line('☕ Caffeine levels restored. Secret arcade unlocked.', 'success'));
      } else {
        output.push(line('Permission denied. Try the documented easter egg: sudo coffee', 'error'));
      }
      break;
    case 'clear':
      return { output: [], quest, clear: true, enterArcade };
    case 'restart':
      return {
        output: [
          line('Quest restarted. Production is waiting for your investigation.', 'success'),
          line('Run help for commands, or start with scan.')
        ],
        quest: initialQuest,
        enterArcade: false,
      };
    case 'exit':
      output.push(line('Quest minimized. Your progress is saved for this visit.', 'hint'));
      break;
    default:
      output.push(
        line(`Command not found: ${normalizedCommand || '(empty)'}`, 'error'),
        line('Run help to see available commands. Commands are case-insensitive.', 'hint')
      );
      break;
  }

  return { output, quest: nextQuest, enterArcade };
}
