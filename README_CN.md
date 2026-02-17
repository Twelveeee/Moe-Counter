# Moe Counter Cloudflare

语言: 中文 | [English](./README.md)

多种风格可选的萌萌计数器，使用 serverless 函数部署

<p align="center">
  <a href="https://moe-counter-cf.12dev.us/" target="_blank">
    <img alt="Moe Counter Cloudflare!" src="https://moe-counter-cf.12dev.us/@Moe-Counter-Cloudflare.github?name=Moe-Counter-Cloudflare.github&theme=booru-lewd&padding=7&offset=0&align=top&scale=1&pixelated=1&darkmode=auto">
  </a>
</p>


支持以下三种部署模式：

1. Cloudflare Worker + D1
2. Cloudflare Worker + Upstash (REST)
3. Vercel (Node Serverless) + Upstash (REST)


> 建议只使用免费额度。
> 使用 Upstash, 每月pv在500,000 以下的网站。
> 使用 D1, 每日pv 在50,000 以下的网站。
> 超过这个值建议自己部署 [Moe-Counter](https://github.com/journey-ad/Moe-Counter) 的Docker版本。


## Demo

https://moe-counter-cf.12dev.us/


仅供体验，不建议使用当前网站，可能不定期清除数据，建议自行部署。


## Environment Variables

见 `.env.example`。

通用：

- `DB_DRIVER=d1|upstash` (默认d1)
- `APP_SITE` (optional)
- `GA_ID` (optional)
- `LOG_LEVEL` (optional)

Upstash 模式额外需要：

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `COUNTER_PREFIX` (optional, default `moe_count_`)

Cloudflare D1 需要手动创建数据库和绑定数据库

## Deploy 1: Vercel + Upstash
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FTwelveeee%2FMoe-Counter-Cloudflare)

1. 在 Upstash 创建 Redis 并拿到 REST URL / TOKEN。

2. 在 Vercel 项目里设置环境变量：
   - `DB_DRIVER=upstash`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `COUNTER_PREFIX` (optional)
   - `APP_SITE` / `GA_ID` / `LOG_LEVEL` (optional)


## Deploy 2: Cloudflare Worker + Upstash
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FTwelveeee%2FMoe-Counter-Cloudflare)

1. 在 Upstash 创建 Redis 并拿到 REST URL / TOKEN。
2. 在 Cloudflare 后台设置：
   - `DB_DRIVER=upstash`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `COUNTER_PREFIX` (optional)

## Deploy 3: Cloudflare Worker + D1
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FTwelveeee%2FMoe-Counter-Cloudflare)

1. 创建 D1 数据库。

2. 创建数据表
![alt text](./docs/image/01.png)


在命令行执行sql

[0001_create_tb_count.sql](./migrations/0001_create_tb_count.sql)
```sql
CREATE TABLE IF NOT EXISTS tb_count (
  name TEXT PRIMARY KEY,
  num INTEGER NOT NULL DEFAULT 0 CHECK (num >= 0)
);

```

3. 创建 Workers
点击 [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2FTwelveeee%2FMoe-Counter-Cloudflare) 

![alt text](./docs/image/02.png)
输入环境变量。点击创建。



4. 手动绑定 D1 数据库

添加绑定
![alt text](./docs/image/03.png)

选择D1 数据库
![alt text](./docs/image/04.png)

变量名输入DB， d1 databases 选择刚刚创建的数据库
![alt text](./docs/image/05.png)


5. 在变量里设置 `DB_DRIVER=d1`。

## 消耗额度

截止当前日期(2026年2月18日)

### vercel 免费额度

https://vercel.com/docs/limits

 1,000,000 请求次/每个月

### Cloudflare Worker 免费额度

https://developers.cloudflare.com/workers/platform/pricing/

100,000 次请求/每天


### Upstash 免费额度

https://upstash.com/docs/redis/overall/pricing

256MB 存储
500,000 次请求/每个月


### Cloudflare D1 免费额度

https://developers.cloudflare.com/d1/platform/pricing/
读 5 million / day
写 100,000 / day
5gb 存储


### 每百次请求消耗额度
1. vercel 

![alt text](./docs/image/07.png)

2. Cloudflare Worker 

![alt text](./docs/image/08.png)

3. Upstash

![alt text](./docs/image/06.png)

4. Cloudflare D1

![alt text](./docs/image/09.png)

## License

原仓库 [Moe-Counter](https://github.com/journey-ad/Moe-Counter)

[MIT](./LICENSE)，主题图片除外。
