interface TabSwitcherProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export default function TabSwitcher({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabSwitcherProps) {
  return (
    <div className={`flex w-fit ${className}`}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab;
        const isFirst = index === 0;
        const isLast = index === tabs.length - 1;

        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`
              px-4 py-2 text-sm !font-medium transition-all
              ${
                isActive
                  ? "bg-light-red text-primary-red border border-primary-red z-10"
                  : "text-secondary-text border border-secondary-text"
              }
              ${isFirst ? "rounded-l-lg" : "-ml-[1px]"}
              ${isLast ? "rounded-r-lg" : ""}
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
