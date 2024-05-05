/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  ChangeEvent,
  useRef,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
} from "react";
import "./AutoCompleteInput.css";

interface AutoCompleteInputProps {
  // TODO: look for proper names to give the getOptions method
  getOptions: () => Promise<string[]>;
  inputPlaceHolder: string;
  disableInput?: boolean;
  defaultInputValue?: string;
  classes?: string[];
  // TODO:  options should be used to pass static option list, in cases why async data is not being used
  // options?: string[];
  // TODO:  onInputChange?: () => {}
  // accepts a callback, will dispatch the inputValue to the Parent component
  // TODO: inputLabel: string
}

const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
  getOptions,
  inputPlaceHolder,
  disableInput = false,
  defaultInputValue = "",
  classes = [],
  //   options = [],
}) => {
  const listRef = useRef<HTMLUListElement | null>(null);
  const listItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(defaultInputValue);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  let timeoutIDRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleOptionClick = (text: string) => {
    setInputValue(text);
    setFilteredOptions([]);
  };

  // sanitize HTML to aviod Cross-Site Scripting (XSS) attack
  // this can be replaced with a reliable React HTML sanitize libary e.g DOMPurify, react-html-parser
  const sanitizeHTML = (input: string): string => {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  const highlightText = (text: string) => {
    if (inputValue.length) {
      const sanitizedInputValue = sanitizeHTML(inputValue.toLowerCase());

      const highlightedText = text.replace(
        new RegExp(sanitizedInputValue, "gi"),
        `<strong>${sanitizedInputValue}</strong>`
      );

      return highlightedText;
    }
    return text;
  };

  // Mouse Event
  const handleListItemOnMouseOver = (
    e: MouseEvent<HTMLLIElement>,
    index: number
  ) => {
    listItemRefs.current[index]?.focus();
  };

  //   onChange Event
  const getListItems = async (
    e: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const checkWhiteSpace = !value.replace(/\s/g, "").length;

    if (checkWhiteSpace) {
      setFilteredOptions([]);
      return;
    }

    setLoading(true);

    try {
      let options;

      options = await getOptions();

      const filteredOptions = options.filter((option: string) =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filteredOptions.slice(0, 10));
      setLoading(false);
    } catch {
      alert("Cannot fetch options at this moment");
      setLoading(false);
    }
  };
  // Debounce fuction
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (timeoutIDRef.current) {
      clearTimeout(timeoutIDRef.current);
    }

    const value = e.target.value;

    setInputValue(value);

    timeoutIDRef.current = setTimeout(() => {
      getListItems(e, value);
    }, 500);
  }, []);

  // Keyboard Event: Key Down
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && listRef.current) {
      const firstListItem = listRef.current.querySelector("li");
      setInputValue((prevText) => firstListItem?.innerText || prevText);

      if (firstListItem) {
        (firstListItem as HTMLLIElement).focus();
      }
    }
  };
  // Arrow-Down Event
  const handleArrowDown = (index: number) => {
    const prevIndex = index - 1;
    if (prevIndex >= 0) {
      listItemRefs.current[prevIndex]?.focus();
      return listItemRefs.current[prevIndex]?.innerText || "";
    }
    listRef.current?.parentElement?.querySelector("input")?.focus();
    return "";
  };
  //   Arrow-Up Event
  const handleArrowUp = (index: number) => {
    const nextIndex = index + 1;

    if (nextIndex < listItemRefs.current.length) {
      listItemRefs.current[nextIndex]?.focus();
      return listItemRefs.current[nextIndex]?.innerText || "";
    }
  };
  // Keyboard Event
  const handleListItemKeyDown = (
    e: KeyboardEvent<HTMLLIElement>,
    index: number,
    option: string
  ) => {
    let currentInputText: string | undefined = "";

    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
      inputRef.current?.focus();
    }

    if (e.key === "ArrowDown" && listRef.current) {
      e.preventDefault();

      currentInputText = handleArrowUp(index);
    } else if (e.key === "ArrowUp" && listRef.current) {
      e.preventDefault();

      currentInputText = handleArrowDown(index);
    }

    setInputValue((prevText) => currentInputText || prevText);
  };

  useEffect(() => {
    return () => {
      if (timeoutIDRef.current) {
        clearTimeout(timeoutIDRef.current);
      }
    };
  }, []);

  return (
    <section className={["auto-complete-input", ...classes].join(" ")}>
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

      {loading ? <p data-testid="loader">loading...</p> : null}

      {filteredOptions.length > 0 && !loading && (
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
