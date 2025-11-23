import Section from "../../UI_kit/Section";
import Style from "../../styles/main/home/home.module.scss";
import AddSumm from "./AddSumm";
import { db, auth } from "../..";
import { collection, query, orderBy, where, deleteDoc, doc} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Preloader from "../../components/Preloaders/Preloader";
import DateFun from "../../components/DateFun";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Home = () => {
  const [t] = useTranslation();
  const [user] = useAuthState(auth);
  const startOfMonth = new Date(); // Начало текущего месяца
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const [tab, setTab] = useState(false);
  const [dId, setDId] = useState(null);

  const endOfMonth = new Date(); // Конец текущего месяца
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  const [list, loading] = useCollectionData(
    query(
      collection(db, "users", user.uid, "list"),
      where("createdAt", ">=", startOfMonth),
      where("createdAt", "<=", endOfMonth),
      orderBy("createdAt", "desc")
    )
  );
  const arryDates = [];
  const uniqueDates = new Set();
  let summ = 0;
  let expense = 0;
  let income = 0;

  if (loading) return <Preloader />;

  list.forEach((e) => uniqueDates.add(DateFun(e.createdAt)));

  const sumsByDate = {};
  list.forEach((item) => {
    const day = DateFun(item.createdAt);
    if (!sumsByDate[day]) {
      sumsByDate[day] = 0;
    }

    sumsByDate[day] += parseInt(item.summ);
  });

  uniqueDates.forEach((e) =>
    arryDates.push({
      date: e,
      summ: sumsByDate[e],
    })
  );

  list.forEach((e) => {
    summ += Number(e.summ);
    if (Number(e.summ) < 1) {
      expense += Number(e.summ);
    }
    if (Number(e.summ) > 1) {
      income += Number(e.summ);
    }
  });

const deleteRequest = async (docId) => {
    const docRef = doc(db, "users", user.uid, "list", docId);
    await deleteDoc(docRef);
};

const changeRequest = (docId) => {
  setTab(prev => prev = !prev);
  setDId(prev => prev = docId);
} 

console.log(dId)

  return (
    <main>
      <Section>
        <div className={Style.home}>
          <p className={Style.home_date}>
            <i className="fa-regular fa-calendar"></i>
            {new Date().toLocaleDateString().slice(3) + " "} {t("balance")}
          </p>

          <div className={Style.home_content}>
            <h1 style={{ color: summ > 1 ? "#00b74a" : "#f63e62" }}>
              <i className="fa-solid fa-coins"></i>
              {summ > 1 ? "+" + summ : summ}
            </h1>

            <p className={Style.home_content_expense}>
              <i className="fa-solid fa-money-bill-transfer"></i>
              {t("expenses")}: {expense}
            </p>
            <p className={Style.home_content_income}>
              <i className="fa-solid fa-money-bill-trend-up"></i>
              {t("income")} +{income}
            </p>
          </div>

          <div className={Style.home_transfers}>
            <h3>{t("history")}</h3>

            {arryDates &&
              arryDates.map((e, id) => (
                <div key={id} className={Style.home_transfers_block}>
                  <div className={Style.home_transfers_block_date}>
                    <p>
                      {e.date === new Date().toLocaleDateString()
                        ? t("today")
                        : e.date}
                    </p>
                    {e.summ > 1 ? (
                      <p className={Style.home_content_income}>
                        {t("income")} +{e.summ}
                      </p>
                    ) : (
                      <p className={Style.home_content_expense}>
                        {t("expenses")} {e.summ}
                      </p>
                    )}
                  </div>
                  {list &&
                    list.map(
                      (data, id) =>
                        DateFun(data.createdAt) === e.date && (
                          <div
                            key={id}
                            className={Style.home_transfers_block_history}
                          >
                            <div
                              className={
                                Style.home_transfers_block_history_data
                              }
                            >
                              <img src={data.icon} alt="category" />
                              <h4>{t(data.title)}</h4>
                              <h5
                                className={
                                  Number(data.summ) > 1
                                    ? Style.home_content_income
                                    : Style.home_content_expense
                                }
                              >
                                {data.summ}
                              </h5>
                            <div className={Style.home_block_edit_visible}>
                                <button onClick={()=>{
                                  changeRequest(data.id);
                                }} className={Style.home_edit}>Изменить</button>
                                <br className={Style.home_block_edit} />
                              <button onClick={()=>{
                                deleteRequest(data.id)
                              }} className={Style.home_delete}>Удалить</button>
                            </div>
                            </div>
                            <div className={Style.home_block_edit_hide}>
                                <button onClick={()=>{
                                  changeRequest(data.id);
                                }} className={Style.home_edit}>Изменить</button>
                                <br className={Style.home_block_edit} />
                              <button onClick={()=>{
                                deleteRequest(data.id)
                              }} className={Style.home_delete}>Удалить</button>
                            </div>
                          </div>
                        )
                    )}
                </div>
              ))}
          </div>
        </div>

        <AddSumm tab={tab} setTab={setTab} setDId={setDId} dId={dId}/>
      </Section>
    </main>
  );
};

export default Home;
