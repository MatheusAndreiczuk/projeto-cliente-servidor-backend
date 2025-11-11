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

    async getAllJobs(req: Request, res: Response) {
        try {
            const filters = req.query as Partial<CreateJobSchema>
            const jobs = await this.service.getAllJobs(filters)
            if(!jobs){
                return res.status(404).json({ message: "Jobs not found" })
            }
            return res.status(200).json(jobs)
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async getJobById(req: Request, res: Response) {
        try {
            const jobId = Number(req.params.id)
            const job = await this.service.getJobById(jobId)
            if(!job){
                return res.status(404).json({ message: "Job not found" })
            }
            return res.status(200).json(job)
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async getJobsByCompanyId(req: Request, res: Response) {
        try {
            const companyId = (req as any).userID
            const filters = req.query as Partial<CreateJobSchema>
            const jobs = await this.service.getJobsByCompanyId(filters, companyId)
            if(!jobs){
                return res.status(404).json({ message: "Jobs not found" })
            }
            return res.status(200).json(jobs)
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async updateJob(req: Request, res: Response) {
        try {
            const body = req.body
            const jobId = Number(req.params.id)
            const requestBody = createJobSchema.parse(body)

            const updatedJob = await this.service.updateJob(requestBody, jobId)
            if(!updatedJob){
                return res.status(404).json({ message: "Job not found" })
            }
            return res.status(200).json(updatedJob)
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

    async deleteJob(req: Request, res: Response){
        try {
            const jobId = Number(req.params.id)
            const existsjob = await this.service.getJobById(jobId)
            if(!existsjob){
                return res.status(404).json({ message: "Job not found" })
            }
            const message = await this.service.deleteJob(jobId)
            return res.status(200).json({ message })
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
    }
}