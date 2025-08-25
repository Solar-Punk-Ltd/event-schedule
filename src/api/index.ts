export const getJSON = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url);
    const json: T = await response.json();

    return json;
  } catch (e) {
    console.log(`error getting from ${url} `, e);
    return null;
  }
};
