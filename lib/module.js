const { resolve } = require('path')

export default function (moduleOptions) {

    const {
      options: { hcaptcha = {} },
      addPlugin,
      addTemplate
    } = this;

    const options = { ...moduleOptions, ...hcaptcha, }

    addPlugin({
      fileName: 'hcaptcha.js',
      options,
      src: resolve(__dirname, 'plugin.js')
    })

    addTemplate({
      fileName: 'hcaptcha.vue',
      src: resolve(__dirname, 'hcaptcha.vue')
    })

}