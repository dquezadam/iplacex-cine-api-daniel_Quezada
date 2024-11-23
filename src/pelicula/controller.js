import { ObjectId } from 'mongodb'
import client from '../common/dbconn.js'
import { Pelicula } from './pelicula.js';

const peliculaCollection = client.db('cine-db').collection('peliculas')

async function handleInsertPeliculaRequest(req, res) {
    try {
        const data = req.body;

        
        if (!data.nombre || !data.generos || !data.anioEstreno) {
            return res.status(400).send({ error: "Todos los campos son obligatorios: nombre, generos, anioEstreno" });
        }

        
        const pelicula = {
            _id: new ObjectId(),
            nombre: data.nombre,
            generos: data.generos,
            anioEstreno: data.anioEstreno,
        };

        const result = await peliculaCollection.insertOne(pelicula);
        return res.status(201).send({ mensaje: "Película agregada con éxito", id: result.insertedId });
    } catch (e) {
        console.error("Error al insertar película:", e);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
}

async function handleGetPeliculasRequest(req, res) {
    try {
        const peliculas = await peliculaCollection.find({}).toArray();
        return res.status(200).send(peliculas);
    } catch (e) {
        console.error("Error al obtener películas:", e.message || e);
        return res.status(500).send({ error: "Error interno del servidor" });
    }
}

async function handleGetPeliculaRequest(req, res) {
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)

        await peliculaCollection.findOne({ _id: oid })
        .then((data) => {
            if(data === null) return res.status(404).send(data)

            return res.status(200).send(data)
        })

        .catch((e) => {
            return res.status(500).send({error: e.code })
        })
    }catch(e){
        return res.status(400).send('Id mal formado')
    }
}

async function handleUpdatePeliculasRequest(req, res ) {
    let id = req.params.id
    let pelicula = req.body

    try{
        let oid = ObjectId.createFromHexString(id)

        let query = { $set: pelicula }

        await peliculaCollection.updateOne({ _id: oid }, query)
        .then((data) => { return res.status(200).send(data) })
        .catch((e) => { return res.status(500).send({ code: e.code }) })
    }catch(e){
        return res.status(400).send('Id mal formado')
    }

    }

async function handleDeletePeliculasRequest(req, res) {
    let id = req.params.id

    try{
        let oid = ObjectId.createFromHexString(id)

        await peliculaCollection.deleteOne({ _id: oid })
        .then((data) => { return res.status(200).send(data) })
        .catch((e) => { return res.status(500).send({ code: e.code }) })
    }catch(e){
        return res.status(400).send('Id mal formado')
    }
}

export default {
    handleInsertPeliculaRequest,
    handleGetPeliculasRequest,
    handleGetPeliculaRequest,
    handleUpdatePeliculasRequest,
    handleDeletePeliculasRequest
}