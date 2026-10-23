import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Text } from '~/components/text';
import { Link } from '@remix-run/react';
import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import { executeQuestCommand, initialQuest } from './quest-engine';
import { readAchievements, writeAchievements } from './storage';
import styles from './developer-terminal-quest.module.css';

const CodeSnake = lazy(() =>
  import('./code-snake').then(module => ({ default: module.CodeSnake }))
);

const achievements = [
  { id: 'first-boot', title: 'First Boot', detail: 'Launched the terminal' },
  { id: 'system-explorer', title: 'System Explorer', detail: 'Discovered the services' },
  {
    id: 'production-responder',
    title: 'Production Responder',
    detail: 'Completed the mission',
  },
  { id: 'coffee-powered', title: 'Coffee Powered', detail: 'Unlocked the secret arcade' },
  { id: 'bug-slayer', title: 'Bug Slayer', detail: 'Scored 50 in Code Snake' },
];

const openingOutput = [
  { text: 'MAHESH_OS v1.0 · SIMULATED INCIDENT RESPONSE', kind: 'success' },
  { text: 'MISSION 001: THE PRODUCTION INCIDENT', kind: 'command' },
  {
    text: 'Production is experiencing intermittent failures. The API gateway is returning errors, the database connection pool is under pressure, and the deployment pipeline is waiting. Investigate the system, identify the problem, and restore service.',
    kind: 'output',
  },
  { text: 'This is a local simulation. No real systems are connected.', kind: 'hint' },
  { text: 'Start with help, or jump in with scan.', kind: 'hint' },
];

function OutputLine({ item, onNavigate }) {
  const content = item.href?.startsWith('/') ? (
    <Link to={item.href} onClick={onNavigate}>
      {item.text}
    </Link>
  ) : item.href ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer">
      {item.text}
    </a>
  ) : (
    item.text
  );

  return (
    <div className={styles.outputLine} data-kind={item.kind}>
      {content}
    </div>
  );
}

