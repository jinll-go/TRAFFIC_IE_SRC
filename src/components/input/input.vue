<template>
  <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input']">
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <!-- input 图标 
      <slot name="icon">
        <i class="el-input__icon"
          :class="[
            'el-icon-' + icon,
            onIconClick ? 'is-clickable' : ''
          ]"
          v-if="icon"
          @click="handleIconClick">
        </i>
      </slot>-->
      <input
        v-if="type !== 'textarea'"
        class="textv w100"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :autocomplete="autoComplete"
        :autofocus="autofocus"
        :min="min"
        :max="max"
        :step="step"
        :form="form"
        :value="currentValue"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      >
      <i class="el-input__icon el-icon-loading" v-if="validating"></i>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      class="el-textarea-inner textc"
      :value="currentValue"
      @input="handleInput"
      @keyup.delete="handleInput"
      ref="textarea"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="textareaStyle"
      :readonly="readonly"
      :rows="rows"
      :form="form"
      direction="right"
      :autofocus="autofocus"
      :maxlength="maxlength"
      :minlength="minlength"
      @focus="handleFocus"
      @blur="handleBlur">
    </textarea>
  </div>
</template>
<script>
 
  import calcTextareaHeight from './calcTextareaHeight';
 // import merge from 'element-ui/src/utils/merge';

  export default {
    name: 'CVInput',

    componentName: 'CVInput',

  //  mixins: [emitter],

    data() {
      return {
        currentValue: this.value,
        textareaCalcStyle: {}
      };
    },

    props: {
      value: [String, Number],
      placeholder: String,
      size: String,
      resize: String,
      readonly: Boolean,
      autofocus: Boolean,
      icon: String,
      disabled: Boolean,
      type: {
        type: String,
        default: 'text'
      },
      name: String,
      autosize: {
        type: [Boolean, Object],
        default: false
      },
      rows: {
        type: Number,
        default: 2
      },
      autoComplete: {
        type: String,
        default: 'off'
      },
      form: String,
      maxlength: Number,
      minlength: Number,
      max: {},
      min: {},
      step: {},
      validateEvent: {
        type: Boolean,
        default: true
      },
      onIconClick: Function
    },

    computed: {
      validating() {
        return this.$parent.validateState === 'validating';
      },
      textareaStyle() {
        return this.textareaCalcStyle;
      }
    },

    watch: {
      'value'(val, oldValue) {
        this.setCurrentValue(val);
      }
    },

    methods: {
      handleBlur(event) {
        this.$emit('blur', event);
        //if (this.validateEvent) {
          //this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
        //}
      },
      inputSelect() {
        this.$refs.input.select();
      },
      resizeTextarea() {

        if (this.$isServer) return;
        var { autosize, type } = this;
        if (!autosize || type !== 'textarea') return;
        const minRows = autosize.minRows;
        const maxRows = autosize.maxRows;
     
        this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    
      },
      handleFocus(event) {
        this.$emit('focus', event);
      },
      handleInput(event) {
        const value = event.target.value;
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('change', value);
      }/*,
      handleIconClick(event) {
        if (this.onIconClick) {
          this.onIconClick(event);
        }
        this.$emit('click', event);
      }*/,
      setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.$nextTick(_ => {
          this.resizeTextarea();
        });
        this.currentValue = value;
        //if (this.validateEvent) {
        // this.dispatch('ElFormItem', 'el.form.change', [value]);
        //}
      }
    },

    created() {
      this.$on('inputSelect', this.inputSelect);
    },

    mounted() {
      this.resizeTextarea();
    }
  };
</script>
<style scoped>

  .el-input {
    width:180px;
  }

  .el-textarea{
    display: inline-block;
    vertical-align: bottom;
    width:180px;
  }

  .el-textarea-inner {
    display: block;
    resize: vertical;
    padding: 5px 7px;
    line-height: 1.5;
    box-sizing: border-box;
    width: 100%;
    border-radius: 4px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
      
</style>