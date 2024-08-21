import Style from "../styles/menu/Lang/Lang.module.scss";
import { useTranslation } from "react-i18next";

const Lang = ({ setLang }) => {
  const [t] = useTranslation();

  return (
    <section className={Style.outLang}>
      <button
        title={"Сменить язык"}
        className={Style.lang}
        onClick={() => {
          setLang((prev) => !prev);
        }}
      >
        <img width={20} src={t("Lang") === 'Русский' ? '../img/Header/Russia.png' : t("Lang") === 'English' ? "../img/Header/usa.png" : '../img/Header/Kazakhstan.png'} alt="lang"/>
        <p>
          <b>{t("Lang")}</b>
        </p>
      </button>
    </section>
  );
};

export default Lang;
