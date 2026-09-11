"use client";

import { useEffect, useMemo, useState } from "react";

// ====================
// TYPES
// ====================

type CalculationMode =
  | "time-addition"
  | "time-subtraction"
  | "time-difference"
  | "date-addition"
  | "date-difference";

type FeatureState = {
  readonly selectedMode: CalculationMode;
  readonly inputA: string;
  readonly inputB: string;
  readonly result: string;
  readonly error: string;
};

type ModeConfig = {
  readonly id: CalculationMode;
  readonly label: string;
  readonly description: string;
  readonly inputALabel: string;
  readonly inputBLabel: string;
  readonly inputAType: "time" | "date";
  readonly inputBType: "time" | "date" | "text" | "number";
  readonly inputAPlaceholder: string;
  readonly inputBPlaceholder: string;
};

type FeatureViewProps = {
  readonly state: FeatureState;
  readonly modeConfig: ModeConfig;
  readonly updateMode: (nextMode: CalculationMode) => void;
  readonly updateInputA: (value: string) => void;
  readonly updateInputB: (value: string) => void;
  readonly handleCalculate: () => void;
  readonly handleReset: () => void;
};

// ====================
// PRIMITIVES
// ====================

const MODE_CONFIGS: readonly ModeConfig[] = [
  {
    id: "time-addition",
    label: "Add duration to time",
    description: "Find what time it will be after adding hours and minutes.",
    inputALabel: "Start time",
    inputBLabel: "Duration",
    inputAType: "time",
    inputBType: "text",
    inputAPlaceholder: "10:30",
    inputBPlaceholder: "7:30 or 7"
  },
  {
    id: "time-subtraction",
    label: "Subtract duration from time",
    description: "Find what time it was before subtracting hours and minutes.",
    inputALabel: "Start time",
    inputBLabel: "Duration",
    inputAType: "time",
    inputBType: "text",
    inputAPlaceholder: "10:30",
    inputBPlaceholder: "4:00 or 4"
  },
  {
    id: "time-difference",
    label: "Difference between two times",
    description: "Find elapsed time between two times.",
    inputALabel: "Start time",
    inputBLabel: "End time",
    inputAType: "time",
    inputBType: "time",
    inputAPlaceholder: "08:00",
    inputBPlaceholder: "15:30"
  },
  {
    id: "date-addition",
    label: "Add days to date",
    description: "Find the date after adding a number of days.",
    inputALabel: "Start date",
    inputBLabel: "Days to add",
    inputAType: "date",
    inputBType: "number",
    inputAPlaceholder: "2026-01-01",
    inputBPlaceholder: "45"
  },
  {
    id: "date-difference",
    label: "Difference between two dates",
    description: "Find the number of days between two dates.",
    inputALabel: "Start date",
    inputBLabel: "End date",
    inputAType: "date",
    inputBType: "date",
    inputAPlaceholder: "2026-01-01",
    inputBPlaceholder: "2026-02-15"
  }
];

