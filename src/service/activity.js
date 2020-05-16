import instance from './instance'

export const getActivity = ({ rows, page, sidx = "F_CreatorTime desc", sord = "desc", F_Class, F_EventType }) => {
  return instance.get('/SchoolManage/School_Event_Info/GetGridJson', {
    params: {
      rows, 
      page, 
      sidx, 
      sord, 
      F_Class, 
      F_EventType
    }
  })
}

export const postActivity = ({ F_Title, F_Cover, F_EventType, F_IsDisPlay, F_Content, F_Class, F_Imgs }) => {
  return instance.post('/SchoolManage/School_Event_Info/SubmitForm', {
    F_Title, 
    F_Cover, 
    F_EventType, 
    F_IsDisPlay, 
    F_Content, 
    F_Class,
    F_Imgs
  })
}