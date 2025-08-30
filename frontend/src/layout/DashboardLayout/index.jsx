import React from 'react'
import styles from './index.module.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react';
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            router.push("/login");

        }
        dispatch(setTokenIsThere());
    }, []);
    return (
        <div className={styles.container}>
            <div className={styles.homeContainer}>
                <div className={styles.homeContainerLeft}>
                    <div className={styles.sideBar}>
                        <div onClick={() => {
                            router.push("/dashboard")
                        }}
                            className={styles.sideBarOption}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>

                            <p>Home</p>
                        </div>

                        <div onClick={() => {
                            router.push("/discover")
                        }}
                            className={styles.sideBarOption}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>

                            <p>Discover</p>


                        </div>

                        <div onClick={() => {
                            router.push("/my_connections")
                        }}
                            className={styles.sideBarOption}>
                            <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.icon}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>


                            <p>My Connections</p>


                        </div>
                    </div>
                </div>

                <div className={styles.feedContainer}>
                    {children}
                </div>

                <div className={styles.extraContainer}>
                    <h2>Top Profiles</h2>
                    {authState.all_profiles_fetched && authState.all_users.map((profile) => {
                        return (
                            <div key={profile._id} className={styles.extraContainer__profile}>
                                {/* <p>{authState.user.userId.name}</p> */}

                            </div>
                        );

                    })}
                </div>
            </div>
        </div>
    )
}
