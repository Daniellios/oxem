import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { useState, useEffect } from "react";
import Slider from "../components/Slider";
import axios from "axios";

export default function Home() {
  //Стоимость автомобиля
  const [price, setPrice] = useState(3300000);
  //Проценты перовначального взноса
  const [firstPaymentPercent, setFirstPaymentPercent] = useState(10);
  //Сумма перовначального взноса
  const [firstPaymentSum, setFirstPaymentSum] = useState(1);
  //Срок лизинга
  const [months, setMonths] = useState(60);
  //Ежемесячный платеж
  const [monthlyPayment, setMonthlyPayment] = useState(1);
  //Общая Сумма договора
  const [dealSum, setDealSum] = useState(1);
  // Состояние кнопки на заявку
  const [isDisabled, setIsDisabled] = useState(false);
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(false);

  const [requestTextStatus, setRequestTextStatus] = useState("Оставить заявку");

  useEffect(() => {
    countFirstPayment();
    countMounthlyPayment();
    countLeaseDealSum();
  }, [price, monthlyPayment, months, firstPaymentPercent]);

  const sliderPropsPrice = {
    slidertype: "Price",
    min: 1000000,
    max: 6000000,
    valueType: "₽",
    step: 100000,
    title: "Стоимость автомобиля",
  };

  const sliderPropsFirstPayment = {
    slidertype: "Payment",
    min: 10,
    max: 60,
    valueType: "%",
    step: 1,
    title: "Первоначальный взнос",
  };

  const sliderPropsTerms = {
    slidertype: "Terms",
    min: 1,
    max: 60,
    valueType: "мес.",
    step: 1,
    title: "Срок лизинга",
  };

  const handleLeaseRequest = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsDisabled(true);
      setRequestTextStatus("Заявка отправлена!");
    }, 2000);

    await axios({
      method: "post",
      url: "https://hookb.in/eK160jgYJ6UlaRPldJ1P",
      data: {
        car_coast: price,
        initail_payment: firstPaymentSum,
        initail_payment_percent: firstPaymentPercent,
        lease_term: months,
        total_sum: dealSum,
        monthly_payment_from: monthlyPayment,
      },
    }).then((response) => {
      console.log(response.data);
    });
  };

  const countFirstPayment = () => {
    let firstPaymentSum = (firstPaymentPercent / 100) * price;
    setFirstPaymentSum(Number(firstPaymentSum.toFixed(0)));
  };

  const countLeaseDealSum = () => {
    let leaseDealSum = firstPaymentSum + months * monthlyPayment;
    setDealSum(Number(leaseDealSum.toFixed(0)));
  };

  const countMounthlyPayment = () => {
    let monthPay =
      (price - firstPaymentSum) *
      ((0.035 * Math.pow(1 + 0.035, months)) /
        (Math.pow(1 + 0.035, months) - 1));
    setMonthlyPayment(Number(monthPay.toFixed(0)));
  };

  return (
    <>
      <Head>
        <title>Тест от Oxem Studio</title>
        <meta charSet="UTF-8"></meta>
        <meta
          name="description"
          content="Тестовое задание от Oxem Studio"
        ></meta>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>

      <main className={styles.app}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Рассчитайте стоимость автомобиля в лизинг
          </h1>

          <div className={styles.grid_container}>
            <div className={styles.slider_grid}>
              <Slider
                onSliderChange={setPrice}
                isDisabled={isDisabled}
                value={price}
                {...sliderPropsPrice}
              ></Slider>

              <Slider
                firstPayment={firstPaymentSum}
                isDisabled={isDisabled}
                onSliderChange={setFirstPaymentPercent}
                value={firstPaymentPercent}
                {...sliderPropsFirstPayment}
              ></Slider>
              <Slider
                onSliderChange={setMonths}
                isDisabled={isDisabled}
                value={months}
                {...sliderPropsTerms}
              ></Slider>
            </div>

            <div className={styles.deal_grid}>
              <div className={styles.deal_container}>
                <h3 className={styles.deal_sub_title}>
                  Сумма договора лизинга
                </h3>
                <h2 className={styles.deal_total}>
                  {!isNaN(+dealSum)
                    ? dealSum?.toLocaleString("ru-RU") + " ₽"
                    : 0}
                </h2>
              </div>
              <div className={styles.deal_container}>
                <h3 className={styles.deal_sub_title}>Ежемесячный платеж от</h3>
                <h2 className={styles.deal_total}>
                  {!isNaN(+monthlyPayment) && monthlyPayment !== Infinity
                    ? monthlyPayment?.toLocaleString("ru-RU") + " ₽"
                    : 0}
                </h2>
              </div>
              <button
                onClick={!isLoading ? handleLeaseRequest : null}
                disabled={isDisabled}
                className={styles.button_main}
              >
                {isLoading ? (
                  <div className={styles.loading_ring}>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  requestTextStatus
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
