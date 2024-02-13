*** Settings ***
Documentation     Support Sprint1 level tests
Resource          ../Support.robot

*** Keywords ***
I navigate to report creation website
    Navigate to ${wvar('xena_site')} site
    Log    Opened ${wvar('xena_site')} on browser ${browser}
    Take Screenshot    Selenium

I upload the image to report site
    Start a new late report process
    Upload an ID card image to the site

Image is processed for reading image data
    Start the image process step by clicking the Process Image button
    Wait until the image is processed

Data from the image is read correctly
    The text from image is read successfully
    Text from the image matches ${wvar('image_comparison_text')}

Cancel Create new user workflow
    Click Element    ${wvar('cancel_create_new_user_button')}
    Close Browser

Navigate to ${url} site
    Open Browser    ${url}    ${browser}    options=${global_browser_options}

Start a new late report process
    Click Element    ${wvar('new_late_report_button')}
    Take Screenshot    Selenium

Upload an ID card image to the site
    ${path} =    Evaluate    os.path.abspath("${wvar('image_file_relative_path')}")    modules=os
    Choose File    ${wvar('student_id_file_xpath')}    ${path}

Start the image process step by clicking the Process Image button
    Click Element    ${wvar('process_image_button')}
    Take Screenshot    Selenium

Wait until the image is processed
    Wait Until Enabled    ${wvar('create_new_student_button')}

The text from image is read successfully
    ${image_data}=    Get Text    ${wvar('text_location_from_image')}
    Take Screenshot    Selenium
    set test variable    ${image_text}    ${image_data}

Text from the image matches ${compare_text}
    Should be equal    ${image_text}    ${compare_text}
