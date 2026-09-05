import * as yup from 'yup'
import { departments, type Department } from '../types/contact'

export type ContactFormValues = {
  name: string
  email: string
  phone: string
  department: Department | ''
}

const namePattern = /^[\p{L}\p{M}]+(?:[- '][\p{L}\p{M}]+)*$/u
const emailWithCompleteDomain = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/

function isValidMexicanPhone(value?: string) {
  if (!value) return true
  const compactPhone = value.replace(/[ ()-]/g, '')
  return /^(?:\+52)?\d{10}$/.test(compactPhone)
}

export const contactSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Escribe el nombre del contacto.')
    .matches(
      namePattern,
      'Usa únicamente letras, espacios, apóstrofes o guiones.',
    ),
  email: yup
    .string()
    .trim()
    .email('Escribe un email válido.')
    .matches(emailWithCompleteDomain, 'Escribe un email válido.')
    .required('Escribe el email del contacto.'),
  phone: yup
    .string()
    .trim()
    .test(
      'mexican-phone',
      'Escribe un teléfono mexicano de 10 dígitos; el código +52 es opcional.',
      isValidMexicanPhone,
    ),
  department: yup
    .string()
    .oneOf(departments, 'Selecciona un departamento.')
    .required('Selecciona un departamento.'),
})
