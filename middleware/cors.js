export const corsMiddleware = (req, res) => {
  let  allowedOrigin = "";
  if (req.headers.origin === process.env.FRONTEND_ORIGINS) {
    allowedOrigin = process.env.FRONTEND_ORIGINS;
  }/* else if (req.headers.origin === "http://localhost:5173") {
    allowedOrigin = process.env.FRONTEND_ORIGINS;
  }*/

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return false; // corta la ejecución
  }

  return true; // continuar con el handler principal
};
