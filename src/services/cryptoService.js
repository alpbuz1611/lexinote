/**
 * High-Security Client-Side AES-GCM 256-bit Encryption with PBKDF2 Key Derivation
 */

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derives a 256-bit AES-GCM key from password and salt using PBKDF2
 */
async function getKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts arbitrary object or text with password
 */
export async function encryptData(data, password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(password, salt);

  const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    enc.encode(plaintext)
  );

  return {
    ciphertext: bufferToBase64(encrypted),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt)
  };
}

/**
 * Decrypts encrypted package back into original object or text
 */
export async function decryptData(encryptedPackage, password) {
  try {
    const salt = base64ToBuffer(encryptedPackage.salt);
    const iv = base64ToBuffer(encryptedPackage.iv);
    const ciphertext = base64ToBuffer(encryptedPackage.ciphertext);

    const key = await getKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    const decodedStr = dec.decode(decrypted);

    try {
      return JSON.parse(decodedStr);
    } catch {
      return decodedStr;
    }
  } catch (err) {
    throw new Error('Yanlış parola veya şifre çözme hatası!');
  }
}
