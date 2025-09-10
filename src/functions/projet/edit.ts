import { api } from '../../lib/api';
import { Projet } from '../../types/projet';

export default async (id: number|string, value: any) => {
  try {
    const { data } = await api.put(`projet/${id}`, value);

    return data as Projet;
  } catch (error) {
    console.error(error)
  }
}
