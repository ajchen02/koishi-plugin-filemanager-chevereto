import { Context, Schema } from 'koishi';
import { } from 'koishi-plugin-filemanager';


export const name = 'filemanager-chevereto';

export interface Config
{
  endpoint: string; // 图床服务的API端点地址
  token: string; // 图床服务的Token令牌
  killTime: number; // 可选的过期时间，单位为分钟
} // 那filemanager本体的killtime怎么办（

export const Config: Schema<Config> = Schema.object({
  endpoint: Schema.string().description('图床服务的API端点地址').default('https://freeimghost.net/api/1/upload'),
  token: Schema.string().description('图床服务的Token令牌').default('').required(),
  killTime: Schema.number().description('可选的过期时间，单位为分钟').default(5)
});

export const inject = ['filemanager'];

export function apply(ctx: Context, config: Config)
{

  const killTime = config.killTime;
  
  // 进行图床注册
  ctx.fileManager.img.reg('chevereto', config.endpoint, async (file: Buffer, fileName: string) =>
  {
    const url = config.endpoint; 
    const formData = new ctx.fileManager.FormData();
    
    formData.append('source', file, `${fileName}.jpeg`); 
    formData.append('expiration', `PT${killTime}M`);
    formData.append('key', config.token);

    const data = await ctx.fileManager.axios.post(`${url}/api/1/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-Key': config.token,
        "Content-Type": "multipart/form-data",
      }
    });

    if (data.data.status_code != 200)
    {
      console.log(data.data);
      throw new Error('chevereto图床上传失败！请检查控制台');
    }

    return data.data.image.url
  });
}
//草，咱是不是还得改adapter-iirose
// 欸等会
// 你等会）
// 欸等会等会（
//好（