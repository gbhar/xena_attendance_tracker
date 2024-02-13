*** Settings ***
Documentation     This is a sample user story.
...               The documentation here should ideally match the user story doc.
...               It only works if you have Web libraries enabled and the chromedriver
...               is available in the environment PATH. Jira-ID: NCNL-1
Suite Setup       Log to Console    Keyword is executed once before first test in the suite
Suite Teardown    Close All Browsers
Force Tags        NCNL-1    Report_Creation
Resource          Support_Xena_Training.robot

*** Test Cases ***
Ensure image can be uploaded for new late report student_userName
    [Documentation]    Test to check a new late report can be created for a new user
    [Tags]    image_upload
    Given I navigate to report creation website
    When I upload the image to report site
    And Image is processed for reading image data
    Then Data from the image is read correctly
    [Teardown]    Cancel Create new user workflow
# New Report Creation with Existing Email is restricted student_userName
#    [Documentation]    If a student with an existing email is present then the student
#    ...    with same email id cannot be created and an exception is shown for it.
#    [Tags]    late_report_restricted_by_email
#    Given A User exists in the Xena Site
#    When Create a new user late report
#    Then An exception shows student with email id exists
