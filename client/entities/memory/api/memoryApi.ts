export interface Memory {
   id: number
   title: string
   description: string
   image: string
   created_at: string
}

const API_URL = 'http://localhost:5000'

export const getMemories = async (): Promise<Memory[]> => {
   const response = await fetch(
      `${API_URL}/api/memories`
   )

   if (!response.ok) {
      throw new Error(
         'Не удалось загрузить воспоминания'
      )
   }

   return response.json()
}
// ========================================
// СОЗДАТЬ ВОСПОМИНАНИЕ
// ========================================

export interface CreateMemoryData {
   title: string
   description: string
   image: File
}


export const createMemory = async (
   data: CreateMemoryData
): Promise<Memory> => {

   const formData = new FormData()

   formData.append(
      'title',
      data.title
   )

   formData.append(
      'description',
      data.description
   )

   formData.append(
      'image',
      data.image
   )


   const response = await fetch(
      `${API_URL}/api/memories`,
      {
         method: 'POST',
         body: formData,
      }
   )


   if (!response.ok) {
      throw new Error(
         'Не удалось создать воспоминание'
      )
   }


   return response.json()
}