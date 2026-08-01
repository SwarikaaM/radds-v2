import { useCallback, useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function InputRow({ input, value, onChange }) {
  const { key, label, prefix, suffix, min, max, step, helper, decimals } = input;

  // Format utility for clean displays
  const getFormattedValue = (val) => {
    return decimals
      ? Number(val).toFixed(decimals)
      : Number(val).toLocaleString("en-IN");
  };

  // 1. Maintain local raw text state so the user retains complete typing control
  const [inputValue, setInputValue] = useState(() => getFormattedValue(value));
  // 2. Track focus to prevent parent updates from interrupting mid-keystroke
  const [isFocused, setIsFocused] = useState(false);

  // Sync state if the value is modified outside (e.g., via the range slider)
  useEffect(() => {
    if (!isFocused) {
      setInputValue(getFormattedValue(value));
    }
  }, [value, decimals, isFocused]);

  const handleSlider = (e) => {
    const val = Number(e.target.value);
    onChange(key, val);
    setInputValue(getFormattedValue(val));
  };

  const handleNumber = (e) => {
    const raw = e.target.value;

    // Allow digits, commas, and a single decimal point anywhere
    if (/[^0-9.,]/.test(raw)) return;

    // Update local string state immediately so characters appear instantly
    setInputValue(raw);

    // Parse the actual value for instant parent recalculation
    const cleanRaw = raw.replace(/,/g, "");
    
    // If the input ends with a floating decimal point or trailing zero, 
    // update parent with parsed value but do not interrupt local keystrokes
    if (!isNaN(cleanRaw) && cleanRaw !== "" && !raw.endsWith(".")) {
      const parsed = decimals ? parseFloat(cleanRaw) : parseInt(cleanRaw, 10);
      if (!isNaN(parsed)) {
        // Clamp loosely while typing so they can reach numbers but prevent breaking boundaries
        onChange(key, Math.min(max, Math.max(0, parsed))); 
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Remove local commas on focus to make editing easier for the user
    const cleanRaw = inputValue.replace(/,/g, "");
    setInputValue(cleanRaw);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const cleanRaw = inputValue.replace(/,/g, "");
    const parsed = decimals ? parseFloat(cleanRaw) : parseInt(cleanRaw, 10);
    const finalValue = isNaN(parsed) ? min : clamp(parsed, min, max);

    // Save strictly clamped and formatted numbers across states on blur
    onChange(key, finalValue);
    setInputValue(getFormattedValue(finalValue));
  };

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <label className="text-textmuted text-sm font-medium flex-1">{label}</label>
        
        {/* Number input box */}
        <div className="flex items-center gap-1 bg-white border border-[#D1DDE8] focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(34,86,143,0.08)] rounded-input px-3 py-2 transition-all duration-200 min-w-[120px]">
          {prefix && <span className="text-textmuted text-sm font-mono-num">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            className="w-full text-sm font-mono-num font-semibold text-textprimary bg-transparent outline-none text-center"
            value={inputValue}
            onChange={handleNumber}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {suffix && <span className="text-textmuted text-xs font-mono-num whitespace-nowrap">{suffix}</span>}
        </div>
      </div>

      {/* Slider */}
      <div className="relative h-6 flex items-center">
        <div className="w-full h-1.5 bg-[#E2EBF5] rounded-full relative">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-100 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSlider}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-6"
          style={{ zIndex: 2 }}
        />
        <div
          className="absolute w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md pointer-events-none transition-all duration-100 ease-out"
          style={{ left: `calc(${pct}% - 8px)` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-textmuted font-mono-num">
        <span>{prefix}{min.toLocaleString("en-IN")}{suffix?.trim()}</span>
        <span>{prefix}{max.toLocaleString("en-IN")}{suffix?.trim()}</span>
      </div>

      {helper && (
        <p className="text-[11px] text-textmuted/70 italic">{helper}</p>
      )}
    </div>
  );
}

export default function CalculatorInputPanel({ inputs, values, onChange }) {
  const handleChange = useCallback((key, val) => {
    onChange({ ...values, [key]: val });
  }, [values, onChange]);

  const primaryInputs = inputs.filter((i) => !i.advanced);
  const advancedInputs = inputs.filter((i) => i.advanced);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-textprimary font-semibold text-base mb-0.5">Configure Inputs</h3>
        <p className="text-textmuted text-xs">All results update instantly as you adjust</p>
      </div>

      {primaryInputs.map((input) => (
        <InputRow key={input.key} input={input} value={values[input.key]} onChange={handleChange} />
      ))}

      {advancedInputs.length > 0 && (
        <div className="border-t border-[#E2EBF5] pt-5">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="text-textprimary font-semibold text-sm">Important Assumptions</span>
            {showAdvanced
              ? <ChevronUp size={16} className="text-primary" />
              : <ChevronDown size={16} className="text-textmuted" />}
          </button>
          {showAdvanced && (
            <div className="space-y-7 mt-5">
              {advancedInputs.map((input) => (
                <InputRow key={input.key} input={input} value={values[input.key]} onChange={handleChange} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

