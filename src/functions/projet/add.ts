import { api } from '../../lib/api';
import { Projet } from '../../types/projet';

export default async (value: Projet) => {
  try {
    const { data } = await api.post('projet/', value);

    return data as Projet;
  } catch (error) {
    console.error(error)
  }
}
