/* eslint-disable */
import { FaChevronDown } from 'react-icons/fa';
import ProgressBar from './ProgressBar';

function Accordion({
  title,
  children,
  isOpen,
  onClick,
  index,
  icons,
  progress,
}) {
  return (
    <div
      className={` ${
        isOpen
          ? 'mx-0'
          : 'margin-size mx-20 border border-gray-300 dark:border-gray-700'
      } mt-6 rounded-xl p-4 px-5 ${
        isOpen ? 'transition-all duration-500 ease-in-out' : ''
      }`}
    >
      <div className="cursor-pointer" onClick={onClick}>
        {!isOpen && (
          <h2 className="flex items-center ">
            <span className="text-xl font-bold">
              {index}. {title}
            </span>
            {icons.map((Icon, i) => (
              <span key={i} className={`ml-${i === 0 ? '10' : '2'}`}>
                {Icon}
              </span>
            ))}
            <ProgressBar progress={progress} className="ml-auto" />
            <span className="ml-10">{isOpen ? '' : <FaChevronDown />}</span>
          </h2>
        )}
      </div>
      <div
        className={`overflow-hidden ${
          isOpen
            ? 'max-h-full transition-all duration-500 ease-in-out'
            : 'max-h-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default Accordion;
