import clsx from 'clsx';

import { CodeIcon, HeartIcon, SparklesIcon } from '@/components/Icons';

import FeaturedCard from '@/contents/index/FeaturedCard';
import Header from '@/contents/index/Header';
import Quote from '@/contents/index/Quote';
import GithubContribCard from '@/contents/index/GithubContrib';

import SkillsAndTech from './SkillsAndTech';

function FeaturedCardSection() {
  return (
    <div className={clsx('content-wrapper')}>
      <div className={clsx('flex flex-col gap-4', 'lg:flex-row lg:gap-8')}>
        <FeaturedCard
          icon={
            <div
              className={clsx(
                'rounded-full bg-amber-300 p-3.5',
                'dark:bg-amber-900'
              )}
            >
              <SparklesIcon className={clsx('h-5 w-5 text-white')} />
            </div>
          }
          title="Scalable System Design"
          desc="Create scalable systems to ensure robustness for growing demands."
        />
        <FeaturedCard
          icon={
            <div
              className={clsx(
                'rounded-full bg-pink-300 p-3.5',
                'dark:bg-pink-900'
              )}
            >
              <HeartIcon className={clsx('h-5 w-5 text-white')} />
            </div>
          }
          title="Detail Oriented"
          desc="Precise and meticulous, ensuring attention to every aspect for refined outcomes."
        />
        <FeaturedCard
          icon={
            <div
              className={clsx(
                'rounded-full bg-sky-300 p-3.5',
                'dark:bg-sky-900'
              )}
            >
              <CodeIcon className={clsx('h-5 w-5 text-white')} />
            </div>
          }
          title="Pretty & Optimized"
          desc="Writing clean code is a top priority while keeping it as optimized as possible."
        />
      </div>
    </div>
  );
}

function QuoteSection() {
  return (
    <div className={clsx('content-wrapper')}>
      <div className={clsx('flex items-center justify-center py-4')}>
        <Quote />
      </div>
    </div>
  );
}

function GithubContrib() {
  return (
    <div className={clsx('content-wrapper')}>
      <GithubContribCard />
    </div>
  );
}

function IndexContents() {
  return (
    <>
      <Header />
      <div className={clsx('hidden', 'lg:-mt-16 lg:mb-24 lg:block')}>
        <FeaturedCardSection />
      </div>
      <div className={clsx('-mt-12 mb-2', 'md:mb-1 md:mt-0')}>
        <QuoteSection />
      </div>
      <div className="flex items-center justify-center">
        <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600" />
        <div
          className={clsx(
            'mx-1 w-1/2 border-t-4 border-dashed border-slate-400',
            'lg:border-t-4',
            'dark:border-slate-600'
          )}
        />
        <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-slate-600" />
      </div>
      <div className={clsx('mb-2 mt-4', 'md:mb-4 md:mt-2')}>
        <GithubContrib />
      </div>
      <div className={clsx('mb-2 mt-12', 'md:mb-4 md:mt-0')}>
        <SkillsAndTech />
      </div>
    </>
  );
}

export default IndexContents;
