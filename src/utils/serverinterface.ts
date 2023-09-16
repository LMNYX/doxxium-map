import { Express } from "express";

export interface HTTPInterface extends Express {
    [key: string]: any;
};