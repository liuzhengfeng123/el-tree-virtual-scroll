<template>
  <label
    class="el-checkbox"
    :class="[
      border && checkboxSize ? 'el-checkbox--' + checkboxSize : '',
      {'is-disabled': isDisabled},
      {'is-bordered': border},
      {'is-checked': isChecked}
    ]"
    :id="id"
  >
    <span
      class="el-checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate,
        'is-focus': focus
      }"
      :tabindex="indeterminate ? 0 : false"
      :role="indeterminate ? 'checkbox' : false"
      :aria-checked="indeterminate ? 'mixed' : false"
    >
      <span class="el-checkbox__inner"></span>
      <input
        ref="input"
        class="el-checkbox__original"
        type="checkbox"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :disabled="isDisabled"
        :value="label"
        :name="name"
        v-model="model"
        @change="handleChange"
        @focus="focus = true"
        @blur="focus = false"
      />
    </span>
    <span class="el-checkbox__label" v-if="$slots.default || label">
      <slot></slot>
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </label>
</template>
<script>

export default {
  name: "ElCheckbox",

  inject: {
    elForm: {
      default: ""
    }
  },

  componentName: "ElCheckbox",

  data() {
    return {
      selfModel: false,
      focus: false,
    }
  },

  computed: {
    model: {
      get() {
        return this.value !== undefined ? this.value : this.selfModel
      },

      set(val) {
        this.$emit("input", val)
        this.selfModel = val
      }
    },

    isChecked() {
      return this.model
    },

    isDisabled() {
      return this.disabled
    },

    checkboxSize() {
      return this.size || (this.$ELEMENT || {}).size
    }
  },

  props: {
    value: {},
    label: {},
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    id: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/,
    controls: String /* 当indeterminate为真时，为controls提供相关连的checkbox的id，表明元素间的控制关系*/,
    border: Boolean,
    size: String
  },

  methods: {
    addToStore() {
      this.model = true
    },
    handleChange(ev) {
      let value
      if (ev.target.checked) {
        value = true
      } else {
        value = false
      }
      this.$emit("change", value, ev)
    }
  },

  created() {
    this.checked && this.addToStore()
  },
  mounted() {
    // 为indeterminate元素 添加aria-controls 属性
    if (this.indeterminate) {
      this.$el.setAttribute("aria-controls", this.controls)
    }
  },
}
</script>
