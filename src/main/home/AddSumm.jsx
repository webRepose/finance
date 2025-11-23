import { useState, useEffect } from "react";
import Style from "../../styles/main/home/addSumm.module.scss";
import expense from "./expense.json";
import income from "./income.json";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  addDoc,
  Timestamp,
  collection,
  query,
  orderBy,
  updateDoc,
  doc, getDoc
} from "firebase/firestore";
import Preloader from "../../components/Preloaders/Preloader";
import { useTranslation } from "react-i18next";

const AddSumm = ({tab, setTab, setDId, dId}) => {
  const [t] = useTranslation();
  const [user] = useAuthState(auth);
  const [active, setActive] = useState(false);
  const [summ, setSumm] = useState(0);
  const [selectCateg, setSelectCateg] = useState({
    title: "alcohol",
    icon: "../img/category/alcogol.png",
    status: "expense",
  });
  const [categories, loading] = useCollectionData(
    query(
      collection(db, "users", user.uid, "category"),
      orderBy("createdAt", "desc")
    )
  );

  const createOrder = () => {
    document.querySelector("html").style.overflow = "hidden";
    setTab((prev) => (prev = true));
  };

  const choiceCateg = (title, category, icon) => {
    setSelectCateg(
      (prev) =>
        (prev = {
          title: title,
          icon: icon,
          status: category,
        })
    );
  };

  const createRequest = async () => {

  if (dId === null) {
  try {
    const docRef = await addDoc(collection(db, "users", user.uid, "list"), {
      title: selectCateg.title,
      status: selectCateg.status,
      icon: selectCateg.icon,
      summ: selectCateg.status === "expense" ? -summ : "+" + summ,
      createdAt: Timestamp.fromDate(new Date()),
    });

    await updateDoc(docRef, {
      id: docRef.id
    });

    setSumm(0);
    setTab(false);
    setActive(false);
    setDId(null);

  } catch (error) {
    console.error("Ошибка при создании документа:", error);
  }
} else {


 try {
      const docRef = doc(db, "users", user.uid, "list", dId);
      await updateDoc(docRef, {
        title: selectCateg.title,
        status: selectCateg.status,
        icon: selectCateg.icon,
        summ: selectCateg.status === "expense" ? -summ : "+" + summ,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      setSumm(0);
      setTab(false);
      setActive(false);
      setDId(null);

    } catch (error) {
      console.error("Ошибка при обновлении документа:", error);
    }
}
};


useEffect(() => {
  const loadData = async () => {
    if (dId !== null) {
      const docRef = doc(db, "users", user.uid, "list", dId);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const data = snap.data();

        // заполняем данные
        setSelectCateg({
          title: data.title,
          status: data.status,
          icon: data.icon,
        });

        setSumm(
          typeof data.summ === "number"
            ? Math.abs(data.summ)
            : Number(data.summ.replace("+", ""))
        );
      }
    } else {
      // если dId стал null — очищаем поля
      setSelectCateg({
        title: "alcohol",
        status: "expense",
        icon: "../img/category/alcogol.png",
      });
      setSumm(0);
    }
  };

  loadData();
}, [dId, user.uid]);

  if (loading) return <Preloader />;

  return (
    <>
      <button onClick={createOrder} className={Style.AddSumm}>
        <i className="fa-solid fa-plus"></i>
      </button>
      {tab && (
        <div className={Style.AddSumm_back}>
          <div className={Style.AddSumm_menu}>
            <div className={Style.AddSumm_menu_position}>
              <h2>{active ? t("yourIncome") : t("yourExpenses")}</h2>
              <div className={Style.AddSumm_menu_title}>
                <img
                  width={50}
                  height={50}
                  src={selectCateg.icon}
                  alt="category"
                />
                <p>{t(selectCateg.title)}</p>
              </div>
              <input
                value={summ}
                onChange={(e) => {
                  setSumm((prev) => (prev = e.target.value));
                }}
                type="number"
                placeholder="0"
              />
              <button onClick={createRequest}>{t("record")}</button>
            </div>
          </div>

          <button
            className={Style.AddSumm_close}
            onClick={() => {
              setSumm((prev) => (prev = 0));
              setTab((prev) => (prev = false));
              setActive((prev) => (prev = false));
              setDId((prev) => (prev = null));
              document.querySelector("html").style.overflow = "auto";
            }}
          >
            <i className="fa-solid fa-plus"></i>
          </button>

          <div className={Style.AddSumm_toolpar}>
            <div className={Style.AddSumm_toolpar_choice}>
              <button
                className={!active ? Style.AddSumm_toolpar_choice_active : ""}
                onClick={() => {
                  setActive((prev) => (prev = false));
                }}
              >
                {t("expenses")}
              </button>
              <button
                className={active ? Style.AddSumm_toolpar_choice_active : ""}
                onClick={() => {
                  setActive((prev) => (prev = true));
                }}
              >
                {t("income")}
              </button>
            </div>
            <hr />

            <div className={Style.AddSumm_category}>
              {!active ? (
                <>
                  {categories &&
                    categories.map(
                      (data, id) =>
                        data.mode === "expense" && (
                          <button
                            onClick={() => {
                              choiceCateg(
                                data.title,
                                "expense",
                                data.icon
                                  ? data.icon
                                  : "../img/category/other.svg"
                              );
                            }}
                            className={Style.AddSumm_category_item}
                            key={id}
                          >
                            <img
                              width={50}
                              height={50}
                              src={
                                data.icon
                                  ? data.icon
                                  : "../img/category/other.svg"
                              }
                              alt={data.title}
                            />
                            <p>{t(data.title)}</p>
                          </button>
                        )
                    )}
                  {expense &&
                    expense.map((data, id) => (
                      <button
                        onClick={() => {
                          choiceCateg(data.title, "expense", data.icon);
                        }}
                        className={Style.AddSumm_category_item}
                        key={id}
                      >
                        <img
                          width={50}
                          height={50}
                          src={data.icon}
                          alt={data.title}
                        />
                        <p>{t(data.title)}</p>
                      </button>
                    ))}
                </>
              ) : (
                <>
                  {categories &&
                    categories.map(
                      (data, id) =>
                        data.mode === "income" && (
                          <button
                            onClick={() => {
                              choiceCateg(
                                data.title,
                                "income",
                                data.icon
                                  ? data.icon
                                  : "../img/category/other.svg"
                              );
                            }}
                            className={Style.AddSumm_category_item}
                            key={id}
                          >
                            <img
                              width={50}
                              height={50}
                              src={
                                data.icon
                                  ? data.icon
                                  : "../img/category/other.svg"
                              }
                              alt={data.title}
                            />
                            <p>{t(data.title)}</p>
                          </button>
                        )
                    )}
                  {expense &&
                    income.map((data, id) => (
                      <button
                        onClick={() => {
                          choiceCateg(data.title, "income", data.icon);
                        }}
                        className={Style.AddSumm_category_item}
                        key={id}
                      >
                        <img
                          width={50}
                          height={50}
                          src={data.icon}
                          alt={data.title}
                        />
                        <p>{t(data.title)}</p>
                      </button>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddSumm;
