"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export type SearchableSelectOption = {
  value: string;
  label: string;
  searchText?: string;
};

type SearchableSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  fieldClassName: string;
  placeholder?: string;
  emptyLabel?: string;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("ru");
}

function matchesQuery(option: SearchableSelectOption, query: string) {
  if (!query) {
    return true;
  }

  const haystack = normalizeSearch(option.searchText ?? option.label);
  return haystack.includes(query);
}

export function SearchableSelect({
  id,
  label,
  value,
  onChange,
  options,
  fieldClassName,
  placeholder,
  emptyLabel = "Все",
}: SearchableSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(
    null,
  );

  const selected = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    return options.filter((option) => matchesQuery(option, normalizedQuery));
  }, [options, query]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      setDropdownPosition(null);
      return;
    }

    function updatePosition() {
      if (!inputRef.current) {
        return;
      }

      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, filteredOptions.length]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        rootRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
      setQuery("");
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(nextValue: string) {
    onChange(nextValue);
    setQuery("");
    setIsOpen(false);
  }

  const displayValue = isOpen ? query : (selected?.label ?? "");

  const dropdown =
    mounted && isOpen && dropdownPosition ? (
      <ul
        ref={listRef}
        id={listId}
        style={{
          position: "fixed",
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 200,
        }}
        className="max-h-60 overflow-auto rounded-xl border border-white/10 bg-card shadow-2xl shadow-black/40"
      >
        <li>
          <button
            type="button"
            onClick={() => handleSelect("")}
            className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-white/5 ${
              !value ? "bg-accent/15 text-accent" : ""
            }`}
          >
            {emptyLabel}
          </button>
        </li>
        {filteredOptions.map((option) => (
          <li key={option.value}>
            <button
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-white/5 ${
                value === option.value ? "bg-accent/15 text-accent" : ""
              }`}
            >
              {option.label}
            </button>
          </li>
        ))}
        {filteredOptions.length === 0 && (
          <li className="px-4 py-2 text-sm text-muted">Ничего не найдено</li>
        )}
      </ul>
    ) : null;

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="mb-2 block text-sm text-muted">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={displayValue}
        placeholder={placeholder ?? emptyLabel}
        onFocus={() => {
          setIsOpen(true);
          setQuery(selected?.label ?? "");
        }}
        onChange={(event) => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          setIsOpen(true);

          if (!nextQuery.trim()) {
            onChange("");
          }
        }}
        className={fieldClassName}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        autoComplete="off"
      />

      {dropdown && createPortal(dropdown, document.body)}
    </div>
  );
}
