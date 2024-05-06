import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
} from "@testing-library/react";
import AutoCompleteInput from "../components/AutoCompleteInput";

describe("AutoCompleteInput", () => {
  // Render
  it("should renders without crashing", () => {
    render(
      <AutoCompleteInput
        getOptions={async () => ["Option 1", "Option 2"]}
        inputPlaceHolder="Search"
      />
    );
  });
    // Test passing Props
    it("input should respond to defaultInputValue, disableInput and inputLabel props", () => {
      render(
        <AutoCompleteInput
          getOptions={async () => ["option 1", "option 2"]}
          inputPlaceHolder="Search"
          disableInput={false}
          inputLabel={'label'}
          defaultInputValue={'input'}
        />
      );
      const inputElement = screen.getByRole("combobox");
      expect(inputElement).toHaveValue('input');

      const inputLabel = screen.getByTestId('input-label');
      expect(inputLabel).toBeInTheDocument();

    });
  // testing All  Props
  it("should renders input placeholder correctly", () => {
    render(
      <AutoCompleteInput
        getOptions={async () => ["option 1", "option 2"]}
        inputPlaceHolder="Search"
      />
    );
    const inputElement = screen.getByPlaceholderText("Search");
    expect(inputElement).toBeInTheDocument();
  });

  it("should updates input value on change", async () => {
    render(
      <AutoCompleteInput
        getOptions={async () => ["Option 1", "Option 2"]}
        inputPlaceHolder="Search"
      />
    );

    const inputElement = screen.getByPlaceholderText(
      "Search"
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: "test" } });

    await waitFor(() => {
      expect(inputElement.value).toBe("test");
    });
  });
  // Render Options
  it("should renders options list correctly", async () => {
    render(
      <AutoCompleteInput
        getOptions={async () => ["option1", "option2"]}
        inputPlaceHolder="Search"
      />
    );

    const inputElement = screen.getByPlaceholderText("Search");
    fireEvent.change(inputElement, { target: { value: "option" } });

    await waitFor(() => {
      const option1 = screen.getByTestId("option-0");
      expect(option1).toBeInTheDocument();
    });

    await waitFor(() => {
      const option2 = screen.getByTestId("option-1");
      expect(option2).toBeInTheDocument();
    });
  });
  // Options Click Event
  it("should selects an option value, onClick of option", async () => {
    let option1;
    render(
      <AutoCompleteInput
        getOptions={async () => ["option1", "option2"]}
        inputPlaceHolder="Search"
      />
    );

    const inputElement = screen.getByPlaceholderText("Search");
    fireEvent.change(inputElement, { target: { value: "optio" } });

    await waitFor(() => (option1 = screen.getByTestId("option-0")));

    if (option1) {
      fireEvent.click(option1);
    }

    await waitFor(async () => {
      await expect(inputElement).toHaveValue("option1");
    });
  });
  // EVENT: Keyboard event "Enter"
  it("should selects an option value on keyboard Enter", async () => {
    let option1;
    render(
      <AutoCompleteInput
        getOptions={async () => ["option1", "option2"]}
        inputPlaceHolder="Search"
      />
    );

    const inputElement = screen.getByPlaceholderText("Search");

    fireEvent.change(inputElement, { target: { value: "optio" } });

    await waitFor(() => (option1 = screen.getByTestId("option-0")));
    if (option1) {
      fireEvent.keyDown(option1, { key: "Enter" });
    }

    await waitFor(async () => {
      await expect(inputElement).toHaveValue("option1");
    });
  });

  it("should focus on the inputElement on keyboard event: Arrow UP", async () => {
    let option1;
    render(
      <AutoCompleteInput
        getOptions={async () => ["option1"]}
        inputPlaceHolder="Search"
      />
    );

    const inputElement = screen.getByPlaceholderText("Search");

    fireEvent.change(inputElement, { target: { value: "optio" } });

    await waitFor(() => (option1 = screen.getByRole("option")));
    if (option1) {
      fireEvent.keyDown(option1, { key: "ArrowUp" });
    }

    await waitFor(async () => {
      await expect(inputElement).toHaveFocus();
    });
  });

  it("should selects an option value on keyboard event Arrow Down", async () => {
    let option1;
    render(
      <AutoCompleteInput
        getOptions={async () => ["option1"]}
        inputPlaceHolder="Search"
      />
    );

    const inputElement = screen.getByPlaceholderText("Search");

    fireEvent.change(inputElement, { target: { value: "optio" } });
    inputElement.focus();
    await waitFor(() => (option1 = screen.getByRole("option")));
    fireEvent.keyDown(inputElement, { key: "ArrowDown" });

    await expect(option1).toHaveFocus();

    await waitFor(async () => {
      await expect(inputElement).toHaveValue("optio");
    });
  });

});
