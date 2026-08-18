import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import heart from './heart.svg'
import { logout } from '../../../app/providers/authSlice'


const Header = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   const birthday = new Date(
      '2026-08-19T00:00:00'
   ).getTime()


   const [time, setTime] = useState(
      birthday - Date.now()
   )


   useEffect(() => {
      const interval = setInterval(() => {
         const timeLeft =
            birthday - Date.now()

         setTime(timeLeft)
      }, 1000)


      return () => {
         clearInterval(interval)
      }
   }, [])


   // ========================================
   // ВРЕМЯ
   // ========================================

   const days = Math.floor(
      time /
      (1000 * 60 * 60 * 24)
   )


   const hours = Math.floor(
      (time /
         (1000 * 60 * 60)) %
      24
   )


   const minutes = Math.floor(
      (time /
         (1000 * 60)) %
      60
   )


   const seconds = Math.floor(
      (time / 1000) % 60
   )


   // ========================================
   // ВОЗВРАТ НА СТАРТОВУЮ
   // ========================================

   const handleHeartClick = () => {
      dispatch(logout())

      navigate('/')
   }


   return (
      <header className={styles.header}>

         <div className={styles.container}>

            <button
               type="button"
               className={styles.heartButton}
               onClick={handleHeartClick}
               aria-label="Вернуться на главную"
            >
               <img
                  className={styles.heart}
                  src={heart}
                  alt="heart"
               />
            </button>


            <div className={styles.timer}>
               До твоего дня рождения:{' '}

               {days} д{' '}
               {hours} ч{' '}
               {minutes} мин{' '}
               {seconds} сек
            </div>

         </div>

      </header>
   )
}


export default Header