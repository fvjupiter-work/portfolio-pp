import { atom } from 'recoil'

export const isInfoState = atom({
    key: 'isInfoState', // unique ID (with respect to other atoms/selectors)
    default: false // default value (aka initial value)
})

export const isProjectInfoState = atom({
  key: 'isProjectInfoState', 
  default: false, 
})

export const projectInfoState = atom({
  key: 'projectInfoState', 
  default: {}, 
})

export const chosenProjectSlugState = atom({
  key: 'chosenProjectSlugState', 
  default: '', 
})

export const projectPicIdState = atom({
  key: 'projectPicIdState', 
  default: -1, 
})

export const screenState = atom({
  key: 'screenState', 
  default: 0, 
})

export const backgroundImgState = atom({
  key: 'backgroundImgState', 
  default: '', 
})

export const captchaPicIdState = atom({
    key: 'captchaPicIdState', 
    default: -1, 
  })

export const accentColorState = atom({
  key: 'accentColorState', 
  default: 'rgb(170,201,105)', 
})

export const dataState = atom({
  key: 'dataState',
  default: {
    name: 'Peter Plügler',
    intro: '',
    profileImage: {
      fields: {
        file: {
          url: '//'
        }
      }
    },
    mailAddress: '',
    accentColorRed: 170,
    accentColorGreen: 201,
    accentColorBlue: 105,
    generalInfo: 'Visual Artist based in Vienna and Den Haag',
    cvTitle: 'CV',
    cv: '',
    aboutTitle: 'About',
    about: '',
    isTextColorIntroWhite: 'white',
  },
})

export const projectDataState = atom({
    key: 'projectDataState',
    default: [],
  })