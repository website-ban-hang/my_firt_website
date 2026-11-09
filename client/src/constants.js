// The production fallback keeps the client pointed at the deployed API even
// when REACT_APP_API_URL was not added to the Vercel build environment.
const configuredApiUrl = process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://my-firt-website-server.vercel.app"
    : "http://localhost:3000");

const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "");
export const PORT = `${normalizedApiUrl}/`;

export const LOCAL_STORAGE_TOKEN_NAME = "XUANHIEu";
