<template>
  <div>
    <el-input placeholder="Please input" v-model.lazy="input"></el-input>
  </div>
</template>

<script>
export default {
  props: ['row', 'col', 'index', 'value'],
  data() {
    return {
      input: ''
    }
  },
  mounted() {
   console.log(this.index)
    console.log('row: ',this.row)
    console.log('col: ',this.col)
    console.log('value: ',this.value)
    this.input = this.value
  },
  watch: {
    input(v) {
      this.$emit('on-value',v);
    }
  }
}
</script>

<style scoped>

</style>
