<template>
  <div class="questionBox">
    <a-tabs @change="handleTabChange">
      <a-tab-pane key="onlist" tab="待审核"></a-tab-pane>
      <a-tab-pane key="reject" tab="已拒绝"></a-tab-pane>
      <a-tab-pane key="pass" tab="已审核"></a-tab-pane>
    </a-tabs>
    <a-button type="primary" @click="handleClickExamine(null, 'multiple')"
      >批量审核</a-button
    >
    <!-- 表格 -->
    <a-table
      style="margin-top: 10px"
      :rowSelection="{
        onChange: handleSelectionChange,
      }"
      :row-key="(record) => record._id"
      @change="handleTableChange"
      :pagination="{
        current: tableConfig.page,
        pageSize: tableConfig.limit,
        total: tableConfig.total,
      }"
      :loading="tableConfig.loading"
      :dataSource="dataSource"
    >
      <a-table-column :width="240" title="题目标题" data-index="title" />
      <a-table-column title="内容" data-index="content">
        <template #default="{ text: content }">
          <a-popover :title="null">
            <!-- 气泡中显示全部的内容 -->
            <template #content>
              <div class="questionContent">{{ content }}</div>
            </template>
            <!-- 气泡外展示部分内容由CSS用省略号代替 -->
            <div class="questionContent ellipsis">{{ content }}</div>
          </a-popover>
        </template>
      </a-table-column>
      <a-table-column title="出题人" data-index="publishUser">
        <template #default="{ text: publishUser }">
          <a-avatar style="margin-right: 10px" :src="publishUser[0].avatar" />
          <span>{{ publishUser[0].nickname }}</span>
        </template>
      </a-table-column>
      <a-table-column title="专区" data-index="areaInfo">
        <template #default="{ text: areaInfo }">
          {{ areaInfo.map((a) => a.name)[0] }}
        </template>
      </a-table-column>
      <a-table-column title="标签" data-index="tagInfo">
        <template #default="{ text: tagInfo }">
          <a-tag
            v-for="(tag, index) in tagInfo"
            :key="index"
            color="processing"
            >{{ tag.name }}</a-tag
          >
        </template>
      </a-table-column>
      <!-- <a-table-column title="时间" data-index="updateDate" /> -->
      <a-table-column key="action" title="操作">
        <template #default="{ record }">
          <span>
            <a-button type="primary" @click="handleClickExamine(record)"
              >审核</a-button
            >
          </span>
        </template>
      </a-table-column>
    </a-table>
    <!-- 审核 -->
    <a-modal
      title="审核"
      v-model:visible="examineModal"
      :confirm-loading="exmineForm.loading"
      cancelText="取消"
      okText="确定"
      @ok="handleExamine"
    >
      <a-radio-group v-model:value="exmineForm.type">
        <a-radio value="pass"> 审核成功 </a-radio>
        <a-radio value="reject"> 审核失败 </a-radio>
      </a-radio-group>
      <a-input
        v-model:value="exmineForm.reason"
        v-if="exmineForm.type === 'reject'"
        style="margin-top: 20px"
        placeholder="请输入拒绝原因"
      ></a-input>
    </a-modal>
  </div>
</template>
<script lang='ts'>
// api
import { getQuestionList, updateQuestionState } from "../../../api/question";
import { defineComponent, ref } from "vue";
import { message } from "ant-design-vue";
interface TableConfig {
  page: number;
  limit: number;
  total: number;
  loading: boolean;
  selection: string[];
}
export default defineComponent({
  setup() {
    let state = "onlist"; // 默认状态 待审核
    // 审核的Modal
    const examineModal = ref(false);
    // 审核的Form
    const exmineForm = ref({
      id: "",
      loading: false,
      type: "pass",
      reason: "",
    });
    // 表格配置
    const tableConfig = ref<TableConfig>({
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
      selection: [],
    });
    // 判断当前是批量审核还是单击审核
    const multipleExamine = ref(false);
    // 表格数据
    const dataSource = ref([]);
    const getData = async () => {
      tableConfig.value.loading = true;
      const data = await getQuestionList({
        state,
        limit: tableConfig.value.limit,
        page: tableConfig.value.page,
      });
      tableConfig.value.loading = false;
      if (data.success) {
        dataSource.value = data.data.list;
        tableConfig.value.total = data.data.count;
      }
    };
    getData();
    const handleTableChange = (e: { current: number }): void => {
      tableConfig.value.page = e.current;
      getData();
    };
    // 点击审核按钮
    const handleClickExamine = (record: { _id: string }, type: string) => {
      // 打开Modal
      examineModal.value = true;
      // 如果是多选就让此变量置为true
      multipleExamine.value = type === "multiple";
      // 如果type是多选
      if (type !== "multiple") {
        // 存储审核的ID
        exmineForm.value.id = record._id;
      }
    };
    // 表格选中项变化
    const handleSelectionChange = (selection: string[]) => {
      tableConfig.value.selection = selection;
    };
    const handleTabChange = (currentState: string): void => {
      state = currentState;
      tableConfig.value.page = 1; //页数置为1
      getData();
    };
    // 处理审核
    const handleExamine = async () => {
      // 判断是否是多选审核
      if (multipleExamine.value && tableConfig.value.selection.length === 0) {
        message.warning("请勾选对应的题目");
        return;
      }
      // 如果是拒绝则必须填写拒绝原因
      if (
        exmineForm.value.type === "reject" &&
        exmineForm.value.reason === ""
      ) {
        message.warning("请填写拒绝原因");
      } else {
        exmineForm.value.loading = true;
        const updateResult = await updateQuestionState({
          _id: multipleExamine.value
            ? tableConfig.value.selection
            : [exmineForm.value.id],
          state: exmineForm.value.type,
          examineInfo:
            exmineForm.value.type !== "reject"
              ? undefined
              : { reason: exmineForm.value.reason },
        });
        exmineForm.value.loading = false;
        if (updateResult.success) {
          // 重新请求列表
          getData();
          // 关闭模态框且清空相关记录
          examineModal.value = false;
          exmineForm.value.reason = "";
          exmineForm.value.type = "pass";
          message.success("操作成功");
        }
      }
    };
    return {
      dataSource,
      exmineForm,
      examineModal,
      handleTabChange,
      handleTableChange,
      handleExamine,
      tableConfig,
      handleClickExamine,
      handleSelectionChange,
    };
  },
});
</script>
<style scoped>
.questionContent {
  max-width: 300px;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>