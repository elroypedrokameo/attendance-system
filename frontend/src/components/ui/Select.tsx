import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export interface Option {
  value: string | number;
  label: string;
  content?: ReactNode;
}

export interface SelectChangeEvent {
  target: {
    value: string;
    name?: string;
  };
  currentTarget: {
    value: string;
    name?: string;
  };
}

export interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: Option[] | string[];
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (e: SelectChangeEvent) => void;
  icon?: ReactNode;
  searchable?: boolean;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  className?: string;
  menuClassName?: string;
  optionClassName?: string;
  selectedClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options: rawOptions = [],
  placeholder = "Select...",
  value: controlledValue,
  defaultValue,
  onChange,
  icon,
  searchable = false,
  disabled = false,
  required = false,
  id,
  name,
  className = "",
  menuClassName = "",
  optionClassName = "",
  selectedClassName = "bg-zinc-100 font-medium",
}) => {
  const selectId = id || name;

  const [internalValue, setInternalValue] = useState<string>(
    defaultValue != null ? String(defaultValue) : "",
  );
  const currentValue =
    controlledValue !== undefined
      ? controlledValue != null
        ? String(controlledValue)
        : ""
      : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [position, setPosition] = useState({
    openUp: false,
    top: 0,
    bottom: 0,
    left: 0,
    width: 0,
    maxHeight: 220,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: Option[] = useMemo(() => {
    return (Array.isArray(rawOptions) ? rawOptions : [])
      .filter(Boolean)
      .map((opt) => {
        if (typeof opt === "string" || typeof opt === "number") {
          return { value: String(opt), label: String(opt) };
        }
        return {
          ...opt,
          value: opt.value != null ? String(opt.value) : "",
          label:
            opt.label != null ? String(opt.label) : String(opt.value ?? ""),
        };
      });
  }, [rawOptions]);

  const allOptions: Option[] = useMemo(() => {
    if (
      placeholder &&
      !required &&
      !normalizedOptions.some((o) => o.value === "")
    ) {
      return [{ value: "", label: placeholder }, ...normalizedOptions];
    }
    return normalizedOptions;
  }, [normalizedOptions, placeholder, required]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return allOptions;
    const term = search.toLowerCase();
    return allOptions.filter((o) => o.label.toLowerCase().includes(term));
  }, [allOptions, searchable, search]);

  const selectedOption = allOptions.find((o) => o.value === currentValue);
  const selectedLabel = selectedOption ? selectedOption.label : "";

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const GAP = 4;
    const MARGIN = 8;
    const CHROME = 16;
    const PREFERRED = 220;

    const spaceBelow = window.innerHeight - rect.bottom - GAP - MARGIN;
    const spaceAbove = rect.top - GAP - MARGIN;
    const openUp = spaceBelow < PREFERRED && spaceAbove > spaceBelow;
    const maxHeight = Math.max(
      120,
      Math.min(PREFERRED, (openUp ? spaceAbove : spaceBelow) - CHROME),
    );

    setPosition({
      openUp,
      left: rect.left,
      width: rect.width,
      top: rect.bottom + GAP,
      bottom: window.innerHeight - rect.top + GAP,
      maxHeight,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable) {
      inputRef.current?.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue: string | number) => {
    const stringVal = String(optionValue);
    setInternalValue(stringVal);
    setIsOpen(false);
    setSearch("");

    if (onChange) {
      onChange({
        target: {
          value: stringVal,
          name: name || id,
        },
        currentTarget: {
          value: stringVal,
          name: name || id,
        },
      });
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-zinc-800 mb-1"
        >
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}

      {/* The trigger is a div, so this keeps the native "required" check working. */}
      {required && (
        <input
          type="text"
          className="sr-only"
          tabIndex={-1}
          value={currentValue}
          required={required}
          onChange={() => {}}
        />
      )}

      <div
        ref={containerRef}
        id={selectId}
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev);
          }
        }}
        className={`h-10 w-full px-3 rounded-lg border text-sm flex items-center justify-between transition-colors shadow-xs ${
          disabled
            ? "bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed"
            : error
              ? "bg-white border-rose-500 text-zinc-900 cursor-pointer ring-1 ring-rose-500/20"
              : isOpen
                ? "bg-white border-zinc-900 ring-2 ring-zinc-900/10 cursor-pointer"
                : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-900 cursor-pointer"
        } ${className}`}
      >
        {searchable && isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder={selectedLabel || placeholder}
            className="min-w-0 flex-1 h-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none border-none shadow-none ring-0 focus:outline-none focus:border-none focus:ring-0 focus:shadow-none p-0"
          />
        ) : (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {icon}
            <span
              className={`min-w-0 truncate ${
                selectedLabel && (!placeholder || currentValue !== "")
                  ? "text-zinc-900"
                  : "text-zinc-400"
              }`}
            >
              {selectedLabel || placeholder}
            </span>
          </div>
        )}

        <ChevronDown
          className={`w-4 h-4 shrink-0 text-zinc-500 transition-transform duration-200 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {error ? (
        <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-zinc-500">{helperText}</p>
      ) : null}

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className={`bg-white border border-zinc-200 rounded-lg p-1.5 overflow-hidden shadow-lg ${menuClassName}`}
            style={{
              position: "fixed",
              left: position.left,
              width: position.width,
              ...(position.openUp
                ? { bottom: position.bottom }
                : { top: position.top }),
              zIndex: 9999,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="space-y-0.5 overflow-y-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar]:w-0.75"
              style={{ maxHeight: position.maxHeight }}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-xs text-zinc-400 text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = currentValue === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`flex items-center rounded-md justify-between px-3 py-2 text-xs sm:text-sm text-zinc-900 cursor-pointer transition-colors hover:bg-zinc-100 ${
                        isSelected ? selectedClassName : ""
                      } ${optionClassName}`}
                    >
                      <span className="min-w-0 truncate">
                        {opt.content ?? opt.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-zinc-700 shrink-0 ml-2" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

Select.displayName = "Select";
