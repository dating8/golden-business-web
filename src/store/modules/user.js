import {getStore, setStore} from '@/util/store'
import {isURL} from '@/util/validate'
import {getUserInfo, loginByUsername, logout, refreshToken, getObj} from '@/api/login'
import {deepClone, encryption} from '@/util/util'
import webiste from '@/const/website'
import {GetMenu} from '@/api/admin/menu'

function addPath(ele, first) {
  const propsConfig = webiste.menu.props
  const propsDefault = {
    label: propsConfig.label || 'label',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  }
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0
  if (!isChild && first) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
    return
  }
  ele[propsDefault.children].forEach(child => {
    if (!isURL(child[propsDefault.path])) {
      child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path] ? child[propsDefault.path] : 'index'}`
    }
    addPath(child)
  })
}

const user = {
  state: {
    userInfo: {},
    businessUserInfo: {},
    siteInfo: {},
    portal: {},
    permissions: {},
    roles: [],
    menu: getStore({
      name: 'menu'
    }) || [],
    menuAll: [],
    expires_in: getStore({
      name: 'expires_in'
    }) || '',
    access_token: getStore({
      name: 'access_token'
    }) || '',
    refresh_token: getStore({
      name: 'refresh_token'
    }) || ''
  },
  actions: {
    //获取平台信息
    getPortal({commit},protocol) {
    	return new Promise((resolve, reject) => {
    	  getObj(protocol.siteId).then((res) => {
    	    const data = res.data.data || {}
          if(!data.bizBgImageUrl){
            data.bizBgImageUrl = '/img/bg.png'
          }
          // data.logoUrl = data.logoUrl || '/img/logo.png'
    	    commit('SET_PORTAL', data)
    	    resolve(data)
    	  }).catch((err) => {
          return
    	    // reject()
    	  })
    	})
    },
    // 根据用户名登录
    LoginByUsername({commit}, userInfo) {
      const user = encryption({
        data: userInfo,
        key: 'thanks,pig4cloud',
        param: ['password']
      })
      return new Promise((resolve, reject) => {
        loginByUsername(user.username, user.password, user.code, user.randomStr).then(response => {
          const data = response.data
          commit('SET_ACCESS_TOKEN', data.access_token)
          commit('SET_REFRESH_TOKEN', data.refresh_token)
          commit('SET_EXPIRES_IN', data.expires_in)
          commit('CLEAR_LOCK')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetUserInfo({commit}) {
      return new Promise((resolve, reject) => {
        getUserInfo().then((res) => {
          const data = res.data.data || {}
          if(!data.siteInfo.siteLogoUrl){
            data.siteInfo.siteLogoUrl = '/img/logo.png'
          }
          commit('SET_USERIFNO', data.sysUser)
          commit('SET_ROLES', data.roles || [])
          commit('SET_PERMISSIONS', data.permissions || [])
          commit('SET_BUSINESSUSERINFO', data.businessUserInfo)//新增商家信息
          commit('SET_SITEINFO', data.siteInfo)//新增平台信息

          resolve(data)
        }).catch((err) => {
          reject()
        })
      })
    },
    // 刷新token
    RefreshToken({commit, state}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refresh_token).then(response => {
          const data = response.data
          commit('SET_ACCESS_TOKEN', data.access_token)
          commit('SET_REFRESH_TOKEN', data.refresh_token)
          commit('SET_EXPIRES_IN', data.expires_in)
          commit('CLEAR_LOCK')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({commit}) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_MENU', [])
          commit('SET_PERMISSIONS', [])
          commit('SET_USER_INFO', {})
          commit('SET_ACCESS_TOKEN', '')
          commit('SET_REFRESH_TOKEN', '')
          commit('SET_EXPIRES_IN', '')
          commit('SET_ROLES', [])
          commit('DEL_ALL_TAG')
          commit('CLEAR_LOCK')
          commit('SET_BUSINESS_USER_INFO', {})//新增商家信息
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 注销session
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_MENU', [])
        commit('SET_PERMISSIONS', [])
        commit('SET_USER_INFO', {})
        commit('SET_ACCESS_TOKEN', '')
        commit('SET_REFRESH_TOKEN', '')
        commit('SET_ROLES', [])
        commit('DEL_ALL_TAG')
        commit('CLEAR_LOCK')
        commit('SET_BUSINESS_USER_INFO', {})//新增商家信息
        resolve()
      })
    },
    // 获取系统菜单
    GetMenu({
              commit
            }) {
      return new Promise(resolve => {
        GetMenu().then((res) => {
          const data = res.data.data
          let menu = deepClone(data)
          menu.forEach(ele => {
            addPath(ele)
          })
          commit('SET_MENU', menu)
          resolve(menu)
        })
      })
    }

  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      })
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in
      setStore({
        name: 'expires_in',
        content: state.expires_in,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      })
    },
    SET_USERIFNO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    //新增商家信息
    SET_BUSINESSUSERINFO: (state, businessUserInfo) => {
      state.businessUserInfo = businessUserInfo
    },
    //新增平台信息
    SET_SITEINFO: (state, siteInfo) => {
      state.siteInfo = siteInfo
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({
        name: 'menu',
        content: state.menu,
        type: 'session'
      })
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true
      }
      state.permissions = list
    },
    //新增平台信息存储
    SET_PORTAL: (state, portal) => {
      state.portal = portal
    }
  }

}
export default user
