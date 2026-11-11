# PlannerCMS_AzureSQL_Design.md

# Planner CMS Azure SQL 設計書

## 1. システム概要
Planner CMS は SES・人材紹介向け案件管理システムです。

## 2. DB設計方針
- Azure SQL Database
- Microsoft Entra ID認証
- Row Level Security
- 監査ログ
- Soft Delete

## 3. スキーマ作成
```sql
CREATE SCHEMA planner;
GO
```

## 4. 主要DDL

### M_Groups
```sql
CREATE TABLE planner.M_Groups (
 GroupId UNIQUEIDENTIFIER PRIMARY KEY,
 GroupName NVARCHAR(100) NOT NULL
);
```

### M_Users
```sql
CREATE TABLE planner.M_Users (
 UserId UNIQUEIDENTIFIER PRIMARY KEY,
 EmployeeNo NVARCHAR(20),
 Name NVARCHAR(100),
 Email NVARCHAR(255),
 GroupId UNIQUEIDENTIFIER,
 Status NVARCHAR(30),
 RoleType NVARCHAR(30)
);
```

### M_Skills
```sql
CREATE TABLE planner.M_Skills (
 SkillId UNIQUEIDENTIFIER PRIMARY KEY,
 SkillName NVARCHAR(200)
);
```

### T_UserSkills
```sql
CREATE TABLE planner.T_UserSkills (
 UserSkillId UNIQUEIDENTIFIER PRIMARY KEY,
 UserId UNIQUEIDENTIFIER,
 SkillId UNIQUEIDENTIFIER,
 ExperienceYears DECIMAL(5,1)
);
```

### T_Resumes
```sql
CREATE TABLE planner.T_Resumes (
 ResumeId UNIQUEIDENTIFIER PRIMARY KEY,
 UserId UNIQUEIDENTIFIER,
 SharePointUrl NVARCHAR(1000)
);
```

### T_RecruitProjects
```sql
CREATE TABLE planner.T_RecruitProjects (
 RecruitProjectId UNIQUEIDENTIFIER PRIMARY KEY,
 ProjectName NVARCHAR(300),
 Status NVARCHAR(50),
 Location NVARCHAR(200)
);
```

### T_ProjectMatching
```sql
CREATE TABLE planner.T_ProjectMatching (
 MatchingId UNIQUEIDENTIFIER PRIMARY KEY,
 RecruitProjectId UNIQUEIDENTIFIER,
 UserId UNIQUEIDENTIFIER,
 MatchScore DECIMAL(5,2)
);
```

### T_AssignProjects
```sql
CREATE TABLE planner.T_AssignProjects (
 AssignProjectId UNIQUEIDENTIFIER PRIMARY KEY,
 ProjectName NVARCHAR(300),
 StartDate DATE,
 EndDate DATE,
 Status NVARCHAR(30)
);
```

### T_Attendance
```sql
CREATE TABLE planner.T_Attendance (
 AttendanceId UNIQUEIDENTIFIER PRIMARY KEY,
 UserId UNIQUEIDENTIFIER,
 TargetMonth CHAR(7)
);
```

### T_FieldReports
```sql
CREATE TABLE planner.T_FieldReports (
 ReportId UNIQUEIDENTIFIER PRIMARY KEY,
 UserId UNIQUEIDENTIFIER,
 AssignProjectId UNIQUEIDENTIFIER,
 HealthScore INT,
 MotivationScore INT
);
```

### T_Notifications
```sql
CREATE TABLE planner.T_Notifications (
 NotificationId UNIQUEIDENTIFIER PRIMARY KEY,
 UserId UNIQUEIDENTIFIER,
 NotificationType NVARCHAR(50)
);
```

### T_AIGenerationLogs
```sql
CREATE TABLE planner.T_AIGenerationLogs (
 LogId UNIQUEIDENTIFIER PRIMARY KEY,
 GenerationType NVARCHAR(50),
 ResultText NVARCHAR(MAX)
);
```

## 5. Azure AI Search設計
### candidate-index
- userId
- name
- skills
- certifications
- resumeText

### recruit-project-index
- projectName
- location
- requiredSkills
- projectDetail

## 6. View設計
### V_CandidateProfile
候補者統合ビュー

### V_AssignProjectSummary
参画案件サマリ

### V_RecruitProjectMatching
AIマッチングビュー

## 7. Stored Procedure設計
- SP_CreateRecruitProject
- SP_GetMatchingCandidates
- SP_GetContractExpireMembers

## 8. 監査テーブル
### T_AuditLogs
- UserId
- TableName
- ActionType
- BeforeData
- AfterData

## 9. Row Level Security
### fn_UserFilter
ユーザー単位データ制御

### UserSecurityPolicy
通知テーブル保護

## 10. Microsoft Entra ID認証
```sql
CREATE USER [PlannerCMSApp]
FROM EXTERNAL PROVIDER;
```

## 11. セキュリティ設計
- MFA
- RBAC
- TDE
- Key Vault
- Log Analytics

## 12. Azureリソース
- App Service
- Azure SQL Database
- Azure OpenAI
- Azure AI Search
- SharePoint Online
- Microsoft Graph

## 13. RAG構成
案件票→AI Search→Azure OpenAI→マッチング結果
