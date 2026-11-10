# データベース設計

## ER図（概要）

```text
ユーザー
 ├── グループ
 ├── スキル
 ├── 経歴書
 ├── 資格
 ├── 案件参画
 └── 勤怠

募集案件
 ├── 提案履歴
 ├── 面談履歴
 ├── マッチング結果
 └── チャット

参画案件
 ├── 勤怠
 ├── 現場状況
 ├── 延長確認
 └── チャット

ユーザー
 └── 案件参画
         ├── 募集案件
         └── 参画案件
```

---

# テーブル一覧

|テーブル名|用途|
|---|---|
|m_users|ユーザー管理|
|m_groups|グループ管理|
|m_offices|事業所管理|
|m_skills|スキルマスタ|
|m_certifications|資格マスタ|
|t_user_skills|ユーザースキル|
|t_user_certifications|ユーザー資格|
|t_resumes|経歴書管理|
|t_resume_histories|経歴書更新履歴|
|t_recruit_projects|募集案件|
|t_project_proposals|提案履歴|
|t_project_interviews|面談履歴|
|t_project_matching|AIマッチング|
|t_assign_projects|参画案件|
|t_project_members|案件参画者|
|t_attendance|勤怠管理|
|t_field_reports|現場状況管理|
|t_extension_confirmations|延長確認|
|t_chats|案件チャット|
|t_notifications|通知|
|t_ai_generation_logs|AI生成履歴|

---

# m_users（ユーザー）

|項目|型|説明|
|---|---|---|
|user_id|UUID(PK)|ユーザーID|
|employee_no|VARCHAR(20)|社員番号|
|name|VARCHAR(100)|氏名|
|group_id|UUID(FK)|所属グループ|
|office_id|UUID(FK)|所属事業所|
|email|VARCHAR(255)|メール|
|status|VARCHAR(30)|募集中/参画中など|
|desired_conditions|TEXT|希望条件|
|join_date|DATE|入社日|
|retire_date|DATE|退職日|
|role|VARCHAR(30)|管理者/営業等|
|created_at|DATETIME|登録日時|
|updated_at|DATETIME|更新日時|

---

# m_groups（グループ）

|項目|型|
|---|---|
|group_id|UUID(PK)|
|group_name|VARCHAR(100)|
|leader_user_id|UUID(FK)|

---

# m_offices（事業所）

|項目|型|
|---|---|
|office_id|UUID(PK)|
|office_name|VARCHAR(100)|

---

# m_skills（スキルマスタ）

|項目|型|
|---|---|
|skill_id|UUID(PK)|
|skill_name|VARCHAR(100)|
|skill_category|VARCHAR(50)|

### カテゴリ例

- 言語
- DB
- クラウド
- OS
- FW
- ツール
- 業界

---

# t_user_skills

|項目|型|
|---|---|
|user_skill_id|UUID(PK)|
|user_id|UUID(FK)|
|skill_id|UUID(FK)|
|experience_years|DECIMAL(4,1)|
|skill_level|INT|

### スキルレベル

```text
1 初級
2 初中級
3 中級
4 上級
5 エキスパート
```

---

# m_certifications（資格マスタ）

|項目|型|
|---|---|
|certification_id|UUID(PK)|
|certification_name|VARCHAR(200)|

---

# t_user_certifications

|項目|型|
|---|---|
|id|UUID(PK)|
|user_id|UUID(FK)|
|certification_id|UUID(FK)|
|acquired_date|DATE|

---

# t_resumes（経歴書）

|項目|型|
|---|---|
|resume_id|UUID(PK)|
|user_id|UUID(FK)|
|version_no|INT|
|resume_json|JSON|
|pdf_path|VARCHAR(500)|
|updated_date|DATE|

### 保持情報

- 職務経歴
- スキル
- 資格
- 自己PR
- プロジェクト履歴

---

# t_recruit_projects（募集案件）

## ステータス

```text
展開前
募集
本人確認中
提案中
面談
合否
保留
見送り
```

|項目|型|
|---|---|
|project_id|UUID(PK)|
|project_name|VARCHAR(300)|
|project_detail|TEXT|
|group_id|UUID(FK)|
|priority|INT|
|unit_price|DECIMAL(10,0)|
|settlement_min|INT|
|settlement_max|INT|
|work_location|VARCHAR(200)|
|contract_type|VARCHAR(50)|
|commercial_flow|TEXT|
|status|VARCHAR(30)|
|created_user_id|UUID|
|created_at|DATETIME|

