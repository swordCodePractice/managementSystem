import request from "../common/request";

// 获取题目列表
export function getAreaList(data: {
    limit: number;
    page: number;
  }): Promise<ActionResult> {
    return new Promise((resolve) => {
      request({
        service: "questionArea",
        action: "getAreaList",
        method: "get",
        data,
      }).then((res) => {
        resolve(res);
      });
    });
  }