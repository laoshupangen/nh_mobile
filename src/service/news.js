import instance from './instance'

export const getNews = ({ rows, page, sidx = "F_CreatorTime desc", sord = "desc", F_Class, F_NewsType }) => {
  return instance.get('/SchoolManage/School_News_Info/GetGridJson', {
    params: {
      rows, 
      page, 
      sidx, 
      sord, 
      F_Class, 
      F_NewsType 
    }
  })
}
export const postNews = ({ F_Title, F_Cover, F_NewsType, F_IsDisPlay, F_Content, F_Class }) => {
  return instance.post('/SchoolManage/School_News_Info/SubmitForm', {
    F_Title, 
    F_Cover, 
    F_NewsType, 
    F_IsDisPlay, 
    F_Content, 
    F_Class
  })
}