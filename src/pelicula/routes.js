import express from 'express';
import controller from './controller.js';

const routes = express.Router();

routes.post('/Pelicula', controller.handleInsertPeliculaRequest)
routes.get('/pelicula', controller.handleGetPeliculasRequest)
routes.get('/Pelicula/:id', controller.handleGetPeliculaRequest)
routes.put('/Pelicula/:id', controller.handleUpdatePeliculasRequest)
routes.delete('/Pelicula/:id', controller.handleDeletePeliculasRequest)

export default routes;
