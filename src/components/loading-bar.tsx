export default function LoadingBar({ percentage }: { percentage: number }) {
  return (
    <div className="border border-white overflow-hidden relative rounded-[25px] w-1/2 h-[30px]">
      <div
        className="w-0 h-full bg-[#4caf50] transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
