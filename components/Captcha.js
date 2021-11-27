import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { 
    accentColorState, 
    chosenProjectSlugState, 
    projectDataState, 
    projectPicIdState, 
    screenState} from '../lib/state'
import Image from 'next/image'
import Fade from './Fade'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import CheckMark from '../components/svg/CheckMark'
import styles from '../styles/Captcha.module.scss'

export default function Captcha({ dataFields }) {
    const [chosenProjectSlug, setchosenProjectSlug] = useRecoilState(chosenProjectSlugState)
    const [hoverId, sethoverId] = useState(-1)
    const projectData = useRecoilValue(projectDataState)
    const setprojectPicId = useSetRecoilState(projectPicIdState)
    const accentColor = useRecoilValue(accentColorState)
    const screen = useRecoilValue(screenState)

    useEffect(() => setprojectPicId(0), [])

    return <div style={{display: 'block', color: dataFields.isTextColorIntroWhite ? 'white' : 'black'}}>
        <div style={{ background: accentColor }} className={`${styles.introBox}`}>
            <div className={`${styles.introLeftBox}`}>
                <div className={`font ${styles.introTitle}`}>{dataFields.name}</div>
                <div className={`font noMarginParagraph ${styles.introDes}`}>
                    {documentToReactComponents(dataFields.intro)}
                </div>
            </div>
            <div className={`flexCenter ${styles.introPicCon}`}>
                <Image 
                    alt='Peter' 
                    src={`https:${dataFields.profileImage.fields.file.url}`}
                    height={screen == 3 ? 78 : 97}
                    width={screen == 3 ? 56 : 70}
                />
            </div>
        </div>
        {projectData ? 
        <div className={`${styles.picsCon}`}>
            {projectData.map((project, index) => {
                let { title, slug }= project.fields
                let thumbnailUrl = project.fields.thumbnail.fields.file.url
                let isClicked = slug == chosenProjectSlug
                let isHover = slug == hoverId
                return (
                <Fade key={index}  delay={0.05 * index} duratio={0.8} scale={[0.8, 1]}>
                    <div 
                        key={index} 
                        style={{ padding: isClicked ? (screen < 3 ? 9 : 6.2) : 0 }} 
                        className={`${styles.picBox} transit`}
                        onMouseEnter={() => { sethoverId(slug) }} 
                        onMouseLeave={() => { sethoverId(-1) }}
                        onClick={() => { setchosenProjectSlug(isClicked ? '' : slug) }}
                        >
                        <div className={`${isClicked ? styles.imgWrapClicked : styles.imgWrap} transit`}>
                            <Image 
                                alt='shotByPeter' 
                                src={`https:${thumbnailUrl}`}
                                layout='fill'
                                objectFit='cover'
                                placeholder="blur"
                                blurDataURL={'/imgPlaceholder.gif'}
                                objectPosition='center'
                            />
                        </div>
                        <div className={`${styles.titleCheckWrap}`}>
                            <div style={{ opacity: isHover ? 1 : 0 }} className={`font ${styles.picTitle} transit`}>
                                {title}
                            </div>
                            <div style={{ opacity: isClicked ? 1 : 0 }} className={`font ${styles.picCheck} transit`}>
                                <CheckMark styles={styles} accentColor={'#AAC969'}/>
                            </div>
                        </div>
                    </div>
                </Fade>
                )
            })}
        </div>
        : null}
    </div>
}
