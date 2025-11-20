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
        const job = await Job.findByPk(jobId, {
            include: [
                {
                    model: Company,
                    attributes: ['name', 'email']
                }
            ]
        })
        return job
    }

    async getAllJobs(filters: IJobFilters = {}) {
        const whereClauseJob: any = {}

        if (filters.title) {
            whereClauseJob.title = { [Op.like]: `%${filters.title}%` };
        }
        if (filters.area) {
            whereClauseJob.area = { [Op.like]: `%${filters.area}%` };
        }
        if (filters.description) {
            whereClauseJob.description = { [Op.like]: `%${filters.description}%` };
        }
        if (filters.state) {
            whereClauseJob.state = filters.state;
        }
        if (filters.city) {
            whereClauseJob.city = { [Op.like]: `%${filters.city}%` };
        }
        if (filters.salary_range && typeof filters.salary_range === 'object') {
            const salaryFilter: any = {};
            if (typeof (filters.salary_range as any).min !== 'undefined') {
                salaryFilter[Op.gte] = (filters.salary_range as any).min;
            }
            if (typeof (filters.salary_range as any).max !== 'undefined') {
                salaryFilter[Op.lte] = (filters.salary_range as any).max;
            }
            if (Object.keys(salaryFilter).length > 0) {
                whereClauseJob.salary = salaryFilter;
            }
        }

        const whereClauseCompany: any = {};
        if (filters.company) {
            whereClauseCompany.name = { [Op.like]: `%${filters.company}%` };
        }
        const shouldRequireCompany = Object.keys(whereClauseCompany).length > 0;

        try {
            const jobs = await Job.findAll({
                where: whereClauseJob,
                include: [
                    {
                        model: Company,
                        attributes: ['name', 'email'],
                        ...(shouldRequireCompany ? { where: whereClauseCompany } : {}),
                        required: shouldRequireCompany,
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            return jobs;
        } catch (error) {
            console.error('JobRepository.getAllJobs error', { error: (error as Error).message, whereClauseJob, whereClauseCompany });
            throw error;
        }
    }

    async getJobsByCompany(filters: IJobFilters = {}, companyId : number) {
        const whereClauseJob: any = {
            companyId: companyId
        }

        if (filters.title) {
            whereClauseJob.title = { [Op.like]: `%${filters.title}%` };
        }
        if (filters.area) {
            whereClauseJob.area = { [Op.like]: `%${filters.area}%` };
        }
        if (filters.description) {
            whereClauseJob.description = { [Op.like]: `%${filters.description}%` };
        }
        if (filters.state) {
            whereClauseJob.state = filters.state;
        }
        if (filters.city) {
            whereClauseJob.city = { [Op.like]: `%${filters.city}%` };
        }
        if (filters.salary_range && typeof filters.salary_range === 'object') {
            const salaryFilter: any = {};
            if (typeof (filters.salary_range as any).min !== 'undefined') {
                salaryFilter[Op.gte] = (filters.salary_range as any).min;
            }
            if (typeof (filters.salary_range as any).max !== 'undefined') {
                salaryFilter[Op.lte] = (filters.salary_range as any).max;
            }
            if (Object.keys(salaryFilter).length > 0) {
                whereClauseJob.salary = salaryFilter;
            }
        }

        const whereClauseCompany: any = {};
        if (filters.company) {
            whereClauseCompany.name = { [Op.like]: `%${filters.company}%` };
        }
        const shouldRequireCompany = Object.keys(whereClauseCompany).length > 0;

        try {
            const jobs = await Job.findAll({
                where: whereClauseJob ,
                include: [
                    {
                        model: Company,
                        attributes: ['name', 'email', 'state', 'city'],
                        ...(shouldRequireCompany ? { where: whereClauseCompany } : {}),
                        required: shouldRequireCompany,
                    },
                ],
                order: [['createdAt', 'DESC']],
            });

            return jobs;
        } catch (error) {
            console.error('JobRepository.getJobsByCompany error', { error: (error as Error).message, whereClauseJob, whereClauseCompany });
            throw error;
        }
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