import { instance } from '../../axios'
import { ProgrammeTypes } from '../../types/programme'

export const addProgram = async (data: ProgrammeTypes) => {
  try {
    const res = await instance.post('programme/', data)
    return res.data
  } catch (error) {
    throw error
  }
}
