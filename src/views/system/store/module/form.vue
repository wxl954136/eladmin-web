<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    :before-close="crud.cancelCU"
    :visible="crud.status.cu > 0"
    :title="crud.status.title"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="id" prop="id" hidden >
        <el-input v-model="form.id" style="width: 370px;"  />
      </el-form-item>
      <el-form-item label="key" prop="keywords"  hidden>
        <el-input v-model="form.keywords" style="width: 370px;" />
      </el-form-item>

      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input
          v-model.trim="form.name"
          ref="input"
          style="width: 370px;">
              <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
        </el-input>
      </el-form-item>
      <el-form-item
        label="排序"
        prop="sort"
      >
        <el-input-number
          v-model.number="form.sort"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item
        label="所属部门"
        prop="dept.id"
        :rules="rules.dept"
      >
        <treeselect
          v-model="form.dept.id"
          :options="depts"
          style="width: 370px"
          placeholder="选择部门"
        />
      </el-form-item>


      <el-form-item
        label="状态"
        prop="enabled"
      >
        <el-radio
          v-for="item in jobStatus"
          :key="item.id"
          v-model="form.enabled"
          :label="item.value === 'true'"
        >
          {{ item.label }}
        </el-radio>
      </el-form-item>

      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          type = "textarea"
          v-model.trim="form.remark"
          :autosize="{ minRows: 2, maxRows: 4}"
          style="width: 370px;"
        >
        <i slot="suffix" class="el-input__icon  el-icon-edit"></i>
        </el-input>
      </el-form-item>
      <!--

   EL官网说明 https://cloud.tencent.com/developer/section/1489871
-->

    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="text"
        @click="crud.cancelCU"
      >
        取消
      </el-button>
      <el-button
        :loading="crud.status.cu === 2"
        type="primary"
        @click="crud.submitCU"
      >
        确认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import CRUD, { form } from '@crud/crud'
import { getDepts } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'


const defaultForm = {
  id: null,
  name: '',
  sort: 999,
  enabled: true,
  store: {
    id: 1
  },
  dept: {
    id: null
  },
  isDelete:0,
  remark:"",
  version:0,
  keywords:null,
  topCompanyCode:null
}
export default {
  components: { Treeselect },
  mixins: [form(defaultForm)],
  props: {
    jobStatus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      depts: [],  //部门值集合
      rules: {
        name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入序号', trigger: 'blur', type: 'number' }
        ] ,
        dept: { required: true, message: '所属部门不能为空', trigger: 'select' }
      }
    }
  },

  methods: {
    sayHello() {
    },
    /*
    submitCU_me(){
      this.crud.submitCU()
      //提交后回调获得焦点
      this.$nextTick(function () {
        this.$refs.input.focus();
      })
    },
    */
    [CRUD.HOOK.beforeToCU]() {
  //新增时执行
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    [CRUD.HOOK.afterToCU]() {
        //lukeWang：当点击添加按钮时，光标注处于文本尾处 ,一定要放到afterToCU,否则defautForm值还未赋值，仅是DOM元素加载
        this.$nextTick(function () {
            this.$refs.input.focus();
            //this.$refs.input.select();  //文本全选中状态
            length = this.$refs.input.length;
            this.$refs.input.selectionStart = length;
            this.$refs.input.selectionEnd = length;

        })
    },
    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (!this.form.dept.id) {
        this.$notify({
          title: '所属部门不能为空',
          type: 'warning'
        })
        return false
      }

      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
