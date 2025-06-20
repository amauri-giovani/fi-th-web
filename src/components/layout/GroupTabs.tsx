type Props = {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
};

export function GroupTabs({ tabs, active, onChange }: Props) {
  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = tab === active;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-all
              ${
                isActive
                  ? "bg-purple-100 text-primary border-b-4 border-purple-800"
                  : "bg-white text-gray-600 hover:text-primary"
              }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
