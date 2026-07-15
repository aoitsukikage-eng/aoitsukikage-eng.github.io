# Quantitative Research Source Map

This map records the source location for every public quantitative value. The
source files remain outside the repository; the public site and PDFs use only
the de-identified values and author-created visualisations listed here.

## Portfolio optimisation

| Public item | Source location | Verification note |
| --- | --- | --- |
| Fund names, five-year cumulative returns, annual return and annual standard deviation | `investment-analysis.xlsx` → `基金基本資料!B2:D9` | Fund 1 / Fund 2 / Fund 3 are the three assets throughout the workbook. |
| Monthly-return input series | `investment-analysis.xlsx` → `E®&corel&cov!A2:G62` | Month-end observations run from 2020-12-31 through 2025-12-31; returns are calculated in C3:C62, E3:E62 and G3:G62. |
| Annual returns, annual standard deviations and individual Sharpe ratios | `investment-analysis.xlsx` → `Max sharpe!B3:D6` | The same values also appear in `GMV!B3:D6`. |
| Risk-free rate | `investment-analysis.xlsx` → `Max sharpe!G1`, `Max sharpe!B8` | 1.70%. |
| Correlation matrix | `investment-analysis.xlsx` → `Max sharpe!B10:D13` | Annualised covariance matrix is at `B20:D23`. |
| Covariance matrix | `investment-analysis.xlsx` → `Max sharpe!B20:D23` | Annualised sample covariance values. |
| Max Sharpe weights, return, variance, standard deviation and Sharpe ratio | `investment-analysis.xlsx` → `Max sharpe!G3:G7` | Asset weights are G3:I3; total is J3. |
| GMV weights, return, variance, standard deviation and Sharpe ratio | `investment-analysis.xlsx` → `GMV!G3:G7` | Asset weights are G3:I3; total is J3. |
| Efficient-frontier coordinates and CML anchor | `investment-analysis.xlsx` → `效率前緣各點計算!H19:J28`, `L18:N20` | The public chart reproduces these supplied coordinates; it does not re-optimise them. |
| Solver setup | `investment-analysis.xlsx` → workbook Solver settings and `效率前緣各點計算!B32:E67` | Weights sum to 1, are non-negative; GMV minimises variance and Max Sharpe maximises excess return divided by standard deviation. |
| Retirement target context and allocation calculation | `investment-report.docx` → retirement-target and allocation sections | 20/30/40-year, 5m/10m/15m target ladder; the public page does not publish personal identifiers. |

## Beta and portfolio-risk analysis

| Public item | Source location | Verification note |
| --- | --- | --- |
| Five stocks, daily prices, daily returns and S&P 500 comparison | `financial-management-analysis.xlsx` → `財管作業!A1:U254` | Observations span 2023-07-12 through 2024-07-11. Returns begin on row 4. |
| Portfolio weights | `financial-management-analysis.xlsx` → `財管作業!U4:U254` formula | CITI 25%, TM 25%, GRMN 20%, LOGI 20%, UA 10%. |
| Market variance and portfolio variance / covariance / beta | `financial-management-analysis.xlsx` → `財管作業!X5:X10` | Portfolio beta is 0.8585640012. |
| Individual stock covariance, variance and beta | `financial-management-analysis.xlsx` → `財管作業!X12:X35` | CITI X13:X15; GRMN X18:X20; LOGI X23:X25; TM X28:X30; UA X33:X35. |
| Variance comparison | `financial-management-analysis.xlsx` → `財管作業!AA5:AA10` | Ratios compare each stock and the portfolio with S&P 500 variance. |
| Original course-assignment conclusion | `financial-management-report.pdf` → pages 1–5 | The report describes the five-stock portfolio, Beta and diversification result. |
| SML / CAPM / Alpha extension | `financial-management-analysis.xlsx` → `SML Analysis!A1:F35` | A2 explicitly says the worksheet was added post-submission; it is labelled as an author extension everywhere public. |
| Author charts | `public/research/beta-risk-comparison.png`, `public/research/beta-sml-analysis.png` | Derived from the author workbook, retained as author-created public visual material. |

## Publication boundary

Original DOCX/XLSX files and the original PDF are not redistributed. This map
is a provenance record, not a substitute for the source workbooks; values are
rounded only for readable public display.
