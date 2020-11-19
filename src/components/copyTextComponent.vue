<template>
  <span
    title="yo"
    class="copy"
    v-clipboard="text"
    v-clipboard:success="clipboardSuccessHandler"
    v-tooltip.bottom="{ content: 'copied', trigger: 'manual', show: isOpen }">
    {{ showingText }}
  </span>
</template>

<script scoped>
export default {
  name: "CopyText",
  data() {
    return {
      isOpen: false
    }
  },
  props: {
    showingText: String,
    text: String
  },
  methods: {
    clipboardSuccessHandler() {
      let self = this
      if (!self.isOpen) {
        self.isOpen = true
        setTimeout(() => { self.isOpen = false } , 500)
      }
    }
  }
}
</script>

<style scoped>
  span {
    cursor: pointer;
    font-weight: bold;
  }

  span:hover {
    text-decoration: underline;
  }
</style>
