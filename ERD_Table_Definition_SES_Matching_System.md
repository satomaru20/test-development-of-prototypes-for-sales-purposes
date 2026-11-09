# ER図・テーブル定義書

## ER図

```text
MailImportQueue
    |
    | 1:N
    v
ImportedAttachment

Candidate 1:N MatchResult N:1 Job

Candidate 1:N CandidateSkill

Job 1:N JobSkill

Candidate 1:N AuditLog
Job 1:N AuditLog
```

---

# テーブル定義

## Candidate
|列名|型|PK|説明|
|---|---|---|---|
|CandidateId|nvarchar(20)|○|候補者ID|
|Status|nvarchar(20)||未決定/決定/対象外|
|WorkStyle|nvarchar(50)||出社/ハイブリッド/フルリモート|
|Industry|nvarchar(200)||業界経験|
|QualityScore|decimal(5,2)||匿名化品質スコア|
|UpdatedAt|datetime||更新日時|

## CandidateSkill
|列名|型|PK|説明|
|---|---|---|---|
|SkillId|uniqueidentifier|○|ID|
|CandidateId|nvarchar(20)||候補者ID|
|SkillName|nvarchar(100)||スキル名|
|Years|decimal(4,1)||経験年数|

## Job
|列名|型|PK|説明|
|---|---|---|---|
|JobId|nvarchar(20)|○|案件ID|
|Title|nvarchar(200)||案件名|
|Budget|decimal(18,2)||単価|
|WorkStyle|nvarchar(50)||勤務条件|
|Status|nvarchar(20)||募集中等|
|UpdatedAt|datetime||更新日時|

## JobSkill
|列名|型|PK|説明|
|---|---|---|---|
|JobSkillId|uniqueidentifier|○|ID|
|JobId|nvarchar(20)||案件ID|
|SkillName|nvarchar(100)||必須/歓迎スキル|

## MatchResult
|列名|型|PK|説明|
|---|---|---|---|
|MatchId|uniqueidentifier|○|ID|
|CandidateId|nvarchar(20)||候補者ID|
|JobId|nvarchar(20)||案件ID|
|Score|decimal(5,2)||一致率|
|Reason|nvarchar(max)||推薦理由|
|CreatedAt|datetime||作成日時|

## MailImportQueue
|列名|型|PK|説明|
|---|---|---|---|
|QueueId|uniqueidentifier|○|ID|
|MessageId|nvarchar(255)||Graph Message ID|
|Subject|nvarchar(1000)||件名|
|Sender|nvarchar(500)||送信者|
|Status|nvarchar(20)||処理状態|
|ReceivedAt|datetime||受信日時|

## ImportedAttachment
|列名|型|PK|説明|
|---|---|---|---|
|AttachmentId|uniqueidentifier|○|ID|
|QueueId|uniqueidentifier||取込キューID|
|FileName|nvarchar(255)||ファイル名|
|FileHash|varchar(64)||SHA256|
|DuplicateFlag|bit||重複フラグ|

## AuditLog
|列名|型|PK|説明|
|---|---|---|---|
|AuditId|uniqueidentifier|○|ID|
|UserId|nvarchar(100)||操作者|
|Action|nvarchar(100)||操作|
|TargetType|nvarchar(50)||Candidate/Job|
|TargetId|nvarchar(50)||対象ID|
|CreatedAt|datetime||日時|
