import axios from "axios";
// // URL
import { SERVERLESS_ACTION_TEST } from "../config/url";
interface RequestParams {
  service: string;
  action: string
  method: "get" | "post" | "put" | "delete";
  data: object;
}

/**
 * 云函数action请求
 * @param params
 * @param version
 * @param namespace
 * @description https://uniapp.dcloud.io/uniCloud/http 云函数URL化文档
 */
export default function request(
  params: RequestParams,
  version: string = "/v1",
  namespace: string = "/application"
) {
  return new Promise((resolve) => {
    axios
      .request({
        url: SERVERLESS_ACTION_TEST + version + namespace,
        method: params.method,
        data: {
          service: params.service,
          action: params.action,
          params: params.data
        },
      })
      .then((res: any) => {
        resolve(res.data);
      });
  });
}
