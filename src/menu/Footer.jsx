import Style from "../styles/menu/Footer/Footer.module.scss"; // Импорт стилей
import MenuList from "./MenuList";

const Footer = () => {
  return (
    <footer className={Style.footer}>
      {/* Обертка для колонтитула */}
      <section className={Style.footer_block}>
        <MenuList style={Style} />
      </section>
    </footer>
  );
};

export default Footer;
