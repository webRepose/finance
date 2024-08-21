import Style from "../styles/UI_kit/Section/Section.module.scss";

const Section = (props) => {
  return <section className={Style.section}>{props.children}</section>;
};

export default Section;
