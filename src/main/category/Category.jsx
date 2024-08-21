import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../..";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  Timestamp,
  addDoc,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import Section from "../../UI_kit/Section";
import Style from "../../styles/main/category/category.module.scss";
import income from "../home/income.json";
import expense from "../home/expense.json";
import Preloader from "../../components/Preloaders/Preloader";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";

const Category = () => {
  const [t] = useTranslation();
  const [user] = useAuthState(auth);
  const [expenses, setExpenses] = useState(true);
  const [addInput, setAddInput] = useState(false);
  const [title, setTille] = useState("");
  const [linkImg, setLinkImg] = useState("");

  const [categories, loading] = useCollectionData(
    query(
      collection(db, "users", user.uid, "category"),
      orderBy("createdAt", "desc")
    )
  );

  const addCategory = async (e) => {
    e.preventDefault();
    if (title.length > 3) {
      await addDoc(collection(db, "users", user.uid, "category"), {
        title: title,
        icon: linkImg,
        mode: expenses ? "expense" : "income",
        createdAt: Timestamp.fromDate(new Date()),
      }).then(() => {
        setAddInput((prev) => !prev);
        setTille((prev) => (prev = ""));
        setLinkImg((prev) => (prev = ""));
        setExpenses((prev) => (prev = true));
        document.querySelector("html").style.overflow = "auto";
        swal({
          icon: "success",
        });
      });
    } else {
      swal({
        text: t("cordata"),
      });
    }
  };

  const addCategoryInput = () => {
    setAddInput((prev) => !prev);
    document.querySelector("html").style.overflow = "hidden";
  };

  if (loading) return <Preloader />;

  let expenseCount = 0;
  let incomeCount = 0;
  categories.forEach((data) => {
    if (data.mode === "expense") {
      expenseCount += 1;
    } else incomeCount += 1;
  });

  return (
    <>
      <main>
        <Section>
          <div className={Style.categ}>
            <div className={Style.categ_block}>
              <h1>{t("categorySettings")}</h1>
              <div className={Style.categ_module}>
                <button
                  style={{ textDecoration: expenses && "underline" }}
                  onClick={() => {
                    setExpenses((prev) => (prev = true));
                  }}
                  className={Style.categ_module_expense}
                >
                  {t("expenses")} ({expense.length + expenseCount})
                </button>
                <button
                  style={{ textDecoration: !expenses && "underline" }}
                  onClick={() => {
                    setExpenses((prev) => (prev = false));
                  }}
                  className={Style.categ_module_income}
                >
                  {t("income")} ({income.length + incomeCount})
                </button>
              </div>
            </div>

            <button onClick={addCategoryInput} className={Style.categ_add}>
              <i className="fa-solid fa-plus"></i>
              {t("addCategory")}
            </button>

            <div className={Style.categ_block}>
              {expenses ? (
                <>
                  {categories &&
                    categories.map(
                      (data, id) =>
                        data.mode === "expense" && (
                          <article key={id}>
                            <img
                              width={50}
                              height={50}
                              src={
                                data.icon
                                  ? data.icon
                                  : "../img/category/other.svg"
                              }
                              alt={t(data.title)}
                            />
                            <p>{t(data.title)}</p>
                          </article>
                        )
                    )}
                  {expense &&
                    expense.map((data, id) => (
                      <article key={id}>
                        <img
                          width={50}
                          height={50}
                          src={data.icon}
                          alt={t(data.title)}
                        />
                        <p>{t(data.title)}</p>
                      </article>
                    ))}
                </>
              ) : (
                <>
                  {categories &&
                    categories.map(
                      (data, id) =>
                        data.mode === "income" && (
                          <article key={id}>
                            <img
                              width={50}
                              height={50}
                              src={
                                data.icon
                                  ? data.icon
                                  : "../img/category/other.svg"
                              }
                              alt={t(data.title)}
                            />
                            <p>{t(data.title)}</p>
                          </article>
                        )
                    )}
                  {income &&
                    income.map((data, id) => (
                      <article key={id}>
                        <img
                          width={50}
                          height={50}
                          src={data.icon}
                          alt={t(data.title)}
                        />
                        <p>{t(data.title)}</p>
                      </article>
                    ))}
                </>
              )}
            </div>
          </div>
        </Section>
      </main>
      {addInput && (
        <div className={Style.categ_input}>
          <form>
            <h3>{t("enterCategoryData")}</h3>
            <input
              value={title}
              onChange={(e) => {
                setTille((prev) => (prev = e.target.value));
              }}
              required
              placeholder={t("categoryName")}
              type="text"
            />
            <input
              value={linkImg}
              onChange={(e) => {
                setLinkImg((prev) => (prev = e.target.value));
              }}
              placeholder={t("iconLink")}
              type="text"
            />
            <button onClick={addCategory}>
              <i className="fa-regular fa-square-plus"></i>
              {t("createCategory")}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Category;
