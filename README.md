<p align="center">
  <a target="_blank" href="https://www.hcaptcha.com">
    <img
      height="80"
      style="padding:10px"
      alt="HCaptcha logo"
      src="assets/logos/hcaptcha.svg"
    >
  </a>
  <a target="_blank" href="https://nuxtjs.org">
    <img
      height="80"
      style="padding:10px"
      alt="Nuxt logo"
      src="assets/logos/nuxt.svg"
    >
  </a>
</p>

# nuxt-hcaptcha

> this package is in development and should not be used yet.

hCaptcha module for Nuxt.js.


## Development Status <prototype>

- **Immediate Goals**
  - Something
- **Coming Soon**
  - Something


## Installation

- Add dependency to your project

```**shell**
npm i nuxt-hcaptcha
```
 
- Add module to nuxt and configure it providing inline options

```js
// nuxt.config.js
{
  modules: [
    [
      'nuxt-hcaptcha', {
        /* hCaptcha options */
      }
    ],
  ]
}
```

- Or using top-level options

```js
{
  modules: [
    'nuxt-hcaptcha',
  ],

  hcaptcha: {
    /* hCaptcha options */
  },
}
```

## Usage

```html
<template></template>

<script>
export default {}
</script>
```

## Something

lorem ipsum

```html
<template></template>

<script>
export default {}
</script>
```

---

This package was inspired by [@nuxtjs/recaptcha](https://github.com/nuxt-community/recaptcha-module/)