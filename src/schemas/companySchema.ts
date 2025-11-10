import { z } from 'zod';

const validStates = [
    'AC', 'Acre',
    'AL', 'Alagoas',
    'AP', 'Amapá',
    'AM', 'Amazonas',
    'BA', 'Bahia',
    'CE', 'Ceará',
    'DF', 'Distrito Federal',
    'ES', 'Espírito Santo',
    'GO', 'Goiás',
    'MA', 'Maranhão',
    'MT', 'Mato Grosso',
    'MS', 'Mato Grosso do Sul',
    'MG', 'Minas Gerais',
    'PA', 'Pará',
    'PB', 'Paraíba',
    'PR', 'Paraná',
    'PE', 'Pernambuco',
    'PI', 'Piauí',
    'RJ', 'Rio de Janeiro',
    'RN', 'Rio Grande do Norte',
    'RS', 'Rio Grande do Sul',
    'RO', 'Rondônia',
    'RR', 'Roraima',
    'SC', 'Santa Catarina',
    'SP', 'São Paulo',
    'SE', 'Sergipe',
    'TO', 'Tocantins'
] as const;

export const companySchema = z.object({
    name:  z
    .string()
    .min(4, "Deve ter no mínimo 4 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    business: z
    .string()
    .min(4, "Deve ter no mínimo 4 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    username: z
    .string()
    .min(3, "Deve ter no mínimo 3 caracteres")
    .max(20, "Deve ter no máximo 20 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "Deve conter apenas letras e números, sem espaços ou caracteres especiais"),
    password: z
    .string()
    .min(3, "Deve ter no mínimo 3 caracteres")
    .max(20, "Deve ter no máximo 20 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "Deve conter apenas letras e números, sem espaços ou caracteres especiais"),
    street: z
    .string()
    .min(1, "Deve ter no mínimo 3 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    number: z
    .string()
    .regex(/^\d+$/, "Deve conter apenas números")
    .min(1, "Deve ter no mínimo 1 dígito")
    .max(8, "Deve ter no máximo 8 dígitos"),
    city: z
    .string()
    .min(4, "Deve ter no mínimo 4 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    phone: z
    .string()
    .regex(/^\d+$/, "Deve conter apenas números")
    .min(10, "Deve ter no mínimo 10 dígitos")
    .max(14, "Deve ter no máximo 14 dígitos"),
    email: z
    .email()
    .min(10, "Deve ter no mínimo 10 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    state: z
    .string()
    .refine((val) => validStates.includes(val as any), {
        message: "Estado inválido. Use a sigla (ex: PR, SP) ou nome completo (ex: Paraná, São Paulo)"
    })
})

export const companySchemaUpdate = z.object({
    name:  z
    .string()
    .min(4, "Deve ter no mínimo 4 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    business: z
    .string()
    .min(4, "Deve ter no mínimo 4 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    password: z
    .string()
    .min(3, "Deve ter no mínimo 3 caracteres")
    .max(20, "Deve ter no máximo 20 caracteres")
    .regex(/^[a-zA-Z0-9]+$/, "Deve conter apenas letras e números, sem espaços ou caracteres especiais"),
    street: z
    .string()
    .min(1, "Deve ter no mínimo 3 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    number: z
    .string()
    .regex(/^\d+$/, "Deve conter apenas números")
    .min(1, "Deve ter no mínimo 1 dígito")
    .max(8, "Deve ter no máximo 8 dígitos"),
    city: z
    .string()
    .min(4, "Deve ter no mínimo 4 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    phone: z
    .string()
    .regex(/^\d+$/, "Deve conter apenas números")
    .min(10, "Deve ter no mínimo 10 dígitos")
    .max(14, "Deve ter no máximo 14 dígitos"),
    email: z
    .email()
    .min(10, "Deve ter no mínimo 10 caracteres")
    .max(150, "Deve ter no máximo 150 caracteres"),
    state: z
    .string()
    .refine((val) => validStates.includes(val as any), {
        message: "Estado inválido. Use a sigla (ex: PR, SP) ou nome completo (ex: Paraná, São Paulo)"
    })
})

export type CompanySchema = z.infer<typeof companySchema>
export type CompanySchemaUpdate = z.infer<typeof companySchemaUpdate>