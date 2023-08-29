import React, {
  FormEvent,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";
import DoggyDayEmailClient, {
  DoggyDayConfig,
  DoggyDayEmailClientContext,
} from "../clients/DoggyDayEmailClient";
import DoggyDayConfigForm from "./auth/DoggyDayConfigForm";
import LoadingSpinner from "./LoadingSpinner";

export interface EmailSendFormProps {
  toAddress: string;
  subject: string;
  htmlContent: string;
  sentCallback?: () => void | Promise<void>;
}

const EmailSendForm = ({
  toAddress,
  subject,
  htmlContent,
  sentCallback,
}: EmailSendFormProps) => {
  const [formToAddress, setFormToAddress] = useState(toAddress);
  const [formSubject, setFormSubject] = useState(subject);
  const [formSending, setFormSending] = useState(false);
  const [formSentStatus, setFormSentStatus] = useState<string>();

  const [doggyDayConfig, setDoggyDayConfig] = useState<DoggyDayConfig>();
  const [doggyDayEmailClient, setDoggyDayEmailClient] =
    useState<DoggyDayEmailClient>(new DoggyDayEmailClient());

  useEffect(() => {
    setDoggyDayEmailClient(new DoggyDayEmailClient({ doggyDayConfig }));
  }, [doggyDayConfig]);

  const onToAddressInputChange = (event: FormEvent<HTMLInputElement>) => {
    setFormToAddress(event.currentTarget.value);
  };
  const onSubjectInputChange = (event: FormEvent<HTMLInputElement>) => {
    setFormSubject(event.currentTarget.value);
  };
  const onIframeLoad: ReactEventHandler<HTMLIFrameElement> = (event) => {
    const iframeEl = event.currentTarget;
    const iframeHeight =
      iframeEl.contentWindow.document.body.parentElement.scrollHeight;
    iframeEl.style.height = `${iframeHeight}px`;
  };
  const onSendEmailButtonClick = () => {
    setFormSending(true);
    doggyDayEmailClient
      .send({
        recipientEmail: formToAddress,
        messageSubject: formSubject,
        messageHtml: htmlContent,
      })
      .then((res) => {
        setFormSentStatus(res.status);
      })
      .then(() => sentCallback())
      .finally(() => {
        setFormSending(false);
      });
  };
  if (formSending) {
    return <LoadingSpinner loadingText="Sending email..." />;
  }
  if (formSentStatus) {
    return <div>Email sent with status: {formSentStatus}</div>;
  }

  return (
    <DoggyDayEmailClientContext.Provider value={doggyDayEmailClient}>
      {doggyDayConfig && (
        <>
          <div className="row">
            <div className="col-sm-12">
              <div className="input-group mt-2 mb-2">
                <label
                  className="input-group-text"
                  htmlFor="form-to-address-input"
                >
                  To
                </label>
                <input
                  id="form-to-address-input"
                  type="text"
                  className="form-control"
                  aria-label="To Address"
                  value={formToAddress}
                  onChange={onToAddressInputChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="input-group mt-2 mb-2">
                <label
                  className="input-group-text"
                  htmlFor="form-subject-input"
                >
                  Subject
                </label>
                <input
                  id="form-subject-input"
                  type="text"
                  className="form-control"
                  aria-label="Subject"
                  value={formSubject}
                  onChange={onSubjectInputChange}
                />
              </div>
            </div>
            <div className="col-sm-12">
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primary mt-2"
                  onClick={onSendEmailButtonClick}
                >
                  Send Email
                </button>
              </div>
            </div>
          </div>
          <div className="card mt-4 mb-4">
            <div className="card-body">
              <h5 className="card-title">Preview</h5>
              <div className="card-text">
                <iframe
                  srcDoc={htmlContent}
                  style={{
                    height: "200px",
                    width: "100%",
                    border: "none",
                    overflow: "hidden",
                  }}
                  onLoad={onIframeLoad}
                />
              </div>
            </div>
          </div>
        </>
      )}
      <DoggyDayConfigForm doggyDayConfigChanged={setDoggyDayConfig} />
    </DoggyDayEmailClientContext.Provider>
  );
};

export default EmailSendForm;
