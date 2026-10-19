import { Icon } from '~/components/icon';
import { useBackgroundAnimation } from '~/components/background-animation/background-animation-provider';
import { useTheme } from '~/components/theme-provider';
import { navLinks } from '~/layouts/navbar/nav-data';
import { useFetcher, useNavigate } from '@remix-run/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './command-palette.module.css';

const pageCommands = [
  {
    title: 'Home',
    description: 'Go to the homepage',
    href: '/#intro',
    type: 'Page',
  },
  ...navLinks.map(({ label, pathname }) => ({
    title: label,
    description: `Go to ${label.toLowerCase()}`,
    href: pathname,
    type: 'Page',
  })),
  {
    title: 'Uses',
    description: 'See the tools and setup I use',
    href: '/uses',
    type: 'Page',
  },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const requestedArticles = useRef(false);
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { cycleMode } = useBackgroundAnimation();
  const { theme, toggleTheme } = useTheme();

  const articles = fetcher.data?.articles;
  const results = useMemo(() => {
    const commands = [
      ...pageCommands,
      {
        title: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
        description: 'Switch between the light and dark themes',
        keywords: 'theme appearance light dark',
        shortcut: 'Alt/Option + L',
        type: 'Action',
        action: toggleTheme,
      },
      {
        title: 'Cycle background graphics',
        description: 'Switch to the next animated background',
        keywords: 'background animation visual',
        shortcut: 'Alt/Option + G',
        type: 'Action',
        action: cycleMode,
      },
      ...(articles ?? []).map(article => ({ ...article, type: 'Article' })),
    ];
    const normalizedQuery = query.trim().toLocaleLowerCase();

    if (!normalizedQuery) return commands;

    return commands.filter(command =>
      `${command.title} ${command.description} ${command.type} ${command.keywords ?? ''} ${
        command.shortcut ?? ''
      }`
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    );
  }, [articles, cycleMode, query, theme, toggleTheme]);

  useEffect(() => {
    const handleShortcut = event => {
      if (event.defaultPrevented || event.repeat) {
        return;
      }

      const hasPrimaryModifier = event.metaKey || event.ctrlKey;

      if (hasPrimaryModifier && event.code === 'KeyK') {
        event.preventDefault();
        setIsOpen(open => !open);
        return;
      }

      if (
        !event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        (event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            event.target.closest('input, textarea, select, [contenteditable="true"]')))
      ) {
        return;
      }

      if (event.code === 'KeyL') {
        event.preventDefault();
        toggleTheme();
      } else if (event.code === 'KeyG') {
        event.preventDefault();
        cycleMode();
      }
    };

    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, [cycleMode, toggleTheme]);

  useEffect(() => {
    if (!isOpen || requestedArticles.current) return;

    requestedArticles.current = true;
    fetcher.load('/api/search');
  }, [fetcher, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setQuery('');
    setActiveIndex(0);

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement;
    dialog.showModal();
    inputRef.current?.focus();

    return () => {
      if (dialog.open) dialog.close();
      if (
        previouslyFocused instanceof HTMLElement &&
        previouslyFocused !== document.body &&
        previouslyFocused.isConnected
      ) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !results.length) return;

    dialogRef.current
      ?.querySelector(`#command-result-${activeIndex}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen, results.length]);

  const selectResult = result => {
    if (!result) return;

    setIsOpen(false);
    if (result.action) {
      result.action();
    } else {
      navigate(result.href);
    }
  };

  const handleInputKeyDown = event => {
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      setActiveIndex(index => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      setActiveIndex(index => (index - 1 + results.length) % results.length);
    } else if (event.key === 'Enter' && results.length) {
      event.preventDefault();
      selectResult(results[activeIndex]);
    }
  };

  const handleCancel = event => {
    event.preventDefault();
    setIsOpen(false);
  };

  const retryArticleSearch = () => {
    requestedArticles.current = true;
    fetcher.load('/api/search');
  };

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Search commands, pages, and articles. Press Command K or Control K."
        title="Search (⌘K / Ctrl K)"
        onClick={() => setIsOpen(true)}
      >
        <Icon className={styles.triggerIcon} icon="search" size={20} />
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="command-palette-title"
        onCancel={handleCancel}
      >
        <div className={styles.panel}>
          <div className={styles.header}>
            <h2 id="command-palette-title" className={styles.title}>
              Search
            </h2>
            <button
              type="button"
              className={styles.close}
              aria-label="Close search"
              onClick={() => setIsOpen(false)}
            >
              <Icon icon="close" size={20} />
            </button>
          </div>

          <div className={styles.searchBox}>
            <Icon icon="search" size={20} />
            <input
              ref={inputRef}
              className={styles.input}
              type="search"
              role="combobox"
              aria-label="Search commands, pages, and articles"
              aria-autocomplete="list"
              aria-controls="command-results"
              aria-expanded={results.length > 0}
              aria-activedescendant={
                results.length ? `command-result-${activeIndex}` : undefined
              }
              autoComplete="off"
              placeholder="Search commands, pages, and articles..."
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
            />
            <kbd className={styles.escape}>Esc</kbd>
          </div>

          <div
            className={styles.results}
            id="command-results"
            role="listbox"
            aria-label="Search results"
          >
            {results.map((result, index) => (
              <button
                type="button"
                key={`${result.type}-${result.href ?? result.title}`}
                id={`command-result-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={styles.result}
                data-active={index === activeIndex}
                tabIndex={-1}
                onClick={() => selectResult(result)}
              >
                <span className={styles.resultText}>
                  <span className={styles.resultTitle}>{result.title}</span>
                  <span className={styles.resultDescription}>{result.description}</span>
                </span>
                {result.shortcut ? (
                  <kbd className={styles.resultShortcut}>{result.shortcut}</kbd>
                ) : (
                  <span className={styles.resultType}>{result.type}</span>
                )}
              </button>
            ))}
            {!results.length && fetcher.state === 'idle' && fetcher.data && (
              <p className={styles.empty}>No matching commands, pages, or articles.</p>
            )}
            {fetcher.state === 'loading' && (
              <p className={styles.status} role="status">
                Loading articles…
              </p>
            )}
            {requestedArticles.current && fetcher.state === 'idle' && !fetcher.data && (
              <div className={styles.error} role="status">
                <span>Article search is unavailable.</span>
                <button type="button" onClick={retryArticleSearch}>
                  Try again
                </button>
              </div>
            )}
          </div>

          <div className={styles.footer} aria-hidden="true">
            <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
            <span><kbd>Enter</kbd> to open</span>
            <span><kbd>Esc</kbd> to close</span>
          </div>
        </div>
      </dialog>
    </>
  );
}
