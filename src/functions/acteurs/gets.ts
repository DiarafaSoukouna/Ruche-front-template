import { instance } from '../../axios'

export const getAllActeurs = () => {
  try {
    const data = instance.get('acteur')
    console.log('helloooo', data)
    return data
  } catch {}
}
