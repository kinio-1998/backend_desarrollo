// backend/api/visitors.js

import { corsMiddleware } from "../middleware/cors";
import { db } from "./firebase";

export default async function handler(req, res) {
   if(!corsMiddleware(req,res)) return;
  
  if (req.method === "GET") {
    try {
      const snapshot = await db.collection("visitors").get();
      const visitors = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({ visitors });
    } catch (error) {
      console.error("Error al obtener visitantes:", error);
      return res.status(500).json({ error: "Error al obtener visitantes" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
