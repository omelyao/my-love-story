import {
   ChangeEvent,
   FormEvent,
   useState,
} from 'react'

import styles from './CreateMemory.module.css'

import {
   createMemory,
} from '../../../entities/memory/api/memoryApi'

import type {
   Memory,
} from '../../../entities/memory/model/types'


interface CreateMemoryProps {
   onCreated: (memory: Memory) => void
}


const CreateMemory = ({
   onCreated,
}: CreateMemoryProps) => {

   const [isOpen, setIsOpen] =
      useState(false)

   const [title, setTitle] =
      useState('')

   const [description, setDescription] =
      useState('')

   const [image, setImage] =
      useState<File | null>(null)

   const [preview, setPreview] =
      useState<string | null>(null)

   const [loading, setLoading] =
      useState(false)

   const [error, setError] =
      useState<string | null>(null)


   // ========================================
   // ВЫБОР ФОТО
   // ========================================

   const handleImageChange = (
      event: ChangeEvent<HTMLInputElement>
   ) => {

      const file =
         event.target.files?.[0]

      if (!file) {
         return
      }


      setImage(file)

      setPreview(
         URL.createObjectURL(file)
      )
   }


   // ========================================
   // ОТПРАВКА
   // ========================================

   const handleSubmit = async (
      event: FormEvent<HTMLFormElement>
   ) => {

      event.preventDefault()

      setError(null)


      if (!title.trim()) {
         setError(
            'Напиши название воспоминания 💕'
         )

         return
      }


      if (!description.trim()) {
         setError(
            'Добавь немного истории 💕'
         )

         return
      }


      if (!image) {
         setError(
            'Выбери фотографию 📷'
         )

         return
      }


      try {

         setLoading(true)


         const newMemory =
            await createMemory({
               title: title.trim(),
               description: description.trim(),
               image,
            })


         // Передаём новое воспоминание
         // обратно в OurMemory

         onCreated(newMemory)


         // Очищаем форму

         setTitle('')

         setDescription('')

         setImage(null)

         setPreview(null)

         setError(null)

         setIsOpen(false)

      } catch (error) {

         console.error(error)

         setError(
            'Не удалось сохранить воспоминание 💔'
         )

      } finally {

         setLoading(false)

      }
   }


   // ========================================
   // ЗАКРЫТИЕ
   // ========================================

   const handleClose = () => {

      if (loading) {
         return
      }

      setIsOpen(false)

      setError(null)

   }


   // ========================================
   // КНОПКА
   // ========================================

   if (!isOpen) {

      return (
         <section className={styles.createSection}>

            <button
               className={
                  styles.openButton
               }
               onClick={() =>
                  setIsOpen(true)
               }
            >
               <span>+</span>

               Добавить воспоминание
            </button>

         </section>
      )
   }


   // ========================================
   // ФОРМА
   // ========================================

   return (
      <section
         className={
            styles.createSection
         }
      >

         <div
            className={
               styles.formCard
            }
         >

            {/* HEADER */}

            <div
               className={
                  styles.formHeader
               }
            >

               <div>
                  <div
                     className={
                        styles.formHeart
                     }
                  >
                     💕
                  </div>

                  <h2>
                     Новое воспоминание
                  </h2>

                  <p>
                     Добавим ещё один момент
                     в нашу историю
                  </p>
               </div>


               <button
                  type="button"
                  className={
                     styles.closeButton
                  }
                  onClick={
                     handleClose
                  }
               >
                  ×
               </button>

            </div>


            <form
               className={
                  styles.form
               }
               onSubmit={
                  handleSubmit
               }
            >

               {/* ФОТО */}

               <div
                  className={
                     styles.field
                  }
               >

                  <label>
                     Фотография
                  </label>


                  <label
                     className={
                        styles.imageInput
                     }
                  >

                     {preview ? (

                        <img
                           src={preview}
                           alt="Предпросмотр"
                           className={
                              styles.preview
                           }
                        />

                     ) : (

                        <div
                           className={
                              styles.imagePlaceholder
                           }
                        >

                           <span>
                              📷
                           </span>

                           <strong>
                              Выбрать фотографию
                           </strong>

                           <small>
                              Нажми сюда,
                              чтобы загрузить фото
                           </small>

                        </div>

                     )}


                     <input
                        type="file"
                        accept="image/*"
                        onChange={
                           handleImageChange
                        }
                     />

                  </label>

               </div>


               {/* TITLE */}

               <div
                  className={
                     styles.field
                  }
               >

                  <label
                     htmlFor="memory-title"
                  >
                     Название
                  </label>

                  <input
                     id="memory-title"
                     type="text"
                     value={title}
                     onChange={(event) =>
                        setTitle(
                           event.target.value
                        )
                     }
                     placeholder="Например: Наш первый вечер"
                     maxLength={100}
                  />

               </div>


               {/* DESCRIPTION */}

               <div
                  className={
                     styles.field
                  }
               >

                  <label
                     htmlFor="memory-description"
                  >
                     Описание
                  </label>

                  <textarea
                     id="memory-description"
                     value={description}
                     onChange={(event) =>
                        setDescription(
                           event.target.value
                        )
                     }
                     placeholder="Расскажи, что ты помнишь об этом моменте..."
                     rows={5}
                     maxLength={1000}
                  />

               </div>


               {/* ERROR */}

               {error && (

                  <div
                     className={
                        styles.error
                     }
                  >
                     {error}
                  </div>

               )}


               {/* BUTTONS */}

               <div
                  className={
                     styles.formActions
                  }
               >

                  <button
                     type="button"
                     className={
                        styles.cancelButton
                     }
                     onClick={
                        handleClose
                     }
                     disabled={loading}
                  >
                     Отмена
                  </button>


                  <button
                     type="submit"
                     className={
                        styles.submitButton
                     }
                     disabled={loading}
                  >

                     {loading
                        ? 'Сохраняем... 💕'
                        : 'Сохранить воспоминание 💗'
                     }

                  </button>

               </div>

            </form>

         </div>

      </section>
   )
}


export default CreateMemory