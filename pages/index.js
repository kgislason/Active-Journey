import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'
import { PrismaClient } from '@prisma/client'
import Sidebar from '../components/partials/_sidebar'
import Header from '../components/partials/_header'
import Dashboard from '../components/dashboard/_index'
import Footer from '../components/partials/_footer'

const inter = Inter({ subsets: ['latin'] })

const defaultLayout = {
  lg: [
    { i: "overview", x: 0, y: 0, w: 8, h: 2, static: true},
    { i: "calendar", x: 9, y: 0, w: 4, h: 2, static: true},
    { i: "dailyWater", x: 0, y: 0, w: 3, h: 2},
    { i: "activityGoal", x: 3, y: 7, w: 3, h: 2},
    { i: "a", x: 6, y: 7, w: 3, h: 2},
    { i: "b", x: 9, y: 7, w: 3, h: 2},
    { i: "c", x: 0, y: 8.5, w: 3, h: 2},
    { i: "d", x: 3, y: 8.5, w: 3, h: 2},
    { i: "e", x: 6, y: 8.5, w: 6, h: 2}
  ],
  sm: [
    { i: "overview", x: 3, y: 0, w: 6, h: 2},
    { i: "calendar", x: 0, y: 0, w: 6, h: 2, static: true},
    { i: "dailyWater", x: 0, y: 0, w: 3, h: 2},
    { i: "activityGoal", x: 4, y: 0, w: 3, h: 2},
    { i: "a", x: 0, y: 0, w: 3, h: 2},
    { i: "b", x: 3, y: 0, w: 3, h: 2},
    { i: "c", x: 0, y: 0, w: 6, h: 2},
    { i: "d", x: 3, y: 0, w: 6, h: 2},
    { i: "e", x: 0, y: 0, w: 6, h: 2}
  ]
}

async function updateLayout(id, layout) {
  let newLayout = layout;
  if (layout === '' || layout === null) {
    newLayout = defaultLayout;
  }

  try {
    const userid = Number(id);
    await fetch(`/api/users/${userid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLayout),
    });
  }
  catch (err) {
    console.log(err);
  }
}

export default function Home(props) {
  const userLayout = JSON.parse(props.user.layout);
  const [layout, setLayout] = useState(userLayout || defaultLayout);
  const [day, setDay] = useState(Date.now());  

  const handleSetDay = async (date) => {
    setDay(date);
  }

  const handleLayoutChange = async (layoutsObj) => {
    setLayout(layoutsObj);
    await updateLayout(props.user.id, {"layout": layoutsObj });
  }

  return (
    <>
      <Head>
        <title>ActiveJourney</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen flex-col bg-white text-body dark:bg-dark-14 dark:text-dark-body {styles.main}">
        
        <div className="flex-grow overflow-auto">
          <div className="flex flex-col order-2 sm:flex-row sm:order-1 h-full">
            <Sidebar />
            <main  
              style={{
                backgroundImage: `url(/theme/pexels-simon-berger-1323550.jpg)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom'
              }}       
              className="relative sm:mx-auto w-full h-full max-w-200 overflow-auto"
            >
              <div className="flex h-full flex-col p-8 mb-6">
                <Header
                  pageTitle="Dashboard"
                  userName={props.user.first_name}
                />
                <Dashboard 
                  user={props.user}
                  today={props.today}
                  entries={props.entries}
                  water={props.water}
                  sleep={props.sleep}
                  energy={props.energy}
                  mood={props.mood}
                  day={day}
                  setDay={handleSetDay}
                  layout={layout}
                  dailyWater={props.dailyWater}
                  onLayoutChange={handleLayoutChange}
                />
                <Footer />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

/* Data Fetching */
const prisma = new PrismaClient();

// Fetch all entries by metric
async function fetchSingleMetric(condition) {
  let result = await prisma.User_metric_data.findMany({ where: condition });
  result = JSON.parse(JSON.stringify(result));
  return result;
}

// Fetch all posts (in /pages/index.tsx)
export async function getServerSideProps() {

  const userid = 1;
  const user = await prisma.user.findUnique({
    where: {
      id: userid,
    }
  })

  const now = Date.now();
  const lteVal = new Date(now);
  let dailyWater = await prisma.User_metric_data.findMany({
    where: { user_id: userid,
      metric_id: 1,
      date: {
        lte: lteVal
      }
    },
    include: {
      metrics: true }
  });
  dailyWater = JSON.parse(JSON.stringify(dailyWater));

  // const currDate = new Date();
  const mockCurrDate = '2023-05-04T07:00:00.000Z';
  let today  = await fetchSingleMetric({ date: mockCurrDate }); // Try using lteVal
  let water  = await fetchSingleMetric({ metric_id: 1 });
  let sleep  = await fetchSingleMetric({ metric_id: 2 });
  let energy = await fetchSingleMetric({ metric_id: 4 });
  let mood   = await fetchSingleMetric({ metric_id: 5 });

  let entries = await prisma.User_metric_data.findMany({
    where: { user_id: 1 },
    include: { metrics: true },
    take: 30
  });
  entries = JSON.parse(JSON.stringify(entries));

  return {
    props : {
      user, 
      today,
      entries, 
      water, 
      sleep, 
      energy,
      mood,
      dailyWater
    }
  }
}
