import Airtable from "airtable";

export interface AirtableConfig {
  apiKey: string;
  baseId: string;
}

export const validateAirtableConfig = async (
  config?: AirtableConfig
): Promise<boolean> => {
  if (!config) { 
    // Empty config is handled correctly, so it is considered valid
    return true;
  }
  try {
    const airtableClient = createAirtableClient(config);
    await airtableClient.table("SubscriptionRecord").select({ pageSize: 1 }).firstPage();
    return true;
  } catch {
    // If fetching the table "SubscriptionRecord" failed, return false
  }
  return false;
};

export const createAirtableClient = (config: AirtableConfig): Airtable.Base => {
  return new Airtable({ apiKey: config.apiKey }).base(config.baseId);
};