---

# t_project_matching

AIマッチング結果

|項目|型|
|---|---|
|matching_id|UUID(PK)|
|project_id|UUID(FK)|
|user_id|UUID(FK)|
|match_score|DECIMAL(5,2)|
|strengths|TEXT|
|weaknesses|TEXT|
|generated_comment|TEXT|

### 例

```text
適合率：95点

強み
・Java 5年
・AWS 3年

不足
・React経験不足
```

---

# t_project_proposals

提案履歴

|項目|型|
|---|---|
|proposal_id|UUID(PK)|
|project_id|UUID(FK)|
|user_id|UUID(FK)|
|proposal_date|DATETIME|
|proposal_comment|TEXT|

---

# t_project_interviews

面談履歴

|項目|型|
|---|---|
|interview_id|UUID(PK)|
|project_id|UUID(FK)|
|user_id|UUID(FK)|
|interview_date|DATETIME|
|interview_no|INT|
|result|VARCHAR(50)|
|memo|TEXT|

---

# t_assign_projects（参画案件）

## ステータス

```text
参画中
延長確認
退場予定
契約終了
```

|項目|型|
|---|---|
|assign_project_id|UUID(PK)|
|project_name|VARCHAR(300)|
|project_detail|TEXT|
|start_date|DATE|
|end_date|DATE|
|unit_price|DECIMAL(10,0)|
|status|VARCHAR(30)|

---

# t_project_members

案件参画者

|項目|型|
|---|---|
|member_id|UUID(PK)|
|assign_project_id|UUID(FK)|
|user_id|UUID(FK)|

---

# t_attendance

勤怠管理

|項目|型|
|---|---|
|attendance_id|UUID(PK)|
|user_id|UUID(FK)|
|target_month|VARCHAR(7)|
|work_hours|DECIMAL(5,2)|
|overtime_hours|DECIMAL(5,2)|
|attendance_file|VARCHAR(500)|
|submitted_date|DATETIME|

---

# t_field_reports

現場状況

|項目|型|
|---|---|
|report_id|UUID(PK)|
|assign_project_id|UUID(FK)|
|user_id|UUID(FK)|
|health_score|INT|
|motivation_score|INT|
|site_score|INT|
|extension_preference|VARCHAR(20)|
|extension_reason|TEXT|
|comment|TEXT|
|report_month|VARCHAR(7)|

### スコア

```text
1 ～ 5
```

---

# t_extension_confirmations

延長確認

|項目|型|
|---|---|
|extension_id|UUID(PK)|
|assign_project_id|UUID(FK)|
|confirm_date|DATE|
|result|VARCHAR(20)|
|reason|TEXT|

---

# t_chats

案件チャット

|項目|型|
|---|---|
|chat_id|UUID(PK)|
|project_type|VARCHAR(20)|
|project_id|UUID|
|user_id|UUID|
|message_text|TEXT|
|posted_at|DATETIME|

---

# t_notifications

通知管理

|項目|型|
|---|---|
|notification_id|UUID(PK)|
|user_id|UUID(FK)|
|notification_type|VARCHAR(50)|
|title|VARCHAR(300)|
|message|TEXT|
|is_read|BOOLEAN|
|created_at|DATETIME|

---

# t_ai_generation_logs

AI生成履歴

|項目|型|
|---|---|
|log_id|UUID(PK)|
|user_id|UUID(FK)|
|generation_type|VARCHAR(50)|
|prompt|TEXT|
|result_text|TEXT|
|created_at|DATETIME|

## generation_type

- 経歴書生成
- 自己PR生成
- 提案文生成
- スキル抽出
- マッチング分析

---

# Azure構成推奨

## DB

- Azure SQL Database

## 認証

- Microsoft Entra ID
- Microsoft Graph

## ファイル管理

- SharePoint Online
- Azure Blob Storage

## AI

- Azure OpenAI
- Azure AI Search

## 通知

- Microsoft Teams
- Outlookメール

---

# 将来的に追加したいテーブル

- t_contracts（契約書管理）
- t_business_partners（取引先管理）
- t_clients（顧客管理）
- t_sales_activities（営業活動履歴）
- t_kpi_monthly（KPI集計）
- t_skill_evaluations（スキル評価）
- t_career_history_details（職務経歴詳細）
- t_project_risks（退場・離職リスク管理）