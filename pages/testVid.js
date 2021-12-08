import React from 'react'
import Slide from '../components/Slide'
import ReactPlayer from 'react-player/lazy'
import { useRecoilValue } from 'recoil'
import { screenState } from '../lib/state'

export default function testVid() {
    // const screen = useRecoilValue(screenState)
    return (
        <div>
            
            {/* <Slide 
                        currentBoxId={1}
                        boxIdHandler={()=>{}} 
                        height={screen == 1 ? 683-8 : screen == 2 ? 556-8 : screen == 3 ? 444.8 : 1}
                        width={screen == 1 ? 437 : screen == 2 ? 344.5 : screen == 3 ? 275.6 : 1}
                        // borderRadius={dataFields.borderRadiusOfImagesImageSlider}
                        boxList={[<ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U'/>]
                           
                        }
                    /> */}
        </div>
    )
}
