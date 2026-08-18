import { useRef, useState } from 'react'
import Header from '../../shared/UI/Header/Header'
import styles from './HomePage.module.css'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch } from '../../app/providers/store';
import { login } from '../../app/providers/authSlice';

const HomePage = () => {
   const [love, setLove] = useState(false)
   const [celebration, setCelebration] = useState(false)
   const [noPosition, setNoPosition] = useState({
      x: 0,
      y: 0,
   })

   const buttonsRef = useRef<HTMLDivElement>(null)
   const yesButtonRef = useRef<HTMLButtonElement>(null)
   const noButtonRef = useRef<HTMLButtonElement>(null)

   const dispatch = useDispatch<AppDispatch>();
   const navigate = useNavigate();
   const moveNoButton = (
      event: React.MouseEvent<HTMLButtonElement>
   ) => {
      const container = buttonsRef.current
      const yesButton = yesButtonRef.current
      const noButton = noButtonRef.current

      if (!container || !yesButton || !noButton) {
         return
      }

      const containerRect = container.getBoundingClientRect()
      const yesRect = yesButton.getBoundingClientRect()

      const buttonWidth = noButton.offsetWidth
      const buttonHeight = noButton.offsetHeight

      const padding = 10
      const gap = 20

      // Минимальное расстояние от курсора
      const cursorGap = 100

      // Положение кнопки "Да" относительно buttons
      const yesLeft = yesRect.left - containerRect.left
      const yesTop = yesRect.top - containerRect.top

      const yesRight = yesLeft + yesRect.width
      const yesBottom = yesTop + yesRect.height

      // Максимальные координаты для кнопки "Нет"
      const maxX =
         container.clientWidth - buttonWidth - padding

      const maxY =
         container.clientHeight - buttonHeight - padding

      // Курсор относительно buttons
      const mouseX =
         event.clientX - containerRect.left

      const mouseY =
         event.clientY - containerRect.top

      let bestPosition: {
         x: number
         y: number
         distance: number
      } | null = null

      // Делаем много попыток найти хорошее место
      for (let i = 0; i < 200; i++) {
         const x =
            padding +
            Math.random() * Math.max(0, maxX - padding)

         const y =
            padding +
            Math.random() * Math.max(0, maxY - padding)

         const noLeft = x
         const noRight = x + buttonWidth

         const noTop = y
         const noBottom = y + buttonHeight

         // Не пересекаемся с кнопкой "Да"
         const overlapsYes =
            noRight > yesLeft - gap &&
            noLeft < yesRight + gap &&
            noBottom > yesTop - gap &&
            noTop < yesBottom + gap

         if (overlapsYes) {
            continue
         }

         /*
           Центр кнопки "Нет"
         */
         const noCenterX =
            x + buttonWidth / 2

         const noCenterY =
            y + buttonHeight / 2

         /*
           Расстояние от курсора
           до центра кнопки
         */
         const distance = Math.sqrt(
            Math.pow(noCenterX - mouseX, 2) +
            Math.pow(noCenterY - mouseY, 2)
         )

         /*
           Запоминаем самую дальнюю позицию
         */
         if (
            !bestPosition ||
            distance > bestPosition.distance
         ) {
            bestPosition = {
               x,
               y,
               distance,
            }
         }

         /*
           Если нашли позицию,
           которая достаточно далеко —
           сразу используем её
         */
         if (distance >= cursorGap) {
            setNoPosition({
               x,
               y,
            })

            return
         }
      }

      /*
        Если по какой-то причине
        не нашли позицию на 100px,
        используем самую дальнюю
      */
      if (bestPosition) {
         setNoPosition({
            x: bestPosition.x,
            y: bestPosition.y,
         })
      }
   }
   const handleYesClick = () => {
      setLove(true)
      setCelebration(true)

      setTimeout(() => {
         setCelebration(false)
      }, 5000)
   }
   const handleMemoryClick = () => {
      dispatch(login());
      navigate('/love');
   };
   return (
      <div className={styles.homePage}>
         <Header />
         {celebration && (
            <div className={styles.celebration}>

               <div className={styles.celebrationText}>
                  УРАААА! 💕
               </div>

               {/* Центральный взрыв сердечек */}
               <div className={styles.heartExplosion}>
                  {Array.from({ length: 20 }).map((_, index) => (
                     <span key={index}>♥</span>
                  ))}
               </div>

               {/* МНОГО ФЕЙЕРВЕРКОВ */}
               <div className={styles.fireworks}>
                  {Array.from({ length: 12 }).map((_, index) => (
                     <div
                        key={index}
                        className={styles.firework}
                     />
                  ))}
               </div>

            </div>
         )}
         <main className={styles.loveContainer}>
            <div className={styles.hearts}>
               <span>♡</span>
               <span>♥</span>
               <span>♡</span>
               <span>♥</span>
               <span>♡</span>
            </div>

            <section className={styles.loveCard}>
               <h1 className={styles.title}>
                  Ты меня
                  <span> любишь?</span>
               </h1>

               <div
                  ref={buttonsRef}
                  className={styles.buttons}
               >
                  <button
                     ref={yesButtonRef}
                     className={styles.yesButton}
                     onClick={handleYesClick}
                  >
                     {love
                        ? '💗 Я тоже тебя люблю'
                        : 'Да ❤️'}
                  </button>

                  <button
                     ref={noButtonRef}
                     className={`${styles.noButton} ${love ? styles.hidden : ''
                        }`}
                     onMouseEnter={moveNoButton}
                     style={{
                        left: `${noPosition.x}px`,
                        top: `${noPosition.y}px`,
                     }}
                  >
                     Нет
                  </button>
               </div>

               {love && (
                  <div
                     className={styles.memory}
                     onClick={handleMemoryClick}
                  >
                     <div className={styles.memoryHeart}>
                        💕
                     </div>

                     <h2>
                        Наше первое воспоминание
                     </h2>

                     <p>
                        Кажется, с этого момента начинается
                        наша маленькая история...
                     </p>
                  </div>
               )}
            </section>
         </main>
      </div>
   )
}

export default HomePage

