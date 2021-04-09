/* eslint-disable no-unused-expressions */
import { BaiduMapManager, Geolocation, MapApp } from 'react-native-baidu-map'

export async function getLocation(options: Taro.getLocation.Option = {}): Promise<Taro.getLocation.SuccessCallbackResult> {
  const { type = 'gcj02', success, fail, complete } = options
  const coorType: any = type ?? 'gcj02'
  try {
    const hassPermission = await BaiduMapManager.hasLocationPermission()
    if (!hassPermission) {
      const res = { errMsg: 'Permissions denied!' }
      return Promise.reject(res)
    }
  } catch (err) {
    const res = {
      errMsg: 'Permissions denied!',
      err
    }
    return Promise.reject(res)
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(coorType)
      .then((data: any) => {
        const { latitude, longitude, altitude, accuracy, speed } = data
        const res = {
          latitude,
          longitude,
          speed: speed ?? 0,
          altitude: altitude ?? 0,
          accuracy: accuracy ?? 0,
          verticalAccuracy: accuracy ?? 0,
          horizontalAccuracy: 0,
          errMsg: 'getLocation:ok'
        }
        success?.(res)
        complete?.(res)
        resolve(res)
      }).catch(err => {
        const res = {
          errMsg: 'getLocation fail',
          err
        }
        fail?.(res)
        complete?.(res)
        reject(res)
      })
  })
}

export function openLocation(option: Taro.openLocation.Option): Promise<Taro.General.CallbackResult> {
  const { complete, latitude = 0, longitude = 0, address = '' } = option
  const endPoint = {
    latitude,
    longitude,
    name: address
  }
  return new Promise((resolve, reject) => {
    try {
      const res = {
        errMsg: 'openLocation:ok'
      }
      const coorType: any = 'gcj02'
      Geolocation.getCurrentPosition(coorType).then(data => {
        const startPoint = {
          latitude: data?.latitude || 0,
          longitude: data?.longitude || 0,
          name: data?.address || ''
        }
        MapApp.openDrivingRoute(startPoint, endPoint)
        resolve(res)
        complete?.(res)
      })
    } catch (err) {
      const res = {
        errMsg: 'openLocation:fail',
        err
      }
      complete?.(res)
      reject(res)
    }
  })
}

export function onLocationChange(callback: Taro.onLocationChange.Callback): void {
  const coorType = 'gcj02'
  Geolocation.startLocating((data) => {
    const { latitude, longitude, altitude, accuracy, speed } = data
    const result: Taro.onLocationChange.CallbackResult = {
      latitude,
      longitude,
      speed: speed ?? 0,
      altitude: altitude ?? 0,
      accuracy: accuracy ?? 0,
      verticalAccuracy: accuracy ?? 0,
      horizontalAccuracy: 0
    }
    callback(result)
  }, coorType)
}

export function offLocationChange(callback: (res: Taro.General.CallbackResult) => void): void {
  try {
    Geolocation.stopLocating()
    const res = {
      errMsg: 'offLocationChange :ok'
    }
    callback(res)
  } catch (err) {
    const res = {
      errMsg: 'offLocationChange :fail',
      err
    }
    callback(res)
  }
}

// 暂不支持
// export function chooseLocation () {
// return new Promise((resolve,reject)=>{

// })
// }
