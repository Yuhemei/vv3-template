<!--
 * @Description: TableEdit使用模板
-->
<script setup lang="ts">
import TableEdit from '@/components/Table/TableEdit.vue';
import { useTableEdit } from './index.ts';
import { ref } from 'vue';
const { formOptions, formInitData } = useTableEdit();
const formData = ref({ ...formInitData });

/** 表单整体校验 */
const formRules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
});
</script>
<template>
  <div class="container">
    <TableEdit v-model:model-value="formData" :options="formOptions" v-bind="{ rules: formRules }" />
  </div>
</template>
