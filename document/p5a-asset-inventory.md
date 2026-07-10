# P5A asset inventory

This inventory records the review of the five source groups supplied in
`/tmp/portfolio-p5a-raw`. That directory is a local review input only and is
intentionally not part of this repository.

| Research item | Reviewed source material | Public treatment |
| --- | --- | --- |
| Portfolio optimization and Sharpe ratio | `investment-report.docx`, `investment-analysis.xlsx` | Publish a newly authored, source-traceable Markdown brief and an original chart only. The Word and workbook originals are not redistributed. |
| Beta and portfolio risk | `financial-management-report.pdf`, `financial-management-analysis.xlsx`, `beta-risk-comparison.png`, `beta-sml-analysis.png` | Publish a newly authored brief and the two supplied author charts after metadata review. The PDF and workbook originals are not redistributed. |
| Executive compensation and ESG disclosure | `esg-compensation-report.docx` | Publish a newly authored, source-traceable Markdown brief. The source document is not redistributed because it contains student-identifying material and document metadata. |
| Sinopac / Sambo over-loan governance | `financial-regulation-report.docx` | Publish a newly authored, source-traceable Markdown brief with its research-time disclaimer. The source document is not redistributed because it contains student-identifying material and document metadata. |
| Sugamo Shinkin community finance | `cooperative-bank-report.pdf` | Publish a newly authored, source-traceable Markdown brief. The source PDF is not redistributed; it includes third-party building and product images. |

## Safety review

- The raw directory contains three DOCX files, two PDFs, two XLSX files, and
  two PNG charts. It is outside the repository and is not tracked by Git.
- The supplied DOCX/XLSX files contain document properties; the supplied PDF
  files were inspected with `pdfinfo`. No original office or PDF file is made
  public from this repository.
- The only source images considered for publication are the two author charts
  used by the Beta and portfolio-risk item. No images are extracted from the
  Sugamo Shinkin report.
