export default function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 rounded-lg font-semibold border-2 border-yellow-400 shadow-[3px_3px_0px_#facc15] transition duration-150 hover:shadow-[1px_1px_0px_#facc15] hover:translate-x-[2px] hover:translate-y-[2px] ${className}`}
    >
      {children}
    </button>
  );
}
