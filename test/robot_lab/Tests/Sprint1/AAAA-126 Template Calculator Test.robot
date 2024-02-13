*** Settings ***
Documentation     Tests Calculator app functionality in template. Jira-ID: AAAA-126
Suite Setup       Navigate to calculator browser headless
Suite Teardown    Close All Browsers
Test Setup        Reset the calculator
Force Tags        AAAA-126    Calculator
Resource          Support_Sprint1.robot

*** Test Cases ***
Addition is tested successfully through template
    [Template]    Addition Template is tested through this
    [Documentation]    Test to check Addition on calculator is working correctly through template
    [Tags]    addition_data_driven
    1
    2
