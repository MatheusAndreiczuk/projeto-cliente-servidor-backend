import { CreateJobSchema, createJobSchema } from '../schemas/JobSchema.js';
import { JobService } from "../services/JobService";
import { CompanyService } from "../services/CompanyService.js";
import { Request, Response } from 'express';
import { ZodError } from "zod";
import { IJobFilters } from '../@types/job.types.js';

export class JobController {
    constructor(private service: JobService, private companyService?: CompanyService) { }

    private extractFilters(req: Request): Partial<IJobFilters> {
        const body = req.body || {};
        const filters = body.filters?.[0] || body;
        return filters;
    }

    async createJob(req: Request, res: Response) {
        try {
            const body = req.body
            const requestBody = createJobSchema.parse(body)

            const companyId = (req as any).userID
            if (companyId) {
                (requestBody as any).companyId = companyId
                if (!requestBody.contact) {
                    const company = await this.companyService.getCompanyById(companyId)
                    if (company.email) {
                        (requestBody as any).contact = company.email
                    }
                }
            }

            const createdJob = await this.service.createJob(requestBody)
            if (createdJob) {
                return res.status(201).json({ message: "Created" })
            }
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ field: i.path.join('.'), message: i.message })) || []
                });
            }
            return res.status(500).json({ message: "Internal server error on createJob" })
        }
    }

    async getAllJobs(req: Request, res: Response) {
        try {
            const filters = this.extractFilters(req);
            const jobs = await this.service.getAllJobs(filters)
            if (!jobs) {
                return res.status(404).json({ message: "Jobs not found" })
            }

            const items = jobs.map((j: any) => {
                const companyName = j.Company?.name ?? null;
                const contact = j.contact ?? j.Company?.email ?? null;
                return {
                    job_id: j.id,
                    title: j.title,
                    area: j.area,
                    company: companyName,
                    description: j.description,
                    state: j.state,
                    city: j.city,
                    salary: j.salary,
                    contact: contact
                }
            })

            return res.status(200).json({ items })
        } catch (error) {
            return res.status(500).json({ message: "Internal server error on getAllJobs" })
        }
    }

    async getJobById(req: Request, res: Response) {
        try {
            const jobId = Number(req.params.id)
            const job = await this.service.getJobById(jobId)
            if (!job) {
                return res.status(404).json({ message: "Job not found" })
            }

            const companyName = job.Company?.name ?? null;
            const contact = job.contact ?? job.Company?.email ?? null;

            const items = {
                job_id: job.id,
                title: job.title,
                area: job.area,
                company: companyName,
                description: job.description,
                state: job.state,
                city: job.city,
                salary: job.salary,
                contact: contact
            }

            return res.status(200).json({ items })
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async getJobsByCompanyId(req: Request, res: Response) {
        try {
            const companyId = (req as any).userID
            const filters = this.extractFilters(req);
            const jobs = await this.service.getJobsByCompanyId(filters, companyId)
            if (!jobs) {
                return res.status(404).json({ message: "Jobs not found" })
            }

            const items = jobs.map((j: any) => {
                const companyName = j.Company?.name ?? null;
                const contact = j.contact ?? j.Company?.email ?? null;
                return {
                    job_id: j.id,
                    title: j.title,
                    area: j.area,
                    company: companyName,
                    description: j.description,
                    state: j.state,
                    city: j.city,
                    salary: j.salary,
                    contact: contact
                }
            })

            return res.status(200).json({ items })
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async updateJob(req: Request, res: Response) {
        try {
            const body = req.body
            const jobId = Number(req.params.id)
            const companyId = (req as any).userID

            const existingJob = await this.service.getJobById(jobId)
            if (!existingJob) {
                return res.status(404).json({ message: "Job not found" })
            }
            if (existingJob.companyId !== companyId) {
                return res.status(403).json({ message: "Forbidden" })
            }

            const requestBody = createJobSchema.parse(body)
            const updatedJob = await this.service.updateJob(requestBody, jobId)
            if (!updatedJob) {
                return res.status(404).json({ message: "Job not found" })
            }
            return res.status(200).json(updatedJob)
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(422).json({
                    message: 'ValidationError',
                    code: 'UNPROCESSABLE',
                    details: error.issues?.map(i => ({ field: i.path.join('.'), message: i.message })) || []
                });
            }
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async deleteJob(req: Request, res: Response) {
        try {
            const jobId = Number(req.params.id)
            const companyId = (req as any).userID

            const existsjob = await this.service.getJobById(jobId)
            if (!existsjob) {
                return res.status(404).json({ message: "Job not found" })
            }
            if (existsjob.companyId !== companyId) {
                return res.status(403).json({ message: "Forbidden" })
            }
            const message = await this.service.deleteJob(jobId)
            return res.status(200).json({ message })
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" })
        }
    }
}