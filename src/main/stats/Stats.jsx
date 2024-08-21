import { db, auth } from "../..";
import { collection, orderBy, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Section from "../../UI_kit/Section";
import Style from "../../styles/main/stats/stats.module.scss";
import Preloader from "../../components/Preloaders/Preloader";

import DateFun from "../../components/DateFun";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const [t] = useTranslation();
  const [user] = useAuthState(auth);
  const [list, loading] = useCollectionData(
    query(
      collection(db, "users", user.uid, "list"),
      orderBy("createdAt", "desc")
    )
  );

  const arryDates = [];
  const uniqueDates = new Set();

  if (loading) return <Preloader />;

  const sumsByDate = {};
  list.forEach((item) => {
    const day = DateFun(item.createdAt);
    if (!sumsByDate[day]) {
      sumsByDate[day] = 0;
    }

    sumsByDate[day] += parseInt(item.summ);
  });

  list.forEach((e) => uniqueDates.add(DateFun(e.createdAt)));

  uniqueDates.forEach((e) =>
    arryDates.push({
      date: e,
      summ: sumsByDate[e],
    })
  );

  let summ = 0;
  arryDates.forEach((data) => {
    summ += data.summ;
  });

  console.log(summ / arryDates.length);
  summ = summ / arryDates.length;

  return (
    <main>
      <Section>
        <div className={Style.stats}>
          <h1>{t('Statistics')}</h1>

          <div className={Style.stats_history}>
            <article>
              <p>{t('date')}</p>
              <p>{t('amount')}</p>
              <p>{t('percentageOfAverageCheck')}</p>
            </article>
            {arryDates &&
              arryDates.map((data, id) => (
                <article key={id}>
                  {data.date}
                  <p
                    className={
                      Number(data.summ) > 1
                        ? Style.stats_income
                        : Style.stats_expanse
                    }
                  >
                    {data.summ}
                  </p>
                  <p
                    className={
                      ((data.summ / summ) * 100).toFixed(0) > 1
                        ? Style.stats_income
                        : Style.stats_expanse
                    }
                  >
                    {((data.summ / summ) * 100).toFixed(0)}%
                  </p>
                </article>
              ))}
          </div>
        </div>
      </Section>
    </main>
  );
};

export default Stats;
