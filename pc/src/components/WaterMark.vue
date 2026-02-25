<template>
  <div class="rt-view">
    <rt-view v-if="contentHtml" />
  </div>
</template>

<script>

  let vm = {}

  class ViewElement extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }
    connectedCallback() {
      // html
      const htmlText = document.createElement('div')
      htmlText.setAttribute('id', 'rt_view')
      htmlText.innerHTML = vm.contentHtml

      // append
      this.shadowRoot.appendChild(htmlText)

    }
    disconnectedCallback() {
      this.shadowRoot.querySelectorAll('img').forEach(item => {
        item.removeEventListener('click', null)
      })
    }
  }

  export default {
    name: 'RbRichTextView',
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    watch: {
      content: {
        handler(e) {
          this.contentHtml = ''
          if (e) {
            this.contentHtml = e
          }
        },
        immediate: true
      }
    },
    data() {
      return {
        contentHtml: '',
      }
    },
    created() {
      vm = this
      if (!customElements.get('rt-view')) {
        customElements.define('rt-view', ViewElement)
      }
    },
    methods: {
      
    }
  }
</script>

<style lang="less" scoped>
  .rt-view {
    word-break: break-all;
    ::v-deep {
      .el-image__inner,
      .el-image__error {
        display: none;
      }
    }
  }
</style>
</style>
