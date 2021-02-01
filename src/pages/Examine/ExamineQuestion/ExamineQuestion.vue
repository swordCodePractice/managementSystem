<template>
  <div class="questionBox">
    <a-tabs @change="handleTabChange">
      <a-tab-pane key="onlist" tab="待审核"></a-tab-pane>
      <a-tab-pane key="reject" tab="已拒绝"></a-tab-pane>
      <a-tab-pane key="pass" tab="已审核"></a-tab-pane>
    </a-tabs>
    <!-- 表格 -->
    <a-table
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
      <a-table-column title="题目标题" data-index="title" />
      <a-table-column title="内容" data-index="content" />
      <a-table-column title="专区" data-index="areaID" />
      <!-- <a-table-column title="标签" data-index="tagID" /> -->
      <!-- <a-table-column title="时间" data-index="updateDate" /> -->
      <!-- <a-table-column title="操作" /> -->
    </a-table>
  </div>
</template>
<script lang='ts'>
// api
import { getQuestionList } from "../../../api/question";
import { defineComponent, ref } from "vue";
export default defineComponent({
  setup() {
    let state = "onlist"; // 默认状态 待审核
    // 表格配置
    const tableConfig = ref({
      page: 1,
      limit: 10,
      total: 0,
      loading: false,
    });
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
        console.log(data.data.list);
        tableConfig.value.total = data.data.count;
      }
    };
    getData();
    const handleTableChange = (e: { current: number }) => {
      tableConfig.value.page = e.current;
      getData();
    };
      const handleTabChange = (currentState: string) => {
      state = currentState;
      getData();
    };
    return {
      dataSource,
      handleTabChange,
      handleTableChange,
      tableConfig,
    };
  },
});
</script>
<style scoped>
.questionBox {
  background: #fff;
}
.pagination {
  text-align: end;
  margin-top: 20px;
}
</style>