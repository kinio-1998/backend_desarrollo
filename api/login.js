import { corsMiddleware } from "../middleware/cors";

export default async function handler(req, res) {
  if(!corsMiddleware(req,res)) return
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { password } = req.body;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (!password) return res.status(400).json({ error: "Falta contraseña" });

  if (password === correctPassword) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, error: "Contraseña incorrecta" });
  }
}