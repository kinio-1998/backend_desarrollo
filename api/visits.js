import { corsMiddleware } from "../middleware/cors.js";
import { db } from "./firebase.js";

export default async function handler(req, res) {
  if(!corsMiddleware(req,res)) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });

  try {
    const ref = db.collection("contador").doc("visitors"); // <--- Aquí el nombre correcto
    const doc = await ref.get();

    if (!doc.exists) {
      return res.status(200).json({ visits: 0 });
    }

    const data = doc.data();
    return res.status(200).json({ visits: data.cantidad || 0 }); // <--- Asegúrate de que el campo sea "cantidad"
  } catch (error) {
    console.error("Error al obtener visitas:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
