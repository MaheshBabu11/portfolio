import clsx from 'clsx';

import { QuoteIcon } from '@/components/Icons';

function Quote() {
  return (
    <div className={clsx('flex items-center justify-center')}>
      <img
        className={clsx(
          'h-32 w-32',
          ' md:h-40 md:w-40 lg:mr-4 lg:h-52 lg:w-52'
        )}
        alt="Coder GIF"
        src="assets/images/programmer.gif"
      />

      <blockquote
        className={clsx(
          'flex gap-2 pt-2 text-3xl text-slate-500',
          'md:text-4xl lg:pt-0 lg:text-5xl',
          'dark:text-slate-400'
        )}
      >
        <QuoteIcon
          className={clsx(
            '-mt-1 h-10 text-slate-300',
            'md:-mt-3 md:h-16 lg:h-24',
            'dark:text-slate-800'
          )}
        />
        <span className={clsx('flex flex-col')}>
          <span className={clsx('leading-[1.15]')}>
            <em>The best code is </em>{' '}
            <strong
              className={clsx(
                'font-extrabold text-slate-600',
                'dark:text-slate-300'
              )}
            >
              no code
            </strong>
          </span>
          <span
            className={clsx(
              'flex items-center gap-2 leading-[1.15]',
              'lg:gap-4'
            )}
          >
            <span
              className={clsx(
                'mt-1 h-0.5 w-8 rounded-full bg-slate-400',
                'lg:h-1 lg:w-24',
                'dark:bg-slate-600'
              )}
            />
            <span>
              The{' '}
              <strong
                className={clsx(
                  'font-extrabold text-slate-600',
                  'dark:text-slate-300'
                )}
              >
                fewer
              </strong>{' '}
              lines of{' '}
              <strong
                className={clsx(
                  'font-extrabold text-slate-600',
                  'dark:text-slate-300'
                )}
              >
                code{' '}
              </strong>
            </span>
            <span
              className={clsx(
                'mt-1 h-0.5 w-6 rounded-full bg-slate-400',
                'lg:h-1 lg:w-14',
                'dark:bg-slate-600'
              )}
            />
          </span>
          <span className={clsx('leading-[1.15]')}>
            The fewer{' '}
            <strong
              className={clsx(
                'relative font-extrabold text-slate-600',
                'dark:text-slate-300'
              )}
            >
              <span
                className={clsx(
                  'absolute -left-0.5 bottom-0 right-0 top-1 z-[-1] rounded-md bg-slate-100 px-1',
                  'lg:-left-1.5 lg:-right-0.5 lg:bottom-0 lg:top-2',
                  'dark:bg-slate-800'
                )}
              />
              bugs!!!
            </strong>
          </span>
        </span>
      </blockquote>
    </div>
  );
}

export default Quote;
