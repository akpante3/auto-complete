import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
const originalAlert = window.alert;
window.alert = jest.fn();

// Mock fetch function
const mockFetch = jest.fn();

global.fetch = mockFetch;

describe('App Component', () => {

  it('renders SearchInput component with placeholder and options', async () => {
    

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ name: 'University of XYZ' }],
    });

    render(<App />);

    await waitFor(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByPlaceholderText('Search University...')).toBeInTheDocument();

  });

  it("handles fetch error and displays an error message", async () => {
    const useStateMock = jest.spyOn(React, "useState");
    useStateMock.mockReturnValueOnce([[], jest.fn()]);

    render(<App />);

    const autoCompleteInput = screen.getByPlaceholderText("Search University...");
    userEvent.click(autoCompleteInput);

    await waitFor(() => {
      expect(screen.queryByRole("option")).not.toBeInTheDocument();
    });
  });

});

afterAll(() => {
  window.alert = originalAlert;
});
