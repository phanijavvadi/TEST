'use strict';

export default {
  contexts: {
    PATIENT: 'PATIENT',
  },
  userCategoryTypes: {
    CM_USER: 'CM_USER',
    ORG_USER: 'ORG_USER',
  },
  userSubCategory: {
    CM_ADMIN_USERS: 'CM_ADMIN_USERS',
    ORG_ADMIN_USERS: 'ORG_ADMIN_USERS',
    ORG_PRACTITIONERS: 'ORG_PRACTITIONERS',
  },
  userTypes: {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ORG_ADMIN: 'ORG_ADMIN',
    ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_PRACTITIONER: 'ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_PRACTITIONER',
    CHINESE_MEDICINE_PRACTITIONER: 'CHINESE_MEDICINE_PRACTITIONER',
    CHIROPRACTOR: 'CHIROPRACTOR',
  },
  errorCodes: {
    INVALID_ORG_USER_TYPE: 'INVALID_ORG_USER_TYPE',
  },
  getTableName: function (tableKey) {
    return this.tables.prefix + this.tables[tableKey];
  },
  tables: {
    prefix: 'cm_',
    attachments: 'attachments',
    master_data: 'master_data',
    problems_master: 'problems_master',
    problem_metrics_master: 'problem_metrics_master',
    problem_metrics_target_master: 'problem_metrics_target_master',
    problem_metrics_action_plan_master: 'problem_metrics_action_plan_master',
    problem_metrics_action_plan_input_master: 'problem_metrics_action_plan_input_master',
    problem_metrics_action_plan_input_options_master: 'problem_metrics_action_plan_input_options_master',


    org_health_problems_master: 'org_health_problems_master',
    org_api_keys: 'org_api_keys',
    org_contact_details: 'org_contact_details',
    org_imported_data: 'org_imported_data',
    org_patient_care_plan: 'org_patient_care_plan',
    org_patient_care_plan_problems: 'org_patient_care_plan_problems',
    org_patient_care_plan_problem_metrics: 'org_patient_care_plan_problem_metrics',
    org_patient_care_plan_problem_metric_targets: 'org_patient_care_plan_problem_metric_targets',
    org_patient_care_plan_problem_metric_action_plan: 'org_patient_care_plan_problem_metric_action_plan',
    org_patient_care_plan_problem_metric_action_plan_input: 'org_patient_care_plan_problem_metric_action_plan_input',

    org_patient_family_history: 'org_patient_family_history',
    org_patient_health_insurance: 'org_patient_health_insurance',
    org_patients: 'org_patients',
    org_patient_devices: 'org_patient_devices',
    org_patient_clinical_metrics_data: 'org_patient_clinical_metrics_data',
    org_patient_notifications: 'org_patient_notifications',
    org_patient_medical_history: 'org_patient_medical_history',
    org_patient_medications: 'org_patient_medications',
    org_patients_social_history: 'org_patients_social_history',
    org_subscriptions: 'org_subscriptions',
    org_subscription_types: 'org_subscription_types',
    organisations: 'organisations',
    user_categories: 'user_categories',
    users: 'users',
    user_roles: 'user_roles',
    user_sub_categories: 'user_sub_categories',
    user_types: 'user_types',
    user_verifications: 'user_verifications',


    //preventive activity
    org_patient_preventive_health: 'org_patient_preventive_health',
    org_patient_preventive_activities: 'org_patient_preventive_activities',
    org_patient_preventive_activity_metrics: 'org_patient_preventive_activity_metrics',

    preventive_activity_category_master: 'preventive_activity_category_master',
    preventive_activities_master: 'preventive_activities_master',
    preventive_activity_age_groups_master: 'preventive_activity_age_groups_master',
    preventive_activity_metrics_master: 'preventive_activity_metrics_master',
  }
};
