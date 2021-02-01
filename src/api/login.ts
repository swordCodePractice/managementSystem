import request from "../common/request";

interface LoginData {
  username: string;
  password: string;
}
// 登录
export function loginByPassword(data: LoginData): Promise<ActionResult> {
  return new Promise((resolve) => {
    request({
      service: "user",
      action: "postLoginByPhone",
      method: "post",
      data,
    }).then((res) => {
      resolve(res);
    });
  });
}
