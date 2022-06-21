import { ApolloError } from 'apollo-server-errors';
import { Db, ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
const brcypt = require("bcrypt");
import * as dotenv from "dotenv";
import { pubSub } from '../pubSub';

dotenv.config();

export const Mutation = {

    setMatchData: async (parent: any, args: { id: string, result: string, minute: number, ended: boolean }, context: { client: Db }) => {
        const valid_id = new ObjectId(args.id);
        let valid_minute = 0;
        let valid_score = "Error_assignin_Score";
        let valid_state;
        let change_Pub = false;
        const match = await context.client.collection("Matches").findOne({ _id: valid_id });
        if (match) {
            const resultT1 = parseInt(match.resultado.split("-")[0]);
            const resultT2 = parseInt(match.resultado.split("-")[1]);
            const updateResT1 = parseInt(args.result.split("-")[0]);
            const updateResT2 = parseInt(args.result.split("-")[1]);
            if (args.minute == null) valid_minute = match['minuto_de_juego']; else valid_minute = args.minute;
            if ((args.result == null) || args.result==match['resultado']) valid_score = match['resultado']; else {
                valid_score = args.result;
                change_Pub = true
            }
            if ((args.ended == null) || args.ended==match['finalizado']) valid_state = match['finalizado']; else {
                change_Pub = true
                valid_state = args.ended;
            }
            if (match.finalizado) {
                throw new ApolloError("Match already finished", "Match Already Finished", { status: 442 });
            } else if ((resultT1 > updateResT1) || resultT2 > updateResT2) {
                throw new ApolloError("Error al introducir resultado", "Error al introducir resultado", { status: 442 });
            } else if (args.minute < match.minuto_de_juego) {
                throw new ApolloError("Error al introducir minuto", "Error al introducir minuto", { status: 442 });
            } else {
                await context.client.collection("Matches").updateOne({ _id: valid_id }, { $set: { resultado: valid_score, minuto_de_juego: valid_minute, finalizado: valid_state } });

                if(change_Pub)pubSub.publish(args.id, { id: valid_id, resultado: valid_score, minuto_de_juego: valid_minute, finalizado: valid_state });
                return "Updated!"
            }

        } else {
            throw new ApolloError('Match not found', 'Match not found', { status: 404 });
        }
    },
    startMatch: async (parent: any, args: { equipo1: string, equipo2: string }, context: { client: Db }) => {
        const matches = await context.client.collection("Matches").find({ equipo1: args.equipo1, equipo2: args.equipo2 }).toArray();
        const matchesRev = await context.client.collection("Matches").find({ equipo1: args.equipo2, equipo2: args.equipo1 }).toArray();
        matches.map(function (m) {
            if (!m.finalizado) {
                throw new ApolloError("Match already Going", "Match Already Going", { status: 442 });
            }
        })
        matchesRev.map(function (m) {
            if (!m.finalizado) {
                throw new ApolloError("Match already Going", "Match Already Going", { status: 442 });
            }
        })
        await context.client.collection("Matches").insertOne({ equipo1: args.equipo1, equipo2: args.equipo2, resultado: "0-0", minuto_de_juego: 0, finalizado: false });
        return "Match Started!"
    }

}
