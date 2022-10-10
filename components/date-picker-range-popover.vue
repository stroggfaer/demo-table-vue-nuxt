<template>
  <el-popover
    placement="bottom"
    trigger="manual"
    v-model="visible">
    <div class="dateRange" >
      <div class="title-popover"><b v-if="title" v-html="title"></b></div>
      <v-date-picker
        :value="dateRangeValue"
        :attributes="attributes"
        ref="datePicker"
        :columns="2"
        is-range
        @drag="handleDragValue"
        :select-attribute="setAttributes"
        :drag-attribute="setAttributes"
        :masks="{ input: this.formatDte }"
      >
      </v-date-picker>
      <el-button :loading="loading" type="primary" size="small"  @click="handleDateRangeSave" :disabled="validBtn">Сохранить</el-button>
    </div>
    <div slot="reference" @click="handleShow" class="dateRange">
      <slot name="value-title"></slot>
    </div>
  </el-popover>

</template>

<script>
import {headerRangeDays, isMinMaxRangeDays} from "../core_table/utils";

export default {
  props: {
    title: { type: String },
    dateRange:  { type: Object},
    loading: { type: Boolean },
    disabled: { type: Boolean, default: false },
    formatDte: { type: String, default: 'YYYY-MM-DD' },
    visiblePopover: { type: Boolean, default: false },

  },
  data() {
    return {
      visible: false,
      dateRangeValue: {
        start: null,
        end: null
      },
      attributes: [],

      //
      setAttributes: null,
      disabledBtn: false
    }
  },
  computed: {
    validBtn() {
      return this.disabledBtn || !Boolean(this.dateRangeValue.start && this.dateRangeValue.end)
    }
  },
  methods: {
    /*TODO: style calendar range*/
    styleCalendar(prefix = 'blue') {
      return {
        highlight: {
          start: {
            class: `${prefix}-highlight highlight-start`,
            contentClass: `${prefix}-highlight-text-white`,
          },
          base: { class: `${prefix}-highlight`},
          end: {
            class: `${prefix}-highlight highlight-end`,
            contentClass: `${prefix}-highlight-text-white`
          },
        },
      }
    },

    handleDragValue(e) {
      const {start, end} = e
      const isRange = isMinMaxRangeDays(start, end);

      this.setAttributes = !isRange ? this.styleCalendar('red') : this.styleCalendar();
      this.disabledBtn =!isRange
    },
    // Отправить;
    handleDateRangeSave(e) {
      const calendar = this.$refs.datePicker;
      this.dateRangeValue.start = calendar.inputValues[0]
      this.dateRangeValue.end = calendar.inputValues[1]
      const isRange = isMinMaxRangeDays(this.dateRangeValue.start, this.dateRangeValue.end,);
      this.$emit('on-btn-save', {date: this.dateRangeValue, isRange });
    },
    handleShow() {
      this.visible = !this.visible
      this.$emit('on-visible', this.visible);
    },
    headerRangeDays,
  },
  created() {
    if(this.dateRange) this.dateRangeValue = this.dateRange;
    this.setAttributes = this.styleCalendar();
  },
  mounted() {
    if(this.dateRange) {
       this.disabledBtn = this.disabled
    }else{
      this.disabledBtn = true;
    }

     this.visible = this.visiblePopover;
  },
  watch: {
    dateRange(v) {
      this.dateRangeValue = v;
    },
    visiblePopover(v) {
      this.visible = v;
      this.$emit('on-visible', v);
    }
  }
}
</script>

<style scoped lang="scss">
.title-popover {
  font-size: 16px;
  margin-bottom: 10px;
  margin-top: 10px;
}
.dateRange {
  cursor: pointer;
  //width: 270px;
}
/* календар  */
.mount__com {
  font-family: 'Gilroy';
  border: none;
  :deep(.vc-weeks) {
    display: none;
  }
  :deep(.vc-arrow) {
    &:hover {
      background: transparent;
    }
  }
  :deep(.vc-pane) {
    min-width: 200px;
  }
  :deep(.vc-arrows-container) {
    .vc-arrow {
      @include ease();
      opacity: 0.9;
      svg path {
        fill: #000;
      }
      &:hover {
        opacity: 0.4;
        background: transparent;
      }
    }

  }
  :deep(.vc-title) {
    text-transform: capitalize;
  }

}
</style>
