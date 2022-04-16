
let CONST = {
    FLOOR_OBSERVE: null,  // 地面观测
    ZDZ: null, // 自动站观测
    LIGHTNING_LOCATION: null, // 闪电定位
    TYPHOON_PATH: null, // 台风路径

    OCEAN_ELEMENT: null,  // 海洋要素
    SURGE_HEIGHT: null, // 涌浪波高
    STORMY_WAVES: null, // 风浪
    SURGE: null, // 涌浪
    POTENTIAL_HEIGHT: null, // 位势高度
    SALT: null,
    SODA: null, // SODA
    ARGO: null, // ARGO

    UPPER_AIR_OBSERVE: null,  // 高空观测
    SUNFLOWER_SATELLITE: null, // 葵花卫星
    FY4_SATELLITE: null, // FY4卫星
    COMBINATION_REF: null, // 组合反射率
    BASE_REF: null, // 基本反射率
    V_LIGUID_WATER: null, // 垂直液态水

    NUM_FCST: null,  // 数值预报
    NUM_FCST_3H_RAIN: null, // 数值预报>3小时降水
    NUM_FCST_6H_RAIN: null, // 数值预报>6小时降水
    NUM_FCST_3H_RAIN_FORMAL: null, // 数值预报>3小时降水和形式场
    NUM_FCST_HEIGHT_WIND: null, // 数值预报>高度场和风场
    NUM_FCST_PRE: null, // 数值预报>海平面气压
    NUM_FCST_24H_CPRE: null, // 数值预报>海平面24小时变压
    NUM_FCST_10M_WIND: null, // 数值预报>地面10米风场
    NUM_FCST_T_FCST: null, // 数值预报>温度预报
    NUM_FCST_24H_CT: null, // 数值预报>24小时变温
    NUM_FCST_T: null, // 数值预报>温度场
    NUM_FCST_TWVF: null, // 数值预报>水汽通量
    NUM_FCST_TWVF_DIV: null, // 数值预报>水汽通量散度
    NUM_FCST_CLOUDAGE: null, // 数值预报>云量
    NUM_FCST_SUM_CLOUDAGE: null, // 数值预报>总云量
    NUM_FCST_LOW_CLOUDAGE: null, // 数值预报>低云量
    NUM_FCST_CAPE: null, // 数值预报>对流有效位能
    NUM_FCST_K: null, // 数值预报>K指数

    
    RADAR_BASIC: null, //基本产品
    RADAR_PHYSCIS: null, // 物理量产品
    RADAR_WIND: null, // 风场产品
    RADAR_DISTINGUISH: null, // 识别产品

    REFLECTIVITY_INTENSITY: null, // 反射率强度 滤波后反射率
    // FILTERED_REFLECTIVITY: null, // 滤波后反射率
    // RADIAL_VELOCITY: null, // 径向速度
    // SPECTRUM_WIDTH: null, // 谱宽
    // LINEAR_DEPOLARIZATION_RATIO: null, // 线性退极化比
    DIFFERENTIAL_REFLECTIVITY_FACTOR: null, // 差分反射率因子
    CO_CORRELATION_COEFFICIENT: null, // 协相关系数
    DIFFERENTIAL_PHASE_SHIFT: null, // 差分相移
    DIFFERENTIAL_PHASE_SHIFT_RATE: null, // 差分相移率

    // ET: null, // 回波顶高(ET)
    // EB: null, // 回波底高(EB)
    // CR: null, // 组合反射率(CR)
    // VIL: null, // 垂直积累液态水含量
    // RZ: null, // 雨强(RZ)
    // NHP: null, // 1/3小时累积降雨量
    // MAX: null, // 最大反射率
    HCL:null,
    QPE:null, // 雨强
    HeavyHailPr:null,
    MAXHAILD:null,
    WIND_FIELD_PROFILE: null, // 三维风流场
    WIND_FIELD_3D: null, // 三维风场剖面
    BASE_WIND_DVS: null,  // 基于三维风场的散变、涡度、切变
    
    HI: null, // 冰雹指数
    MESOSCALE_CYCLONE_IDENTIFICATION: null, // 中尺度气旋识别
    STI: null, // 风暴识别追踪预报
    CHP: null, // 水凝物粒子分类

}

for (const key in CONST) {
    CONST[key] = key
}


CONST = new Proxy(CONST, {
    get(target, propKey) {
        if (propKey in target) {
            return target[propKey]
        }
        throw new ReferenceError(`There is no property named "${propKey}" on the CONST object`)
    }
})


CONST = Object.freeze(CONST)

export default CONST

