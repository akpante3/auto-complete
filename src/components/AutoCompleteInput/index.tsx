/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  ChangeEvent,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useAutoCompleteUtils } from "./useAutoCompleteUtils";
import "./AutoCompleteInput.css";

interface AutoCompleteInputProps {
  getOptions: () => Promise<string[]>;
  inputPlaceHolder: string;
  disableInput?: boolean;
  defaultInputValue?: string;
  classes?: string[];
  inputLabel?: string;
  // TODO:  options should be used to pass static option list, in cases why async data is not being used
  // options?: string[];
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  getOptions,
  inputPlaceHolder,
  disableInput = false,
  defaultInputValue = "",
  classes = [],
  inputLabel = "",
  //   options = [],
}) => {
  const {
    handleListItemKeyDown,
    handleInputKeyDown,
    handleListItemOnMouseOver,
    highlightText,
    listItemRefs,
    inputRef,
    inputValue,
    filteredOptions,
    setInputValue,
    loading,
    handleOptionClick,
    getListItems,
    listRef,
  } = useAutoCompleteUtils();
  let timeoutIDRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (timeoutIDRef.current) {
      clearTimeout(timeoutIDRef.current);
    }

    const value = e.target.value;

    setInputValue(value);
    // debounce
    timeoutIDRef.current = setTimeout(() => {
      getListItems(e, value, getOptions);
    }, 400);
  }, []);

  useEffect(() => {
    if (defaultInputValue.length) {
      setInputValue(defaultInputValue);
    }
    return () => {
      if (timeoutIDRef.current) {
        clearTimeout(timeoutIDRef.current);
      }
    };
  }, []);

  return (
    <section className={["auto-complete-input", ...classes].join(" ")}>
      {inputLabel ? (
        <label
          data-testid={"input-label"}
          htmlFor="auto-complete-input"
          className="input-label"
        >
          {inputLabel}
        </label>
      ) : null}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={inputPlaceHolder}
        onKeyDown={handleInputKeyDown}
        ref={inputRef}
        disabled={disableInput}
        role="combobox"
        aria-controls="options-list"
        aria-expanded
        id="auto-complete-input"
        tabIndex={0}
        aria-autocomplete="list"
        aria-labelledby="auto-complete-input"
      />

      {/* {loading ? <p data-testid="loader">loading...</p> : null} */}

      {filteredOptions.length > 0  && (
        <ul id="options-list" className="auto-complete-options" ref={listRef}>
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(option)}
              tabIndex={0}
              onMouseOver={(e) => handleListItemOnMouseOver(e, index)}
              ref={(element) => (listItemRefs.current[index] = element)}
              data-testid={`option-${index}`}
              onKeyDown={(e) => {
                e.key === "Enter"
                  ? handleOptionClick(option)
                  : handleListItemKeyDown(e, index, option);
              }}
              role="option"
              aria-selected="false"
              aria-labelledby={`option-${index}`}
              dangerouslySetInnerHTML={{
                __html: `<p>${highlightText(option)}</p>`,
              }}
            ></li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AutoCompleteInput;
