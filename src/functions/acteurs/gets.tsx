import { instance } from '../../axios'

export const getAll = () => {
  try {
    const data = instance.get('acteur')
    return data
  } catch {}
}
