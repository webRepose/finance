import { auth } from "../index";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Style from "../styles/components/navbar/navbar.module.scss";
import Lang from "../menu/Lang";
import LangAbsolute from "../menu/LangAbsolute";
import MenuList from "../menu/MenuList";

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [t] = useTranslation();
  const [lang, setLang] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const setMenu = () => {
    setUserMenu((prev) => !prev);
  };

  const signOut = () => {
    const resExit = window.confirm(t("really_ex"));
    resExit && auth.signOut();
    setUserMenu((prev) => !prev);
  };

  useEffect(() => {
    window.addEventListener("keyup", (e) => {
      if (e.key === "Escape") setUserMenu((prev) => (prev = false));
    });
  }, []);

  return (
    <>
      <header className={Style.header}>
        <Link className={Style.header_logo_pos} to={"/"}>
          <img
            className={Style.header_logo}
            src="../../img/logo.png"
            width={130}
            alt="logo"
          />
        </Link>

        <div className={Style.onpc}>
          <MenuList style={Style} />
        </div>

        <Lang setLang={setLang} />
        {user && (
          <button onClick={setMenu} className={Style.header_ava}>
            <img
              width={37}
              src={
                user.photoURL
                  ? user.photoURL
                  : "https://yandex-images.clstorage.net/L5jpm4119/75bed6icZ/F2pj5Xlm33ug4PUb7elvsmBvhVI-K5vuW7hbJ2ythexp_KEjGizvG4WL3qiUoj1AnaEqfeYRqEhdin76lgcXcEZjJvRIe9sG2aHlcr3JY6ZoGvBeelrz_y_RUlYFubS0Xe34ir68Z4opIxoJRV_kbcDEbnjTONF1xDYeo-9jqh0nFusRyRrS4yhgiAexSed6IGoZ4hZKI3s_vEZuUaxslWSgXCr6BOuSNUeKbXnHhF0MsB6wGkg5MdxrFsNL94p9e1rz6dVONu8YXCDzxbHzchTe9SZ6QvOXG3wiwvGkQKWghPRiVij_2hGnNhEJf1AZmGTKUFYEtU0sU1L3cxciMY_WK61ZBg5_3KgUn-2h33roRmW6QiIHFztUFuYluExBMEikZnogex6BJ3pp_UNA2VjUurBaxBXRnCM2C0_rTgHTas8VISba3wRQoPMdwc_CfJ4x7hqe_9M7TNpeebCQ7ZTg6HpO9O9O6a8SBfm_fL0YRHLYZtRNjRzvpsPn05aZyzpviS0Cwo8EbCCT3bFbnkRmuX4W9j_H70DCCpUsHG1wmBDygmS7IoHfcpUVE3gp1NQe0B7YRRkIV7pDZ2eqAUfiT_H5-qZTPGBYx7EpkxaoZlWCThq7j-OsRg4lqMwxJCCwpoKcRyJRm0KF7U_0oZisFqB-xCEp8INS14fX_r274leZdabOf9SwiEsBzTNyNCbpUiYak1OjvPbiFZAY6fiQJB5WZCMWMUPCGZUncJ3c7MaE4rDRwRAPAruDQ9J1sz4nKbkeIseofJiftVljfjjSaUqusuNTm7Caen1w9D0MhIyqhhT31v3LbmVJ5_wV7BTeaGKUPTkwq6LHx4uGfQ-K141VGlarvNwoY6UhR8LwUgVCvt7vC7O00uYpILBd-GTgRhZ0IxpRl_r5GVf0vRQ09sC6jOldGJMSg3MDwpWXor-xKeJCUzSklJupaccCzOZdXvIqw0933Jaa_Ry8"
              }
              alt="ava"
            />
            <p>{user.displayName ? user.displayName : 'Пользователь'}</p>
          </button>
        )}

        {userMenu && (
          <nav className={Style.header_user}>
            <ul>
              <li>
                <button onClick={signOut}>
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  {t("exit")}
                </button>
              </li>
            </ul>
          </nav>
        )}
      </header>
      {lang && <LangAbsolute setLang={setLang} />}
    </>
  );
};

export default Navbar;
