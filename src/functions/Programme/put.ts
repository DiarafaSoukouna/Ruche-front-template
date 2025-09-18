import { instance } from '../../axios'
import { ProgrammeTypes } from '../../types/programme'

export const updateProgram = async (data: ProgrammeTypes, id: number) => {
  try {
    const res = await instance.put('programme/' + id + '/', data)
    return res.data
  } catch (error) {
    throw error
  }
}
