import instance from './instance'

//通过组织机构查询首页信息
export const postLoadByOrg = ({ orgId}) => {
    return instance.post('/MobileDataView/loadByOrg', {
      orgId, 
    })
}

//学生查询首页信息
export const postLoadByStu = ({ userId , startTime , endTime}) => {
    return instance.post('/MobileDataView/loadByStu', {
        userId, 
        startTime , 
        endTime
    })
}

//查询宿管绑定楼栋
export const getDorms = () => {
    return instance.get('/Supervisor/GetDorm')
}

//楼栋id查询信息
export const getDormInfo = (BuildingId) => {
    return instance.get('/Supervisor/StatisticsByBuild',{
        params: {
            BuildingId,
        }
    })
}

export const getClassList = ({userId})=>{
    return instance.post('/MobileDataView/ListOrgan',{userId})
}
// 新增1班主任视图数据
export const getHeadmasterData = ({ classId, dateType }) => {
    return instance.get('/MobileDataView/ClassResult', {
        params: {
            classId,
            dateType
        }
    })
}
// 新增2卡片数据
export const getcarData = ({ orgId, dateType }) => {
    return instance.post('/MobileDataView/OrgListData', {
            orgId,
            dateType
    })
}
//新增3-组织机构
export const getSafeData = ({ orgId, startTime, EndTime }) => {
    return instance.post('/MobileDataView/LoadByOrgNew', {
        orgId,
        startTime,
        EndTime
    })
}

//根据id判断是否为班干部或班主任
export const IsClass = (userId)=>{
    return instance.get('MobileDataView/IsClass',{params:{userId}})
}

// 领导视图根据orgId查找人员
export const orgResult = ({orgId,dateType})=>{
    return instance.get('/MobileDataView/OrganResult',{params:{orgId,dateType}})
}

// OrganResultNoReturn 未归
export const organResultNoReturn = ({orgId,dateType})=>{
    return instance.get('/MobileDataView/OrganResultNoReturn',{params:{orgId,dateType}})
}
// OrganResultLateReturn 晚归
export const organResultLateReturn = ({orgId,dateType})=>{
    return instance.get('/MobileDataView/OrganResultLateReturn',{params:{orgId,dateType}})
}
// OrganResultNoOut 未出
export const organResultNoOut = ({orgId,dateType})=>{
    return instance.get('/MobileDataView/OrganResultNoOut',{params:{orgId,dateType}})
}

// 长时间未出OrganResultContiInOut
export const organResultContiInOut = ({orgId,dateType})=>{
    return instance.get('/MobileDataView/OrganResultContiInOut',{params:{orgId,dateType}})
}

// /MobileDataView/ExceptionInfo?orgId=2  
export const getExceptionInfo = (orgId)=>{
   return instance.get('/MobileDataView/ExceptionInfo',{params:{orgId}})
}

///Home/GetNoReturnTopDetail   /Home/GetLateReturnTopDetail
export const getNoreturnDetail = ({studentId,dateType})=>{
    return instance.get('/Home/GetNoReturnTopDetail',{params:{studentId,dateType}})
}

export const getNoLatereturnDetail = ({studentId,dateType})=>{
    return instance.get('/Home/GetLateReturnTopDetail',{params:{studentId,dateType}})
}

// /Dorm/Report/GetNoRecord
export const getNoRecord = ({orgId,rows,page})=>{
  return instance.get('/Dorm/Report/GetNoRecord',{params:{orgId,rows,page}})
}

// /Dorm/Report/GetNoOutList?
export const getNoOutList = ({orgId,rows,page})=>{
    return instance.get('/Dorm/Report/GetNoOutList',{params:{orgId,rows,page}})
}
