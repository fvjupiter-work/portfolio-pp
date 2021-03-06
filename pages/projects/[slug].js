import React, { useEffect, useState, useRef, useContext, useCallback } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { 
    projectPicIdState, 
    dataState, 
    backgroundImgState, 
    accentColorState, 
    projectInfoState, 
    isInfoState,
    screenState,
    isFullscreenState,
    isVideoState,
    fullSContext
} from '../../lib/state'
import Image from 'next/image'

import { createClient } from 'contentful'
import { INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import Fade from '../../components/Fade'
import Slide from '../../components/Slide'
// import BsChevronRight from '../../components/svg/BsChevronRight'
// import BsChevronLeft from '../../components/svg/BsChevronLeft'
import styles from '../../styles/Project.module.css'

import { FullScreen } from "react-full-screen";
import { useRouter } from 'next/router'
// import FullS from '../../components/svg/FullS'
import X from '../../components/svg/X'
import ReactPlayer from 'react-player/lazy'
// import { AiFillPlayCircle } from "react-icons/ai"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";


export default function Project({ project, bgImages, dataFields }) {

    const { title, description, thumbnail, featuredImages, videoLinks } = project.fields
    const videoLinksCopy = videoLinks ? [...videoLinks] : []
    const images = [...videoLinksCopy, ...featuredImages]
    // images.unshift(thumbnail)

    const router = useRouter()
    const isProjectRoute = router.pathname.split('/')[1] == 'projects'

    // const [show_fullS_buttons, setshow_fullS_buttons] = useState(false)

    // fullscreen
    const { handleFullscreen } = useContext(fullSContext)
    const [isFullscreen, setisFullscreen] = useRecoilState(isFullscreenState)
    const getFullscreenBox = () => { 
        return(
        <FullScreen handle={handleFullscreen} className='fullscreen'>
            {/* <div 
                style={{
                    position: 'fixed',
                    display: isFullscreen ? 'block' : 'none',
                    top: 0, left: 0, bottom: 0, right: 0,
                    zIndex: 100000,
                }}
                onMouseOver={() => {
                    setshow_fullS_buttons(true)
                    console.log('mouseover')
                    setTimeout(() => {
                        setshow_fullS_buttons(false)
                    }, 2000);
                }}
            /> */}
            <div style={{
                background: 'black', 
                display: isFullscreen ? 'flex' : 'none',
                alignItems:'center',
                justifyContent: 'center',
                position: 'fixed',
                top: 0, left: 0, bottom: 0, right: 0,
                zIndex: 10000,
                }}
                
                >
                {typeof images[projectPicId == -1 ? 0 : projectPicId] != 'string' ?
                    <Image
                        alt='shotByPeter'             
                        src={`https:${images[projectPicId == -1 ? 0 : projectPicId].fields.file.url}`}
                        layout='fill'
                        objectFit='contain'
                        objectPosition='center'
                        placeholder="blur"
                        blurDataURL={'/imgPlaceholder.gif'}
                    />
                : <ReactPlayer playing={isFullscreen} controls={true} url={videoLinksCopy[projectPicId]} width='100%' height='100%'/>
                }
                <div 
                    style={{ //opacity: show_fullS_buttons ? 1 : 0, 
                        position: 'fixed', zIndex:10, top: screen > 0 ? 20 : 40, left: screen > 0 ? 20 : 40, borderRadius: 3, cursor:'pointer'}} 
                    onClick={() => {  handleFullscreen.exit(); setisFullscreen(false) }}>
                        <X />
                </div>
                <div style={{ position: 'fixed', zIndex:10, top: '50%', left: screen > 0 ? 20 : 40, cursor:'pointer' }}
                    onClick={() => setprojectPicId(projectPicId > 0 ? projectPicId-1 : images.length-1)}>
                    <BsChevronLeft size={28} color='white'/>
                </div>
                <div style={{ position: 'fixed', zIndex:10, top: '50%', right: screen > 0 ? 20 : 40, cursor:'pointer' }}
                    onClick={() => setprojectPicId(projectPicId < images.length-1 ? projectPicId+1 : 0)}>
                    <BsChevronRight size={28} color='white'/>
                </div>
            </div>
        </FullScreen>
        )
    }

    // states
    const setdata = useSetRecoilState(dataState)
    const [projectPicId, setprojectPicId] = useRecoilState(projectPicIdState)
    const [accentColor, setaccentColor] = useRecoilState(accentColorState)
    const [backgroundImg, setbackgroundImg] = useRecoilState(backgroundImgState)
    const setprojectInfo = useSetRecoilState(projectInfoState)
    const isInfo = useRecoilValue(isInfoState)
    const escFunction = useCallback((event) => {
        if(event.keyCode === 27) {//when esc is pressed
            handleFullscreen.exit(); setisFullscreen(false)
        }
    }, [])
    useEffect(() => {
        document.addEventListener("keydown", escFunction, false)
        return () => document.removeEventListener("keydown", escFunction, false)
    }, [])
    const [isVideo, setisVideo] = useRecoilState(isVideoState)
    useEffect(() => {
        setisVideo(projectPicId > videoLinksCopy.length-1 ? false : true)
    }, [projectPicId])
    useEffect(() => {
        setprojectPicId(0)
        setaccentColor(`rgb(
            ${dataFields.accentColorRed}, 
            ${dataFields.accentColorGreen}, 
            ${dataFields.accentColorBlue}
        )`)
        setdata(dataFields)
        setprojectInfo({ title, description, images })
        let randomNum = Math.floor(Math.random() * bgImages.length)
        if(!backgroundImg) setbackgroundImg(`https:${bgImages[randomNum].fields.file.url}`)
    }, [])

    

    const getArrow = (turn) => <div onClick={() => {
                if(!turn) setprojectPicId(projectPicId < images.length-1 ? projectPicId+1 : 0)
                else setprojectPicId(projectPicId > 0 ? projectPicId-1 : images.length-1)
            }}
        className={`flexCenter transit ${styles.arrowWrap}`}>
        {turn ? <BsChevronLeft /> : <BsChevronRight /> }
    </div>

    // OPTIONS FOR RICHTEXT RENDERER
    const richText_Options = {
        // renderMark: {
        //     [MARKS.BOLD]: text => <>{text}</>,
        // },
        renderNode: {
            [INLINES.HYPERLINK]: (node, children) => <a target='_blank' rel="noreferrer" href={node.data.uri}>{children}</a>,
        },
        // renderText: text => text.replace('!', '?'),
    };

    const contentConRef = useRef()
    const leftConRef = useRef()
    const [smallImgBox_height, setsmallImgBox_height] = useState(0)

    const setSmallImgBox_height = () => setsmallImgBox_height(
        leftConRef.current.clientHeight 
        - contentConRef.current.clientHeight 
        - 10
    )
    const screen = useRecoilValue(screenState)
    useEffect(() => setSmallImgBox_height(), [])
    useEffect(() => setSmallImgBox_height(), [screen])

    const [isPlayHover, setisPlayHover] = useState(false)
    
    return <>{getFullscreenBox()}
        <div className={`${styles.con}`}>
            <div className={`${styles.leftCon}`} ref={leftConRef}>
                <div style={{ height: smallImgBox_height }} 
                    className={`${styles.smallImgCon}`}
                    >
                    {images.map((pic, index) => <Fade 
                        key={index} 
                        delay={0.2 * index} 
                        duratio={0.8} 
                        scale={[0.8, 1]}
                        >
                        <div style={{ 
                                borderColor: index == projectPicId ? accentColor : 'black', 
                                opacity: isInfo ? 0 : 1, 
                                transition: 'opacity 0.1s', 
                                transitionDelay: isInfo ? '0s' : '0.3s'
                            }} 
                            onClick={() => setprojectPicId(index)}
                            className={`${styles.smallImgBox}`}
                            >
                            <div className={`${styles.smallImgWrap}`}>
                                <div 
                                    className={`scaleHover transit ${styles.smallImgWrap}`}
                                    >{index > videoLinksCopy.length-1 ?
                                        <Image 
                                            alt='shotByPeter' 
                                            src={`https:${pic.fields.file.url}`}
                                            layout='fill'
                                            objectFit='cover'
                                            objectPosition='50% 50%'
                                            placeholder="blur"
                                            blurDataURL={'/imgPlaceholder.gif'}
                                        /> 
                                    : <><div onClick={() => setprojectPicId(index)} style={{ position: 'absolute', zIndex:9999, cursor: 'pointer', top: 0, left: 0, width: '100%', height: '100%'}}/>
                                    <ReactPlayer playing={false} controls={false} url={videoLinksCopy[index]} width='100%' height='100%'/>
                                    </>
                                    }   
                                </div>
                            </div>
                            <div className={`font ${styles.num}`}>{index+1}</div>
                        </div>
                    </Fade>)}
                </div>
                <div className={`${styles.contentCon}`} ref={contentConRef}>
                    <div className={`font ${styles.title}`}>{title}</div>
                    <div className={`flexCenter mb-5 ${styles.buttonBox}`}>
                        {getArrow(true)}
                        {getArrow()}
                        {projectPicId > videoLinksCopy.length-1 ? 
                            <div className={`flexCenter transit ${styles.fullSWrap}`}>
                                {isProjectRoute && screen == 0 && 
                                    <div style={{ marginLeft: 0, width: '100%', cursor:'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}} onClick={() => { setisFullscreen(true); handleFullscreen.enter() }}>
                                {/* <FullS styles={styles}/>  */}
                                <div style={{ height: '14px', width: '14px', border: '1px solid black'}}/><span style={{ paddingLeft: 6 }}>Fullscreen</span>
                                </div>}
                            </div>
                            : 
                            // <AiFillPlayCircle size={27} 
                            //     onMouseEnter={() => setisPlayHover(true)} 
                            //     onMouseLeave={() => setisPlayHover(false)} 
                            //     color={isPlayHover ? '#E6E6E6' : '#808080'} 
                            //     style={{ marginBottom: 3, marginLeft: 1, cursor: 'pointer' }}
                            //     className={'transit'}
                            //     onClick={() => { setisFullscreen(true); handleFullscreen.enter() }}
                            //     />
                            <div style={{ display: 'flex', alignItems: 'center', }} className={`transit ${styles.fullSWrap}`}>
                                <div style={{ cursor:'pointer', display: 'flex', alignItems: 'center', width: '48px', fontSize: 13, marginLeft: 0 }} onClick={() => { setisFullscreen(true); handleFullscreen.enter() }}>
                                    <div style={{ height: '14px', width: '14px', border: '1px solid black'}}/><span style={{ paddingLeft: 6 }}>play</span>
                                </div>
                            </div>
                        }
                    </div>
                    
                    <div className={`font ${styles.content}`}>
                        {documentToReactComponents(description, richText_Options)}
                    </div>
                </div>
            </div>
            <div className={`flexCenter ${styles.rightCon}`}>
                {screen > 0 ?
                    <Slide 
                        isFullscreen={isFullscreen}
                        currentBoxId={projectPicId}
                        boxIdHandler={setprojectPicId} 
                        height={screen == 1 ? 683-8 : screen == 2 ? 556-8 : screen == 3 ? 444.8 : 1}
                        width={screen == 1 ? 437 : screen == 2 ? 344.5 : screen == 3 ? 275.6 : 1}
                        borderRadius={dataFields.borderRadiusOfImagesImageSlider}
                        boxList={images.map((pic, index) => { 
                            return ( 
                            <>{index > videoLinksCopy.length-1 ?
                                <Image 
                                    key={index}
                                    alt='shotByPeter' 
                                    src={`https:${pic.fields.file.url}`}
                                    layout='fill'
                                    objectFit='contain'
                                    objectPosition='top'
                                    placeholder="blur"
                                    blurDataURL={'/imgPlaceholder.gif'}
                                />
                                : <ReactPlayer playing={false} controls={false} url={videoLinksCopy[index]} width={screen == 1 ? 437 : screen == 2 ? 344.5 : screen == 3 ? 275.6 : 1} height='100%' />}
                            </>
                            )
                        })}
                    />
                :   <Fade delay={0.2} duratio={0.8} scale={[0.8, 1]}>
                        <div className={`transit ${styles.bigImgWrap}`}>
                        {projectPicId > videoLinksCopy.length-1 ?
                            <Image
                                alt='shotByPeter'             
                                src={`https:${images[projectPicId == -1 ? 0 : projectPicId].fields.file.url}`}
                                layout='fill'
                                objectFit='contain'
                                objectPosition='top'
                                placeholder="blur"
                                blurDataURL={'/imgPlaceholder.gif'}
                            />
                            : <div style={{ width: 600, height: '100%' }}><ReactPlayer playing={false} controls={false} url={videoLinksCopy[projectPicId]} width='600px' height='100%'/></div>
                        } 
                        </div>
                    </Fade>
                }
            </div>
        </div>
    </>
}


const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
})

export const getStaticPaths = async () => {
    const res = await client.getEntries({ content_type: 'project' })

    const paths = res.items.map(item => {
        return {
            params: { slug: item.fields.slug }
        }
    })

    return {
        paths,
        fallback: false
    }
}

// context (paths) from getStaticPaths is passed to getStaticProps...
export async function getStaticProps({ params }) {
  
    const { items } = await client.getEntries({ 
        content_type: 'project',
        'fields.slug': params.slug
    })

    const res2 = await client.getEntries({ content_type: 'backgroundImagesList' })

    const res3 = await client.getEntries({ content_type: 'data' })
  
    return {
        props: {
            project: items[0],
            bgImages: res2.items[0].fields.backgroundImages,
            dataFields: res3.items[0].fields
        }
    }
  }
