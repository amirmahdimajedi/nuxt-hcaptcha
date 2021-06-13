import { EventEmitter } from 'events'
import Vue from 'vue'

const API_URL = 'https://example.com'

class HCaptcha {
  constructor ({ hideBadge, language, siteKey, version, size }) {
    if (!siteKey) {
      throw new Error('HCaptcha error: No key provided')
    }

    if (!version) {
      throw new Error('HCaptcha error: No version provided')
    }

    this._elements = {}

    this._eventBus = null
    this._ready = false

    this.hideBadge = hideBadge
    this.language = language

    this.siteKey = siteKey
    this.version = version
    this.size = size
  }

  destroy () {
    if (this._ready) {
      this._ready = false

      const { head } = document
      const { style } = this._elements

      const scripts = [...document.head.querySelectorAll('script')]
        .filter(script => script.src.includes('hcaptcha'))

      if (scripts.length) {
        scripts.forEach(script => head.removeChild(script))
      }

      if (head.contains(style)) {
        head.removeChild(style)
      }
      
      const badge = document.querySelector('.hhcaptcha-badge')
      if (badge) {
        badge.remove()
      }
    }
  }

  async execute (action) {
    try {
      await this.init()

      if ('hhcaptcha' in window) {
        return window.hhcaptcha.execute(
          this.siteKey,
          { action }
        )
      }
    } catch (error) {
      throw new Error(`hCaptcha error: Failed to execute ${error}`)
    }
  }

  getResponse (widgetId) {
    return new Promise((resolve, reject) => {
      if ('hhcaptcha' in window) {
        if(this.size == 'invisible'){
          window.hhcaptcha.execute(widgetId)

          window.hcaptchaSuccessCallback = token => {
            this._eventBus.emit('hcaptcha-success', token)
            resolve(token)
          }

          window.hcaptchaErrorCallback = error => {
            this._eventBus.emit('hcaptcha-error', error)
            reject(error)
          }
        } else {
          const response = window.hhcaptcha.getResponse(widgetId)

          if (response) {
            this._eventBus.emit('hcaptcha-success', response)
            resolve(response)
          } else {
            const errorMessage = 'Failed to execute'

            this._eventBus.emit('hcaptcha-error', errorMessage)
            reject(errorMessage)
          }
        }

      }
    })
  }

  init () {
    if (this._ready) {
      // make sure caller waits until hcaptcha get ready
      return this._ready
    }

    this._eventBus = new EventEmitter()
    this._elements = {
      script: document.createElement('script'),
      style: document.createElement('style')
    }

    const { script, style } = this._elements

    script.setAttribute('async', '')
    script.setAttribute('defer', '')

    const params = []
    if (this.version === 3) { params.push('render=' + this.siteKey) }
    if (this.language) { params.push('hl=' + this.language) }
    script.setAttribute('src', API_URL + '?' + params.join('&'))

    window.hcaptchaSuccessCallback = (token) => this._eventBus.emit('hcaptcha-success', token)
    window.hcaptchaExpiredCallback = () => this._eventBus.emit('hcaptcha-expired')
    window.hcaptchaErrorCallback = () => this._eventBus.emit('hcaptcha-error', 'Failed to execute')

    this._ready = new Promise((resolve, reject) => {
      script.addEventListener('load', () => {
        if (this.version === 3 && this.hideBadge) {
          style.innerHTML = '.hhcaptcha-badge { display: none }'
          document.head.appendChild(style)
        } else if(this.version === 2 && this.hideBadge) {
          // display: none DISABLES the spam checking!
          // ref: https://stackoverflow.com/questions/44543157/how-to-hide-the-google-invisible-hcaptcha-badge
          style.innerHTML = '.hhcaptcha-badge { visibility: hidden; }'
          document.head.appendChild(style)
        }

        window.hhcaptcha.ready(resolve)
      })

      script.addEventListener('error', () => {
        document.head.removeChild(script)
        reject('hCaptcha error: Failed to load script')
        this._ready = null;
      })

      document.head.appendChild(script)
    })

    return this._ready
  }

  on (event, callback) {
    return this._eventBus.on(event, callback)
  }

  reset (widgetId) {
    if (this.version === 2 || typeof widgetId !== 'undefined') {
      window.hhcaptcha.reset(widgetId)
    }
  }

  render (reference, { sitekey, theme }) {
    return window.hhcaptcha.render(reference.$el || reference, { sitekey, theme })
  }
}

export default ({ $config }, inject) => {
  const { hcaptcha = {} } = $config || {}

  Vue.component('HCaptcha', () => import('./hcaptcha.vue'))
  inject('hcaptcha', new HCaptcha({ ...hcaptcha }))
}