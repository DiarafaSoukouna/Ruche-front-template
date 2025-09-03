import { api } from '../../lib/api'

export const DeleteTypeZone = async (id: number) => {
  try {
    const res = await api.delete(`type_zone/${id}/`)
    if (res) {
      return res
    }
  } catch (error) {
    console.error(error)
  }
}
