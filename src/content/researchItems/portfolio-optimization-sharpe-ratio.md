---
title: 投資組合最佳化與夏普比率分析
slug: portfolio-optimization-sharpe-ratio
summary: 以三檔基金的五年月報酬資料求得全域最小變異與最大夏普比率投資組合，並呈現來源工作簿的效率前緣。
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
  - label: 最佳化結果
    value: GMV、最大夏普與效率前緣
  - label: 分析框架
    value: 均值—變異數與效率前緣
methods:
  - 以來源工作簿的基金基本資料與五年月報酬工作表整理比較條件。
  - 依來源已列的期望報酬、共變異數、Solver 條件與權重，閱讀風險、預期報酬與夏普比率。
findings:
  - 組合選擇需要同時檢視風險與預期報酬，不能只以單一指標判斷。
  - 效率前緣提供比較取捨的框架，不代表對未來績效的保證。
reflection: 公開版本忠實重繪來源工作簿已列的結果；未重算、補填或延伸未提供的數字，歷史資料亦不保證未來績效。
downloads: []
---

## 研究定位

本研究以 `investment-report.docx` 與 `investment-analysis.xlsx` 的作業內容為依據，將三檔基金的月報酬資料整理為投資組合的報酬、風險與夏普比率。分析主線為全域最小變異（GMV）、最大夏普比率與效率前緣；來源中沒有可公開核對的完整等權重組合結果，因此本公開版不宣稱或比較等權重組合。

## 方法與呈現

- 以來源工作簿的基金基本資料與五年報酬計算工作表作為輸入。
- 使用來源內的期望報酬、共變異數與權重計算，整理組合風險、預期報酬與夏普比率。
- 呈現工作簿所列的 GMV、最大夏普比率與效率前緣各點；本公開摘要不重算、補填或延伸來源未提供的數字。

## 可追溯來源與公開方式

來源為作者的課程報告與分析工作簿。原始 DOCX 與 XLSX 含有文件中繼資料，因此不公開重發；公開值的工作表範圍記於 `document/quant-research-source-map.md`，並在頁面與去識別化公開版 PDF 中直接呈現核心結果。
