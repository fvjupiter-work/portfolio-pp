import Captcha from '../components/Captcha'
import { createClient } from 'contentful'
import { 
  accentColorState, 
  backgroundImgState, 
  dataState, 
  projectDataState 
} from '../lib/state'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { useEffect } from 'react'

export default function Home({ projects, bgImages, dataFields }) {
  const [backgroundImg, setbackgroundImg] = useRecoilState(backgroundImgState)
  const setdata = useSetRecoilState(dataState)
  const setprojectData = useSetRecoilState(projectDataState)
  const setaccentColor = useSetRecoilState(accentColorState)
  useEffect(() => {
    setdata(dataFields)
    setaccentColor(`rgb(${dataFields.accentColorRed}, ${dataFields.accentColorGreen}, ${dataFields.accentColorBlue})`)
    let randomNum = Math.floor(Math.random() * bgImages.length)
    if(!backgroundImg) setbackgroundImg(`https:${bgImages[randomNum].fields.file.url}`)
    setprojectData(projects)
  }, [])
  
  return <div className='page'>
    <Captcha dataFields={dataFields}/>
  </div>
}

export async function getStaticProps() {
  const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID,
      accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  })

  const res = await client.getEntries({ content_type: 'project', limit: 12, order: 'sys.createdAt' })

  const res2 = await client.getEntries({ content_type: 'backgroundImagesList' })

  const res3 = await client.getEntries({ content_type: 'data' })

  return {
      props: {
          projects: res.items,
          bgImages: res2.items[0].fields.backgroundImages,
          dataFields: res3.items[0].fields
      }
  }
}