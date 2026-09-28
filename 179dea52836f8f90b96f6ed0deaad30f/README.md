# PlayWrightBuilder — ServiceNow Scoped App

**Scope:** `x_146833_playwri_0`  
**Version:** 1.0.0

## Purpose

PlayWrightBuilder enables fully automated Playwright + Cucumber/BDD test authoring and execution driven from ServiceNow.  
Authors write User Stories, Scenarios, and Gherkin Steps inside ServiceNow. A generation layer renders `.feature` files and `NowConfig.env` and triggers Playwright runs, writing results back as Test Result records.

---

## Data Model (9 Tables)

| Table | Label | Description |
|---|---|---|
| `x_146833_playwri_0_pw_environment` | PW Environment | Instance URL, credentials, workspace path — maps 1:1 to `NowConfig.env` |
| `x_146833_playwri_0_pw_config` | PW Config | Playwright profile: timeout, workers, retries, headless, browser channel |
| `x_146833_playwri_0_pw_feature` | PW Feature | Gherkin `Feature:` block — title, description, tags |
| `x_146833_playwri_0_pw_story` | PW Story | User Story (As a / I want / So that) owned by a Feature |
| `x_146833_playwri_0_pw_scenario` | PW Scenario | `Scenario:` or `Scenario Outline:` owned by Story + Feature |
| `x_146833_playwri_0_pw_scenario_step` | PW Scenario Step | Ordered Given/When/Then/And/But steps, linked to Gherkin Step Library |
| `x_146833_playwri_0_gerkin_steps` | Gherkin Step Library | Reusable step patterns mapped to TypeScript implementations |
| `x_146833_playwri_0_pw_test_run` | PW Test Run | A triggered execution: Feature + Config + Environment |
| `x_146833_playwri_0_pw_test_result` | PW Test Result | Per-scenario outcome: status, duration, error, screenshot/video/trace URLs |

---

## Automation Generation Flow

```
Feature + Scenarios + Steps  →  Gherkin Step Library  →  PW Config + Environment
→  Generate .feature + NowConfig.env  →  Run Playwright/Cucumber  →  Write Test Results back
```

---

## Roles

| Role | Purpose |
|---|---|
| `x_146833_playwri_0.admin` | Full read/write access to all tables |
| `x_146833_playwri_0.user` | Read-only access; can view features, scenarios, results |

---

## Update Set Files

All table definitions live under `update/`:

- `sys_db_object_pw_*.xml` — Table definitions (sys_db_object)
- `sys_dictionary_x_146833_playwri_0_pw_*.xml` — Field definitions per table
- `sys_dictionary_x_146833_playwri_0_gerkin_steps_extensions.xml` — New fields added to the existing Gherkin Steps table
- `sys_choice_pw_tables.xml` — All Choice field values
- `sys_security_acl_pw_tables.xml` — ACLs (read + write per table)
- `ua_table_licensing_config_pw_tables.xml` — Licensing configs
- `sys_ui_list_pw_tables.xml` — Default list views
