<template>
  <el-form ref="formRef" :model="model" :rules="rules" :label-width="options.labelWidth || '120px'">
    <el-row>
      <el-col
        v-for="item in options.list.filter(item => {
          return item.type && item.onlyEditShow ? edit : true && !item.hidden;
        })"
        :span="item.span || options.span || 24"
        :xs="item.xs || options.xs || 24"
        :sm="item.sm || options.sm || 24"
        :md="item.md || options.md || 24"
        :lg="item.lg || options.lg || item.span || options.span || 8"
        :xl="item.xl || options.xl || item.span || options.span || 6"
        :offset="item.offset || 0"
        :key="item.prop"
        v-bind="item.colBind"
      >
        <el-form-item
          v-if="item.type && item.onlyEditShow ? edit : true"
          :label="item.label"
          :prop="item.prop"
          :rules="item.rules"
        >
          <!-- 文本框、数字框、下拉框、日期框、开关、上传 -->
          <el-input
            v-if="item.type === 'input'"
            :modelValue="getModel(model, item.prop)"
            @update:modelValue="e => setModel(model, item.prop, e)"
            :disabled="disables.includes(item.prop)"
            clearable
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
          ></el-input>
          <!-- v-bind必须写在最后才能覆盖默认值 -->
          <el-input
            v-if="item.type === 'textarea'"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            clearable
            :rows="3"
            :modelValue="getModel(model, item.prop)"
            @update:modelValue="e => setModel(model, item.prop, e)"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
            :disabled="disables.includes(item.prop)"
          ></el-input>
          <el-input-number
            v-else-if="item.type === 'number'"
            controls-position="right"
            :modelValue="getModel(model, item.prop)"
            @update:modelValue="e => setModel(model, item.prop, e)"
            :disabled="disables.includes(item.prop)"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
          >
            <template #suffix>
              <span v-if="item?.suffix">{{ item?.suffix }}</span>
            </template>
          </el-input-number>
          <el-select
            v-else-if="item.type === 'select'"
            clearable
            :modelValue="getModel(model, item.prop)"
            @update:modelValue="e => setModel(model, item.prop, e)"
            :disabled="disables.includes(item.prop)"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
          >
            <el-option
              v-for="option in item.options"
              :key="option?.label"
              :label="option?.label"
              :value="option?.value"
              :disabled="option?.disabled"
            ></el-option>
          </el-select>
          <el-cascader
            v-else-if="item.type === 'cascader'"
            v-model="model[item.prop]"
            :options="item.options"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
          />
          <el-date-picker
            v-else-if="item.type === 'date' || item.type === 'datetime'"
            :modelValue="getModel(model, item.prop)"
            @update:modelValue="e => setModel(model, item.prop, e)"
            :type="item.type"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
            :disabled="disables.includes(item.prop)"
          ></el-date-picker>
          <DatePickerRange
            v-else-if="item.type === 'daterange'"
            v-model:start="model[item.prop_start!]"
            v-model:end="model[item.prop_end!]"
            :format="item.formatter"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
            :disabled="disables.includes(item.prop)"
          />
          <el-switch
            v-else-if="item.type === 'switch'"
            :modelValue="getModel(model, item.prop)"
            @update:modelValue="e => setModel(model, item.prop, e)"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
            :disabled="disables.includes(item.prop)"
          />
          <el-radio-group
            v-else-if="item.type === 'radio'"
            :modelValue="getModel(model, item.prop)"
            @update:modelValue="e => setModel(model, item.prop, e)"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
            :disabled="disables.includes(item.prop)"
          >
            <el-radio v-for="radio in item.options" :value="radio.value" :key="radio.label">
              {{ radio.label }}
            </el-radio>
          </el-radio-group>

          <Uploader
            v-else-if="item.type === 'upload'"
            v-model="model"
            :formOption="item"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
            :disabled="disables.includes(item.prop)"
          />
          <el-rate
            v-else-if="item.type === 'rate'"
            :modelValue="getModel(model, item.prop)"
            @update:modelValue="e => setModel(model, item.prop, e)"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :disabled="disables.includes(item.prop)"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
          />
          <div v-else-if="item.type === 'string'">
            <span v-if="item.formatter">{{ item.formatter(model[item.prop]) }}</span>
            <span v-else>{{ model[item.prop] }}</span>
          </div>
          <RichTextEditor
            v-else-if="item.type === 'richtext'"
            :modelValue="getModel(model, item.prop)"
            @update:modelValue="e => setModel(model, item.prop, e)"
            :disabled="disables.includes(item.prop)"
            v-bind="item.bind"
            v-on="transformVOn(item.on, model)"
          />
          <slot v-else-if="item.type === 'slot'" :name="item.prop" :item="item" :form="model"></slot>
        </el-form-item>
      </el-col>
    </el-row>
    <div v-if="!hideBtn" class="flex justify-center">
      <el-button type="primary" @click="_handleSubmit(formRef)">保 存</el-button>
      <el-button @click="_handleCancel()">取 消</el-button>
    </div>
    <slot name="footer" :form="model" :formRef="formRef"></slot>
  </el-form>
</template>

<script lang="ts" setup>
import { FormOption } from '@/types/form-option';
import { FormInstance, FormRules } from 'element-plus';
import { defineAsyncComponent, PropType, ref } from 'vue';
import Uploader from '@/components/Uploader/index.vue';
import { transformVOn } from '@/utils/index';
import _ from 'lodash';
import DatePickerRange from '@/components/ElementPlus/DatePickerRange.vue';

const RichTextEditor = defineAsyncComponent(() => import('@/components/RichtextEditor/index.vue'));

const model = defineModel({
  required: true,
  type: Object as PropType<Record<string, any>>,
  default: {},
});
const { options, edit, submit, cancel } = defineProps({
  options: { type: Object as PropType<FormOption>, required: true },
  edit: { type: Boolean, required: false },
  /** 提交方法 */
  submit: { type: Function, required: false, default: () => {} },
  /** 取消回调 */
  cancel: { type: Function, required: false, default: () => {} },
  hideBtn: { type: Boolean, required: false, default: false },
  disables: { type: Array, required: false, default: [] },
});

const rules: FormRules = options.list
  .map(item => {
    if (item.required) {
      return {
        [item.prop]: [{ required: true, message: `${item.label}不能为空`, trigger: 'blur' }],
      };
    }
    return {};
  })
  .reduce((acc, cur) => ({ ...acc, ...cur }), {});

const formRef = ref<FormInstance>();
const _handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid: boolean) => {
    if (!valid) return false;
    await submit(model.value, formEl);
    resetForm(formEl);
  });
};

//  取消
const _handleCancel = () => {
  resetForm(formRef.value);
  cancel();
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const getModel = (form: any, prop: string) => {
  return _.get(form, prop);
};

const setModel = (form: any, prop: string, val: any) => {
  _.set(form, prop, val);
};
</script>

<style scope lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: var(--el-card-border-radius);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.el-date-editor.el-input {
  width: 100%;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.el-dialog__body {
  padding-right: 20px;
}
</style>
