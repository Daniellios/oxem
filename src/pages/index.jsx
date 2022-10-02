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

  const [isLoading, setIsLoading] = useState(false);

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
    }, 2000);

    await axios({
      method: "post",
      url: "https://eoj3r7f3r4ef6v4.m.pipedream.net",
      data: {
        leaseSum: price,
        firstPayment: firstPaymentPercent,
        leaseTerm: months,
        leaseDealSum: dealSum,
        mounthFee: monthlyPayment,
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
        <title>Тестовое задание от Oxem Studio</title>
        <meta name="description" content="Тестовое задание от Oxem Studio" />
        <link rel="icon" href="/favicon.ico" />
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
                <h3 className={styles.sub_title}>Сумма договора лизинга</h3>
                <h2 className={styles.total}>
                  {!isNaN(+dealSum)
                    ? dealSum?.toLocaleString("ru-RU") + " ₽"
                    : 0}
                </h2>
              </div>
              <div className={styles.deal_container}>
                <h3 className={styles.sub_title}>Ежемесячный платеж от</h3>
                <h2 className={styles.total}>
                  {!isNaN(+monthlyPayment) && monthlyPayment !== Infinity
                    ? monthlyPayment?.toLocaleString("ru-RU") + " ₽"
                    : 0}
                </h2>
              </div>
              <button
                onClick={handleLeaseRequest}
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
                  "Оставить заявку"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
