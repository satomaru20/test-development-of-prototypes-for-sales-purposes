# 人材紹介／SES向けシステム 詳細設計書

## 1. システム概要

### システム名称
人材紹介／SES向けAIマッチングシステム

### 利用サービス
- Microsoft Graph
- Azure OpenAI
- Azure AI Search
- Azure SQL Database
- Azure AI Document Intelligence
- Azure Functions
- Azure Storage Account

---

# 2. 機能詳細設計

## 2.1 Outlook自動取込機能

### 概要
Microsoft Graph Webhookを利用しメール受信時に自動取込を行う。

### 入力
- メール本文
- PDF
- DOCX
- XLSX
- TXT

### 出力
- 取込キュー登録
- 添付ファイル保存

### 処理フロー
1. Webhook受信
2. MessageId取得
3. 本文取得
4. 添付取得
5. 重複判定
6. AI分類
7. キュー登録

---

## 2.2 履歴書匿名化機能

### 検出対象
- 氏名
- 住所
- 電話番号
- メールアドレス
- 生年月日
- 学校名
- 会社名

### 処理フロー
1. OCR実行
2. PII検知
3. Azure OpenAI匿名化
4. 品質スコア算出
5. テキスト保存

### 品質スコア
|スコア|判定|
|---|---|
|95～100|OK|
|90～94|確認|
|89以下|NG|

---

## 2.3 求人情報匿名化機能

### 検出対象
- 会社名
- 担当者名
- メールアドレス
- 電話番号

### 出力形式
```text
[COMPANY_001]
[MAIL_001]
[PHONE_001]
```

---

# 3. DB詳細設計

## Candidate

|項目|型|
|---|---|
|CandidateId|nvarchar(20)|
|Status|nvarchar(20)|
|Skill1|nvarchar(100)|
|Skill2|nvarchar(100)|
|WorkStyle|nvarchar(50)|
|Industry|nvarchar(200)|
|QualityScore|decimal(5,2)|
|UpdatedAt|datetime|

## Job

|項目|型|
|---|---|
|JobId|nvarchar(20)|
|Title|nvarchar(200)|
|RequiredSkill|nvarchar(max)|
|WorkStyle|nvarchar(50)|
|Budget|decimal(18,2)|
|Status|nvarchar(20)|
|UpdatedAt|datetime|

## MatchResult

|項目|型|
|---|---|
|MatchId|uniqueidentifier|
|CandidateId|nvarchar(20)|
|JobId|nvarchar(20)|
|Score|decimal(5,2)|
|Reason|nvarchar(max)|

---

# 4. 画面詳細設計

## DASH-001 KPIダッシュボード

### KPI表示
- 未決定求職者
- 募集中案件
- 本日取込件数
- 重複候補件数

### アラート
- 匿名化エラー
- Outlook同期エラー
- 重複候補

---

## CAND-001 求職者管理

### 検索条件
- キーワード
- ステータス
- スキル

### 一覧項目
- 候補者ID
- ステータス
- 主要スキル1
- 主要スキル2
- 勤務条件
- 更新日

### 機能
- ソート
- ページング
- ページサイズ変更
- 条件リセット

---

## CAND-002 求職者詳細

### 基本情報
- 候補者ID
- ステータス
- 品質スコア

### 編集項目
- スキル
- 勤務条件
- 業界経験

### ボタン
- 保存
- 決定
- 対象外

---

## JOB-001 求人管理

### 一覧項目
- 案件ID
- 案件名
- 必須スキル
- 単価
- 状態
- 更新日

### 機能
- 検索
- ソート
- ページング

---

## MATCH-001 AIマッチング

### スコア計算
|項目|重み|
|---|---|
|スキル|40%|
|経験年数|20%|
|業界経験|15%|
|勤務条件|15%|
|資格|10%|

### 出力
- 一致率
- 推薦順位
- 推薦理由

---

# 5. Azure AI Search設計

## CandidateIndex

検索対象
- Skill1
- Skill2
- Industry
- WorkStyle

ベクトル検索
- text-embedding-3-large

## JobIndex

検索対象
- RequiredSkill
- Description
- WorkStyle

---

# 6. API設計

## 求職者検索
GET /api/candidates

## 求職者更新
PUT /api/candidates/{id}

## 求人検索
GET /api/jobs

## マッチング実行
POST /api/matching/run

## Outlook同期
POST /api/mail/sync

---

# 7. セキュリティ設計

- Azure Entra ID認証
- RBAC制御
- TLS1.2以上
- Key Vault利用
- 監査ログ管理

---

# 8. 運用設計

### バッチ
- Outlook同期: 5分毎
- AI Search再構築: 毎日深夜
- ログアーカイブ: 毎月

### 監視
- Application Insights
- Azure Monitor
- Log Analytics
