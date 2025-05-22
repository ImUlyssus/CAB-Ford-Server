// DummyText.js
// Using CommonJS module syntax (module.exports) for Node.js environment.

/**
 * Reusable dummy text arrays for data generation.
 */

// Collect all the arrays into an object
const dummyTextData = {
    change_names: [
        'CDC-II Upgrades',
        'CDC-II Upgrades',
        'HP Office printer replacement',
        'HiveMQ Version Upgrade',
        'AAT IIOTM Body Shop 3 - Establishing PLC connection to DeviceWISE',
        'AAT IIOTM TCF#1 - Establishing PLC connection to DeviceWISE',
        'NGAVS prerequisite to support GVDS migrations.',
        'JV Firewall SNMP string update for AP region',
        'AAT IIOTM Body Shop 1 - Establishing PLC connection to DeviceWISE',
        'IOS upgrade MDF switch (aatrs001,aatrs002) Phase II'
    ],

    // Descriptions with [br] kept as literal characters
    descriptions: [
        'Change Reason: New Functionality[br]NGAVS Team will update the new GVDS end points to new GVDS environment, There is no impact to GVDS.[br]NGAVS service will be restart after the change.[br]Site referent : Pretoria',
        'Change Reason: New Functionality[br]CNA will update the SNMP communication string for SevOne monitoring tool in all AP region firewall.[br]Thailand devices[br]- TBSFW301-JVFTD[br]- TCFFW301-JVFTD',
        'Change Reason : New Functionality[br]As part of IIOT Monitoring (IIOTM) in AAT,[br]IPI, Maintenance and AAT-IT teams will config the PLC (programmable logic controller) program logic to establish the connection to DeviceWise.[br]BODY#1 : [br]- Mitsubishi 95 Assets.[br]- Rockwell 50 Assets.',
        'Change Reason : Upgrade[br]CNA Upgrading code on MDF Switch (aatrs001,aatrs002) to standard IOS for fix memory issues and interface flapping.[br]CURRENT CODE: 03.08.06.E [br]NEW CODE: 03.11.02.E.152-7.E2[br]Phase I (11 IDF switch) Completed[br]Phase II (2 MDF switch)[br]Site Ref: FTM',
        'Change Reason : Upgrade[br]Multiple MS security patches need to be installed on the server. Some patches require multiple reboots.[br]Server name: TBS00003 (FP Server), TBS02006 (AV Server)',
    ],

    // Test plans with [br] kept as literal characters
    test_plans: [
        'NGAVS team will validate for any errors and confirm to GVDS team[br]Site IT& Business team will perform full validation.',
        'CNA will verify the monitoring function and firewall device status.[br]FTM and FSST Site IT will verify the firewall connect and application status in HMON[br]AAT site IT will verify client network connect, web site access and application status',
        'IPI and Site IT will check the connectivity from PLC to DeviceWISE.[br]Business will check the PLC data transfer to conveyor/facilities/tool.',
        'CNA will validate switch IOS version and switch status.[br]Site IT and Business will validate the applications by scan vehicle test at Trim-In station and check all Up/Down stream applications.'
    ],

    // Rollback plans with [br] kept as literal characters (assuming [c]...[/c] is intentional)
    rollback_plans: [
        'Rollback to previous version',
        '[c]Rollback to previous configuration[/c]',
        'Rollback the PLC program from backup PLC program.',
        '[c]Rollback to previous IOS version[/c]',
        'Reinstall the previous version'
    ],

    contacts: [
        'Suriya K.,SKAMMEE',
        'Preechayut W.,PWONGSEN',
        'Preechayut W.,PWONGSEN',
        'Preechayut W.,PWONGSEN',
        'Prapun,PKAEWKAT',
        'Jakkarin,JNGAMCHA',
        'Ramakrishnan,SRAMAK12',
        'Kunchapu D,KSARALA3',
        'Kittipong,KPHINYO',
        'Sathaporn,SCHAROEN',
        'Boonna,BJANUTH1'
    ],

    global_and_business_contacts: [
        'IT,Suriya K.,SKAMMEE',
        'LAN Planner,Preechayut W.,PWONGSEN',
        'WAN Planner,Preechayut W.,PWONGSEN',
        'Mazda,Preechayut W.,PWONGSEN',
        'Business Owner,Prapun,PKAEWKAT',
        'ITO,Jakkarin,JNGAMCHA'
    ],

    crqs: [
        'Pookie!CRQ000000000001,Onichan!CRQ000000000002,UwU UwU!CRQ000000000003',
        'Oreo!CRQ000000398301,Obama!CRQ000008893702,Osma Binladin!CRQ000000030321',
        'The REMEM!CRQ000000000001,OEEM IOI!CRQ000000000002,Global Warming!CRQ000000000003',
        'The Cannibal!CRQ000000000001,RIO!CRQ03200013322,Global Cooking!CRQ0000839933',
        'The Cannibal!CRQ000067331,RIO!CRQ03200013322',
        'BLUE!CRQ03200013322',
        'REcyscle!CRQ03200013322',
        'Same!CRQ03200013322,Different!CRQ03200013322'
    ],

    scheduleTitles: [
        "title 1", "title 2", "title 3", "title 4", "title 5",
        "title 6", "title 7", "title 8", "title 9", "title 10"
    ],

    scheduleComments: [
        "Completed initial setup.",
        "Testing phase underway.",
        "Monitoring system metrics.",
        "Prepared deployment script.",
        "Validated configuration files.",
        "Reviewed log files for errors.",
        "Communicated status update.",
        "Final checks before go-live.",
        "Documenting post-change notes.",
        "Verified data integrity."
    ]
};

// Export the object containing all the arrays
module.exports = dummyTextData;
