# Tracks various level xpaths. Create a folder in future if the number of xpaths grows.
# Selenium Test Xpath Variables
robot_check_id = 'xpath=//*[@class="title"]'
robot_loc_value_id = '//*[@id="introduction"]//following::p[1]'

# Calculator testing variables
page_loaded_check = "//button[text()='AC']"
button_format = "//button[text()='{}']"
calculator_result = '//*[@id="root"]/div/div[1]/div'

# XENA site variables
new_late_report_button = '//span[@class="MuiButton-label"]'
student_id_file_xpath = 'id=file-input'
process_image_button = 'xpath=(//span[@class="MuiButton-label"])[2]'
create_new_student_button = 'xpath=/html/body/div[2]/div[3]/div/div[2]/div[2]/button[1]/span[1]'
text_location_from_image = 'xpath=/html/body/div[2]/div[3]/div/div[2]/p'
cancel_create_new_user_button = 'xpath=/html/body/div[2]/div[3]/div/div[2]/div[2]/button[2]/span[1]'
create_student_button_new_report = 'xpath=//span[text()="Create New Student"]'
first_name_xpath = 'xpath=//*[@id="first-name"]'
last_name_xpath = 'xpath=//*[@id="last-name"]'
email_xpath = 'xpath=//*[@id="email"]'
heading_email_xpath = 'xpath=//th[text()="Email"]'
submit_button_xpath = 'xpath=/html/body/div[2]/div[3]/div/div[2]/form/button/span[1]'
new_report_check_value_xpath = "xpath=//td[text()='teststudent3@gmail.com']"
existing_user_first_row_email = "xpath=//tr[1]/td[2]"
exception_message_xpath = 'xpath=//p[text()="This email is in use already by another student!"]'
