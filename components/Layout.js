import React, { useState, useEffect, useRef, createContext } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { 
    isInfoState, 
    chosenProjectSlugState, 
    projectDataState, 
    isProjectInfoState, 
    dataState, 
    backgroundImgState, 
    accentColorState, 
    screenState,
    isFullscreenState,
    isVideoState,
    fullSContext
} from '../lib/state'
import Head from 'next/head'
import { useRouter } from 'next/router'
import InfoBox from './InfoBox'
import ProjectDes from './ProjectDes'
import Shuffle from './svg/Shuffle'
import Info from './svg/Info'
import TextButton from './svg/TextButton'
import Image from 'next/image'
import styles from '../styles/Layout.module.css'

import { BsFullscreen, BsFullscreenExit } from "react-icons/bs"
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import FullS from './svg/FullS'
import { AiFillPlayCircle } from "react-icons/ai"


export default function Layout({ children }) {
    const router = useRouter()
    const pathname = router.pathname
    const isProjectRoute = pathname.split('/')[1] == 'projects' //'[project_id]'

    // fullscreen
    const setisFullscreen = useSetRecoilState(isFullscreenState)
    const handleFullscreen = useFullScreenHandle()


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
    const [isVideo, setisVideo] = useRecoilState(isVideoState)
    const [isPlayHover, setisPlayHover] = useState(false)
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

    const screenRef = useRef()
    const [screen, setscreen] = useRecoilState(screenState)
    useEffect(() => {
        const observer = new ResizeObserver(entries => {
            setscreen(entries[0].contentRect.width)
        })
        observer.observe(screenRef.current)
        return () => screenRef.current && observer.unobserve(screenRef.current)
    }, [])

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
            <title>Peter Pflügler</title>
            <meta name="Portfolio" content="Projects of Peter Pflügler width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no" />
            <link rel="icon" type="image/png" href="/peterFavicon.png" />
        </Head>
        <div className={styles.screen} ref={screenRef}/>
        <div className={styles.wrap}>
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
                    <fullSContext.Provider value={{ handleFullscreen }}>
                        {children}
                    </fullSContext.Provider>
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
                        {!isVideo ? 
                            <div className={`flexCenter transit ${styles.fullSWrap}`}>{isProjectRoute && screen > 0 && 
                                <div style={{ cursor:'pointer' }} onClick={() => { setisFullscreen(true); handleFullscreen.enter() }}>
                                    <FullS styles={styles}/>
                                </div>}
                            </div> 
                        : isProjectRoute && screen > 0 && 
                            <AiFillPlayCircle size={27} 
                            onMouseEnter={() => setisPlayHover(true)} 
                            onMouseLeave={() => setisPlayHover(false)} 
                            color={isPlayHover ? '#E6E6E6' : '#808080'} 
                            className={'transit ' + styles.playWrap}
                            onClick={() => { setisFullscreen(true); handleFullscreen.enter() }}
                            />
                        }
                        <div className={`flexCenter ${styles.buttonBox}`}>
                            <div 
                                style={{ 
                                    background: disabled ? 'rgb(128,128,128)' 
                                        : buttonHover == 1 ? 
                                        accentColorHover 
                                        : accentColor,
                                    color: disabled ? 'rgb(200,200,200)' : data.isTextColorIntroWhite ? 'white' : 'black',
                                    cursor: disabled && 'default',
                                }}
                                onClick={toggleButt1}
                                onMouseEnter={() => setbuttonHover(1)}
                                onMouseLeave={() => setbuttonHover(-1)}
                                className={`font flexCenter ${styles.button} transit`}
                                >
                                    {pathname != '/' || isInfo ? 'go back' : 'see more'}
                            </div>
                            <a href={`mailto:${data.mailAddress}`} style={{textDecoration: 'none'}}>
                                <div style={{ 
                                        background: buttonHover == 2 ? accentColorHover : accentColor,
                                        color: data.isTextColorIntroWhite ? 'white' : 'black'
                                    }} 
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
    </div>
}