const INITIAL_STATE: FeatureState = {
  selectedMode: "time-addition",
  inputA: "",
  inputB: "",
  result: "",
  error: ""
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ====================
// HELPERS
// ====================

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");

    function update(): void {
      setIsMobile(query.matches);
    }

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function getModeConfig(mode: CalculationMode): ModeConfig {
  return MODE_CONFIGS.find((config) => config.id === mode) ?? MODE_CONFIGS[0];
}

function parseTimeToMinutes(value: string): number | null {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

function parseDurationToMinutes(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;

  if (trimmed.includes(":")) {
    const match = trimmed.match(/^(\d+):(\d{1,2})$/);
    if (!match) return null;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (
      !Number.isInteger(hours) ||
      !Number.isInteger(minutes) ||
      hours < 0 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return null;
    }

    return hours * 60 + minutes;
  }

  const hours = Number(trimmed);
  if (!Number.isFinite(hours) || hours < 0) return null;

  return Math.round(hours * 60);
}

function normalizeMinutesInDay(totalMinutes: number): number {
  const minutesPerDay = 24 * 60;
  return ((totalMinutes % minutesPerDay) + minutesPerDay) % minutesPerDay;
}

function formatTimeFromMinutes(totalMinutes: number): string {
  const normalized = normalizeMinutesInDay(totalMinutes);
  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const paddedMinutes = String(minutes).padStart(2, "0");

  return `${hours12}:${paddedMinutes} ${suffix}`;
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hours`;

  return `${hours} hours ${minutes} minutes`;
}

function parseDateToUtcMs(value: string): number | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);

  const utcMs = Date.UTC(year, monthIndex, day);
  const date = new Date(utcMs);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== monthIndex ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return utcMs;
}

function formatDateFromUtcMs(utcMs: number): string {
  const date = new Date(utcMs);

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "UTC"
  }).format(date);
}

function calculateResult(state: FeatureState): Pick<FeatureState, "result" | "error"> {
  const { selectedMode, inputA, inputB } = state;

  if (inputA.trim().length === 0 || inputB.trim().length === 0) {
    return { result: "", error: "Please fill in both inputs." };
  }

  if (selectedMode === "time-addition" || selectedMode === "time-subtraction") {
    const startMinutes = parseTimeToMinutes(inputA);
    const durationMinutes = parseDurationToMinutes(inputB);

    if (startMinutes === null) return { result: "", error: "Please enter a valid start time." };
    if (durationMinutes === null) return { result: "", error: "Please enter duration as hours or H:MM." };

    const finalMinutes =
      selectedMode === "time-addition"
        ? startMinutes + durationMinutes
        : startMinutes - durationMinutes;

    return { result: formatTimeFromMinutes(finalMinutes), error: "" };
  }

  if (selectedMode === "time-difference") {
    const startMinutes = parseTimeToMinutes(inputA);
    const endMinutes = parseTimeToMinutes(inputB);

    if (startMinutes === null || endMinutes === null) {
      return { result: "", error: "Please enter valid start and end times." };
    }

    const rawDifference = endMinutes - startMinutes;
    const difference = rawDifference >= 0 ? rawDifference : rawDifference + 24 * 60;

    return { result: formatDuration(difference), error: "" };
  }

  if (selectedMode === "date-addition") {
    const startDateMs = parseDateToUtcMs(inputA);
    const days = Number(inputB);

    if (startDateMs === null) return { result: "", error: "Please enter a valid start date." };
    if (!Number.isInteger(days)) return { result: "", error: "Please enter a whole number of days." };

    return { result: formatDateFromUtcMs(startDateMs + days * MS_PER_DAY), error: "" };
  }

  if (selectedMode === "date-difference") {
    const startDateMs = parseDateToUtcMs(inputA);
    const endDateMs = parseDateToUtcMs(inputB);

    if (startDateMs === null || endDateMs === null) {
      return { result: "", error: "Please enter valid start and end dates." };
    }

    const days = Math.round((endDateMs - startDateMs) / MS_PER_DAY);

    return { result: `${Math.abs(days)} days`, error: "" };
  }

  return { result: "", error: "Unsupported calculation mode." };
}

// ====================
// COMPOSITION
// ====================

function DesktopFeatureView(props: FeatureViewProps) {
  const {
    state,
    modeConfig,
    updateMode,
    updateInputA,
    updateInputB,
    handleCalculate,
    handleReset
  } = props;

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <FeatureHeader />

        <label style={styles.label} htmlFor="mode">
          Calculation type
        </label>

        <select
          id="mode"
          value={state.selectedMode}
          onChange={(event) => updateMode(event.target.value as CalculationMode)}
          style={styles.input}
        >
          {MODE_CONFIGS.map((config) => (
            <option key={config.id} value={config.id}>
              {config.label}
            </option>
          ))}
        </select>

        <p style={styles.modeDescription}>{modeConfig.description}</p>

        <div style={styles.inputGrid}>
          <CalculatorInput
            label={modeConfig.inputALabel}
            type={modeConfig.inputAType}
            value={state.inputA}
            placeholder={modeConfig.inputAPlaceholder}
            onChange={updateInputA}
          />

          <CalculatorInput
            label={modeConfig.inputBLabel}
            type={modeConfig.inputBType}
            value={state.inputB}
            placeholder={modeConfig.inputBPlaceholder}
            onChange={updateInputB}
          />
        </div>

        <ActionButtons
          handleCalculate={handleCalculate}
          handleReset={handleReset}
          mobile={false}
        />

        <ResultArea error={state.error} result={state.result} />

        <PremiumPlaceholder />

        <FeatureFooter />
      </section>
    </main>
  );
}

function MobileFeatureView(props: FeatureViewProps) {
  const {
    state,
    modeConfig,
    updateMode,
    updateInputA,
    updateInputB,
    handleCalculate,
    handleReset
  } = props;

  return (
    <main style={styles.mobilePage}>
      <section style={styles.mobileCard}>
        <FeatureHeader />

        <label style={styles.label} htmlFor="mobile-mode">
          Calculation type
        </label>

        <select
          id="mobile-mode"
          value={state.selectedMode}
          onChange={(event) => updateMode(event.target.value as CalculationMode)}
          style={styles.mobileInput}
        >
          {MODE_CONFIGS.map((config) => (
            <option key={config.id} value={config.id}>
              {config.label}
            </option>
          ))}
        </select>

        <p style={styles.modeDescription}>{modeConfig.description}</p>

        <CalculatorInput
          label={modeConfig.inputALabel}
          type={modeConfig.inputAType}
          value={state.inputA}
          placeholder={modeConfig.inputAPlaceholder}
          onChange={updateInputA}
          mobile
        />

        <CalculatorInput
          label={modeConfig.inputBLabel}
          type={modeConfig.inputBType}
          value={state.inputB}
          placeholder={modeConfig.inputBPlaceholder}
          onChange={updateInputB}
          mobile
        />

        <ActionButtons
          handleCalculate={handleCalculate}
          handleReset={handleReset}
          mobile
        />

        <ResultArea error={state.error} result={state.result} />

        <PremiumPlaceholder />

        <FeatureFooter />
      </section>
    </main>
  );
}

function FeatureHeader() {
  return (
    <>
      <p style={styles.brand}>Arc Frame Labs</p>

      <h1 style={styles.title}>Time Calculator</h1>

      <p style={styles.description}>
        Quickly add, subtract, and compare times or dates.
      </p>
    </>
  );
}

function CalculatorInput(props: {
  readonly label: string;
  readonly type: "time" | "date" | "text" | "number";
  readonly value: string;
  readonly placeholder: string;
  readonly onChange: (value: string) => void;
  readonly mobile?: boolean;
}) {
  return (
    <label style={styles.field}>
      <span style={styles.label}>{props.label}</span>
      <input
        type={props.type}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        placeholder={props.placeholder}
        style={props.mobile ? styles.mobileInput : styles.input}
      />
    </label>
  );
}

function ActionButtons(props: {
  readonly handleCalculate: () => void;
  readonly handleReset: () => void;
  readonly mobile: boolean;
}) {
  return (
    <div style={props.mobile ? styles.mobileButtonColumn : styles.buttonRow}>
      <button type="button" onClick={props.handleCalculate} style={styles.primaryButton}>
        Calculate
      </button>

      <button type="button" onClick={props.handleReset} style={styles.secondaryButton}>
        Reset
      </button>
    </div>
  );
}

function ResultArea(props: { readonly error: string; readonly result: string }) {
  return (
    <>
      {props.error.length > 0 ? <p style={styles.error}>{props.error}</p> : null}

      {props.result.length > 0 ? (
        <section style={styles.resultBox} aria-live="polite">
          <p style={styles.resultLabel}>Result</p>
          <p style={styles.result}>{props.result}</p>
        </section>
      ) : null}
    </>
  );
}

function PremiumPlaceholder() {
  return (
    <aside style={styles.placeholderBox}>
      <p style={styles.placeholderTitle}>Future premium features</p>
      <p style={styles.placeholderText}>
        Business-day calculations, timezone tools, and saved calculation history
        may be added later.
      </p>
    </aside>
  );
}

function FeatureFooter() {
  return (
    <footer style={styles.footer}>
      <a href="https://arcframelabs.com" style={styles.link}>
        Back to Arc Frame Labs
      </a>
    </footer>
  );
}

export function AppFeature() {
  const [state, setState] = useState<FeatureState>(INITIAL_STATE);
  const isMobile = useIsMobile();

  const modeConfig = useMemo(
    () => getModeConfig(state.selectedMode),
    [state.selectedMode]
  );

  function updateMode(nextMode: CalculationMode): void {
    setState({
      ...INITIAL_STATE,
      selectedMode: nextMode
    });
  }

  function updateInputA(value: string): void {
    setState((current) => ({
      ...current,
      inputA: value,
      result: "",
      error: ""
    }));
  }

  function updateInputB(value: string): void {
    setState((current) => ({
      ...current,
      inputB: value,
      result: "",
      error: ""
    }));
  }

  function handleCalculate(): void {
    setState((current) => ({
      ...current,
      ...calculateResult(current)
    }));
  }

  function handleReset(): void {
    setState((current) => ({
      ...INITIAL_STATE,
      selectedMode: current.selectedMode
    }));
  }

  const sharedProps: FeatureViewProps = {
    state,
    modeConfig,
    updateMode,
    updateInputA,
    updateInputB,
    handleCalculate,
    handleReset
  };

  return isMobile ? (
    <MobileFeatureView {...sharedProps} />
  ) : (
    <DesktopFeatureView {...sharedProps} />
  );
}

// ====================
// EXPORTS
// ====================

export default AppFeature;

// ====================
// LOCAL STYLES
// ====================

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px",
    background: "#f6f7fb",
    color: "#111827",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  },
  mobilePage: {
    minHeight: "100vh",
    padding: "12px",
    background: "#f6f7fb",
    color: "#111827",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  },
  card: {
    maxWidth: "720px",
    margin: "0 auto",
    padding: "28px",
    borderRadius: "18px",
    background: "#ffffff",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)"
  },
  mobileCard: {
    width: "100%",
    boxSizing: "border-box" as const,
    margin: "0 auto",
    padding: "18px",
    borderRadius: "16px",
    background: "#ffffff",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)"
  },
  brand: {
    margin: "0 0 8px",
    color: "#4f46e5",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    fontSize: "0.8rem"
  },
  title: {
    margin: "0",
    fontSize: "2.25rem",
    lineHeight: 1.1
  },
  description: {
    margin: "12px 0 24px",
    color: "#4b5563",
    fontSize: "1rem"
  },
  modeDescription: {
    margin: "10px 0 20px",
    color: "#6b7280"
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px"
  },
  field: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    marginBottom: "14px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 700,
    fontSize: "0.95rem"
  },
  input: {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "1rem"
  },
  mobileInput: {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "14px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "1.05rem"
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "12px",
    marginTop: "20px"
  },
  mobileButtonColumn: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginTop: "18px"
  },
  primaryButton: {
    padding: "14px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#4f46e5",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "1rem"
  },
  secondaryButton: {
    padding: "14px 18px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "1rem"
  },
  error: {
    marginTop: "18px",
    padding: "12px",
    borderRadius: "10px",
    background: "#fee2e2",
    color: "#991b1b"
  },
  resultBox: {
    marginTop: "20px",
    padding: "18px",
    borderRadius: "14px",
    background: "#eef2ff",
    border: "1px solid #c7d2fe"
  },
  resultLabel: {
    margin: "0 0 4px",
    color: "#4338ca",
    fontWeight: 700
  },
  result: {
    margin: 0,
    fontSize: "1.75rem",
    fontWeight: 800
  },
  placeholderBox: {
    marginTop: "24px",
    padding: "16px",
    borderRadius: "14px",
    background: "#f9fafb",
    border: "1px dashed #d1d5db"
  },
  placeholderTitle: {
    margin: "0 0 6px",
    fontWeight: 700
  },
  placeholderText: {
    margin: 0,
    color: "#6b7280"
  },
  footer: {
    marginTop: "24px",
    paddingTop: "18px",
    borderTop: "1px solid #e5e7eb"
  },
  link: {
    color: "#4f46e5",
    fontWeight: 700,
    textDecoration: "none"
  }
};
