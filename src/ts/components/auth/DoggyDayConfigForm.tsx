import React, { FormEvent, useEffect, useState } from "react";
import {
  DoggyDayConfig,
  validateDoggyDayConfig,
} from "../../clients/DoggyDayEmailClient";

const LOCAL_STORAGE_KEY = "doggyDayConfig";

export interface DoggyDayConfigFormProps {
  doggyDayConfigChanged: (doggyDayConfig?: DoggyDayConfig) => void;
}

const DoggyDayConfigForm = ({
  doggyDayConfigChanged,
}: DoggyDayConfigFormProps) => {
  // Mailchimp config set either from the connect button or loaded from localStorage
  const [doggyDayConfig, setDoggyDayConfig] = useState<DoggyDayConfig>();
  // Boolean indicating if the stored config is valid (validated when the config is changed)
  const [doggyDayConfigValid, setDoggyDayConfigValid] = useState<boolean>(true);
  // The state matching the form UI elements, updated by onChange events or localStorage loader
  const [formApiKey, setFormApiKey] = useState<string>("");
  // Boolean indicating if the stored config matches the formApiKey exactly
  const [doggyDayConfigMatch, setDoggyDayConfigMatch] =
    useState<boolean>(false);
  useEffect(() => {
    let config: DoggyDayConfig;
    try {
      config = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    } catch {
      // If anything fails when reading or parsing the config, leave it undefined
    }
    if (config && config.doggyDayApiKey) {
      setFormApiKey(config.doggyDayApiKey);
      setDoggyDayConfig(config);
    }
  }, []);
  useEffect(() => {
    if (doggyDayConfig) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(doggyDayConfig));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    // Assume valid until we have finished our validation
    setDoggyDayConfigValid(true);
    validateDoggyDayConfig(doggyDayConfig).then((isValid) => {
      console.log(isValid);
      setDoggyDayConfigValid(isValid);
      if (isValid) {
        doggyDayConfigChanged(doggyDayConfig);
      } else {
        doggyDayConfigChanged(undefined);
      }
    });
  }, [doggyDayConfig]);
  useEffect(() => {
    const configMatch =
      doggyDayConfig && doggyDayConfig.doggyDayApiKey === formApiKey;
    setDoggyDayConfigMatch(!!configMatch);
  }, [doggyDayConfig, formApiKey]);

  const onApiKeyInputChange = (event: FormEvent<HTMLInputElement>) => {
    setFormApiKey(event.currentTarget.value);
  };
  const onConnectButtonClick = () => {
    if (formApiKey) {
      setDoggyDayConfig({ doggyDayApiKey: formApiKey });
    } else {
      setDoggyDayConfig(undefined);
    }
  };
  const onDisconnectButtonClick = () => {
    setDoggyDayConfig(undefined);
  };

  const doggyDayConnected = doggyDayConfigValid && doggyDayConfigMatch;
  const doggyDayConfigInvalid = !doggyDayConfigValid && doggyDayConfigMatch;
  const inputClasses = `form-control ${
    doggyDayConfigInvalid ? "is-invalid" : ""
  }`;
  const connectForm = (
    <div className="row mt-4 mb-4">
      <div className="col-sm-8">
        <div className="input-group">
          <label className="input-group-text" htmlFor="form-api-key">
            DoggyDay API Key
          </label>
          <input
            id="form-api-key"
            type="text"
            className={inputClasses}
            aria-label="DoggyDay API Key"
            value={formApiKey}
            onChange={onApiKeyInputChange}
          />
        </div>
      </div>
      <div className="col-sm-4">
        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onConnectButtonClick}
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
  const disconnectForm = (
    <div className="row mt-4 mb-4">
      <div className="col-sm-12">
        <div className="alert alert-success" role="alert">
          Connected to DoggyDay
        </div>
      </div>
      <div className="col-sm-12">
        <div className="d-grid gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onDisconnectButtonClick}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
  return doggyDayConnected ? disconnectForm : connectForm;
};

export default DoggyDayConfigForm;
