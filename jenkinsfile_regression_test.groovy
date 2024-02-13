#!/bin/groovy
def run(manifest) {
  ensure.dockerNode {
    def include_tag = "Report_Creation"           // tags for the selenium execution
    def project_code = "NCNL"                     // Replace with JIRA project where tests are to be uploaded
    def project_test_folder = "test/robot_lab"    // the folder where tests lie in your project
    def r_system

    // to be used to figure out which Data folder to use to get variables during test execution
    switch(env.BRANCH_NAME) {
      case '(qa|test)/*':
        r_system = 'QA'
        break
      default:
        r_system = 'Dev'
    }
    def exitCode = 0
    ensure.insideDockerContainer('jnj.artifactrepo.jnj.com/robot/execution:stable') {
      withCredentials([usernamePassword(usernameVariable: 'xray_user',          // username variable (not to be changed)
                                        passwordVariable: 'xray_password',      /* password variable (not to be changed) */
                                        credentialsId: 'jira')]) {              /* replace with Jenkins credentialsId with access to JIRA */

      // command to execute selenium tests
      // 'driver.py -i' to be replaced with 'threadDriver.py -itags' if run in parallel/multithread execution, along with -nt flag for the number of threads
      def command_execute_test = """
          cd project/$project_test_folder
          python Execution/driver.py -i $include_tag -s $r_system
          zip -rv Output.zip Output/
      """

      // command to upload selenium tests to JIRA
      def command_create_test = """
          cd project/$project_test_folder
          python /Test_Management_Automation/XrayUploader/xray_uploader.py -r \
            Output/Output.xml -u $xray_user -jprj $project_code -p \
            $xray_password -a Create_Test
          if [ $r_system -eq QA ]
            then
              python /Test_Management_Automation/XrayUploader/xray_uploader.py -r \
                Output/Output.xml -u $xray_user -jprj AAQF -p $xray_password -a Add_Result
          fi
      """
      exitCode += shellMe.execute(scriptRaw: command_execute_test, tryCount: 1, onReturn: 'status')
      // adding artifacts to Jenkins Job
      archiveArtifacts artifacts: "project/$project_test_folder/Output.zip", fingerprint: true
      exitCode += shellMe.execute(scriptRaw: command_create_test, tryCount: 1, onReturn: 'status')
      archiveArtifacts artifacts: "project/$project_test_folder/Output/**.log", fingerprint: true
      return exitCode
      }
    }
  }
}

return this;
