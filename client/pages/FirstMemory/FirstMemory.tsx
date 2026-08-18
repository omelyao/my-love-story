import Header from '../../shared/UI/Header/Header';
import styles from './FirstMemory.module.css';
import { useNavigate } from 'react-router-dom';
import memory1 from './assets/memory-1.jpg';
import memory2 from './assets/memory-2.jpg';

const FirstMemory = () => {
   const navigate = useNavigate();
   return (
      <div className={styles.page}>
         <Header />

         <main className={styles.container}>
            <section className={styles.memoryCard}>

               <div className={styles.decorativeHeart}>
                  ♡
               </div>

               <h1 className={styles.title}>
                  Наше первое <span>воспоминание</span>
               </h1>

               <div className={styles.photos}>
                  <div className={styles.photoWrapper}>
                     <img
                        src={memory1}
                        alt="Наше первое воспоминание"
                        className={styles.photo}
                     />
                  </div>

                  <div className={styles.photoWrapper}>
                     <img
                        src={memory2}
                        alt="Наше первое воспоминание"
                        className={styles.photo}
                     />
                  </div>
               </div>

               <div className={styles.story}>
                  <div className={styles.storyHeart}>
                     💕
                  </div>

                  <p>
                     А еще были кроксы и мольбы подписаться на тг канал
                  </p>
               </div>

               <button
                  className={styles.nextButton}
                  type="button"
                  onClick={() => navigate('/love/our-memory')}
               >
                  А что было дальше?.. 💕
               </button>

            </section>
         </main>
      </div>
   );
};

export default FirstMemory;