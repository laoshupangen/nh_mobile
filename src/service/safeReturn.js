import instance from './instance'
// 获取最新的未归数据-returnPreview
export const GetLatestDormitoryStatistics = () => {
    return instance.get('/MobileDataView/GetLatestDormitoryStatistics')
}
// 增加未归人员
export const UpdateStudentInOutStatus = ({ id, noReturnReason, currentLocation }) => {
    return instance.post('/MobileDataView/UpdateStudentInOutStatus', { id, noReturnReason, currentLocation })
}

// 获取平安归寝工作报告数据列表-returnPreview
export const GetSafeDormReport = ({organId, startDate, endDate,page}) => {
    return instance.get('/MobileDataView/GetSafeDormReport', { params: { organId, startDate, endDate,page } })
}

// 获取最新的图形统计-饼图
export const GetLatestDormitoryGraphicStatistics = (checkStatus) => {
    return instance.get('/MobileDataView/GetLatestDormitoryGraphicStatistics', { params: { checkStatus } })
}


// 一键上报
export const ReportStudent = ({ reportDay }) => {
    return instance.post('/MobileDataView/ReportStudent', { reportDay })
}

// 核查学生未归操作
export const CheckStudent = ({ id, noReturnReason, currentLocation }) => {
    return instance.post('/MobileDataView/CheckStudent', { id, noReturnReason, currentLocation })
}

// 获取单条未归人员信息
export const GetSafeDormStudentById = (id) => {
    return instance.get('/MobileDataView/GetSafeDormStudentById', { params: { id } })
}

// 根据组织机构ID和时间查询未归人员列表
export const GetSafeDormReportList = ({ buildingCode,organId, startDate, endDate, checkStatus, keyword, rows, page, sidx, sord }) => {
    return instance.get('/MobileDataView/GetSafeDormReportList', {
        params: {
            buildingCode,organId, startDate, endDate, checkStatus, keyword, rows, page, sidx, sord
        }
    })
}

// 增加未归寝人员查询列表 - 级联选择
export const GetSafeDormStudent = ({ rows, page, keyword, organId, startDate, sidx, sord }) => {
    return instance.get('/MobileDataView/GetSafeDormStudent', {
        params: {
            rows, page, keyword, organId, startDate, sidx, sord
        }
    })
}

// 学生机构
export const GetStudentOrgAll = ()=>{
    return instance.get('/MobileDataView/GetStudentOrgAll')
}