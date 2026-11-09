// Set REACT_APP_API_URL in Vercel to the public backend URL.
const configuredApiUrl = process.env.REACT_APP_API_URL || "";
let normalizedApiUrl = configuredApiUrl;
while (normalizedApiUrl.endsWith("/")) {
  normalizedApiUrl = normalizedApiUrl.slice(0, -1);
}

export const PORT = normalizedApiUrl
  ? `${normalizedApiUrl}/`
  : process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : "/";

if (process.env.NODE_ENV === "production" && !normalizedApiUrl) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing REACT_APP_API_URL. Set it in Vercel to the deployed backend URL."
  );
}

export const LOCAL_STORAGE_TOKEN_NAME = "XUANHIEu";
