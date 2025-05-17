import { corsMiddleware } from "../middleware/cors.js";
import { db, FieldValue } from "./firebase.js";
import { sendTelegramNotification } from "./sendTelegram.js";

export default async function handler(req, res) {
  if (!corsMiddleware(req, res)) return;
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  try {
    const { ip, fingerprint } = req.body;

    if (!ip || !fingerprint) {
      return res.status(400).json({ error: "Faltan datos: IP o fingerprint" });
    }

    let ciudad = "",
      region = "",
      pais = "";
    try {
      const geoRes = await fetch(`https://ipwhois.app/json/${ip}`);
      const geoData = await geoRes.json();
      console.log("geoData response:", geoData);
      ciudad = geoData.city || "";
      region = geoData.region || "";
      pais = geoData.country || "";
    } catch (geoError) {
      console.warn("Error al obtener ubicación IP:", geoError);
    }
    const ubicacion = `${ciudad}, ${region}, ${pais}`;
    const docRef = db.collection("visitors").doc(fingerprint);
    const doc = await docRef.get();

    if (doc.exists) {
      await docRef.update({
        visitas: FieldValue.increment(1),
        ultimoIngreso: FieldValue.serverTimestamp(),
      });
    } else {
      await docRef.set({
        ip,
        fingerprint,
        ubicacion,
        visitas: 1,
        timestamp: FieldValue.serverTimestamp(),
        ultimoIngreso: FieldValue.serverTimestamp(),
      });
 
      await sendTelegramNotification(ip, fingerprint, ubicacion);

      const counterRef = db.collection("contador").doc("visitors");
      await counterRef.update({ cantidad: FieldValue.increment(1) });
    }
    return res.status(200).json({ message: "Visita registrada con ubicación" });
  } catch (error) {
    console.error("Error al registrar visita:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
