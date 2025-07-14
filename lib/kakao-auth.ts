// 카카오 로그인 직접 구현
export const kakaoAuth = {
  // 카카오 초기화
  init() {
    if (typeof window !== 'undefined' && window.Kakao) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_APP_KEY)
    }
  },

  // 카카오 로그인
  async login() {
    if (typeof window === 'undefined' || !window.Kakao) {
      throw new Error('Kakao SDK not available')
    }

    return new Promise((resolve, reject) => {
      window.Kakao.Auth.login({
        success: (authObj: any) => {
          console.log('Kakao login success:', authObj)
          resolve(authObj)
        },
        fail: (err: any) => {
          console.error('Kakao login failed:', err)
          reject(err)
        }
      })
    })
  },

  // 카카오 사용자 정보 가져오기
  async getUserInfo() {
    if (typeof window === 'undefined' || !window.Kakao) {
      throw new Error('Kakao SDK not available')
    }

    return new Promise((resolve, reject) => {
      window.Kakao.API.request({
        url: '/v2/user/me',
        success: (res: any) => {
          console.log('Kakao user info:', res)
          resolve(res)
        },
        fail: (err: any) => {
          console.error('Failed to get Kakao user info:', err)
          reject(err)
        }
      })
    })
  },

  // 카카오 로그아웃
  logout() {
    if (typeof window !== 'undefined' && window.Kakao) {
      window.Kakao.Auth.logout()
    }
  }
}

// 전역 타입 선언
declare global {
  interface Window {
    Kakao: any
  }
} 