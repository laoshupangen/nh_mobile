import instance from './instance'
//统计筛选 年级 院系 班级
export const GetSelectJsonByCategoryId = ({ parentId}) => {
  return instance.get('/SystemManage/Organize/GetSelectJsonByCategoryId', {
      params: {
      parentId:parentId,
    }
  })
}

//通过班级id 查学生
export const GetGridSelectByClassId = (F_ClassID) => {
  return instance.get('/Dorm/Student/GetGridSelectByClassId', {
      params: {
        F_ClassID,
    }
  })
}

//晚归学生统计按班级
export const GetLateListByClass = ({ classId,startTime,endTime}) => {
  return instance.get('/Dorm/InOut/GetLateListByClass', {
      params: {
        classId,
        startTime,
        endTime
    }
  })
}

//晚归学生统计按年级
export const GetLateListByGrade= ({ gradeId,startTime,endTime}) => {
  return instance.get('/Dorm/InOut/GetLateListByGrade', {
      params: {
        gradeId,
        startTime,
        endTime
    }
  })
}

//晚归学生统计按院系
export const GetLateListByDivis= ({ divisId,startTime,endTime}) => {
  return instance.get('/Dorm/InOut/GetLateListByDivis', {
      params: {
        divisId,
        startTime,
        endTime
    }
  })
}

//未归统计-班级
export const GetNoReturnListByClass= ({ classId,startTime,endTime,keyboard}) => {
  return instance.get('/Dorm/InOut/GetNoReturnListByClass', {
      params: {
        classId,
        startTime,
        endTime,
        keyboard
    }
  })
}

//未出统计-班级
export const GetNoOutListByClass= ({classId,startTime,endTime,keyboard}) => {
  return instance.get('/Dorm/InOut/GetNoOutListByClass', {
      params: {
        classId,
        startTime,
        endTime,
        keyboard
    }
  })
}

//宿舍出入记录-学生
export const GetDormRecords = ({ studentId,date}) => {
  return instance.get('/Dorm/InOut/GetDormRecords', {
      params: {
      studentId,
      date,
    }
  })
}

//晚归记录-学生
export const GetLateList= ({studentId,startTime,endTime}) => {
  return instance.get('/Dorm/InOut/GetLateListByStuId', {
      params: {
        studentId,
        startTime,
        endTime
    }
  })
}

//未归记录-学生
export const GetNoReturnList= ({studentId,startTime,endTime}) => {
  return instance.get('/Dorm/InOut/GetNoReturnListByStuId', {
      params: {
        studentId,
        startTime,
        endTime
    }
  })
}

//未出记录-学生
export const GetNoOutList= ({studentId,startTime,endTime}) => {
  return instance.get('/Dorm/InOut/GetNoOutListByStuId', {
      params: {
        studentId,
        startTime,
        endTime
    }
  })
}

export const getInOutLogByDay = ({ rows, page, sidx = "F_CreatorTime desc", sord = "desc",userId, date }) => {
  var d= instance.get('/Dorm/InOut/GetOriginalListBydate', {
      params: {
        PageIndex:page,
        PageSize:rows,
        sidx,
        sord,
        date,
        userId
      }
  })
  return d;
}


export const getLateInLog = ({ rows, page, sidx = "F_CreatorTime desc", sord = "desc", collegeId, startTime,endTime }) => {
  return instance.get('/Dorm/InOut/GetLateList', {
      params: {
      PageIndex:page,
      PageSize:rows,
      sidx,
      sord,
      collegeId,
      startTime,
      endTime
    }
  })
}

export const getNotInLog = ({ rows, page, sidx = "F_CreatorTime desc", sord = "desc",  collegeId, startTime,endTime}) => {
  return instance.get('/Dorm/InOut/GetNoReturnList', {
      params: {
      PageIndex:page,
      PageSize:rows,
      sidx,
      sord,
      collegeId,
      startTime,
      endTime
    }
  })
}

export const getNotOutLog = ({ rows, page, sidx = "F_CreatorTime desc", sord = "desc",  collegeId, startTime,endTime }) => {
  return instance.get('/Dorm/InOut/GetNoOutList', {
      params: {
      PageIndex:page,
      PageSize:rows,
      sidx,
      sord,
      collegeId,
      startTime,
      endTime
    }
  })
}
