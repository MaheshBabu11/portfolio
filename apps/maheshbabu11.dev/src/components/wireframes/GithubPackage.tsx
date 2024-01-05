import clsx from 'clsx';

import { SkeletonSm } from '@/components/wireframes/Skeletons';

import { InstallIcon, MavenIcon, XMLCodeIcon } from '../Icons';

interface GithubPackageWireframeProps {
  packageName?: string;
  version?: string;
  dependency: string;
}

function GitHubPackageWireframe({
  packageName = '',
  version = '',
  dependency = null,
}: GithubPackageWireframeProps) {
  return (
    <div
      className={clsx(
        'h-full w-full bg-white p-4 text-sm text-slate-600',
        'dark:bg-slate-900 dark:text-slate-400'
      )}
    >
      <div className={clsx('flex items-center gap-1')}>
        <div className={clsx('mr-1')}>
          <MavenIcon className={clsx('h-5 w-5')} />
        </div>
        {packageName ? (
          <div
            className={clsx('text-white-700 -mt-0.5', 'dark:text-white-500')}
          >
            {packageName}
          </div>
        ) : (
          <SkeletonSm w={64} />
        )}
        <div className={clsx('-mt-0.5')}> </div>
        <div
          className={clsx(
            'text-white-700 -mt-0.5 font-bold',
            'dark:text-white-500 dark:font-semibold'
          )}
        >
          {version}
        </div>
        <div
          className={clsx(
            'border-divider-light ml-1 rounded-full border px-2 py-0.5 text-xs text-green-500',
            'dark:border-divider-dark'
          )}
        >
          Latest Version
        </div>
      </div>
      <div className="mt-2 rounded-lg border p-4">
        <div className={clsx('mt-5')}>
          <div
            className={clsx(
              'text-white-700 -mt-0.5 flex items-center',
              'dark:text-white-500'
            )}
          >
            <XMLCodeIcon className={clsx('h-4 w-4')} />
            <span className={clsx('ml-1')}>
              Install 1/2: Add this to pom.xml:
            </span>
          </div>

          <pre
            className={clsx(
              'rounded-md p-1',
              'text-white-700 -mt-0.5 font-bold',
              'dark:text-white-500 dark:font-semibold'
            )}
          >
            {dependency}
          </pre>
        </div>
        <div className={clsx('mt-3')}>
          <div
            className={clsx(
              'text-white-700 -mt-0.5 flex items-center',
              'dark:text-white-500'
            )}
          >
            <InstallIcon className={clsx('h-4 w-4')} />
            <span className={clsx('ml-1')}>
              Install 2/2: Run via command line
            </span>
          </div>
          <pre
            className={clsx(
              'rounded-md p-4',
              'text-white-700 -mt-0.5 font-bold',
              'dark:text-white-500 dark:font-semibold'
            )}
          >
            $ mvn install
          </pre>
        </div>
      </div>
    </div>
  );
}

export default GitHubPackageWireframe;
