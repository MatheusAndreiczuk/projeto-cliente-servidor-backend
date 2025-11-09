import { Op } from "sequelize";
import Job from '../models/Job.js'
import Company from '../models/Company.js'
import { CreateJobSchema } from "../schemas/JobSchema.js";
import { IJobFilters } from '../@types/job.types';

export class JobRepository {
    constructor() { }

    async createJob(jobData: CreateJobSchema) {
        const createdJob = await Job.create(jobData)
        return createdJob
    }

    async getJobById(jobId: number) {
        const job = await Job.findByPk(jobId)
        return job
    }

    async getAllJobs(filters: IJobFilters) {
        const whereClauseJob: any = {}

        if (filters.title) {
            whereClauseJob.title = { [Op.like]: `%${filters.title}%` };
        }
        if (filters.area) {
            whereClauseJob.area = filters.area;
        }
        if (filters.description) {
            whereClauseJob.description = { [Op.like]: `%${filters.description}%` };
        }
        if (filters.location) {
            whereClauseJob.location = { [Op.like]: `%${filters.location}%` };
        }
        if (filters.salary_range) {
            const salaryFilter: any = {};
            if (filters.salary_range.min) {
                salaryFilter[Op.gte] = filters.salary_range.min;
            }
            if (filters.salary_range.max) {
                salaryFilter[Op.lte] = filters.salary_range.max;
            }
            whereClauseJob.salary = salaryFilter;
        }

        const whereClauseCompany: any = {};
        if (filters.company) {
            whereClauseCompany.name = { [Op.like]: `%${filters.company}%` };
        }

        const jobs = await Job.findAll({
            where: whereClauseJob,
            include: [
                {
                    model: Company,
                    attributes: ['name', 'contact'],
                    where: whereClauseCompany,
                    required: !!filters.company,
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return jobs;
    }

    async getJobsByCompany(filters: IJobFilters, companyId : number) {
        const whereClauseJob: any = {
            company_id: companyId
        }

        if (filters.title) {
            whereClauseJob.title = { [Op.like]: `%${filters.title}%` };
        }
        if (filters.area) {
            whereClauseJob.area = filters.area;
        }
        if (filters.description) {
            whereClauseJob.description = { [Op.like]: `%${filters.description}%` };
        }
        if (filters.location) {
            whereClauseJob.location = { [Op.like]: `%${filters.location}%` };
        }
        if (filters.salary_range) {
            const salaryFilter: any = {};
            if (filters.salary_range.min) {
                salaryFilter[Op.gte] = filters.salary_range.min;
            }
            if (filters.salary_range.max) {
                salaryFilter[Op.lte] = filters.salary_range.max;
            }
            whereClauseJob.salary = salaryFilter;
        }

        const jobs = await Job.findAll({
            where: whereClauseJob ,
            include: [
                {
                    model: Company,
                    attributes: ['name', 'contact']
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return jobs;
    }

    async updateJob(jobData: CreateJobSchema, idJob : number) {
        await Job.update(jobData, {
            where: { id: idJob }
        })

        const updatedJob = await Job.findByPk(idJob)
        return updatedJob
    }

    async deleteJob(idJob: number) {
        await Job.destroy({
            where: { id: idJob }
        })
        const message = "Job deleted successfully"
        return { message }
    }
}