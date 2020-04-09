import Index from '../views/Index';
import List from '../views/List';
import Error from '../views/Error';

const routes = [
  {path: '/index', component: Index},
  {path: '/list', component: List},
  {path: '/404', component: Error}
]

export default routes