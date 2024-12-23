export default function Tag({
  label,
  removeItem,
  isActive,
  dueDate,
}: {
  label: string;
  removeItem?(name: string, key: string): void | undefined;
  isActive?: boolean;
  dueDate?: number;
}) {
  return (
    <div
      className={`flex items-center border border-black rounded-[20px] text-[12px] py-[3px] px-[8px] gap-1 ${
        isActive && "bg-[rgb(44,41,41)]"
      } ${
        dueDate && dueDate < 4
          ? dueDate < 2
            ? "bg-[#eb3e3e]"
            : "bg-[#ffa500]"
          : "bg-[rgb(59,130,246)]"
      }`}
    >
      <div className={`${isActive && "text-white"}`}>{label}</div>
      {removeItem && (
        <button
          className="rounded-[10px] w-3 h-3 flex justify-center items-center hover:bg-[rgb(44,108,210)]"
          onClick={() => removeItem(label, "tags")}
        >
          x
        </button>
      )}
    </div>
  );
}
