import { Request, Response } from "express";

import express from "express";
import {Express} from "express";
import { getDB } from "./datastore";

const app: Express = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get( "/", (req: Request, res: Response) => {
    res.send( "Hello World!!!" );
} );

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );

getDB();



