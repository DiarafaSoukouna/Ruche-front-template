import { api } from '../../lib/api'
import { typeProgram } from './types'
import { ProgrammeTypes } from '../../types/programme'

export const getAllProgrammes = async () => {
  try {
    const { data } = await api.get('programme/')

    return data as ProgrammeTypes[]
  } catch (error) {
    console.error(error)
  }
}
export const getAllProgrammesNbc = async () => {
  try {
    const { data } = await api.get('programme_nbc/')

    return data as typeProgram[]
  } catch (error) {
    console.error(error)
  }
}
