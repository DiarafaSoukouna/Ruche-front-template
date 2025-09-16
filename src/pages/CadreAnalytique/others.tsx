export const tableauToString = (data: any[]) => {
  return data.map((item) => JSON.stringify(item)).join(', ')
}
export const stringToTableau = (data?: string) => {
  if (!data) return []
  return data.split(',').map((item) => item.trim())
}
