import Style from "../../styles/components/preloaders/preloader/preloader.module.scss";

const Preloader = () => {
  return (
    <div className={Style.loader_pos}>
      <section className={Style.dots_container}>
        <div className={Style.dot}></div>
        <div className={Style.dot}></div>
        <div className={Style.dot}></div>
        <div className={Style.dot}></div>
        <div className={Style.dot}></div>
      </section>
    </div>
  );
};

export default Preloader;
