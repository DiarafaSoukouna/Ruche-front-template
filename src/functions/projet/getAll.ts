import { api } from '../../lib/api';
import { Projet } from '../../types/projet';

export default async () => {
  try {
    const { data } = await api.get('projet/')

    return data as Projet[];
  } catch (error) {
    console.error(error)
  }
}
