import React, { createContext, useContext, useEffect, useState } from 'react'
import { Programme } from '../types/programme'
import { getAllProgrammes } from '../functions/Programme/gets'

interface contextType {
  currentProgramme: Programme | undefined
  setCurrentProgramme: React.Dispatch<
    React.SetStateAction<Programme | undefined>
  >
  programmeList: Programme[]
  setprogrammeList: React.Dispatch<React.SetStateAction<Programme[]>>
}

const RootContext = createContext<contextType | undefined>(undefined)

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentProgramme, setCurrentProgramme] = useState<
    Programme | undefined
  >(undefined)
  const [programmeList, setprogrammeList] = useState<Programme[]>([])

  const loadProject = async () => {
    try {
      const res = await getAllProgrammes()
      res && setprogrammeList(res)
    } catch (error) {}
  }

  const initCUrrentProject = async () => {
    const programme = localStorage.getItem('currentProgramme')

    if (!programme) {
      programmeList.length && setCurrentProgramme(programmeList[0])
      return
    }

    setCurrentProgramme(JSON.parse(programme))
  }

  useEffect(() => {
    loadProject()
  }, [])

  useEffect(() => {
    initCUrrentProject()
  }, [programmeList])

  useEffect(() => {
    currentProgramme &&
      localStorage.setItem('currentProgramme', JSON.stringify(currentProgramme))
  }, [currentProgramme])

  return (
    <RootContext.Provider
      value={{
        currentProgramme,
        setCurrentProgramme,
        programmeList,
        setprogrammeList,
      }}
    >
      {children}
    </RootContext.Provider>
  )
}

export const useRoot = (): contextType => {
  const context = useContext(RootContext)

  if (context === undefined) {
    throw new Error('useRoot must be used within an RootProvider')
  }

  return context
}
