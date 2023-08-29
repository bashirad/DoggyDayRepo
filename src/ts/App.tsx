import "bootstrap";
import "../scss/styles.scss";

import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import DirectoryPage from "./pages/DirectoryPage";
import { useEffect, useState } from "react";
import { AirtableConfig } from "./clients/AirtableClient";
import DoggyDayApiClient, {
  DoggyDayApiClientContext,
} from "./clients/DoggyDayApiClient";
import AirtableForm from "./components/auth/AirtableForm";
import UserPage from "./pages/UserPage";

const router = createHashRouter([
  {
    path: "/",
    element: <DirectoryPage />,
  },
  {
    path: "/users/:userId",
    element: <UserPage />,
  },

]);

const App = () => {
  const [airtableConfig, setAirtableConfig] = useState<AirtableConfig>();
  const [doggyDayApiClient, setDoggyDayApiClient] = useState<DoggyDayApiClient>(
    new DoggyDayApiClient()
  );

  useEffect(() => {
    setDoggyDayApiClient(new DoggyDayApiClient({ airtableConfig }));
  }, [airtableConfig]);

  return (
    <React.StrictMode>
      <DoggyDayApiClientContext.Provider value={doggyDayApiClient}>
        <div className="container py-4 px-3 mx-auto">
          <h1>DoggyDay Admin UI</h1>
          <AirtableForm airtableConfigChanged={setAirtableConfig} />
          <RouterProvider router={router} />
        </div>
      </DoggyDayApiClientContext.Provider>
    </React.StrictMode>
  );
};

export default App; 