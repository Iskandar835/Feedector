export default function Button({
  onClick,
  content,
}: {
  onClick: () => void;
  content: string;
}) {
  return (
    <button
      onClick={onClick}
      className="group shadow-xs group-hover:before:duration-300 group-hover:after:duration-300 after:duration-300 hover:border-[var(--BG-color)] hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-300 before:duration-300 hover:duration-300  hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur-2xl origin-left hover:decoration-2 hover:text-[var(--main-color)] relative bg-white h-14 w-44 border text-center p-3 text-[var--(Txt-color)] cursor-pointer text-base pointer font-bold rounded-lg overflow-hidden before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-[var(--main-color)] before:rounded-full before:blur-xl after:absolute after:z-10 after:w-20 after:h-20 after:content[''] after:bg-[var(--secondary-color)] after:right-8 after:top-3 after:rounded-full after:blur-xl"
    >
      {content}
    </button>
  );
}
