import { createContext } from "react";
import axios from "axios";

export interface DoggyDayConfig {
  doggyDayApiKey: string;
}

const createDoggyDayClient = (config: DoggyDayConfig) =>
  axios.create({
    baseURL: "https://doggyday.co/",
    headers: { Authorization: `Bearer ${config.doggyDayApiKey}` },
  });

export const validateDoggyDayConfig = async (
  config?: DoggyDayConfig
): Promise<boolean> => {
  if (!config) {
    // Empty config is handled correctly, so it is considered valid
    return true;
  }
  const client = createDoggyDayClient(config);
  try {
    const res = await client.get("/mailapi.php");
    return res.status == 200;
  } catch (err) {
    return false;
  }
};

export interface DoggyDayEmailClientProps {
  doggyDayConfig?: DoggyDayConfig;
}

export interface SendMessageProps {
  messageSubject: string;
  messageHtml: string;
  recipientName?: string;
  recipientEmail: string;
}

class DoggyDayEmailClient {
  private readonly doggyDayClient;

  constructor({ doggyDayConfig }: DoggyDayEmailClientProps = {}) {
    this.doggyDayClient = doggyDayConfig
      ? createDoggyDayClient(doggyDayConfig)
      : undefined;
  }

  async send({
    recipientEmail,
    messageSubject,
    messageHtml,
  }: SendMessageProps) {
    if (!this.doggyDayClient) {
      throw new Error("Not logged in to DoggyDay email API");
    }
    const message = {
      to: recipientEmail,
      subject: messageSubject,
      html: messageHtml,
    };
    const res = await this.doggyDayClient.post("/mailapi.php", message);
    if (res.status != 200) {
      throw new Error(`Error sending email: ${res.data?.message}`);
    }
    return { status: <string>res.data.message };
  }
}

export const DoggyDayEmailClientContext = createContext<DoggyDayEmailClient>(
  new DoggyDayEmailClient()
);

export default DoggyDayEmailClient;
