import { ObjectId } from 'mongodb'
import client from '../common/dbconn.js'
import { Actor } from './actor.js'

const actorCollection = client.db('cine-db').collection('actor')

async function handleInsertActorRequest(req, res) {
    const data = req.body;

    if (!data.idPelicula || !data.nombre || !data.edad || typeof data.estaRetirado !== 'boolean') {
        return res.status(400).send({ error: "Faltan campos obligatorios" });
    }

    try {
        const pelicula = await peliculaCollection.findOne({ _id: new ObjectId(data.idPelicula) });

        if (!pelicula) {
            return res.status(404).send({ error: "Película no encontrada" });
        }

        const actor = {
            _id: new ObjectId(),
            idPelicula: data.idPelicula,
            nombre: data.nombre,
            edad: data.edad,
            estaRetirado: data.estaRetirado,
            premios: data.premios || []
        };

        const result = await actorCollection.insertOne(actor);

        if (result.insertedCount === 0) {
            return res.status(400).send({ error: "Error al guardar el actor" });
        }

        return res.status(201).send({ mensaje: "Actor creado con éxito", id: result.insertedId });
    } catch (e) {
        console.error("Error al insertar actor:", e);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
}

async function handleGetActoresRequest(req, res) {
    try {
        const actores = await actorCollection.find({}).toArray();
        return res.status(200).send(actores);
    } catch (e) {
        console.error("Error al obtener actores:", e);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
}

async function handleGetActorByIdRequest(req, res) {
    const { id } = req.params;
    try {
        const actor = await actorCollection.findOne({ _id: new ObjectId(id) });
        if (!actor) {
            return res.status(404).send({ error: "Actor no encontrado" });
        }
        return res.status(200).send(actor);
    } catch (e) {
        return res.status(400).send({ error: "ID mal formado" });
    }
}

async function handleGetActoresByPeliculaRequest(req, res) {
    const { pelicula } = req.params;
    try {
        const actores = await actorCollection.find({ idPelicula: pelicula }).toArray();
        if (actores.length === 0) {
            return res.status(404).send({ error: "No se encontraron actores para esta película" });
        }
        return res.status(200).send(actores);
    } catch (e) {
        return res.status(500).send({ error: "Error interno del servidor" });
    }
}

export default {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaRequest
};