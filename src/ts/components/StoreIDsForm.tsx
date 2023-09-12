import React, { FormEvent, useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export interface StoreIDsFormProps {
  id1?: number;
  id2?: number;
  id3?: number;
  id4?: number;
  onSubmit: (ids: number[]) => void;
}

const StoreIDsForm = ({
  id1 = 0,
  id2 = 0,
  id3 = 0,
  id4 = 0,
  onSubmit,
}: StoreIDsFormProps) => {
  const [inputId1, setInputId1] = useState(id1.toString());
  const [inputId2, setInputId2] = useState(id2.toString());
  const [inputId3, setInputId3] = useState(id3.toString());
  const [inputId4, setInputId4] = useState(id4.toString());
  const [formSending, setFormSending] = useState(false);
  const [formSentStatus, setFormSentStatus] = useState<string | null>(null);

  useEffect(() => {
    setInputId1(id1.toString());
    setInputId2(id2.toString());
    setInputId3(id3.toString());
    setInputId4(id4.toString());
  }, [id1, id2, id3, id4]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormSending(true); // Start showing loading spinner
    const ids = [parseInt(inputId1), parseInt(inputId2), parseInt(inputId3), parseInt(inputId4)];

    try {
      // Simulate an asynchronous API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Replace with your actual API call
      onSubmit(ids);
      setFormSentStatus("Data Sent Successfully!");
    } catch (error) {
      setFormSentStatus("Error sending data."); // Handle the error as needed
    } finally {
      setFormSending(false); // Stop showing loading spinner
    }
  };

  if (formSending) {
    return <LoadingSpinner loadingText="Sending Four IDs to PHP ..." />;
  } else if (formSentStatus) {
    return <div>Four IDs sent with status: {formSentStatus}</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className="store-ids-form">
      <div className="input-group">
        <input
          type="number" // Change the input type to "number"
          placeholder="ID 1"
          value={inputId1}
          onChange={(e) => setInputId1(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="input-group">
        <input
          type="number" // Change the input type to "number"
          placeholder="ID 2"
          value={inputId2}
          onChange={(e) => setInputId2(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="input-group">
        <input
          type="number" // Change the input type to "number"
          placeholder="ID 3"
          value={inputId3}
          onChange={(e) => setInputId3(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="input-group">
        <input
          type="number" // Change the input type to "number"
          placeholder="ID 4"
          value={inputId4}
          onChange={(e) => setInputId4(e.target.value)}
          className="form-control"
        />
      </div>
      <button type="submit" className="btn btn-primary" >
        Submit
      </button>
    </form>
  );
};

export default StoreIDsForm;
