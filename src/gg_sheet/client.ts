import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT, GoogleAuth } from 'google-auth-library';
import { getGGServiceAccount, getConfig } from '../config/tax.chat.config';

export async function getGGSheet(id: string): Promise<GoogleSpreadsheet> {
  let auth = null;

  if (getConfig().NODE_ENV === 'local') {
    const serviceAccountConfig = await getGGServiceAccount();

    auth = new JWT({
      email: serviceAccountConfig.client_email,
      key: serviceAccountConfig.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  } else {
    auth = new GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
  }

  const doc = new GoogleSpreadsheet(id, auth);
  try {
    await doc.loadInfo();
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to load Google Sheet: ${id}`);
  }

  return doc;
}
