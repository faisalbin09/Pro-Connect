import { useState, useEffect, use } from 'react';
import UserLayout from '@/layout/UserLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import { loginUser, registerUser } from '@/config/redux/action/authAction';

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");


  useEffect(() => {
    if (authState.loggedIn) {
      router.push('/dashboard');
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());  
  },[userLoginMethod]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push('/dashboard');
    }
  }, []);


  const handleLogin = () => {
    console.log("login..");
    dispatch(loginUser({ email, password })); 
  }

  const handleRegister = () => {
    console.log("working");
    dispatch(registerUser({ username, name, email, password }));
  }

  return (
    <div>
      <UserLayout>


        <div className={styles.container}>
          <div className={styles.cardContainer}>

            <div className={styles.cardContainerLeft}>
              <div className={styles.cardLeftHeading}>
                <p>{userLoginMethod ? 'SignIn' : 'SignUp'}</p>
                <p style={{ color: authState.isError ? 'red' : 'green' }}>
                  {authState.message?.message}
                </p>
              </div>


              <div className={styles.inputContainer}>
                {!userLoginMethod && <div className={styles.inputRow}>
                  {/* <label htmlFor="username">Username:</label><br /> */}
                  <input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" id="username" placeholder='Username' name="username" required />

                  {/* <label htmlFor="username">Name:</label><br /> */}
                  <input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" id="name" placeholder='Name' name="name" required /><br /><br />

                </div>}
                <input onChange={(e) => setEmailAddress(e.target.value)} className={styles.inputField} type="text" id="email" placeholder='Email' name="email" required />
                <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="password" id="password" placeholder='Password' name="password" required />


                <div onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                  }
                  else {
                    handleRegister();
                  }
                }} className={styles.buttonWithOutline}>
                  <p>{userLoginMethod ? "SignIn" : "SignUp"}</p>
                </div>
              </div>
            </div>

            <div className={styles.cardContainerRight}>
              <div>
                {userLoginMethod ?
                  <p>Dont have an Account?</p> :
                  <p>Already have an Account.</p>}
              <div onClick={() => {
                  setUserLoginMethod(!userLoginMethod);
                  dispatch({ type: 'auth/reset' }); 
                }} className={styles.buttonWithOutline}>
                  <p>{userLoginMethod ? "SignUp" : "SignIn"}</p>
                </div>
              </div>
              
            </div>

          </div>
        </div>
      </UserLayout>
    </div>
  );
}

export default LoginComponent;
