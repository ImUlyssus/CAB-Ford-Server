const db = require("../config/db");

const createChangeRequestTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS ChangeRequest (
  id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Change Request Metadata
  category ENUM('Hardware', 'Application', 'New tech update', 'Password reset') NOT NULL,
  reason ENUM('Fix/Repair', 'New functionality', 'Maintenance', 'Upgrade', 'Tech refresh', 'Yearly change') NOT NULL,
  impact ENUM('Extensive', 'Significant', 'Moderate', 'Minor') NOT NULL,
  priority ENUM('Critical', 'High', 'Medium', 'Low') NOT NULL,
  change_name VARCHAR(255) NOT NULL,
  change_sites JSON NOT NULL,  -- Stores selected sites as an array
  common_change BOOLEAN NOT NULL DEFAULT FALSE,
  request_change_date DATE NOT NULL, -- Change request date
  time_of_change INT NOT NULL, -- Integer value for time
  achieve_2_week_change_request BOOLEAN DEFAULT FALSE, -- Automatically calculated

  -- Site-Specific Change Schedules (Only Show If Site is Selected)
  ftm_schedule_change DATE DEFAULT NULL,
  aat_schedule_change DATE DEFAULT NULL,
  fsst_schedule_change DATE DEFAULT NULL,

  -- Site-Specific IT Contacts (Only Show If Site is Selected)
  ftm_it_contact JSON DEFAULT NULL,  -- { "name": "John Doe", "cdsid": "jdoe1" }
  aat_it_contact JSON DEFAULT NULL,
  fsst_it_contact JSON DEFAULT NULL,

  -- Contact Information
  global_team_contact JSON NOT NULL, -- [{ "position": "Lead", "name": "John", "cdsid": "jdoe1" }]
  business_team_contact JSON NOT NULL,

  -- CRQ Information
  ftm_crq VARCHAR(255) DEFAULT NULL,
  aat_crq VARCHAR(255) DEFAULT NULL,
  fsst_crq VARCHAR(255) DEFAULT NULL,
  common_crq VARCHAR(255) DEFAULT NULL,

  -- Status & Approval
  approval BOOLEAN DEFAULT FALSE, -- Approval status
  change_status ENUM(
    'Completed with no issue',
    'Cancel Change Request',
    'FTM change cancel',
    'AAT change cancel',
    'FSST change cancel',
    'Common change cancel'
  ) DEFAULT NULL,

  -- Cancel Reason (Only Allowed If Status is Not "Completed with no issue")
  cancel_change_reason TEXT DEFAULT NULL,

  -- Additional Details
  description TEXT NOT NULL,
  test_plan TEXT NOT NULL,
  rollback_plan TEXT NOT NULL,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


  `;
  db.query(createChangeRequestTable, (err, result) => {
    if (err) {
      console.error("❌ Error creating ChangeRequest table:", err);
    } else {
      console.log("✅ ChangeRequest table is ready.");
    }
  });
};

module.exports = {createChangeRequestTable};
