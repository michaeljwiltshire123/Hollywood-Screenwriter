/**
 * Client-Side Google Drive API Integration via Google Identity Services (GIS)
 * No backend required. Uses browser OAuth2 token client for zero-cost student backups.
 */

declare global {
  interface Window {
    google?: any;
  }
}

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const clientId = "740559251187-qsr19mgjn6jh5hb7so58ppsm0jkrfa27.apps.googleusercontent.com";

/**
 * Request Google Access Token via GIS
 */
export function requestGoogleDriveToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("Current Origin:", window.location.origin);
    console.log(`[Google Client ID Audit]: ${clientId.slice(0, 5)}...${clientId.slice(-5)}`);

    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      // Load GIS script dynamically if missing
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initAndRequestToken(resolve, reject);
      script.onerror = () => reject(new Error('Failed to load Google Identity Services script.'));
      document.head.appendChild(script);
    } else {
      initAndRequestToken(resolve, reject);
    }
  });
}

function initAndRequestToken(resolve: (token: string) => void, reject: (err: Error) => void) {
  try {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (response: any) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error));
        } else {
          resolve(response.access_token);
        }
      },
    });
    client.requestAccessToken();
  } catch (err: any) {
    reject(err);
  }
}

/**
 * Find or create "Screenwriter Pro" folder in Google Drive
 */
export async function getOrCreateScreenwriterFolder(accessToken: string): Promise<string> {
  const query = encodeURIComponent("name = 'Screenwriter Pro' and mimeType = 'application/vnd.google-apps.folder' and trashed = false");
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const searchData = await searchRes.json();
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create folder
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Screenwriter Pro',
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Mirror screenplay JSON to Google Drive folder
 */
export async function mirrorScriptToGoogleDrive(
  accessToken: string,
  script: any
): Promise<{ success: boolean; fileId: string; timestamp: Date }> {
  const folderId = await getOrCreateScreenwriterFolder(accessToken);
  const fileName = `${script.title || 'Untitled_Screenplay'}.screenplay.json`;
  const fileContent = JSON.stringify(script, null, 2);

  // Check if file already exists in folder
  const query = encodeURIComponent(`name = '${fileName}' and '${folderId}' in parents and trashed = false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const searchData = await searchRes.json();

  let fileId = '';
  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    parents: [folderId],
  };

  if (searchData.files && searchData.files.length > 0) {
    fileId = searchData.files[0].id;
    // Update existing file
    await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: createMultipartBody(metadata, fileContent),
    });
  } else {
    // Create new file
    const createRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: createMultipartBody(metadata, fileContent),
    });
    const fileData = await createRes.json();
    fileId = fileData.id;
  }

  return { success: true, fileId, timestamp: new Date() };
}

function createMultipartBody(metadata: any, fileContent: string): FormData {
  const form = new FormData();
  form.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  );
  form.append(
    'file',
    new Blob([fileContent], { type: 'application/json' })
  );
  return form;
}
