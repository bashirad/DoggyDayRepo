import React, { FormEvent, useEffect, useState } from "react";
import {
  AirtableConfig,
  validateAirtableConfig,
} from "../../clients/AirtableClient";

const LOCAL_STORAGE_KEY = "airtableConfig";

export interface AirtableConfigFormProps {
  airtableConfigChanged: (airtableConfig?: AirtableConfig) => void;
}

const AirtableForm = ({ airtableConfigChanged }: AirtableConfigFormProps) => {
  // Airtable config set either from the connect button or loaded from localStorage
  const [airtableConfig, setAirtableConfig] = useState<AirtableConfig>();
  // Boolean indicating if the stored config is valid (validated when the config is changed)
  const [airtableConfigValid, setAirtableConfigValid] = useState<boolean>(true);
  // The state matching the form UI elements, updated by onChange events or localStorage loader
  const [formApiKey, setFormApiKey] = useState<string>("");
  const [formBaseId, setFormBaseId] = useState<string>("");
  // Boolean indicating if the stored config matches the formApiKey and formBaseId exactly
  const [airtableConfigMatch, setAirtableConfigMatch] =
    useState<boolean>(false);
  useEffect(() => {
    let config: AirtableConfig;
    try {
      config = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    } catch {
      // If anything fails when reading or parsing the config, leave it undefined
    }
    if (config && config.apiKey && config.baseId) {
      setFormApiKey(config.apiKey);
      setFormBaseId(config.baseId);
      setAirtableConfig(config);
    }
  }, []);
  useEffect(() => {
    if (airtableConfig) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(airtableConfig));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    // Assume valid until we have finished our validation
    setAirtableConfigValid(true);
    validateAirtableConfig(airtableConfig).then((isValid) => {
      setAirtableConfigValid(isValid);
      if (isValid) {
        airtableConfigChanged(airtableConfig);
      } else {
        airtableConfigChanged(undefined);
      }
    });
  }, [airtableConfig]);
  useEffect(() => {
    const configMatch =
      airtableConfig &&
      airtableConfig.apiKey === formApiKey &&
      airtableConfig.baseId === formBaseId;
    setAirtableConfigMatch(!!configMatch);
  }, [airtableConfig, formApiKey, formBaseId]);

  const onApiKeyInputChange = (event: FormEvent<HTMLInputElement>) => {
    setFormApiKey(event.currentTarget.value);
  };
  const onBaseIdInputChange = (event: FormEvent<HTMLInputElement>) => {
    setFormBaseId(event.currentTarget.value);
  };
  const onConnectButtonClick = () => {
    if (formApiKey && formBaseId) {
      setAirtableConfig({ apiKey: formApiKey, baseId: formBaseId });
    } else {
      setAirtableConfig(undefined);
    }
  };
  const onDisconnectButtonClick = () => {
    setAirtableConfig(undefined);
  };

  const airtableConnected = airtableConfigValid && airtableConfigMatch;
  const airtableConfigInvalid = !airtableConfigValid && airtableConfigMatch;
  const inputClasses = `form-control ${
    airtableConfigInvalid ? "is-invalid" : ""
  }`;
  const connectForm = (
    <div className="row mt-4 mb-4">
      <div className="col-sm-4">
        <div className="input-group">
          <label className="input-group-text" htmlFor="form-api-key">
            Airtable API Key
          </label>
          <input
            id="form-api-key"
            type="text"
            className={inputClasses}
            aria-label="Airtable API Key"
            value={formApiKey}
            onChange={onApiKeyInputChange}
          />
        </div>
      </div>
      <div className="col-sm-4">
        <div className="input-group">
          <label className="input-group-text" htmlFor="form-base-id">
            Airtable Base ID
          </label>
          <input
            id="form-base-id"
            type="text"
            className={inputClasses}
            aria-label="Airtable Base ID"
            value={formBaseId}
            onChange={onBaseIdInputChange}
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
          Connected to Airtable
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
  return airtableConnected ? disconnectForm : connectForm;
};

export default AirtableForm;
