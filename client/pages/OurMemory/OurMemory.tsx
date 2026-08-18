import {
   useEffect,
   useState,
   useCallback,
} from 'react'

import styles from './OurMemory.module.css'
import Header from '../../shared/UI/Header/Header'
import CreateMemory from '../../features/create-memory/ui/CreateMemory'

import {
   getMemories,
   type Memory,
} from '../../entities/memory/api/memoryApi'


const API_URL = 'http://localhost:5000'


const OurMemory = () => {
   const [memories, setMemories] = useState<Memory[]>([])

   const [loading, setLoading] = useState(true)

   const [error, setError] =
      useState<string | null>(null)


   // ========================================
   // ВЫБРАННОЕ ВОСПОМИНАНИЕ
   // ========================================

   const [selectedMemory, setSelectedMemory] =
      useState<Memory | null>(null)


   // ========================================
   // КОЛОНКИ MASONRY
   // ========================================

   const [columns, setColumns] = useState<
      Memory[][]
   >([[], [], [], []])


   // ========================================
   // ОПРЕДЕЛЯЕМ КОЛИЧЕСТВО КОЛОНОК
   // ========================================

   const getColumnCount = useCallback(() => {
      const width = window.innerWidth

      if (width <= 600) {
         return 2
      }

      if (width <= 900) {
         return 3
      }

      return 4
   }, [])


   // ========================================
   // РАСКЛАДКА MASONRY
   // ========================================

   const createMasonry = useCallback(() => {
      const columnCount = getColumnCount()

      const newColumns: Memory[][] =
         Array.from(
            { length: columnCount },
            () => []
         )


      /*
         Раскладываем фотографии
         по колонкам.

         Высота самих фотографий
         сохраняется благодаря CSS,
         поэтому визуально получается
         Pinterest-style masonry.
      */

      memories.forEach((memory, index) => {
         const columnIndex =
            index % columnCount

         newColumns[columnIndex].push(memory)
      })


      setColumns(newColumns)
   }, [
      memories,
      getColumnCount,
   ])


   // ========================================
   // ЗАГРУЗКА ВОСПОМИНАНИЙ
   // ========================================

   const loadMemories = useCallback(
      async () => {
         try {
            setLoading(true)
            setError(null)

            const data = await getMemories()

            setMemories(data)
         } catch (error) {
            console.error(error)

            setError(
               'Не удалось загрузить наши воспоминания 💔'
            )
         } finally {
            setLoading(false)
         }
      },
      []
   )


   // ========================================
   // ПЕРВАЯ ЗАГРУЗКА
   // ========================================

   useEffect(() => {
      loadMemories()
   }, [loadMemories])


   // ========================================
   // ПЕРЕСОЗДАЁМ MASONRY
   // ========================================

   useEffect(() => {
      if (memories.length === 0) {
         return
      }

      createMasonry()
   }, [
      memories,
      createMasonry,
   ])


   // ========================================
   // RESPONSIVE
   // ========================================

   useEffect(() => {
      const handleResize = () => {
         createMasonry()
      }

      window.addEventListener(
         'resize',
         handleResize
      )

      return () => {
         window.removeEventListener(
            'resize',
            handleResize
         )
      }
   }, [createMasonry])


   // ========================================
   // ОТКРЫТИЕ ФОТО
   // ========================================

   const handleMemoryClick = (
      memory: Memory
   ) => {
      setSelectedMemory(memory)

      document.body.style.overflow = 'hidden'
   }


   // ========================================
   // ЗАКРЫТИЕ ФОТО
   // ========================================

   const handleCloseMemory = () => {
      setSelectedMemory(null)

      document.body.style.overflow = ''
   }


   // ========================================
   // ESC
   // ========================================

   useEffect(() => {
      const handleKeyDown = (
         event: KeyboardEvent
      ) => {
         if (
            event.key === 'Escape' &&
            selectedMemory
         ) {
            handleCloseMemory()
         }
      }

      window.addEventListener(
         'keydown',
         handleKeyDown
      )

      return () => {
         window.removeEventListener(
            'keydown',
            handleKeyDown
         )
      }
   }, [selectedMemory])


   // ========================================
   // ПОСЛЕ СОЗДАНИЯ НОВОГО ВОСПОМИНАНИЯ
   // ========================================

   const handleMemoryCreated = (memory: Memory) => {
      setMemories((prev) => [
         ...prev,
         memory,
      ])
   }


   // ========================================
   // LOADING
   // ========================================

   if (loading) {
      return (
         <main className={styles.page}>

            <div className={styles.centerMessage}>

               <div className={styles.messageHeart}>
                  💕
               </div>

               <h1>
                  Загружаем нашу историю...
               </h1>

            </div>

         </main>
      )
   }


   // ========================================
   // ERROR
   // ========================================

   if (error) {
      return (
         <main className={styles.page}>

            <div className={styles.centerMessage}>

               <div className={styles.messageHeart}>
                  💔
               </div>

               <h1>
                  {error}
               </h1>

               <button
                  onClick={loadMemories}
               >
                  Попробовать снова
               </button>

            </div>

         </main>
      )
   }


   // ========================================
   // PAGE
   // ========================================

   return (
      <>
         <Header />

         <main className={styles.page}>

            {/* ========================================
             HEADER
         ======================================== */}

            <section className={styles.header}>

               <div className={styles.headerHeart}>
                  ♡
               </div>

               <h1 className={styles.title}>
                  Наша <span>история</span>
               </h1>

               <p className={styles.subtitle}>
                  Маленькие моменты, которые стали
                  нашей большой историей 💕
               </p>

            </section>


            {/* ========================================
             PHOTOS
         ======================================== */}

            {memories.length === 0 ? (

               <div className={styles.empty}>

                  <div className={styles.emptyHeart}>
                     💕
                  </div>

                  <h2>
                     Здесь пока ничего нет
                  </h2>

                  <p>
                     Но наша история только начинается...
                  </p>

               </div>

            ) : (

               <section className={styles.memoryGrid}>

                  {columns.map(
                     (column, columnIndex) => (

                        <div
                           key={columnIndex}
                           className={styles.memoryColumn}
                        >

                           {column.map(
                              (memory) => (

                                 <article
                                    key={memory.id}
                                    className={
                                       styles.memoryCard
                                    }
                                    onClick={() =>
                                       handleMemoryClick(
                                          memory
                                       )
                                    }
                                 >

                                    <div
                                       className={
                                          styles.imageWrapper
                                       }
                                    >

                                       <img
                                          src={`${API_URL}${memory.image}`}
                                          alt={
                                             memory.title
                                          }
                                          className={
                                             styles.image
                                          }
                                       />

                                    </div>

                                 </article>

                              )
                           )}

                        </div>

                     )
                  )}

               </section>

            )}


            {/* ========================================
             СОЗДАНИЕ НОВОГО ВОСПОМИНАНИЯ
         ======================================== */}

            <section className={styles.createMemorySection}>

               <CreateMemory
                  onCreated={handleMemoryCreated}
               />

            </section>


            {/* ========================================
             PHOTO VIEWER
         ======================================== */}

            {selectedMemory && (

               <div
                  className={
                     styles.memoryViewer
                  }
                  onClick={
                     handleCloseMemory
                  }
               >

                  <div
                     className={
                        styles.memoryViewerContent
                     }
                     onClick={(event) =>
                        event.stopPropagation()
                     }
                  >

                     {/* CLOSE */}

                     <button
                        className={
                           styles.closeButton
                        }
                        onClick={
                           handleCloseMemory
                        }
                        aria-label="Закрыть"
                     >
                        ×
                     </button>


                     {/* IMAGE */}

                     <div
                        className={
                           styles.viewerImageWrapper
                        }
                     >

                        <img
                           src={`${API_URL}${selectedMemory.image}`}
                           alt={
                              selectedMemory.title
                           }
                           className={
                              styles.viewerImage
                           }
                        />

                     </div>


                     {/* INFO */}

                     <div
                        className={
                           styles.viewerInfo
                        }
                     >

                        <h2>
                           {
                              selectedMemory.title
                           }
                        </h2>

                        <p>
                           {
                              selectedMemory.description
                           }
                        </p>

                     </div>

                  </div>

               </div>

            )}

         </main>
      </>
   )

}


export default OurMemory