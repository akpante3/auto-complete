import {
  useState,
  ChangeEvent,
  useRef,
  KeyboardEvent,
  MouseEvent,
} from "react";

export function useAutoCompleteUtils() {
  const listRef = useRef<HTMLUListElement | null>(null);
  const listItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputValueRef = useRef<string>('')



  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
    value: string,
    getOptions: () => Promise<string[]>

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


  // Keyboard Event: KeyDown
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && listRef.current) {
      const firstListItem = listRef.current.querySelector("li");
      setInputValue((prevText: string) => firstListItem?.innerText || prevText);

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
    option: string,
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


  return {
    handleListItemKeyDown,
    handleArrowUp,
    handleInputKeyDown,
    getListItems,
    handleListItemOnMouseOver,
    highlightText,
    listItemRefs,
    inputRef,
    setInputValue,
    inputValue,
    filteredOptions,
    loading,
    handleOptionClick,
    listRef,
    inputValueRef
  };
}
