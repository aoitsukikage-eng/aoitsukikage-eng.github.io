---
title: Beta 與投資組合風險分析
slug: beta-portfolio-risk-analysis
summary: 以五檔美股的日報酬、S&P 500 與投資組合權重估計 Beta，說明分散化後的風險結果與作者的 SML 延伸。
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
  - label: 原始投組 Beta
    value: "0.8586"
    detail: 五檔股票加權日報酬，相對 S&P 500
  - label: 樣本期間
    value: 2023-07-12 至 2024-07-11
methods:
  - 以五檔股票的日報酬與 S&P 500 日報酬計算共變異數、變異數與 Beta。
  - 依既有權重合成投組日報酬，對照個股與投組的變異數結果。
  - 將 SML、CAPM 與 Alpha 保留為繳交後新增的作者延伸，不混稱原始課程要求。
findings:
  - 五檔加權投組的 Beta 為 0.8586，低於 1，反映該樣本中的市場敏感度低於 S&P 500。
  - 投組變異數為 0.000096871，約為 S&P 500 變異數的 195.85%；相較多數單一股票，分散化降低了波動，但不消除系統性風險。
reflection: 兩張公開圖表均為作者圖表。原始作業使用日資料、Beta 與分散化比較；SML/CAPM/Alpha 工作表是在繳交後加入的作者延伸。歷史樣本不構成投資建議。
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

本研究依 `financial-management-report.pdf` 與 `financial-management-analysis.xlsx` 的財務管理作業，分析 Beta 對投資組合系統性風險的意義。原始作業以 2023-07-12 至 2024-07-11 的日資料，對 CITI、GRMN、LOGI、TM、UA 與 S&P 500 計算日報酬與 Beta。`beta-risk-comparison.png` 與 `beta-sml-analysis.png` 為同一份分析所附的作者圖表。

## 分析內容

### Original course assignment

原始財管作業以各資產的相鄰收盤價計算日報酬，以 `COVARIANCE.S(資產日報酬, 市場日報酬) / VAR.S(市場日報酬)` 取得 Beta；投組日報酬依既定權重加總。此部分的目的，是比較個別資產與投組相對市場的敏感度，並觀察分散化對風險的影響。

| 股票 | 權重 | Beta | 個股變異數 | 相對 S&P 500 變異數 |
| --- | ---: | ---: | ---: | ---: |
| CITI | 25% | 0.9202 | 0.000191877 | 387.93% |
| GRMN | 20% | 0.7563 | 0.000232558 | 470.18% |
| LOGI | 20% | 0.8284 | 0.000410037 | 829.00% |
| TM | 25% | 0.7343 | 0.000241545 | 488.35% |
| UA | 10% | 1.2800 | 0.000540096 | 1,091.95% |
| 五檔投組 | 100% | 0.8586 | 0.000096871 | 195.85% |

同一樣本的 S&P 500 日報酬變異數為 0.000049462。投組的變異數低於每一檔個股，但仍高於市場指數；因此「分散化降低部分非系統性風險」是本資料所支持的表述，而非宣稱風險已被消除。

### Author extension (post-submission)

`SML Analysis` 工作表在繳交後才加入，工作表 A2 明確標示其為 portfolio demonstration purposes 的新增內容。它以 2024 年 7 月的一年期美國國庫券 4.781%、S&P 500 價格報酬 24.8734% 與平均股利殖利率 1.46% 建構 CAPM/SML，並列出各股的實際報酬與 Alpha。這是作者後續延伸，**不是**老師原始作業要求，也不改寫原始 Beta 與分散化結論。

| 股票 | CAPM 預期報酬 | 實際報酬 | Alpha | SML 結果 |
| --- | ---: | ---: | ---: | --- |
| CITI | 24.614% | 44.721% | 20.107% | Above SML |
| GRMN | 21.081% | 59.842% | 38.761% | Above SML |
| LOGI | 22.636% | 51.726% | 29.090% | Above SML |
| TM | 20.606% | 27.915% | 7.309% | Above SML |
| UA | 32.369% | −6.958% | −39.327% | Below SML |

## 可追溯來源與公開下載

公開資產為兩張作者圖表：`/research/beta-risk-comparison.png`（原始作業的 Beta／風險比較）與 `/research/beta-sml-analysis.png`（繳交後作者延伸）。原始 PDF 與 XLSX 不公開重發，因其保留文件屬性；公開數值可回溯至 `document/quant-research-source-map.md`。
