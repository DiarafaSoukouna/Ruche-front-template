import { api } from '../../lib/api'
import { Programme } from '../../types/programme';

export default async () => {
  try {
    const { data } = await api.get('programme/')

    return data as Programme[];
  } catch (error) {
    console.error(error)
  }
}
