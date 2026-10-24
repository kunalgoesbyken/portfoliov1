export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

const OPTION_CLASS = "px-3 py-1.5 text-xs font-medium transition-colors duration-200";
const ACTIVE_CLASS = "bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50";
const IDLE_CLASS = "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100";

export function SegmentedControl<T extends string>({ label, options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className="frame-dashed flex gap-1 p-1">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={`${OPTION_CLASS} ${isActive ? ACTIVE_CLASS : IDLE_CLASS}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
