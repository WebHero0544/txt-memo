import * as d3 from 'd3'
import proj4 from 'proj4'

const proj4269 = proj4(proj4('EPSG:4326'), proj4('EPSG:4269'))  //  EPSG:4269
const proj3857 = proj4(proj4('EPSG:4326'), proj4('EPSG:3857'))  //  web墨卡托


export default class GeoHeatImage {

    defaultOptions = {
        width: 1920,
        invalidValue: 9999,
        opacity: 0.8,
        is3d: true
    }
    datas = null

    constructor(options, datas) {
        this.options = Object.assign({}, this.defaultOptions, options)
        this.datas = datas
        this.colorCreater = this.getColorCreater()
        this.proj = this.options.is3d === true ? proj4269 : proj3857
    }


    get() {
        const imageData = this.getImageData()

        const canvas = document.createElement('canvas')
        canvas.width = this.options.width
        canvas.height = this.height
        const ctx = canvas.getContext('2d')
        const image = ctx.getImageData(0, 0, this.options.width, this.height)
        image.data.forEach((item, i) => {
            image.data[i] = imageData[i]
        })
        ctx.putImageData(image, 0, 0, 0, 0, this.options.width, this.height)

        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                var url = URL.createObjectURL(blob)
                // this.downloadImage(url)
                resolve({
                    canvas,
                    url,
                    startLon: this.nearStartLon,
                    startLat: this.nearStartLat,
                    endLon: this.nearEndLon,
                    endLat: this.nearEndLat
                })
            })
        })
    }


    getImageData() {
        const { startLon, startLat, lonSize, latSize, lonGap, latGap, values } = this.datas

        const endLon = startLon + lonGap * (lonSize - 1)
        const endLat = startLat + latGap * (latSize - 1)

        let nearStartLon = startLon, nearStartLat = startLat, nearEndLon = endLon, nearEndLat = endLat

        // 对于转web墨卡托，当纬度超出85后坐标转换有问题，这里做一下限制
        if (this.options.is3d === false) {
            nearStartLat = startLat < -85 ? -85 : startLat > 85 ? 85 : startLat
            nearEndLat = endLat < -85 ? -85 : endLat > 85 ? 85 : endLat
        }

        this.nearStartLon = nearStartLon
        this.nearStartLat = nearStartLat
        this.nearEndLon = nearEndLon
        this.nearEndLat = nearEndLat

        const [startx, starty] = this.latlng2coor(this.nearStartLon, this.nearStartLat)
        const [endx, endy] = this.latlng2coor(this.nearEndLon, this.nearEndLat)


        const xdiff = endx - startx
        const ydiff = endy - starty

        this.height = Math.round(this.options.width * ydiff / xdiff)


        const xgap = xdiff / (this.options.width - 1)
        const ygap = ydiff / (this.height - 1)


        // const imageData = new Array(this.height * this.options.width * 4)

        const imageData = []

        for (let yi = 0; yi < this.height; yi++) {
            const y = starty + ygap * yi
            const rowImageData = []
            for (let xi = 0; xi < this.options.width; xi++) {
                const x = startx + xgap * xi
                const [lon, lat] = this.coor2latlng(x, y)
                const value = this.getValue(lon, lat, startLon, startLat, lonSize, latSize, lonGap, latGap, values)
                const rgb = this.colorCreater(value).match(/rgb\((\d+),\s(\d+),\s(\d+)*\)/)
                if (rgb) {
                    const [, r, g, b] = rgb
                    rowImageData.push(+r, +g, +b, Math.round(this.options.opacity * 255))
                } else {
                    rowImageData.push(0, 0, 0, 0)
                }
            }
            imageData.push(rowImageData)
        }
        return imageData.reverse().flat()
    }


    getValue(lon, lat, startLon, startLat, lonSize, latSize, lonGap, latGap, values) {

        const lonfi = (lon - startLon) / lonGap
        const loni = Math.floor(lonfi)
        const lonf = lonfi - loni

        const latfi = (lat - startLat) / latGap
        const lati = Math.floor(latfi)
        const latf = latfi - lati

        let value
        if (lonf === 0 && latf === 0) {
            value = values[lonSize * lati + loni]
        } else if (lonf === 0) {
            const currValue = values[lonSize * lati + loni]
            const nextValue = values[lonSize * (lati + 1) + loni]
            value = currValue + (nextValue - currValue) * (latf / latGap)
        } else if (latf === 0) {
            const currValue = values[lonSize * lati + loni]
            const nextValue = values[lonSize * lati + (loni + 1)]
            value = currValue + (nextValue - currValue) * (lonf / lonGap)
        } else {
            const bottomLeftValue = values[lonSize * lati + loni]
            const topLeftValue = values[lonSize * (lati + 1) + loni]
            const bottomRightValue = values[lonSize * lati + (loni + 1)]
            const topRight = values[lonSize * (lati + 1) + (loni + 1)]
            const leftCenterValue = bottomLeftValue + (topLeftValue - bottomLeftValue) * (latf / latGap)
            const rightCenterValue = bottomRightValue + (topRight - bottomRightValue) * (latf / latGap)
            value = leftCenterValue + (rightCenterValue - leftCenterValue) * (lonf / lonGap)
        }
        return value
    }


    
    downloadImage(url) {
        const a = document.createElement('a')
        a.download = 'GeoHeatImage'
        a.href = url
        a.click()
    }


    // 经纬度转平面坐标
    latlng2coor(lng, lat) {
        return this.proj.forward([lng, lat])
    }

    // 平面坐标转经纬度
    coor2latlng(x, y) {
        return this.proj.inverse([x, y])
    }

    getColorCreater() {
        const values = this.datas.thresholds.map(el => el.value)
        const colors = this.datas.thresholds.map(el => el.color)
        return d3.scaleLinear().domain(values).range(colors)
    }
}


