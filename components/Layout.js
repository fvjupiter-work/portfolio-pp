import React, { useState, useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { isInfoState, chosenProjectSlugState, projectDataState, isProjectInfoState, dataState, backgroundImgState, accentColorState} from '../lib/state'
import Head from 'next/head'
import { useRouter } from 'next/router'
import InfoBox from './InfoBox'
import ProjectDes from './ProjectDes'
import Shuffle from './svg/Shuffle'
import Info from './svg/Info'
import TextButton from './svg/TextButton'
import Image from 'next/image'
import styles from '../styles/Layout.module.scss'

export default function Layout({ children }) {
    const router = useRouter()
    const pathname = router.pathname
    const isProjectRoute = pathname.split('/')[1] == 'projects' //'[project_id]'

    // navigation states
    const [isInfo, setisInfo] = useRecoilState(isInfoState)
    const toggleInfo = () => { setisInfo(!isInfo); setisProjectInfo(false) }
    const [isProjectInfo, setisProjectInfo] = useRecoilState(isProjectInfoState)
    const toggleProjectInfo = () => { setisInfo(false); setisProjectInfo(!isProjectInfo) }
    const [chosenProjectSlug, setchosenProjectSlug] = useRecoilState(chosenProjectSlugState)

    // data states
    const data = useRecoilValue(dataState)
    const [projectData, setprojectData] = useRecoilState(projectDataState)
    const backgroundImg = useRecoilValue(backgroundImgState)
    const accentColor = useRecoilValue(accentColorState)

    // other states & functions
    const [buttonHover, setbuttonHover] = useState(-1)
    const [accentColorHover, setaccentColorHover] = useState('')
    const calcAccentColorHover = () => {
        setaccentColorHover(`rgba${accentColor.slice(3, -1)}, 0.7)`)
    }
    useEffect(() => { calcAccentColorHover() }, [accentColor])

    const disabled = !chosenProjectSlug && pathname == '/' && !isInfo
    const [shuffleRotate, setshuffleRotate] = useState(0)
    const shuffle = () => {
        setchosenProjectSlug('')
        setshuffleRotate(shuffleRotate+360)
        let projectDataCopy = [...projectData]
        let currIndex = projectDataCopy.length,  randomIndex
        while (currIndex != 0) {
            randomIndex = Math.floor(Math.random() * currIndex)
            currIndex--
            // Swap it with the current element
            [projectDataCopy[currIndex], projectDataCopy[randomIndex]] = [
                projectDataCopy[randomIndex], projectDataCopy[currIndex]
            ]
        }
        setprojectData(projectDataCopy)
    }

    // components
    const toggleButt1 = () => {
        let goHome = isProjectRoute
        let goProject = (!disabled && !isInfo && pathname == '/')
        if(isInfo) toggleInfo()
        else if(isProjectInfo) toggleProjectInfo()
        if(goHome)router.push(`/`) 
        else if(goProject) router.push(`/projects/${chosenProjectSlug}`) 
    }

    return <div className={`flexCenter image ${styles.page}`}>
        {backgroundImg ? <Image 
            alt='shotByPeter'
            src={backgroundImg} 
            placeholder="blur"
            blurDataURL={'/imgPlaceholder.gif'}
            layout='fill' 
            objectFit='cover'
            objectPosition='center'
            /> 
        : null}
        <Head>
            <title>Peter Plügler</title>
            <meta name="Portfolio" content="Projects of Peter Plügler" />
            <link rel="icon" href="/images/Peter_Pluegler_10.png" />
        </Head>

        <div 
            className={`
                ${styles.con} ${isProjectRoute 
                && !isInfo? 
                styles.conHeightProject 
                : styles.conHeightNorm} 
                ${isProjectRoute && !isInfo ? 
                styles.conWidthProject : 
                styles.conWidthNorm}
            `}>

            <div
                className={`
                    ${styles.childrenBox} 
                    ${isInfo || isProjectInfo ? 
                    styles.childrenBoxZero 
                    : isProjectRoute ? 
                    styles.childrenBoxProject : ''}
                `}
                >
                {children}
            </div>

            <div
                className={`${styles.infoBox} 
                    ${isInfo || isProjectInfo ?
                    styles.infoBoxVar2
                    : isProjectRoute ?
                    styles.infoBoxVar3
                    : ''}
                `}
                >
                <InfoBox isProjectRoute={isProjectRoute}/>
                <ProjectDes show={isProjectRoute && !isInfo}/>
            </div>

            <div className={`flexCenter ${styles.controlsCon}`}>
                <div className={`flexCenter ${styles.controlsInnerBox} 
                        ${isProjectRoute ? styles.controlsInnerBox : ''}`
                    }>
                    <div className={`flexCenter ${styles.controlsLeft} 
                            ${isProjectRoute ? styles.controlsLeftProject : ''}`
                        }>
                        <div onClick={toggleInfo} className={`${isProjectRoute ? 
                                styles.infoButtProject : styles.infoButt} flexCenter transit`
                            }>
                            <Info isClicked={isInfo} styles={styles}/>
                        </div>
                        <div style={{ borderRadius: '100%' }} onClick={toggleProjectInfo} 
                            className={`flexCenter ${isProjectRoute ? styles.textButtProject : styles.textButt}`}>
                            <TextButton isClicked={isProjectInfo} styles={styles}/>
                        </div> 
                        {pathname == '/' ?
                            <div 
                                style={{ transform: `rotate(${shuffleRotate}deg)`}}
                                onClick={!isInfo ? shuffle : null}
                                className={`flexCenter ${styles.shuffleWrap}`}
                                >
                                    <Shuffle styles={styles}/>
                            </div> 
                        : null}
                    </div>
                    <div className={`flexCenter ${styles.buttonBox}`}>
                        <div 
                            style={{ 
                                background: disabled ? 'rgb(128,128,128)' 
                                    : buttonHover == 1 ? 
                                    accentColorHover 
                                    : accentColor,
                                color: disabled ? 'rgb(200,200,200)' : 'white'
                            }}
                            onClick={toggleButt1}
                            onMouseEnter={() => setbuttonHover(1)}
                            onMouseLeave={() => setbuttonHover(-1)}
                            className={`font flexCenter ${styles.button} transit`}
                            >
                                {pathname != '/' || isInfo ? 'go back' : 'see more'}
                        </div>
                        <a href={`mailto:${data.mailAddress}`}>
                            <div style={{ background: buttonHover == 2 ? accentColorHover : accentColor }} 
                                onMouseEnter={() => setbuttonHover(2)}
                                onMouseLeave={() => setbuttonHover(-1)}
                                className={`font flexCenter ${styles.button} ${styles.buttonContact} transit`}>
                                contact
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
}




