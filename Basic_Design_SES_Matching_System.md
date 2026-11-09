# 人材紹介／SES向けマッチングシステム 基本設計書

## 1. システム概要
本システムは Microsoft Graph、Azure OpenAI、Azure AI Search、Azure SQL を活用し、履歴書・求人票の自動取込、個人情報匿名化、求職者・求人管理、AIマッチングを実現する。

### 目的
- Outlookメールから履歴書・求人票を自動収集
- 個人情報の自動検知・匿名化
- 求職者／求人データの一元管理
- AIによるマッチング支援
- 重複候補の検出

---

## 2. システム構成

```text
Outlook
  ↓
Microsoft Graph
  ↓
Azure Function
  ↓
Document Intelligence
  ↓
Azure OpenAI
  ↓
Azure SQL Database
  ↓
Azure AI Search
  ↓
Webアプリ
```

---

## 3. 利用サービス

|サービス|用途|
|---|---|
|Microsoft Graph|メール・添付ファイル取得|
|Azure Functions|Webhook受信・処理制御|
|Azure AI Document Intelligence|OCR・文書解析|
|Azure OpenAI|匿名化、スキル抽出、マッチング|
|Azure AI Search|ベクトル検索、類似検索|
|Azure SQL Database|マスタ・業務データ保存|
|Azure Blob Storage|一時ファイル保管|
|Application Insights|監視・ログ|

---

## 4. 主要機能

### 4.1 Outlook自動取込
- Microsoft Graph Webhook連携
- メール本文取得
- 添付ファイル取得
- PDF/DOCX/XLSX/TXT対応
- 自動分類

### 4.2 個人情報匿名化
対象:
- 氏名
- 住所
- 電話番号
- メールアドレス
- 生年月日
- 学校名
- 会社名

処理:
1. OCR
2. PII検知
3. 匿名化
4. 品質スコア算出

### 4.3 求職者管理
- 検索
- ソート
- ページング
- 編集
- ステータス変更

### 4.4 求人管理
- 求人情報管理
- ステータス管理
- 検索
- ソート

### 4.5 AIマッチング
評価項目:
- スキル
- 経験年数
- 業界経験
- 勤務条件
- 資格

出力:
- 一致率
- 推薦理由
- ランク

### 4.6 重複検知
- MessageId比較
- SHA256比較
- ベクトル類似検索

---

## 5. 画面一覧

|ID|画面名|
|---|---|
|DASH-001|KPIダッシュボード|
|MAIL-001|Outlook自動取込管理|
|IMPORT-001|ファイルアップロード|
|ANON-001|匿名化前プレビュー|
|ANON-002|匿名化処理|
|ANON-003|匿名化品質判定|
|CAND-001|求職者管理|
|CAND-002|求職者詳細|
|JOB-001|求人管理|
|JOB-002|求人詳細|
|MATCH-001|AIマッチング|
|MATCH-002|AI推薦理由|
|DUP-001|重複候補管理|
|AUDIT-001|監査ログ|
|ADMIN-001|システム管理|

---

## 6. DB概要

### Candidate
- CandidateId
- Status
- SkillSummary
- ExperienceYears
- WorkStyle
- UpdatedAt

### Job
- JobId
- Title
- RequiredSkill
- WorkStyle
- Budget
- Status

### MatchResult
- MatchId
- CandidateId
- JobId
- Score
- Reason

### MailImportQueue
- QueueId
- MessageId
- Subject
- Sender
- Status

---

## 7. セキュリティ

- Azure Entra ID認証
- ロールベースアクセス制御
- Key Vaultによる秘密情報管理
- TLS通信
- 監査ログ保持
- 匿名化済みデータのみ永続保存

---

## 8. 画面遷移

```text
KPIダッシュボード
 ├─ Outlook自動取込
 ├─ ファイルアップロード
 ├─ 匿名化前プレビュー
 ├─ 匿名化処理
 ├─ 品質判定
 ├─ 求職者管理
 │   └─ 求職者詳細
 ├─ 求人管理
 │   └─ 求人詳細
 ├─ AIマッチング
 │   └─ 推薦理由
 ├─ 重複候補管理
 ├─ 監査ログ
 └─ システム管理
```
