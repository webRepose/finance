import { useTranslation } from "react-i18next"; // Импорт хука для локализации текста
import { NavLink } from "react-router-dom"; // Импорт компонента NavLink для навигации

const MenuList = ({ style }) => {
  const [t] = useTranslation(); // Инициализация хука для локализации текста
  const menu = [
    // Массив объектов с данными о пунктах меню
    {
      to: "/",
      title: "Home",
      img: "fa-solid fa-house",
    },
    {
      to: "/category",
      title: "Category",
      img: "fa-solid fa-list",
    },
    {
      to: "/stats",
      title: "Statistics",
      img: "fa-solid fa-chart-simple",
    },
  ];

  return (
    <nav className={style.header_menu}>
      {/* Навигационное меню */}
      <div className={style.onpc}>
        <div>
          <ul>
            {menu && // Отображение пунктов меню
              menu.map((data, id) => (
                <li title={data.title} key={id}>
                  <NavLink
                    className={({ isActive }) => [isActive ? style.active : style.notActive]} // Добавление активного класса при активной странице
                    to={data.to} // Ссылка для перехода
                  >
                    <i className={data.img}></i>
                    {t(data.title)} {/* Локализованный текст пункта меню */}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MenuList;
