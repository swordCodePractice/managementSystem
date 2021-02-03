import request from "../common/request";

// 获取题目列表
export function getQuestionList(data: {
  state: string;
  limit: number;
  page: number;
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    request({
      service: "question",
      action: "getQuestionList",
      method: "get",
      data,
    }).then((res) => {
      resolve(res);
    });
  });
}

// 审核题目根据_id
export function updateQuestionState(data: {
  state: string;
  _id: string[];
  examineInfo?: {reason: string};
}): Promise<ActionResult> {
  return new Promise((resolve) => {
    request({
      service: "question",
      action: "examineQuestion",
      method: "put",
      data,
    }).then((res) => {
      resolve(res);
    });
  });
}
