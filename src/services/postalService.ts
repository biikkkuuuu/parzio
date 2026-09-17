export interface PostalInfo {
  pincode: string;
  postOffices: string[];
  district: string;
  state: string;
}

const pincodeCache = new Map<string, PostalInfo>();

export async function lookupPincode(pincode: string): Promise<PostalInfo | null> {
  const clean = pincode.replace(/\D/g, '').trim();
  if (clean.length !== 6) return null;

  if (pincodeCache.has(clean)) {
    return pincodeCache.get(clean)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    if (
      Array.isArray(data) &&
      data[0]?.Status === 'Success' &&
      Array.isArray(data[0]?.PostOffice) &&
      data[0].PostOffice.length > 0
    ) {
      const offices = data[0].PostOffice;
      const district = offices[0]?.District || offices[0]?.Block || offices[0]?.Division || '';
      const state = offices[0]?.State || '';
      const names: string[] = offices.map((o: any) => o.Name).filter(Boolean);

      const result: PostalInfo = {
        pincode: clean,
        postOffices: names,
        district,
        state
      };

      pincodeCache.set(clean, result);
      return result;
    }
    return null;
  } catch {
    return null;
  }
}
