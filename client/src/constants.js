// Set REACT_APP_API_URL in Vercel to the deployed backend URL,
// including the /api prefix only if your backend is mounted under /api.
const configuredApiUrl = process.env.REACT_APP_API_URL;

export const PORT = configuredApiUrl
  ? `${configuredApiUrl.replace(/\\/+$/, "")}/`
  : process.env.NODE_ENV === "development"
    ? "http://localhost:3000/"
    : "/";

if (process.env.NODE_ENV === "production" && !configuredApiUrl) {
  // This warning makes a missing Vercel environment variable easy to diagnose.
  // Configure REACT_APP_API_URL to the public backend URL in Vercel.
  // eslint-disable-next-line no-console
  console.error(
    "Missing REACT_APP_API_URL. Configure it in Vercel to connect this frontend to the backend."
  );
}

export const LOCAL_STORAGE_TOKEN_NAME = "XUANHIEu";
