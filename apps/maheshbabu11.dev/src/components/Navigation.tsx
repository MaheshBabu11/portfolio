import clsx from 'clsx';

import {
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from '@/components/Icons';
import NavIcon from '@/components/navigations/NavIcon';
import NavIconQuickAccess from '@/components/navigations/NavIconQuickAccess';
import NavLink from '@/components/navigations/NavLink';
import NavLinkDropdown from '@/components/navigations/NavLinkDropdown';
import NavLinkExpanded from '@/components/navigations/NavLinkExpanded';
import NavLogo from '@/components/navigations/NavLogo';

import useOnScroll from '@/hooks/useOnScroll';

const workLinks = [
  { title: 'Skills & Tools', href: '/work/skills-and-tools' },
  { title: 'Experience', href: '/work/experience' },
  { title: 'Contact', href: '/work/contact' },
];

function Navbar() {
  const isScrolled = useOnScroll(0);

  return (
    <header
      className={clsx('fixed left-0 right-0 top-0 z-[1000]', 'fm:absolute')}
    >
      <div
        className={clsx(
          'fixed inset-0 h-16',
          [
            isScrolled === true && [
              'border-divider-light border-b bg-white/70 backdrop-blur',
              'dark:border-divider-dark dark:bg-slate-900/80',
            ],
          ],
          'fm:hidden'
        )}
      />
      <div className={clsx('h-2', [isScrolled === true && ['-mt-2']])} />
      <div className={clsx('content-wrapper-max')}>
        <div
          className={clsx(
            'relative z-50 flex h-16 items-center justify-between px-2 text-sm',
            'md:px-4'
          )}
        >
          <nav className={clsx('flex', 'md:gap-2')} data-accent="violet">
            <NavLogo href="/" title="Home" />
            <ul className={clsx('flex items-center', 'md:gap-1')}>
              <li>
                <NavLink title="Projects" href="/projects" />
              </li>
              <li>
                <NavLink title="Blog" href="https://blog.maheshbabu11.dev/" />
              </li>

              <li className={clsx('lg:hidden')} data-accent="blue">
                <NavLinkDropdown title="Work" items={workLinks} />
              </li>
              <li className={clsx('hidden lg:block')} data-accent="blue">
                <NavLinkExpanded title="Work" items={workLinks} />
              </li>
            </ul>
          </nav>
          <ul className={clsx('flex items-center')}>
            <li className={clsx('hidden', 'sm:block')}>
              <NavIcon
                href="https://www.linkedin.com/in/maheshbabu11/"
                icon={<LinkedInIcon className={clsx('h-5 w-5')} />}
                title="Twitter"
              />
            </li>
            <li className={clsx('hidden', 'sm:block')}>
              <NavIcon
                href="https://www.instagram.com/m_r.coder/"
                icon={<InstagramIcon className={clsx('h-5 w-5')} />}
                title="Instagram"
              />
            </li>
            <li className={clsx('hidden', 'sm:block')}>
              <NavIcon
                href="https://twitter.com/MaheshBabu11_"
                icon={<TwitterIcon className={clsx('h-5 w-5')} />}
                title="Twitter"
              />
            </li>
            <li className={clsx('hidden', 'sm:block')}>
              <NavIcon
                href="https://github.com/MaheshBabu11"
                icon={<GitHubIcon className={clsx('h-5 w-5')} />}
                title="GitHub"
              />
            </li>
            <li className={clsx('hidden', 'sm:block')}>
              <div
                className={clsx(
                  'ml-2 mr-4 h-3 w-[1px] bg-slate-200',
                  'dark:bg-slate-700'
                )}
              />
            </li>
            <li className={clsx('mr-2')}>
              <NavIconQuickAccess />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
