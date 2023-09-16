import express from "express";
import Eta from "eta";
import fs from "fs";
import { PresetOutput } from "@utils/output";
import { HTTPInterface } from "@utils/serverinterface";
import DefaultRoute from "./route";

export class Server
{
    private readonly output: PresetOutput = new PresetOutput("http");
    private routes: DefaultRoute[] = [];
    private app: HTTPInterface;

    public constructor()
    {
        this.app = express();
        this.app.engine("eta", Eta.renderFile);
        this.app.set("view engine", "eta");
        this.app.set("views", "./views");
        this.app.use(express.static("./public"));
    }

    public async start() : Promise<void>
    {
        this.output.Log("Starting server...");
        await this.addRoutes();
        // TO-OD: Replace port with ENV
        this.app.listen(3000, () => this.output.Log("Server started!"));
    }

    public async addRoutes()
    {
        this.output.Log("Adding routes...");
        fs.readdirSync("./dist/web/routes").forEach((file) =>
        {
            let route = require(`./routes/${file}`).default;
            this.output.Log(`Adding route ${route.name.cyan}...`);
            let routeIndex = this.routes.push(new route());
            this.routes[routeIndex - 1].DatabaseInterface = null;
            this.app[this.routes[routeIndex - 1].Method.toLowerCase()](this.routes[routeIndex - 1].Path, (request:any, response:any) =>
            {
                this.routes[routeIndex - 1].Serve(request, response);
            });

        });
    }
}