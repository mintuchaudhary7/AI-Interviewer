export default function Card({ children, className = "" }) {
  return (
    <div
      className={`p-6 rounded-xl bg-slate-900 border-2 border-slate-700 shadow-[4px_4px_0px_#475569] transition duration-300 hover:shadow-[6px_6px_0px_#475569] ${className}`}
    >
      {children}
    </div>
  );
}
