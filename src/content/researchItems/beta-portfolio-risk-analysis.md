---
title: Beta 與投資組合風險分析
slug: beta-portfolio-risk-analysis
summary: 以 CAPM 的 Beta 與證券市場線比較個別資產及投資組合的系統性風險，並搭配作者圖表說明。
track: research
domain:
  - quantitative-finance
  - risk-analysis
status: completed
visibility: public
year: 2024
tags:
  - beta
  - CAPM
  - SML
type: quantitative
highlights:
  - label: 核心概念
    value: Beta、CAPM、SML
  - label: 風險界線
    value: 系統性與非系統性風險
methods:
  - 依來源報告比較個別資產的 Beta 與相對市場敏感度。
  - 用證券市場線整理 Beta 與 CAPM 所要求報酬率的關係。
findings:
  - Beta 描述相對市場變動的敏感度，並非所有投資風險的總和。
  - 分散化可處理部分非系統性風險，系統性風險仍需另行辨識。
reflection: 兩張公開圖表均為作者圖表；文字僅概述原報告的分析架構，不另行主張新的估計結果。
downloads:
  - label: 下載 Beta 風險比較圖
    href: /research/beta-risk-comparison.png
    description: 作者圖表，呈現 Beta 與投資組合風險比較。
  - label: 下載 SML 分析圖
    href: /research/beta-sml-analysis.png
    description: 作者圖表，呈現證券市場線分析。
visuals:
  - kind: chart
    src: /research/beta-risk-comparison.png
    alt: 作者製作的 Beta 與投資組合風險比較圖。
    caption: 作者圖表：Beta 與投資組合風險比較。
  - kind: chart
    src: /research/beta-sml-analysis.png
    alt: 作者製作的證券市場線與 Beta 分析圖。
    caption: 作者圖表：證券市場線分析。
---

## 研究定位

本研究依 `financial-management-report.pdf` 與 `financial-management-analysis.xlsx` 的財務管理作業，分析 Beta 對投資組合系統性風險的意義。`beta-risk-comparison.png` 與 `beta-sml-analysis.png` 為同一份分析所附的作者圖表。

## 分析內容

- 以個別資產的 Beta 比較其相對於市場報酬變動的敏感度。
- 以證券市場線（SML）整理 Beta 與 CAPM 所要求報酬率的關係。
- 對照投資組合配置下的風險特性，將可透過分散化處理的非系統性風險，與 Beta 所代表的系統性風險分開討論。

## 可追溯來源與公開下載

公開資產為兩張作者圖表：`/research/beta-risk-comparison.png` 與 `/research/beta-sml-analysis.png`。原始 PDF 與 XLSX 不公開重發，因其保留文件屬性；本頁的文字僅概述原始報告已使用的 Beta、CAPM 與 SML 分析架構，不另行宣稱新的估計結果。
