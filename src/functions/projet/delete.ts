import { api } from '../../lib/api';

export default async (id: number | string) => {
  try {
    await api.delete(`projet/${id}`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
