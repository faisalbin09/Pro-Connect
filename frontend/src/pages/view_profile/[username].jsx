import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { clientServer, BASE_URL } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import UserLayout from '@/layout/UserLayout';
import DashboardLayout from '@/layout/dashboardLayout';
import styles from './index.module.css';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionsRequest, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.postReducer);

  const [userPosts, setUserPosts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("none"); // none pending and accepted

  const getUsersPost = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
  };

  useEffect(() => {
    // Reset connection status
    setConnectionStatus("none");

    if (authState?.connections?.length && userProfile?.userId?._id) {
      const profileUserId = userProfile.userId._id;

      // Find any connection involving the profile user
      const connection = authState.connections.find((conn) => {
        // Handle both string and object cases for connectionId and userId
        const connectionId = typeof conn.connectionId === "string"
          ? conn.connectionId
          : conn.connectionId?._id;

        const userId = typeof conn.userId === "string"
          ? conn.userId
          : conn.userId?._id;

        // Check if profile user is involved in this connection
        const isProfileUserInConnection =
          connectionId === profileUserId || userId === profileUserId;

        return isProfileUserInConnection;
      });

      if (connection) {
        // Set status based on connection status
        setConnectionStatus(connection.status);
      } else {
        setConnectionStatus("none");
      }
    }
  }, [authState?.connections, userProfile?.userId?._id]);



  // Fetch posts and filter for current user
  useEffect(() => {
    getUsersPost();
  }, []);

  useEffect(() => {
    if (postReducer?.posts && Array.isArray(postReducer.posts)) {
      const post = postReducer.posts.filter((p) =>
        p.userId?.username === router.query.username
      );
      setUserPosts(post);
    }
  }, [postReducer?.posts, router.query.username]);

  // useEffect(() => {
  //   if (
  //     Array.isArray(authState?.connections) &&
  //     userProfile?.userId?._id
  //   ) {
  //     const isInConnection = authState.connections.some(
  //       (conn) => conn?.connectionId?._id === userProfile.userId._id
  //     );
  //     setIsCurrentUserInConnection(isInConnection);
  //   } else {
  //     setIsCurrentUserInConnection(false);
  //   }
  // }, [authState?.connections, userProfile?.userId?._id]);
const handleConnectionRequest = async () => {
  const requestData = {
    userId: authState.user._id,
    connectionId: userProfile.userId._id,
  };
  
  console.log("Sending connection request with data:", requestData);
  
  try {
    await dispatch(sendConnectionRequest(requestData));
    // ... rest of your code
  } catch (error) {
    console.error("Error sending connection request:", error);
  }
};

  const renderConnectionButton = () => {
    switch (connectionStatus) {
      case "accepted":
        return (
          <button className={styles.connectedBtn} disabled>
            Connected
          </button>
        );
      case "pending":
        return (
          <button className={styles.connectedBtn} disabled>
            Pending
          </button>
        );
      case "none":
      default:
        return (
          <button onClick={handleConnectionRequest} className={styles.connectBtn}>
            Connect
          </button>
        );
    }
  };
  // useEffect(() => {
  //   if (
  //     Array.isArray(authState?.connections) &&
  //     userProfile?.userId?._id
  //   ) {
  //     const isInConnection = authState.connections.some(
  //       (conn) => conn?.connectionId?._id === userProfile.userId._id
  //     );
  //     setIsCurrentUserInConnection(isInConnection);
  //   } else {
  //     setIsCurrentUserInConnection(false);
  //   }
  // }, [authState?.connections, userProfile?.userId?._id]);


  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt=""
            />
          </div>

          <div className={styles.profileContiner_details}>
            <div style={{ display: 'flex', gap: '0.7rem' }}>
              <div style={{ flex: '0.8' }}>
                <div style={{
                  display: 'flex',
                  width: 'fit-content',
                  alignItems: 'center',
                  gap: '1.2rem'
                }}>
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: 'grey' }}>@{userProfile.userId.username}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
                  {renderConnectionButton()}
                  <div onClick={async () => {
                    const response = await clientServer.get(
                      `/user/download_resume?id=${userProfile.userId._id}`
                    );

                    window.open(`${BASE_URL}/${response.data.outputPath}`, "_blank");

                  }}>
                    <svg style={{ width: "1.2em", cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>

                  </div>
                </div>


                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>
              <div style={{ flex: "0.2" }}>
                <h3>Recent Activity</h3>
                {userPosts.map((post) => {
                  return (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media !== "" ? (
                            <img src={`${BASE_URL} /${post.media}`} alt="img" />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Display user's posts
            <div style={{ marginTop: '2rem' }}>
              <h3>User Posts</h3>
              {userPosts.length > 0 ? (
                userPosts.map((post, index) => (
                  <div key={index}>
                    <p>{post.content}</p>
                  </div>
                ))
              ) : (
                <p>No posts yet.</p>
              )}
            </div> */}
          </div>

          <div className="workHistory">
            <h3>Work History</h3>
            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const request = await clientServer.get("/user/get_profile_based_on_username", {
      params: {
        username: context.query.username
      }
    });

    return {
      props: { userProfile: request.data.profile }
    };
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    return {
      props: { userProfile: null }
    };
  }
}