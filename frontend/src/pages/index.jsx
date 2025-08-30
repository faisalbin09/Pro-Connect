import {Inter} from 'next/font/google';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import UserLayout from '@/layout/UserLayout';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const router = useRouter();
  return(
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <div className={styles.mainContainerLeft}>
            <p style={{fontWeight: '600'}}>Connect with people in here</p>
            <p>Social media platforms for professionals</p>
            <div onClick={()=>{
              router.push('/login');
            }} className={styles.buttonJoin}>
              <p>Join Now</p>
            </div>
          </div>
          <div className={styles.mainContainerRight}>
            <img src="/images/connections.jpg" alt="" />
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
