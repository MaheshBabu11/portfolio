function Accordion({ title, children, isOpen, onClick, index, icon }) {
  return (
    <div
      className={` ${
        isOpen ? 'mx-0' : 'mx-10 border'
      } mt-2 rounded-xl p-2 px-5 ${
        isOpen ? 'transition-all duration-500 ease-in-out' : ''
      }`}
    >
      <div className="cursor-pointer" onClick={onClick}>
        <h2 className="flex items-center">
          <span>
            {index}. {title}
            <span className="ml-2">{icon} </span>
          </span>
        </h2>
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
