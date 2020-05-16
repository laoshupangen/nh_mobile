import instance from './instance'
import axios from 'axios'
import { API_HOST_1 } from '@/config'
import { md5 } from '@/utils';


export const getDictionary = () => {
  return instance.get('/Home/ClientData')
}

export const getSchoolList = () => {
  // https://www.easy-mock.com/mock/5c8b7baa0e11997fba90a510/GetSchoolList/GetSchollList
  // /Login/GetSchoolList
  return instance.get('/Config/GetSchoolList');
}

export const userLogin = ({ username, password, code, belongSchool }) => {
 return instance.post('/Login/CheckLogin', { username, password: md5(password), code, });
//  return instance.post('/Login/CheckLogin', { username, password: md5(password), code, schoolCode: belongSchool });

}

export const userLogout = () => {
  return instance.get('/Login/OutLoginMobile')
}

export const restoreLogin = () => {
  return instance.get('/SystemManage/CurrentUser/GetCurrentUser')
}

export const bindChild = ({ F_StudentName, F_CardNo }) => {
  return instance.post('/SchoolManage/School_ParStu_Num/bindStudent', { F_StudentName, F_CardNo })
}

//老师绑定班级 多对多
export const TeacherBindClass = ({ classID , teacherId}) => {
  return instance.post('/Dorm/Teacher/TeacherBindClass', {classID, teacherId})
}

//获取绑定的班级
export const GetBindClass = (teacherId) => {
  return instance.get('/Dorm/Teacher/GetBindClass', {
    params: {
      teacherId
    }
  })
}

export const updateParentAvatar = (userId, avatar) => {
  return instance.post('/SchoolManage/School_ParStu_Num/setParentIcon', { parentId: userId, filePath: avatar })
}

export const getHonor = (userId) => {
  return instance.get('/WeChat/Honor/GetHornors', {
    params: {
      userId
    }
  })
}

export const getSerialNumber = (url, userId, F_School_Id) => {
  return axios.get(`${urls}/Api/User/GetSerialNumber`, {
    params: {
      userId,
      F_School_Id
    }
  })
}

// export const getAppkey = (F_School_Id) => {
//   return axios.get(`${API_HOST_1}/Api/School/GetSchoolConfig`, {
//     params: {
//       SchoolCode: F_School_Id
//     }
//   })
// }

export const getProfileById = (userId) => {
  return instance.get('/SystemManage/User/GetFormJson', {
    params: {
      keyValue: userId
    }
  })
}

//照片审核接口rows, page, sidx = "CreatedTime", sord = "desc",SearchPattern
export const getPhotosList = ({CurrentUserId,
  rows,
  page,
  sidx='CreateTime',
  sord='desc',
  Keyword,
  SearchPattern
  }) =>{
  return instance.get('/Dorm/Face/GetList',{
    params:{
      rows,
      page,
      sidx,
      sord,
      Keyword,      
      CurrentUserId,
      SearchPattern
    }
  })
}

//审核详情接口 appid：审批记录的id ;currentUserId:当前登录用户
export const getPhotoDetails = ({appId,currentUserId}) =>{
  return instance.get('/Dorm/Face/Get',{
    params:{
      appId,
      currentUserId,        
    }
  })
}

//提交审批信息/Dorm/Face/Approval参数：CurrentUserId，OrderId（就是appID），IsAgreed（是否同意），Opinion（审批意见）

export const setApprovalInfo = ({
  CurrentUserId,
  OrderId,
  IsAgreed,
  Opinion
})=>{
  return instance.post('/Dorm/Face/Approval',{
   CurrentUserId,
   OrderId,
   IsAgreed,
   Opinion
  })

}

// MobileDataView/getStatuById?id=学生ID 照片审核状态判断
export const getStatusByStudent = ()=>{
  return instance.get('MobileDataView/getStatuById')
}

// MobileDataView/loadByOrgShowOutStudentInfo
export const showOut = ({orgId,rows,page})=>{
  return instance.post('/MobileDataView/loadByOrgShowOutStudentInfo',{orgId,rows,page})
}