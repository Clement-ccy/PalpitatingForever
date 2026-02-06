export const encodeBase64 = (input: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(input)));

export const hashString = async (value: string, secret: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${secret}:${value}`);
  const digest = await crypto.subtle.digest('SHA-256', data.buffer);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const encryptValue = async (value: string, secret: string) => {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.digest('SHA-256', encoder.encode(secret).buffer);
  const key = await crypto.subtle.importKey('raw', keyMaterial, { name: 'AES-GCM' }, false, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(value));
  return `${encodeBase64(iv.buffer)}.${encodeBase64(ciphertext)}`;
};

export const generatePasswordHash = async (password: string, salt: Uint8Array, iterations: number) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password).buffer, { name: 'PBKDF2' }, false, ['deriveBits']);
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBuffer, iterations, hash: 'SHA-256' }, key, 256);
  return encodeBase64(derived);
};
