import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  query,
  orderBy,
  collection,
  Timestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { useTranslation } from "react-i18next";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, auth } from "../index";
import { useRef, useState } from "react";
import Style from "../styles/login/login.module.scss";
import swal from "sweetalert";

const Login = () => {
  const [users] = useCollectionData(
    query(collection(db, "users"), orderBy("createdAt", "asc"))
  );
  const [t] = useTranslation();
  const loginRef = useRef(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [regist, setRegist] = useState(false);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);

    let res = true;
    users.forEach((data) => {
      if (data.uid === user.uid) res = false;
    });

    if (res) {
      const createCollect = async () => {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: Timestamp.fromDate(new Date()),
          admin: false,
        });
      };
      createCollect();
    }
  };

  const signUp = async (e) => {
    e.preventDefault();

    if (pass.length >= 6) {
      await createUserWithEmailAndPassword(auth, email, pass)
        .then((user) => {
          setEmail((prev) => (prev = ""));
          setPass((prev) => (prev = ""));

          setDoc(doc(db, "users", user.user.uid), {
            uid: user.user.uid,
            displayName: user.user.displayName,
            photoURL: user.user.photoURL,
            createdAt: Timestamp.fromDate(new Date()),
            admin: false,
          });
        })
        .catch(() => {
          swal(t("nw1"), "", "error");
        });
    } else {
      swal(t("nw2"), "", "error");
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, pass)
      .then(() => {
        setEmail((prev) => (prev = ""));
        setPass((prev) => (prev = ""));
      })
      .catch(() => {
        swal(t("nw3"), "", "error");
      });
  };

  return (
    <>
      <section className={Style.login}>
        <div ref={loginRef} className={Style.login_block}>
          <img
            className={Style.login_block_logo}
            src="../img/logo.png"
            alt="logo"
            width={130}
          />
          <h1>{t("sign")}</h1>
          {!regist ? (
            <form className={Style.login_block_email}>
              <input
                onChange={(e) => setEmail((prev) => (prev = e.target.value))}
                type="email"
                placeholder="Example@gmail.com"
              />
              <input
                onChange={(e) => setPass((prev) => (prev = e.target.value))}
                type="password"
                placeholder={t("pas")}
              />
              <p
                onClick={() => {
                  setRegist((prev) => !prev);
                }}
                className={Style.login_block_email_reg}
              >
                {!regist ? t("regis") : t("auth")}
              </p>
              <button onClick={signIn}>
                <i className="fa-solid fa-right-to-bracket"></i> {t("auth")}
              </button>
            </form>
          ) : (
            <form onSubmit={signUp} className={Style.login_block_email}>
              <input
                onChange={(e) => setEmail((prev) => (prev = e.target.value))}
                type="email"
                placeholder="Example@gmail.com"
              />
              <input
                onChange={(e) => setPass((prev) => (prev = e.target.value))}
                type="password"
                placeholder={t("pas")}
              />
              <p
                onClick={() => {
                  setRegist((prev) => !prev);
                }}
                className={Style.login_block_email_reg}
              >
                {!regist ? t("regis") : t("auth")}
              </p>
              <button>
                <i className="fa-solid fa-right-to-bracket"></i> {t("regis")}
              </button>
            </form>
          )}
          <p>{t("or")}</p>
          <button onClick={login} type="submit">
            <img width={18} src="../img/Login/google.png" alt="google icon" />
            {t("w_google")}
          </button>
        </div>
      </section>
    </>
  );
};

export default Login;
