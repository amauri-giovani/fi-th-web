type Props = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
};

export function GroupTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-300">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-4 py-2 text-sm font-medium transition-all rounded-t-md
              ${
                isActive
                  ? "bg-blue-100 text-primary border-b-2 border-primary"
                  : "bg-white text-gray-600 hover:text-primary border-b-2 border-transparent"
              }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
