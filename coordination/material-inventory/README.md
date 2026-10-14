# `course-materials/v1` 四课程原始资料清单协议

这个协议让学习总台直接读取四门课程**当前线上版本**已经收录的原始资料，避免只凭记忆判断“某份课件或参考材料是否传过”。清单既可包含老师提供的课件、作业和试题，也可包含明确纳入课程学习包的教材或开放参考；前端必须用分类和中性文案区分，不能把所有条目都声称为“老师文件”。

每门课在自己的静态站点中提供：

```text
materials/source-inventory.json
```

总站从课程固定路由读取它：

- `/phy301/materials/source-inventory.json`
- `/phy408/materials/source-inventory.json`
- `/phy309/materials/source-inventory.json`
- `/mat107/materials/source-inventory.json`

完整字段约束见 [`schema.json`](schema.json)。

提交清单前运行零依赖校验器：

```bash
python3 coordination/material-inventory/validate_material_inventory.py \
  path/to/source-inventory.json
```

也可以在同一次运行中校验四门课的多个清单；任何一个文件失败都会以非零状态退出，并汇总所有文件的错误：

```bash
python3 coordination/material-inventory/validate_material_inventory.py \
  phy301.json phy408.json phy309.json mat107.json
```

校验器除逐字段执行 `schema.json` 约束外，还会核对课程固定身份、汇总计数、分类计数、已发布原件数、已知页数合计、ID 与 SHA-256，并拒绝不安全下载路径、本机绝对路径和敏感字段。

## 语义边界

- `materials[]` 只登记真实收到的老师原始文件或明确属于课程来源的原始材料，不把翻译版、讲解版、网页生成文件重复算作原件。
- `sourceStatus=published-original` 表示原件已经进入当前课程静态交付包，并且 `originalUrl` 可从该课程路由下载。
- `sourceStatus=indexed-no-download` 表示已经登记，但因授权、体积或技术限制未提供下载；`originalUrl` 必须为 `null`。
- 只要任一原件的 `pages` 未知，`summary.totalPages` 就必须为 `null`；总站会显示已知信息不足，而不会把部分页数伪装成完整总数。
- `knownGaps[]` 记录“明确缺失”“当前未收到”“已确认尚未发布”或“是否存在未知”的材料；`not-received` 只描述本站资料包，不能据此推断老师平台没有该文件。
- 不得写入本机绝对路径、账号、令牌、教师平台链接参数或其他秘密。
- `sha256` 是当前文件的版本指纹，供人工或后续历史清单比对；只有与可信的上一版清单比较后，才能断言同名文件发生了更新。
- `freshness.sourceAuditDate` 表示这批**包内原件**最近一次核验日期，不表示当天检查过老师平台。仅重新构建而原件内容未变时，不应刷新该日期。

## 更新流程

老师开放权限或更新文件后，每门课项目应执行：

1. 把新原件安全保存到该课程的原始资料目录，不覆盖旧版本；
2. 更新自己的逐文件 `source-coverage.json` 和本清单；
3. 重新生成翻译/讲解版及课程站引用；
4. 更新 `checksums.sha256`，运行课程测试与中央 `course-package/v1` validator；
5. 由 PHY301 总控部署课程包。部署完成后，总站无需再次改代码，刷新即可读到新的线上清单。

`freshness.suggestedReviewDays` 只是“距离最近一次包内核验多久后，应主动回老师平台再检查一次”的提醒，不表示老师一定更新了文件，也不等同于自动监测。
