import { CreateJobSchema, createJobSchema } from './../schemas/JobSchema';
import { JobService } from "../services/JobService";
import { Request, Response } from 'express';
import { ZodError } from "zod";

export class JobController {
    constructor(private service: JobService) {}

    async createJob(req: Request, res: Response) {
        try {
            const body = req.body
            const requestBody = createJobSchema.parse(body)

            const createdJob = await this.service.createJob(requestBody)
            if(createdJob){
                return res.status(201).json({ message: "Created" })
            }
        } catch (error) {
            if(error instanceof ZodError){
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ field: i.path.join('.'), message: i.message })) || []
                });
            }
            return res.status(500).json({ message: "Internal server error" })
        }
    }
}