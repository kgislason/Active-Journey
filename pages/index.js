import { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'
import { PrismaClient } from '@prisma/client'
import Sidebar from './partials/_sidebar'
import Header from './partials/_header'
import Dashboard from './components/dashboard/_index'
import Footer from './partials/_footer'

const inter = Inter({ subsets: ['latin'] })

const defaultLayout = {
  lg: [
    { i: "overview", x: 0, y: 0, w: 8, h: 2, static: true},
    { i: "calendar", x: 9, y: 0, w: 4, h: 2, static: true},
    { i: "dailyWater", x: 0, y: 0, w: 3, h: 1.5},
    { i: "activityGoal", x: 3, y: 7, w: 3, h: 1.5},
    { i: "a", x: 6, y: 7, w: 3, h: 1.5},
    { i: "b", x: 9, y: 7, w: 3, h: 1.5},
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
  if (layout !== '' || layout !== NULL) {
    console.log("Layout: ", layout);
    try {
      const userid = Number(id);
      await fetch(`/api/users/${userid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layout),
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default function Home(props) {
  const [layout, setLayout] = useState({});

  useEffect(() => {
    const userLayout = JSON.parse(props.user.layout);
    setLayout(prev => ({
      ...prev,
      'lg': userLayout['lg'],
      'sm': userLayout['sm']
    }));
  }, [props.user.layout])

  const handleLayoutChange = async (data, f) => {
    if (data && f['sm']) {
      console.log(f);
      const newLayout = {
        ...layout,
        lg: [
          ...f['lg']
        ],
        sm: [
          ...f['sm']
        ]
      }
      setLayout(prev => ({
          ...prev,
          'lg': [
            ...f['lg']
          ],
          'sm': [
            ...f['sm']
          ]
        }));
      await updateLayout(props.user.id, {"data": newLayout });
    }
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
            <main id="section-main" className="bg-slate-100 relative sm:mx-auto w-full h-full max-w-200 overflow-auto">
              <div className="flex h-full container flex-col p-8 mb-6">
                <Header />
                <Dashboard 
                  user={props.user}
                  layout={layout}
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


// Fetch all posts (in /pages/index.tsx)
export async function getServerSideProps() {
  const prisma = new PrismaClient()

  const user = await prisma.user.findUnique({
    where: {
      email: 'jane@jane.com',
    }
  })

  return {
    props : { user }
  }
}
