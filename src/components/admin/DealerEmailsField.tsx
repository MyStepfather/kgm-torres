"use client";

type DealerEmailsFieldProps = {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  fieldClassName: string;
};

export function DealerEmailsField({
  label = "Email",
  values,
  onChange,
  fieldClassName,
}: DealerEmailsFieldProps) {
  const rows = values.length ? values : [""];

  function updateRow(index: number, value: string) {
    const next = [...rows];
    next[index] = value;
    onChange(next);
  }

  function addRow() {
    onChange([...rows, ""]);
  }

  function removeRow(index: number) {
    if (rows.length === 1) {
      onChange([""]);
      return;
    }

    onChange(rows.filter((_, rowIndex) => rowIndex !== index));
  }

  return (
    <div className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      <div className="space-y-2">
        {rows.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="email"
              value={value}
              onChange={(event) => updateRow(index, event.target.value)}
              className={fieldClassName}
              placeholder="dealer@example.com"
            />
            <button
              type="button"
              onClick={() => removeRow(index)}
              className="btn-secondary shrink-0 px-3"
              aria-label="Удалить email"
            >
              −
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRow}
        className="link-brand mt-2 text-sm"
      >
        + Добавить email
      </button>
    </div>
  );
}

export function normalizeDealerEmailInputs(values: string[]) {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim().toLowerCase())
    .filter((value) => {
      if (!value || seen.has(value)) {
        return false;
      }

      seen.add(value);
      return true;
    });
}
