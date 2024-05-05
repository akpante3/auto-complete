/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./App.css";
import AutoCompleteInput from "./components/AutoCompleteInput";

interface University {
  name: string;
}

function App() {
  const [universities, setUniversities] = useState<string[]>([]);

  const fetchUniversities = async () => {
    try {
      if (universities.length > 0) {
        return universities;
      }

      const response = await fetch(
        `http://universities.hipolabs.com/search?country=United+States`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch universities");
      }

      const data: University[] = await response.json();

      const namesOfUniversity = data.map((uni) => uni.name.toLowerCase());
      setUniversities(namesOfUniversity);
      return namesOfUniversity;
    } catch (error) {
      alert("error");
      return [];
    }
  };

  // TODO: fetchUniversities on page load
  useEffect(() => {
    fetchUniversities();
  }, [universities]);

  return (
    <main className="App">
      <AutoCompleteInput
        inputPlaceHolder={"Search University..."}
        getOptions={fetchUniversities}
        classes={["auto-complete-container"]}
        inputLabel = "Search For Universities In The United States"
      />
    </main>
  );
}

export default App;
