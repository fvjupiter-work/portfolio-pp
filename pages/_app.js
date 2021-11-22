import '../styles/globals.css'
import React from 'react'
import { RecoilRoot } from 'recoil'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  console.log('Made by Frederik Schoof - Web-Developer')
  console.log('Contact me @: schoof.frederik@gmail.com')
  return <>
  <RecoilRoot>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </RecoilRoot>
  </>
}

export default MyApp
