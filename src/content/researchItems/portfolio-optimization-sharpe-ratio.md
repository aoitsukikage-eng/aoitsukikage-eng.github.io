---
title: 投資組合最佳化與夏普比率分析
slug: portfolio-optimization-sharpe-ratio
summary: 以基金歷史報酬資料比較等權重、全域最小變異與最大夏普比率投資組合，並呈現效率前緣的量化作業研究。
track: research
domain:
  - quantitative-finance
  - portfolio-optimization
status: completed
visibility: public
year: 2025
tags:
  - mean-variance
  - Sharpe-ratio
  - efficient-frontier
type: quantitative
highlights:
  - label: 比較組合
    value: 等權重、GMV、最大夏普
  - label: 分析框架
    value: 均值—變異數與效率前緣
methods:
  - 以來源工作簿的基金基本資料與五年報酬工作表整理比較條件。
  - 依來源已列的期望報酬、共變異數與權重，閱讀風險、預期報酬與夏普比率。
findings:
  - 組合選擇需要同時檢視風險與預期報酬，不能只以單一指標判斷。
  - 效率前緣提供比較取捨的框架，不代表對未來績效的保證。
reflection: 公開版本保留可追溯的比較架構，未重算、補填或延伸來源未提供的數字。
downloads:
  - label: 查看研究框架圖
    href: /research/portfolio-optimization-framework.svg
    description: 作者製作的原生 SVG，說明資料、比較組合與輸出關係。
visuals:
  - kind: framework
    src: /research/portfolio-optimization-framework.svg
    alt: 投資組合研究框架圖，從基金資料、報酬與共變異數輸入，連到等權重、GMV、最大夏普與效率前緣比較。
    caption: 原生框架圖僅呈現研究流程，不重製來源工作簿數值。
---

## 研究定位

本研究以 `investment-report.docx` 與 `investment-analysis.xlsx` 的作業內容為依據，將基金報酬資料整理為投資組合的報酬、風險與夏普比率比較。分析重點是以均值—變異數架構，對照等權重組合、全域最小變異組合與最大夏普比率組合，並由效率前緣呈現風險與預期報酬的取捨。

## 方法與呈現

- 以來源工作簿的基金基本資料與五年報酬計算工作表作為輸入。
- 使用來源內的期望報酬、共變異數與權重計算，整理組合風險、預期報酬與夏普比率。
- 比較工作簿所列的等權重、GMV、最大夏普比率與效率前緣各點；本公開摘要不重算、補填或延伸來源未提供的數字。

## 可追溯來源與公開方式

來源為作者的課程報告與分析工作簿。原始 DOCX 與 XLSX 含有文件中繼資料，因此不公開重發；`/research/portfolio-optimization-framework.svg` 是不重製來源數值的原生比較框架圖，可安全公開，並足以說明研究問題、資料結構與比較框架。
