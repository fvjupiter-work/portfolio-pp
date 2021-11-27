import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { 
    projectPicIdState, 
    dataState, 
    backgroundImgState, 
    accentColorState, 
    projectInfoState, 
    isInfoState,
    screenState
} from '../../lib/state'
import Image from 'next/image'

import { createClient } from 'contentful'
import { INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import Fade from '../../components/Fade'
import Slide from '../../components/Slide'
import ArrowRight from '../../components/svg/ArrowRight'
import ArrowLeft from '../../components/svg/ArrowLeft'
import styles from '../../styles/Project.module.scss'

export default function Project({ project, bgImages, dataFields }) {

    const { title, description, thumbnail, featuredImages } = project.fields
    const images = [...featuredImages]
    // images.unshift(thumbnail)

    // states
    const setdata = useSetRecoilState(dataState)
    const [projectPicId, setprojectPicId] = useRecoilState(projectPicIdState)
    const [accentColor, setaccentColor] = useRecoilState(accentColorState)
    const [backgroundImg, setbackgroundImg] = useRecoilState(backgroundImgState)
    const setprojectInfo = useSetRecoilState(projectInfoState)
    const isInfo = useRecoilValue(isInfoState)
    
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
        {turn ? <ArrowLeft /> : <ArrowRight /> }
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

    return <>
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
                                    >
                                    <Image 
                                        alt='shotByPeter' 
                                        src={`https:${pic.fields.file.url}`}
                                        layout='fill'
                                        objectFit='cover'
                                        objectPosition='50% 50%'
                                        placeholder="blur"
                                        blurDataURL={'/imgPlaceholder.gif'}
                                    />
                                </div>
                            </div>
                            <div className={`font ${styles.num}`}>{index+1}</div>
                        </div>
                    </Fade>)}
                </div>
                <div className={`${styles.contentCon}`} ref={contentConRef}>
                    <div className={`flexCenter ${styles.buttonBox}`}>
                        {getArrow(true)}
                        {getArrow()}
                    </div>
                    <div className={`font ${styles.title}`}>{title}</div>
                    <div className={`font ${styles.content}`}>
                        {documentToReactComponents(description, richText_Options)}
                    </div>
                </div>
            </div>
            <div className={`flexCenter ${styles.rightCon}`}>
                {screen > 0 ?
                    <Slide 
                        currentBoxId={projectPicId}
                        boxIdHandler={setprojectPicId} 
                        height={screen == 1 ? 683-8 : screen == 2 ? 556-8 : screen == 3 ? 444.8 : 1}
                        width={screen == 1 ? 437 : screen == 2 ? 344.5 : screen == 3 ? 275.6 : 1}
                        borderRadius={dataFields.borderRadiusOfImagesImageSlider}
                        boxList={images.map((pic, index) => { 
                            return (
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
                            )
                        })}
                    />
                :   <Fade delay={0.2} duratio={0.8} scale={[0.8, 1]}>
                        <div className={`transit ${styles.bigImgWrap}`}>
                            <Image     
                            // onClick={() => setprojectPicId(projectPicId < images.length-1 ? projectPicId+1 : 0)}  
                                alt='shotByPeter'             
                                src={`https:${projectPicId == -1 ? 
                                    thumbnail.fields.file.url 
                                    : images[projectPicId].fields.file.url}`
                                }
                                layout='fill'
                                objectFit='contain'
                                objectPosition='top'
                                placeholder="blur"
                                blurDataURL={'/imgPlaceholder.gif'}
                            />
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
