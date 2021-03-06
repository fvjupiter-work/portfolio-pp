import React, { useState, useEffect, useRef, createContext } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { 
    isImprintState, 
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
import { GrTextAlignFull } from "react-icons/gr";
import { RiFullscreenLine } from "react-icons/ri";
import { AiFillPlayCircle, AiOutlinePlayCircle } from "react-icons/ai"
import { VscInfo } from "react-icons/vsc";
import { MdOutlinePlayCircleFilled, MdRefresh } from "react-icons/md";
import { IoMdRefresh } from "react-icons/io";




import Image from 'next/image'
import styles from '../styles/Layout.module.css'

import { BsFullscreen, BsFullscreenExit } from "react-icons/bs"
import { FullScreen, useFullScreenHandle } from "react-full-screen";



export default function Layout({ children }) {
    const router = useRouter()
    const pathname = router.pathname
    const isProjectRoute = pathname.split('/')[1] == 'projects' //'[project_id]'

    // fullscreen
    const setisFullscreen = useSetRecoilState(isFullscreenState)
    const handleFullscreen = useFullScreenHandle()


    // navigation states
    const [isImprint, setisImprint] = useRecoilState(isImprintState)
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

    useEffect(() => { if(!isInfo) setisImprint(false) }, [isInfo])

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
            <title>Peter Pfl??gler</title>
            <meta name="Portfolio" content="Projects of Peter Pfl??gler" />
            <link rel="icon" type="image/png" href="/peterFavicon.png" />
        </Head>
        <div className={styles.screen} ref={screenRef}/>
        <div style={{ fontSize: screen == 3 ? 11.4 : 13, position: 'fixed', color: 'rgb(150,150,150)', cursor: 'pointer', zIndex: 300, top: screen == 0 ? 10 : 2, left: screen == 0 ? 14 : 7, textDecoration: 'underline'}}
            onClick={() => { setisInfo(isImprint ? false : true); setisImprint(isImprint ? false : true) }}>Imprint</div>
        <div className={`${styles.wrap} ${screen == 2 && 'scale-95'}`}>
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

                <div className={`between ${styles.controlsCon}`}>
                    <div className={`center h-full`}>
                        <div className={!isProjectRoute && `center rounded-full bg-gray hover:bg-gray-light ${isInfo && !isImprint && 'bg-gray-light'} duration-300 overflow-hidden mr-2`}>
                            <VscInfo 
                                onClick={() => { 
                                    if(isImprint) setisImprint(false)
                                    else toggleInfo()
                                }}
                                size={screen < 2 ? 24 : screen < 3 ? 32 : 26}
                                className={`
                                    button-styles
                                    ${isInfo && 'text-gray-light'}
                                    ${!isProjectRoute && 'text-white scale-[1.4] hover:text-white mr-0'}
                                `}
                            />
                        </div>
                        {isProjectRoute ? 
                            <>
                                <GrTextAlignFull 
                                    onClick={toggleProjectInfo} 
                                    size={screen < 2 ? 22 : screen < 3 ? 30 : 24} 
                                    className={`
                                        button-styles 
                                        ${isProjectInfo && 'text-gray-light'} 
                                        ${screen < 1 && 'hidden'}
                                    `}
                                />
                                {isVideo ?
                                    <AiOutlinePlayCircle
                                        onClick={() => { 
                                            setisFullscreen(true)
                                            handleFullscreen.enter() 
                                        }}
                                        size={screen < 2 ? 24 : screen < 3 ? 32 : 26}
                                        className={`
                                            button-styles
                                            ${screen < 1 && 'hidden'}
                                        `}
                                    />
                                :
                                    <RiFullscreenLine 
                                        onClick={() => { 
                                            setisFullscreen(true)
                                            handleFullscreen.enter() 
                                        }}
                                        size={screen < 2 ? 22 : screen < 3 ? 30 : 24} 
                                        className={`
                                            button-styles
                                            ${screen < 1 && 'hidden'}
                                        `}
                                    />
                                }
                            </>
                        : 
                            <div 
                                style={{ transform: `rotate(${shuffleRotate}deg)`}}
                                onClick={!isInfo ? shuffle : null}
                                className={`flexCenter ${styles.shuffleWrap}`}
                                >
                                    <Shuffle styles={styles}/>
                            </div> 
                            // <IoMdRefresh 
                            //     style={{ transform: `rotate(${shuffleRotate}deg)`}}
                            //     onClick={!isInfo ? shuffle : null}
                            //     size={40}
                            //     className={`duration-300`}
                            // />
                        }
                        
                        
                    </div>

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
}
