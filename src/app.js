import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// 1️⃣ Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB Atlas Servineo_DB"))
    .catch((err) => console.error("❌ Error al conectar MongoDB:", err));


// 2️⃣ Definir esquema de historial
const historialSchema = new mongoose.Schema({
    usuario_numero: { type: String, required: true }, // nuevo campo para guardar el número del usuario
    mensaje_usuario: { type: String, required: true },
    mensaje_IA: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    tipo_medio: { type: String, enum: ["texto", "audio", "imagen"], default: "texto" },
});

// 'historial_conversaciones' es el nombre de la colección en MongoDB
const Historial = mongoose.model("Historial", historialSchema, "historial_conversaciones");

// 3️⃣ Endpoint para registrar interacciones
app.post("/historial", async (req, res) => {
    try {
        const { usuario_numero, mensaje_usuario, mensaje_IA, tipo_medio } = req.body;

        if (!usuario_numero || !mensaje_usuario || !mensaje_IA) {
            return res.status(400).json({ ok: false, mensaje: "Faltan campos obligatorios" });
        }

        const nuevaInteraccion = new Historial({
            usuario_numero,
            mensaje_usuario,
            mensaje_IA,
            tipo_medio,
        });

        await nuevaInteraccion.save();
        res.json({ ok: true, mensaje: "Interacción guardada" });
    } catch (error) {
        console.error("Error al guardar la interacción:", error);
        res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
    }
});

// 4️⃣ Endpoint de prueba (ping)
app.get("/ping", (req, res) => {
    res.json({ ok: true, mensaje: "API funcionando" });
});

// 5️⃣ Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
