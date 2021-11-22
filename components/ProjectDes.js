import React from 'react'
import { useRecoilValue } from 'recoil'
import { projectPicIdState, isProjectInfoState, isInfoState, projectInfoState } from '../lib/state'
import getStyles from '../lib/getStyles'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import styles from '../styles/ProjectDes.module.scss'

export default function ProjectDes({ show }) {
    const { title, description, images } = useRecoilValue(projectInfoState)
    const isProjectInfo = useRecoilValue(isProjectInfoState)
    const projectPicId = useRecoilValue(projectPicIdState)
    const isInfo = useRecoilValue(isInfoState)
    const sty = {
        des: {
            opacity: isProjectInfo ? 1 : 0,
            zIndex: isInfo ? -5 : 0
        }
    }
    return <div className={`${styles.projectDesCon} ${!isInfo ? styles.projectDesConNoInfo : ''}`}>
        <div style={{ zIndex: isInfo ? -5 : 0 }} 
            className={`${styles.smallTitleBox} ${show ? styles.smallTitleBoxProject : ''}`}
            >
            <div className={`font ${styles.smallScreenTitle}`}>{title}</div> 
            <div style={{ opacity: isProjectInfo ? 0 : 1 }}
                className='font transitLong'
                >
                    {images ? `${projectPicId+1}/${images.length}` : null}
            </div>
        </div>
        <div style={getStyles(sty, 'des')} className={`font transitLong ${styles.des}`}>{description ? documentToReactComponents(description) : null}</div>
    </div>
}
