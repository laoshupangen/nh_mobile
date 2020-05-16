import instance from './instance'

export const getPresence = ({ rows, page, sidx = "F_CreatorTime desc", sord = "desc", F_Class, F_PresenceType }) => {
  return instance.get('/SchoolManage/School_Presence_Info/GetGridJson', {
    params: {
      rows, 
      page, 
      sidx, 
      sord, 
      F_Class, 
      F_PresenceType
    }
  })
}

export const postPresence = ({
  F_Title, 
  F_Cover, 
  F_PresenceType, 
  F_IsDisPlay, 
  F_Content, 
  F_Class,
  F_Files,
  F_Pattern
}) => {
  return instance.post('/SchoolManage/School_Presence_Info/SubmitForm', {
    F_Title, 
    F_Cover, 
    F_PresenceType, 
    F_IsDisPlay, 
    F_Content, 
    F_Class,
    F_Files,
    F_Pattern
  })
}