export function DeveloperTerminalQuest() {
  const id = 'developer-terminal-quest';
  const [isOpen, setIsOpen] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [arcadeUnlocked, setArcadeUnlocked] = useState(false);
  const [arcadeOpen, setArcadeOpen] = useState(false);
  const [quest, setQuest] = useState(initialQuest);
  const [output, setOutput] = useState([]);
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);
  const triggerRef = useRef(null);
  const launchRef = useRef(null);
  const resumeRef = useRef(null);
  const dialogRef = useRef(null);
  const outputRef = useRef(null);
  const lineId = useRef(0);
  const deploymentTimer = useRef(null);

  useEffect(() => {
    setEarnedAchievements(readAchievements());
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!dialog || !trigger) return undefined;

    dialog.showModal();

    return () => {
      if (dialog.open) dialog.close();
      if (trigger.isConnected) trigger.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (launched && !minimized && !arcadeOpen) inputRef.current?.focus();
    else if (minimized) resumeRef.current?.focus();
    else if (!launched) launchRef.current?.focus();
  }, [arcadeOpen, isOpen, launched, minimized]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const addOutput = useCallback(items => {
    if (items.length === 0) return;
    setOutput(current => [
      ...current,
      ...items.map(item => ({ ...item, id: lineId.current++ })),
    ]);
  }, []);

  const awardAchievement = useCallback(idToAward => {
    setEarnedAchievements(current => {
      if (current.includes(idToAward)) return current;
      const nextAchievements = [...current, idToAward];
      writeAchievements(nextAchievements);
      return nextAchievements;
    });
  }, []);
  const awardBugSlayer = useCallback(
    () => awardAchievement('bug-slayer'),
    [awardAchievement]
  );

  useEffect(() => {
    if (quest.stage !== 'deploying') return undefined;
    deploymentTimer.current = window.setTimeout(() => {
      setQuest(current => ({ ...current, stage: 'complete' }));
      addOutput([
        { text: 'DEPLOYMENT SUCCESSFUL', kind: 'success' },
        { text: 'All simulated services are operational.', kind: 'success' },
        {
          text: 'MISSION COMPLETED · PRODUCTION RESPONDER BADGE AWARDED',
          kind: 'success',
        },
      ]);
      awardAchievement('production-responder');
    }, 1000);

    return () => window.clearTimeout(deploymentTimer.current);
  }, [addOutput, awardAchievement, quest.stage]);

  const launchQuest = () => {
    setLaunched(true);
    setMinimized(false);
    awardAchievement('first-boot');
    if (!output.length) addOutput(openingOutput);
  };

  const restartQuest = () => {
    if (deploymentTimer.current) window.clearTimeout(deploymentTimer.current);
    setQuest(initialQuest);
    setOutput([]);
    setHistory([]);
    setHistoryIndex(-1);
    setCommand('');
    setArcadeOpen(false);
    setMinimized(false);
    setLaunched(true);
    addOutput(openingOutput);
    awardAchievement('first-boot');
  };

  const exitQuest = () => {
    setLaunched(false);
    setMinimized(false);
    setArcadeOpen(false);
  };

  const closeQuest = () => {
    setIsOpen(false);
    setArcadeOpen(false);
  };

  const handleDialogCancel = event => {
    event.preventDefault();
    closeQuest();
  };

  const runCommand = value => {
    const rawCommand = value.trim();
    if (!rawCommand) return;
    const commandName = rawCommand.toLowerCase();
    const result = executeQuestCommand(rawCommand, quest);

    setHistory(current => [rawCommand, ...current.filter(entry => entry !== rawCommand)]);
    setHistoryIndex(-1);
    setDraft('');
    setCommand('');

    if (result.clear) {
      setOutput([]);
      return;
    }

    addOutput([
      { text: `mahesh@portfolio:~$ ${rawCommand}`, kind: 'command' },
      ...result.output,
    ]);
    setQuest(result.quest);

    if (
      commandName === 'scan' &&
      quest.stage === 'boot' &&
      result.quest.stage === 'scanned'
    ) {
      awardAchievement('system-explorer');
    }
    if (result.enterArcade) {
      setArcadeUnlocked(true);
      setArcadeOpen(true);
      awardAchievement('coffee-powered');
    }
    if (commandName === 'exit') setMinimized(true);
    if (result.quest.stage === 'boot' && commandName === 'restart') {
      setArcadeOpen(false);
      setMinimized(false);
    }
  };

  const suggestions =
    quest.stage === 'boot'
      ? ['help', 'scan', 'status']
      : quest.stage === 'scanned'
      ? ['inspect', 'status']
      : quest.stage === 'inspected'
      ? ['diagnose pool', 'diagnose DNS']
      : quest.stage === 'diagnosed'
      ? ['remediate leak', 'remediate query duration']
      : quest.stage === 'ready'
      ? ['deploy', 'status']
      : quest.stage === 'complete'
      ? ['projects', 'sudo coffee']
      : ['status', 'sudo coffee'];
  const missionProgress = {
    boot: 0,
    scanned: 1,
    inspected: 2,
    diagnosed: 3,
    ready: 4,
    deploying: 4,
    complete: 5,
  }[quest.stage];

  const onCommandKeyDown = event => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const nextIndex = Math.min(historyIndex + 1, history.length - 1);
      if (nextIndex >= 0) {
        if (historyIndex === -1) setDraft(command);
        setHistoryIndex(nextIndex);
        setCommand(history[nextIndex]);
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex < 0) {
        setHistoryIndex(-1);
        setCommand(draft);
      } else {
        setHistoryIndex(nextIndex);
        setCommand(history[nextIndex]);
      }
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.questTrigger}
        aria-label="Open Developer Terminal Quest"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title="Play a game"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon="gamepad" size={21} />
      </button>
      <dialog
        ref={dialogRef}
        className={styles.questDialog}
        aria-labelledby={`${id}-title`}
        onCancel={handleDialogCancel}
      >
        <div className={styles.dialogInner}>
          <button
            className={styles.dialogClose}
            type="button"
            aria-label="Close Developer Terminal Quest"
            onClick={closeQuest}
          >
            <Icon icon="close" size={20} />
          </button>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>INTERACTIVE EXPERIENCE / MISSION 001</p>
            <Heading level={2} as="h2" id={`${id}-title`} className={styles.title}>
              Developer Terminal Quest
            </Heading>
            <Text as="p" size="l" className={styles.subtitle}>
              Explore my world through a terminal. Find the clues, solve the incident, and
              discover what lies beneath.
            </Text>
            <Text as="p" className={styles.description}>
              Step into a simulated production incident, investigate a database
              connection-pool issue, and restore service with a measured fix. No command
              reaches a real system.
            </Text>
            <div className={styles.introActions}>
              {!launched && (
                <Button
                  ref={launchRef}
                  iconEnd="arrow-right"
                  onClick={launchQuest}
                  type="button"
                >
                  Launch Quest
                </Button>
              )}
              <Button
                secondary
                href="/#project-1"
                iconEnd="chevron-right"
                onClick={closeQuest}
              >
                Back to projects
              </Button>
            </div>
          </div>

          {!launched ? (
            <div className={styles.preview} aria-label="Terminal preview">
              <div className={styles.titleBar}>
                <span className={styles.terminalMark} aria-hidden="true">
                  ⌘
                </span>
                <span>MAHESH_OS v1.0</span>
                <span className={styles.windowDots} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className={styles.previewBody}>
                <span>
                  <b>mahesh@portfolio</b>:~$ <em>help</em>
                </span>
                <span>Explore a simulated incident response mission.</span>
                <span>
                  <b>mahesh@portfolio</b>:~$ <i className={styles.cursor} />
                </span>
              </div>
            </div>
          ) : minimized ? (
            <div className={styles.minimized}>
              <p>Quest paused. Your progress is saved for this visit.</p>
              <button ref={resumeRef} type="button" onClick={() => setMinimized(false)}>
                Resume terminal
              </button>
            </div>
          ) : (
            <div className={styles.experience}>
              <div className={styles.questColumn}>
                {arcadeUnlocked && (
                  <div className={styles.arcadeMount} hidden={!arcadeOpen}>
                    <Suspense
                      fallback={
                        <p className={styles.loadingArcade}>Loading the hidden arcade…</p>
                      }
                    >
                      <CodeSnake
                        active={arcadeOpen}
                        onExit={() => setArcadeOpen(false)}
                        onBugSlayer={awardBugSlayer}
                      />
                    </Suspense>
                  </div>
                )}
                {!arcadeOpen && (
                  <>
                    <div className={styles.terminal}>
                      <div className={styles.titleBar}>
                        <span className={styles.terminalMark} aria-hidden="true">
                          ⌘
                        </span>
                        <span>MAHESH_OS v1.0</span>
                        <div className={styles.windowControls}>
                          <button
                            type="button"
                            aria-label="Minimize quest"
                            onClick={() => setMinimized(true)}
                          >
                            −
                          </button>
                          <button
                            type="button"
                            aria-label="Exit quest"
                            onClick={exitQuest}
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <div className={styles.missionBar}>
                        <span>MISSION 001</span>
                        <span data-status={quest.stage}>
                          {quest.stage === 'complete'
                            ? 'MISSION COMPLETED'
                            : quest.stage === 'deploying'
                            ? 'DEPLOYING'
                            : 'INCIDENT RESPONSE'}
                        </span>
                      </div>
                      <div
                        className={styles.missionProgress}
                        role="progressbar"
                        aria-label="Mission progress"
                        aria-valuemin={0}
                        aria-valuemax={5}
                        aria-valuenow={missionProgress}
                      >
                        <span style={{ width: `${missionProgress * 20}%` }} />
                      </div>

                      <div
                        className={styles.terminalOutput}
                        ref={outputRef}
                        role="log"
                        aria-live="polite"
                        aria-relevant="additions text"
                      >
                        {output.length === 0 ? (
                          <p className={styles.emptyOutput}>
                            Your local terminal is ready. Run help to begin.
                          </p>
                        ) : (
                          output.map(item => (
                            <OutputLine
                              key={item.id}
                              item={item}
                              onNavigate={closeQuest}
                            />
                          ))
                        )}
                      </div>

                      <form
                        className={styles.commandForm}
                        onSubmit={event => {
                          event.preventDefault();
                          runCommand(command);
                        }}
                      >
                        <label htmlFor={`${id}-command`} className={styles.prompt}>
                          <span>mahesh@portfolio</span>:~$
                        </label>
                        <input
                          id={`${id}-command`}
                          ref={inputRef}
                          value={command}
                          onChange={event => setCommand(event.target.value)}
                          onKeyDown={onCommandKeyDown}
                          autoComplete="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          aria-label="Enter a terminal command"
                        />
                        <button type="submit">Run</button>
                      </form>
                    </div>

                    <div className={styles.suggestions} aria-label="Suggested commands">
                      <span>Try</span>
                      {suggestions.map(suggestion => (
                        <button
                          type="button"
                          key={suggestion}
                          onClick={() => runCommand(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                      <button type="button" onClick={restartQuest}>
                        Restart quest
                      </button>
                    </div>

                    {quest.stage === 'complete' && (
                      <div className={styles.completion} role="status">
                        <span className={styles.completionKicker}>
                          INCIDENT CLOSED · SIMULATION COMPLETE
                        </span>
                        <h3>Production is back online.</h3>
                        <p>
                          You investigated the evidence before changing capacity—the right
                          instinct for production work.
                        </p>
                        <div className={styles.completionActions}>
                          <Button
                            href="/#project-1"
                            iconEnd="arrow-right"
                            onClick={closeQuest}
                          >
                            Explore My Projects
                          </Button>
                          <Button
                            secondary
                            href={`https://github.com/${config.github}`}
                            iconEnd="arrow-right"
                          >
                            View GitHub
                          </Button>
                          <button type="button" onClick={restartQuest}>
                            Restart Quest
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <aside
                className={styles.achievementPanel}
                aria-labelledby={`${id}-achievements`}
              >
                <div className={styles.panelHeading}>
                  <span className={styles.panelIcon} aria-hidden="true">
                    ✦
                  </span>
                  <div>
                    <h3 id={`${id}-achievements`}>Achievements</h3>
                    <p>
                      {earnedAchievements.length} / {achievements.length} unlocked
                    </p>
                  </div>
                </div>
                <ul>
                  {achievements.map(achievement => {
                    const isEarned = earnedAchievements.includes(achievement.id);
                    return (
                      <li key={achievement.id} data-earned={isEarned}>
                        <span className={styles.badgeIcon} aria-hidden="true">
                          {isEarned ? '✓' : '·'}
                        </span>
                        <span>
                          <strong>{achievement.title}</strong>
                          <small>{achievement.detail}</small>
                        </span>
                        <span className={styles.srOnly}>
                          {isEarned ? 'Unlocked' : 'Locked'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <Link
                  className={styles.projectAnchor}
                  to="/#project-1"
                  onClick={closeQuest}
                >
                  Return to portfolio projects ↗
                </Link>
              </aside>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
