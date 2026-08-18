import HomePage from '../../pages/HomePage/HomePage';
import FirstMemory from '../../pages/FirstMemory/FirstMemory';
import OurMemory from '../../pages/OurMemory/OurMemory';

export const routes = {
   public: [
      {
         path: '/',
         component: HomePage,
      },
   ],

   private: [
      {
         path: '/love',
         component: FirstMemory,
      },
      {
         path: '/love/our-memory',
         component: OurMemory,
      },
   ],
};