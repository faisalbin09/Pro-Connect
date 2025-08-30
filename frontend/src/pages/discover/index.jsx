import React, { useEffect } from 'react'
import UserLayout from '@/layout/UserLayout';
import { getAllUsers } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/dashboardLayout';
import { useSelector, useDispatch } from 'react-redux';
import { BASE_URL } from "@/config"
import styles from './index.module.css'
import { useRouter } from 'next/navigation';

export default function DiscoverPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.all_profiles_fetched, dispatch]);

  return (
    <div>
      <UserLayout>
        <DashboardLayout>
          <div className={styles.pageHeader}>
            <h1>Discover People</h1>
            <p>Connect with new users and explore their profiles</p>
          </div>

          <div className={styles.allUserProfiles}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => {
                if (
                  user &&
                  user.userId &&
                  user.userId.profilePicture &&
                  user.userId.name &&
                  user.userId.username
                ) {
                  return (
                    <div
                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`)
                      }}
                      className={styles.userCard}
                      key={user._id}
                    >
                      <img
                        className={styles.userCard_image}
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt="profile"
                      />
                      <div className={styles.userCard_info}>
                        <h2>{user.userId.name}</h2>
                        <p>@{user.userId.username}</p>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
          </div>
        </DashboardLayout>
      </UserLayout>
    </div>
  )
}
