<template>
  <el-card class="app-container">
    <el-row type="flex" justify="space-between" align="middle">
      <!--? before -->
      <el-col>
        <div v-if="showBefore" class="before">
          <i class="el-icon-info"></i>
          <slot name="before" />
        </div>
  
      </el-col>
      <!--? after -->
      <el-col>
        <!--? 后面又是一行 可能还有多个按钮 使用el-row -->
        <el-row type="flex" justify="center" align="middle">
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools',
  props: {
    showBefore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style lang='scss'>
 .page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>