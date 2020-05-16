import axios from 'axios'
import {API_HOST_2} from '@/config'
// axios.defaults.withCredentials = true
// axios.defaults.headers['Content-type']='application/json'
const config = {
    withCredentials:true,
    headers:{
        'Content-Type': 'application/json'
    }
}
export const getCampus = ({keyword})=>{
    return axios.post(`${API_HOST_2}/Campus/List`,{keyword},config)
}
export const getBuild = ({buildingId}) =>{
    return axios.post(`${API_HOST_2}/bed/BuildingBedsInfo`,{buildingId},config)
}
export const getCurrentStudentInfo = ()=>{
    return axios.post(`${API_HOST_2}/Student/Info`,null,config)
}
//退宿
export const applyForCheckOut = ({reason})=>{
    return axios.post(`${API_HOST_2}/DormCheckOut/Apply`,{reason},config)
}
export const approvalForCheckOut = ({applyId,status,approvalOpinions})=>{
    return axios.post(`${API_HOST_2}/DormCheckOut/Approval`,{applyId,status,approvalOpinions},config)
}
export const checkOutPage = ({status,pageSize,pageIndex,sortName,sortOrder})=>{
    return axios.post(`${API_HOST_2}/DormCheckOut/Page`,{status,pageSize,pageIndex,sortName,sortOrder},config)

}

// 维修
export const applyForRepair = ({description})=>{
    return axios.post(`${API_HOST_2}/DormRepair/Apply`,{description},config)
}
export const approvalForRepair = ({id,message})=>{
    return axios.post(`${API_HOST_2}/DormRepair/Restore`,{id,message},config)
}
export const repairPage = ({pageSize,pageIndex,sortName,sortOrder})=>{
    return axios.post(`${API_HOST_2}/DormRepair/Page`,{pageSize,pageIndex,sortName,sortOrder},config)

}

// 入住
export const applyForCheckin = ({roomId,checkinDate,graduationTime,noticeFilePath,goodsReceived})=>{
    return axios.post(`${API_HOST_2}/DormCheckin/Apply`,
    {roomId,checkinDate,graduationTime,noticeFilePath,goodsReceived},config)
}
export const approvalForCheckin = ({applyId,status,approvalOpinions})=>{
    return axios.post(`${API_HOST_2}/DormCheckin/Approval`,{applyId,status,approvalOpinions},config)
}
export const checkinPage = ({status,pageSize,pageIndex,sortName,sortOrder})=>{
    return axios.post(`${API_HOST_2}/DormCheckin/Page`,{status,pageSize,pageIndex,sortName,sortOrder},config)

}

// 调宿
export const applyForDormExchange = ({targetRoomId})=>{
    return axios.post(`${API_HOST_2}/DormExchange/Apply`,{targetRoomId},config)
}
export const approvalForDormExchange = ({applyId,status,approvalOpinions})=>{
    return axios.post(`${API_HOST_2}/DormExchange/Approval`,{applyId,status,approvalOpinions},config)
}
export const DormExchangePage = ({status,pageSize,pageIndex,sortName,sortOrder})=>{
    return axios.post(`${API_HOST_2}/DormExchange/Page`,{status,pageSize,pageIndex,sortName,sortOrder},config)

}