import * as yup from 'yup'
import { departments, type Department } from '../types/contact'

export type ContactFormValues = {
  name: string
  email: string
  phone: string
  department: Department | ''
}

export const contactSchema = yup.object({
  name: yup.string().trim().required('Escribe el nombre del contacto.'),
  email: yup
    .string()
    .trim()
    .email('Escribe un email válido.')
    .required('Escribe el email del contacto.'),
  phone: yup.string().trim(),
  department: yup
    .string()
    .oneOf(departments, 'Selecciona un departamento.')
    .required('Selecciona un departamento.'),
})
