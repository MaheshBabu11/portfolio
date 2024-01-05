import clsx from 'clsx';
import { m } from 'framer-motion';

import {
  GitIcon,
  HibernateIcon,
  IntellijIdeaIcon,
  JavaIcon,
  MavenIcon,
  PostgresIcon,
  SpringBootIcon,
  SqlServerIcon,
} from '@/components/Icons';

const animation = {
  hide: { x: -8, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
  },
};

function HeaderTechStack() {
  return (
    <div>
      <m.p
        className={clsx('mb-2.5 text-sm text-slate-600', 'dark:text-slate-400')}
        initial={animation.hide}
        animate={animation.show}
        transition={{ delay: 0.6 }}
      >
        current favorite tech stack/tools:
      </m.p>
      <m.ul
        className={clsx(
          'flex items-center gap-3.5 text-slate-500',
          'dark:text-slate-500'
        )}
        initial="hide"
        animate="show"
        transition={{ delayChildren: 0.6, staggerChildren: 0.025 }}
      >
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#cf0202]')}>
            <JavaIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#049115]')}>
            <SpringBootIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#f7d683]')}>
            <HibernateIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>

        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#961754]')}>
            <MavenIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#105082]')}>
            <PostgresIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#6b0202]')}>
            <SqlServerIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('h-3 w-[1px] bg-slate-300 dark:bg-slate-700')} />
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#FFFFFF]')}>
            <IntellijIdeaIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
        <m.li variants={animation}>
          <div className={clsx('transition duration-200 hover:text-[#fa5c5c]')}>
            <GitIcon className={clsx('h-6 w-6')} />
          </div>
        </m.li>
      </m.ul>
    </div>
  );
}

export default HeaderTechStack;
