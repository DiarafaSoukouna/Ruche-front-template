export interface UniteIndicateurTypes {
  id_unite: number
  unite_ui: string
  definition_ui: string
}

export interface FormProps {
  uniteIndicateur: UniteIndicateurTypes
  setUniteIndicateur: (value: UniteIndicateurTypes) => void
  isEdit: boolean
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}
